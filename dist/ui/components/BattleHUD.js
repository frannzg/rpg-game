import { renderHealthBar, renderMpBar } from './HealthBar.js';
import pc from 'picocolors';
export function renderCharacterHUD(char, isEnemy = false) {
    const stats = char.getEffectiveStats();
    const hpBar = renderHealthBar(char.currentStats.hp, char.currentStats.maxHp);
    const mpBar = renderMpBar(char.currentStats.mp, char.currentStats.maxMp);
    const side = isEnemy ? pc.red('❌ ENEMY') : pc.green('✅ ALLY');
    const icon = isEnemy ? '👹' : '🧙';
    const statusText = char.statusEffects.length > 0
        ? ` [${char.statusEffects.map(e => pc.magenta(e.name)).join(', ')}]`
        : '';
    const defText = char.isDefending ? ` ${pc.yellow('[DEFENDIENDO]')}` : '';
    return [
        `${icon} ${pc.bold(char.name)} (${char.className}) ${pc.bold(`Lv.${char.level}`)} ${side}`,
        `  ${pc.green('HP:')} ${hpBar}${statusText}${defText}`,
        `  ${pc.blue('MP:')} ${mpBar}`,
        `  ${pc.cyan('STR:')} ${stats.str} ${pc.yellow('DEF:')} ${stats.def} ${pc.red('INT:')} ${stats.int} ${pc.magenta('RES:')} ${stats.res} ${pc.white('SPD:')} ${stats.spd} ${pc.green('DEX:')} ${stats.dex}`,
        char.equippedWeapon ? `  🗡 ${pc.gray(char.equippedWeapon.name)}` : '',
        char.equippedArmor ? `  🛡 ${pc.gray(char.equippedArmor.name)}` : '',
    ].filter(Boolean).join('\n');
}
export function renderBattleHUD(allies, enemies) {
    const lines = ['', pc.bold(pc.yellow('═══ EQUIPO ALIADO ═══')), ''];
    for (const ally of allies) {
        lines.push(renderCharacterHUD(ally, false));
        lines.push('');
    }
    lines.push(pc.bold(pc.red('═══ EQUIPO ENEMIGO ═══')), '');
    for (const enemy of enemies) {
        if (enemy.isAlive) {
            lines.push(renderCharacterHUD(enemy, true));
            lines.push('');
        }
    }
    return lines.join('\n');
}
//# sourceMappingURL=BattleHUD.js.map