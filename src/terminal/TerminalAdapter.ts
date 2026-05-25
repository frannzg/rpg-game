import inquirer from 'inquirer'
import pc from 'picocolors'
import { CombatSystem } from '../systems/CombatSystem.js'
import { NeedInputInfo, PlayerDecision, BattleAction, BattleState } from '../types/index.js'
import { abilities } from '../data/abilities.js'
import { renderBattleLog } from '../ui/components/Log.js'
import { Character } from '../models/Character.js'

export class TerminalAdapter {
  private combat: CombatSystem

  constructor(
    private allies: Character[],
    private enemies: Character[],
    playerControlledIds: string[]
  ) {
    this.combat = new CombatSystem(allies, enemies, playerControlledIds)
    this.combat.onNeedInput = (info) => this.handleNeedInput(info)
    this.combat.onBattleState = (state) => this.handleBattleState(state)
  }

  private async handleNeedInput(info: NeedInputInfo): Promise<void> {
    const char = [...this.allies, ...this.enemies].find(c => c.instanceId === info.charId)
    if (!char) return

    const choices = [
      { name: '⚔ Atacar', value: 'attack' },
      ...(info.availableAbilityIds.length > 0
        ? [{ name: '✨ Habilidad', value: 'ability' }]
        : []),
      ...(info.availableItems.length > 0
        ? [{ name: '🧪 Objeto', value: 'item' }]
        : []),
      { name: '🛡 Defender', value: 'defend' },
    ]

    const { action } = await inquirer.prompt<{ action: string }>([
      { type: 'list', name: 'action', message: `Turno de ${pc.bold(char.name)}:`, choices },
    ])

    switch (action) {
      case 'attack': {
        const target = await this.pickTarget(info.aliveEnemies, 'Selecciona objetivo:')
        this.combat.setPlayerDecision({ action: BattleAction.ATTACK, targetId: target?.instanceId })
        break
      }
      case 'ability': {
        const ability = await this.pickAbility(info.availableAbilityIds, char)
        if (!ability) return this.handleNeedInput(info)

        let targetId: string | undefined
        if (ability.targetType === 'single_enemy') {
          const target = await this.pickTarget(info.aliveEnemies, 'Selecciona objetivo:')
          targetId = target?.instanceId
        } else if (ability.targetType === 'single_ally') {
          const target = await this.pickTarget(info.aliveAllies, 'Selecciona aliado:')
          targetId = target?.instanceId
        } else if (ability.targetType === 'self') {
          targetId = char.instanceId
        }

        this.combat.setPlayerDecision({
          action: BattleAction.ABILITY,
          abilityId: ability.id,
          targetId,
        })
        break
      }
      case 'item': {
        if (info.availableItems.length === 0) return this.handleNeedInput(info)
        const { itemIdx } = await inquirer.prompt<{ itemIdx: number }>([
          {
            type: 'list',
            name: 'itemIdx',
            message: 'Selecciona objeto:',
            choices: info.availableItems.map((item, i) => ({
              name: `${item.name} — ${item.description}`,
              value: i,
            })),
          },
        ])
        this.combat.setPlayerDecision({ action: BattleAction.ITEM, itemIndex: itemIdx })
        break
      }
      case 'defend':
        this.combat.setPlayerDecision({ action: BattleAction.DEFEND })
        break
    }
  }

  private handleBattleState(state: BattleState): void {
    console.clear()
    console.log(pc.bold(pc.yellow(`\n╔══════════════════ RONDA ${state.round} ═════════════════╗\n`)))

    const aliveChars = [
      ...state.allies.filter(a => a.isAlive),
      ...state.enemies.filter(e => e.isAlive),
    ]

    for (const snap of state.allies) {
      const char = this.allies.find(c => c.instanceId === snap.instanceId)
      if (char) {
        console.log(pc.green(`✅ ${char.name} (${char.className}) Lv.${snap.level}`))
        console.log(`  HP: ${renderBar(snap.hp, snap.maxHp, 'green')}`)
        console.log(`  MP: ${renderBar(snap.mp, snap.maxMp, 'blue')}`)
      }
    }

    console.log(pc.bold(pc.yellow('\n═══ ENEMIGOS ═══\n')))

    for (const snap of state.enemies) {
      if (!snap.isAlive) continue
      const char = this.enemies.find(c => c.instanceId === snap.instanceId)
      if (char) {
        console.log(pc.red(`❌ ${char.name} (${char.className}) Lv.${snap.level}`))
        console.log(`  HP: ${renderBar(snap.hp, snap.maxHp, 'green')}`)
        console.log(`  MP: ${renderBar(snap.mp, snap.maxMp, 'blue')}`)
      }
    }

    console.log(renderBattleLog(state.log.map(e => ({ text: e.text, color: e.color }))))
  }

  private async pickTarget(
    targets: { instanceId: string; name: string; hp: number; maxHp: number }[],
    message: string
  ): Promise<{ instanceId: string } | null> {
    if (targets.length === 0) return null
    if (targets.length === 1) return targets[0]

    const { idx } = await inquirer.prompt<{ idx: number }>([
      {
        type: 'list',
        name: 'idx',
        message,
        choices: targets.map((t, i) => ({
          name: `${t.name} (HP: ${t.hp}/${t.maxHp})`,
          value: i,
        })),
      },
    ])
    return targets[idx]
  }

  private async pickAbility(
    abilityIds: string[],
    char: Character
  ): Promise<{ id: string; targetType: string } | null> {
    if (abilityIds.length === 0) return null

    const choices = abilityIds.map(id => {
      const ab = abilities[id]
      if (!ab) return null
      return {
        name: `${ab.name} (MP: ${ab.mpCost}) — ${ab.description}`,
        value: id,
      }
    }).filter(Boolean) as { name: string; value: string }[]

    const { abilityId } = await inquirer.prompt<{ abilityId: string }>([
      { type: 'list', name: 'abilityId', message: 'Selecciona habilidad:', choices },
    ])

    const ab = abilities[abilityId]
    return ab ? { id: ab.id, targetType: ab.targetType } : null
  }

  getCombat(): CombatSystem {
    return this.combat
  }
}

function renderBar(current: number, max: number, _color: string): string {
  const len = 12
  const filled = Math.round((current / max) * len)
  const bar = '█'.repeat(filled) + '░'.repeat(len - filled)
  return `${bar} ${current}/${max}`
}
