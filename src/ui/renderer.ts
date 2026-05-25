import { Character } from '../models/Character.js'
import { LogEntry } from '../types/index.js'
import { renderBattleHUD } from './components/BattleHUD.js'
import { renderBattleLog } from './components/Log.js'
import pc from 'picocolors'

export function renderBattle(
  allies: Character[],
  enemies: Character[],
  log: LogEntry[],
  round: number
): void {
  console.clear()
  console.log(pc.bold(pc.yellow(`\n╔══════════════════ RONDA ${round} ═════════════════╗`)))

  const aliveAllies = allies.filter(a => a.isAlive)
  const aliveEnemies = enemies.filter(e => e.isAlive)

  console.log(renderBattleHUD(aliveAllies, aliveEnemies))
  console.log(renderBattleLog(log))
}

export function renderVictory(xp: number, levels: string[]): void {
  console.log(pc.green('\n╔══════════════════════════════════════╗'))
  console.log(pc.green('║         ¡VICTORIA!                   ║'))
  console.log(pc.green('╚══════════════════════════════════════╝'))
  console.log(pc.cyan(`\n✨ XP ganada: ${xp}`))
  for (const lvl of levels) {
    console.log(pc.yellow(`  ${lvl}`))
  }
}

export function renderDefeat(): void {
  console.log(pc.red('\n╔══════════════════════════════════════╗'))
  console.log(pc.red('║         DERROTA                      ║'))
  console.log(pc.red('╚══════════════════════════════════════╝'))
}

export function renderLoot(items: string[]): void {
  if (items.length === 0) return
  console.log(pc.yellow('\n🎁 Botín obtenido:'))
  for (const item of items) {
    console.log(pc.yellow(`  • ${item}`))
  }
}
