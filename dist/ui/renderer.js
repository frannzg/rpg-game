import { renderBattleHUD } from './components/BattleHUD.js';
import { renderBattleLog } from './components/Log.js';
import pc from 'picocolors';
export function renderBattle(allies, enemies, log, round) {
    console.clear();
    console.log(pc.bold(pc.yellow(`\n╔══════════════════ RONDA ${round} ═════════════════╗`)));
    const aliveAllies = allies.filter(a => a.isAlive);
    const aliveEnemies = enemies.filter(e => e.isAlive);
    console.log(renderBattleHUD(aliveAllies, aliveEnemies));
    console.log(renderBattleLog(log));
}
export function renderVictory(xp, levels) {
    console.log(pc.green('\n╔══════════════════════════════════════╗'));
    console.log(pc.green('║         ¡VICTORIA!                   ║'));
    console.log(pc.green('╚══════════════════════════════════════╝'));
    console.log(pc.cyan(`\n✨ XP ganada: ${xp}`));
    for (const lvl of levels) {
        console.log(pc.yellow(`  ${lvl}`));
    }
}
export function renderDefeat() {
    console.log(pc.red('\n╔══════════════════════════════════════╗'));
    console.log(pc.red('║         DERROTA                      ║'));
    console.log(pc.red('╚══════════════════════════════════════╝'));
}
export function renderLoot(items) {
    if (items.length === 0)
        return;
    console.log(pc.yellow('\n🎁 Botín obtenido:'));
    for (const item of items) {
        console.log(pc.yellow(`  • ${item}`));
    }
}
//# sourceMappingURL=renderer.js.map