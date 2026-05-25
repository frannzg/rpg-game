import inquirer from 'inquirer';
import pc from 'picocolors';
import { createCharacterFromTemplate, getCharacterChoices, createAllCharacters } from './models/classes/index.js';
import { CombatSystem } from './systems/CombatSystem.js';
import { distributeXp } from './systems/LevelSystem.js';
import { generateLoot } from './systems/LootSystem.js';
import { renderVictory, renderDefeat, renderLoot } from './ui/renderer.js';
import { BattleStatus } from './types/index.js';
function showTitle() {
    console.clear();
    console.log(pc.bold(pc.yellow(`
╔══════════════════════════════════════════╗
║        ⚔  TERMINAL RPG  ⚔               ║
║    Batallas por turnos en la terminal    ║
╚══════════════════════════════════════════╝
`)));
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function showLoading(text, ms = 800) {
    console.log(pc.cyan(text));
    await sleep(ms);
}
async function mainMenu() {
    showTitle();
    const { option } = await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Selecciona modo de juego:',
            choices: [
                { name: '⚔  Jugador vs CPU', value: 'pve' },
                { name: '👥  Jugador vs Jugador (2P)', value: 'pvp' },
                { name: '📊  Ver personajes disponibles', value: 'info' },
                { name: '🚪  Salir', value: 'exit' },
            ],
        },
    ]);
    return option;
}
async function showCharacterInfo() {
    showTitle();
    const allChars = createAllCharacters();
    for (const char of allChars) {
        const stats = char.getEffectiveStats();
        console.log(pc.bold(`\n${pc.yellow('✦')} ${pc.bold(char.name)} — ${char.className} (Nv.${char.level})`));
        console.log(`  ${pc.gray(char.description)}`);
        console.log(`  ${pc.green('HP:')} ${stats.maxHp}  ${pc.blue('MP:')} ${stats.maxMp}  ${pc.cyan('STR:')} ${stats.str}  ${pc.yellow('DEF:')} ${stats.def}`);
        console.log(`  ${pc.red('INT:')} ${stats.int}  ${pc.magenta('RES:')} ${stats.res}  ${pc.white('SPD:')} ${stats.spd}  ${pc.green('DEX:')} ${stats.dex}`);
        console.log(`  ${pc.gray('Habilidades:')} ${char.getAbilities().map(a => pc.cyan(a.name)).join(', ')}`);
        if (char.equippedWeapon)
            console.log(`  🗡 ${pc.gray(char.equippedWeapon.name)}`);
        if (char.equippedArmor)
            console.log(`  🛡 ${pc.gray(char.equippedArmor.name)}`);
    }
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Presiona Enter para volver...' }]);
}
async function selectCharacter(promptMessage) {
    const choices = getCharacterChoices();
    choices.push({ name: '🎲  Aleatorio', value: 'random', short: 'Aleatorio' });
    const { templateId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'templateId',
            message: promptMessage,
            choices,
        },
    ]);
    if (templateId === 'random') {
        const templates = getCharacterChoices().filter(c => c.value !== 'random');
        const random = templates[Math.floor(Math.random() * templates.length)];
        console.log(pc.gray(`Seleccionado: ${random.name}`));
        return createCharacterFromTemplate(random.value);
    }
    return createCharacterFromTemplate(templateId);
}
async function selectEnemies(count = 2) {
    const enemies = [];
    const choices = getCharacterChoices();
    for (let i = 0; i < count; i++) {
        const availableChoices = choices.filter(c => !enemies.find(e => e.id === c.value));
        availableChoices.push({ name: '🎲  Aleatorio', value: 'random', short: 'Aleatorio' });
        const { enemyId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'enemyId',
                message: `Selecciona enemigo ${i + 1} de ${count}:`,
                choices: availableChoices,
            },
        ]);
        const id = enemyId === 'random'
            ? choices[Math.floor(Math.random() * choices.length)].value
            : enemyId;
        enemies.push(createCharacterFromTemplate(id));
    }
    return enemies;
}
async function playPvE() {
    showTitle();
    console.log(pc.bold(pc.green('📋 SELECCIONA TU PERSONAJEn')));
    const playerChar = await selectCharacter('Elige tu personaje:');
    await showLoading(`Has elegido a ${playerChar.name}! Preparando batalla...`);
    showTitle();
    console.log(pc.bold(pc.red('👹 SELECCIONA ENEMIGOS\n')));
    const { enemyCount } = await inquirer.prompt([
        {
            type: 'list',
            name: 'enemyCount',
            message: '¿Contra cuántos enemigos quieres pelear?',
            choices: [
                { name: '1 enemigo', value: 1 },
                { name: '2 enemigos', value: 2 },
                { name: '3 enemigos', value: 3 },
            ],
        },
    ]);
    const enemies = await selectEnemies(enemyCount);
    await showLoading(`\n¡${enemies.map(e => e.name).join(', ')} aparecen! ⚔`);
    console.log(pc.bold(pc.yellow('\n¡QUE COMIENCE LA BATALLA!\n')));
    await sleep(1000);
    const combat = new CombatSystem([playerChar], enemies, [playerChar.id]);
    const result = await combat.start();
    if (result.status === BattleStatus.VICTORY) {
        const defeatedEnemies = enemies.filter(e => !e.isAlive);
        const lootItems = generateLoot(defeatedEnemies);
        const xpResults = distributeXp([playerChar], result.xpEarned);
        const xpEntry = xpResults.get(playerChar.id);
        const levelMsgs = [];
        if (xpEntry && xpEntry.levels > 0) {
            levelMsgs.push(`${playerChar.name} subió ${xpEntry.levels} nivel(es)! (Nv. ${playerChar.level})`);
        }
        renderVictory(result.xpEarned, levelMsgs);
        renderLoot(lootItems.map(i => `${i.name} — ${i.description}`));
        for (const item of lootItems) {
            if (item.canEquip(playerChar.className) && item.isEquippable()) {
                const { equip } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'equip',
                        message: `¿Equipar ${item.name}?`,
                        default: false,
                    },
                ]);
                if (equip) {
                    if (playerChar.equipItem(item)) {
                        console.log(pc.green(`${item.name} equipado!`));
                    }
                }
                else {
                    playerChar.addToInventory(item);
                }
            }
            else if (item.isConsumable()) {
                playerChar.addToInventory(item);
            }
        }
    }
    else {
        renderDefeat();
    }
    console.log(pc.gray(`\nBatalla duró ${result.rounds} rondas`));
    console.log(pc.gray(`Personaje: ${playerChar.name} — Nv.${playerChar.level} (${playerChar.xp}/${playerChar.xpToNext} XP)`));
    console.log(pc.gray(`Inventario: ${playerChar.inventory.length} objetos`));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: '\nPresiona Enter para volver al menú...' }]);
}
async function playPvP() {
    showTitle();
    console.log(pc.bold(pc.green('👤 JUGADOR 1\n')));
    const p1Char = await selectCharacter('Jugador 1, elige tu personaje:');
    await showLoading(`${p1Char.name} listo!`);
    console.log(pc.bold(pc.green('\n👤 JUGADOR 2\n')));
    const p2Choices = getCharacterChoices().filter(c => c.value !== p1Char.id);
    const { p2TemplateId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'p2TemplateId',
            message: 'Jugador 2, elige tu personaje:',
            choices: p2Choices,
        },
    ]);
    const p2Char = createCharacterFromTemplate(p2TemplateId);
    await showLoading(`\n${p1Char.name} vs ${p2Char.name}! ⚔`);
    console.log(pc.bold(pc.yellow('\n¡QUE COMIENCE LA BATALLA!\n')));
    await sleep(1000);
    const combat = new CombatSystem([p1Char, p2Char], [p2Char, p1Char], [p1Char.id, p2Char.id]);
    const result = await combat.start();
    if (result.status === BattleStatus.VICTORY) {
        const winner = p1Char.isAlive ? p1Char : p2Char;
        const loser = p1Char.isAlive ? p2Char : p1Char;
        console.log(pc.green(`\n🏆 ¡${winner.name} ha ganado la batalla!`));
        console.log(pc.gray(`${loser.name} ha sido derrotado.`));
        const defeatedEnemies = [loser];
        const lootItems = generateLoot(defeatedEnemies);
        renderLoot(lootItems.map(i => `${i.name} — ${i.description}`));
        for (const item of lootItems) {
            winner.addToInventory(item);
        }
    }
    else {
        renderDefeat();
    }
    console.log(pc.gray(`\nBatalla duró ${result.rounds} rondas`));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: '\nPresiona Enter para volver al menú...' }]);
}
async function main() {
    let running = true;
    while (running) {
        const option = await mainMenu();
        switch (option) {
            case 'pve':
                await playPvE();
                break;
            case 'pvp':
                await playPvP();
                break;
            case 'info':
                await showCharacterInfo();
                break;
            case 'exit':
                running = false;
                console.log(pc.green('\n¡Gracias por jugar Terminal RPG! 🎮\n'));
                break;
        }
    }
}
main().catch(console.error);
//# sourceMappingURL=index.js.map