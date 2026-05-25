import { Character } from '../models/Character.js'
import { Item } from '../models/Item.js'
import { abilities, SUMMON_LOBO } from '../data/abilities.js'
import { talents } from '../data/talents.js'
import {
  BattleAction, BattleStatus, BattleResult, Ability,
  TargetType, LogEntry, CharacterClass,
  PlayerDecision, NeedInputInfo, CharSnapshot, BattleState,
  Element, ELEMENT_ADVANTAGE,
} from '../types/index.js'
import { decideAIAction } from './AISystem.js'

export interface SummonedPet {
  id: string
  name: string
  hp: number
  maxHp: number
  str: number
  def: number
  spd: number
  dex: number
  isAlive: boolean
  turnsLeft: number
  ownerInstanceId: string
}

export class CombatSystem {
  private allies: Character[]
  private enemies: Character[]
  private battleLog: LogEntry[] = []
  private round: number = 0
  private playerControlledIds: Set<string>
  private decisionResolver: ((decision: PlayerDecision) => void) | null = null
  private readonly MAX_ROUNDS = 50
  private summonedPets: SummonedPet[] = []

  onNeedInput?: (info: NeedInputInfo) => void
  onBattleState?: (state: BattleState) => void

  public totalDamageDealt: number = 0
  public totalDamageTaken: number = 0
  public totalHealed: number = 0
  public criticalHits: number = 0
  public enemiesDefeated: number = 0

  constructor(
    allies: Character[],
    enemies: Character[],
    playerControlledIds: string[] = []
  ) {
    this.allies = [...allies]
    this.enemies = [...enemies]
    this.playerControlledIds = new Set(playerControlledIds)
    for (const char of [...this.allies, ...this.enemies]) char.resetForBattle()
  }

  private log(text: string, color?: string): void {
    this.battleLog.push({ text, color })
  }

  private getAlive(party: Character[]): Character[] {
    return party.filter(c => c.isAlive)
  }

  private getAlivePets(): SummonedPet[] {
    return this.summonedPets.filter(p => p.isAlive)
  }

  private findChar(instanceId: string): Character | undefined {
    return [...this.allies, ...this.enemies].find(c => c.instanceId === instanceId)
  }

  private findPet(id: string): SummonedPet | undefined {
    return this.summonedPets.find(p => p.id === id)
  }

  private isEnemyTeam(char: Character): boolean {
    return this.enemies.includes(char)
  }

  private getElementMultiplier(attackElement: Element, defender: Character): number {
    const advantage = ELEMENT_ADVANTAGE[attackElement]
    if (!advantage) return 1.0
    const defElement = defender.equippedArmor?.elementalResistance
    if (!defElement) return 1.0
    for (const [elem] of Object.entries(defElement)) {
      const mult = advantage[elem as Element]
      if (mult) return mult
    }
    return 1.0
  }

  private toSnapshot(char: Character): CharSnapshot {
    const s = char.getEffectiveStats()
    return {
      id: char.id,
      instanceId: char.instanceId,
      name: char.name,
      className: char.className,
      level: char.level,
      hp: char.currentStats.hp,
      maxHp: char.currentStats.maxHp,
      mp: char.currentStats.mp,
      maxMp: char.currentStats.maxMp,
      str: s.str, def: s.def, int: s.int, res: s.res, spd: s.spd, dex: s.dex,
      isAlive: char.isAlive,
      isDefending: char.isDefending,
      statusEffects: char.statusEffects.map(e => e.name),
      weaponName: char.equippedWeapon?.name ?? null,
      armorName: char.equippedArmor?.name ?? null,
    }
  }

  private emitState(turnCharId?: string): void {
    if (!this.onBattleState) return
    this.onBattleState({
      round: this.round,
      allies: this.allies.map(c => this.toSnapshot(c)),
      enemies: this.enemies.map(c => this.toSnapshot(c)),
      log: this.battleLog.slice(-10),
      status: this.getBattleResult(),
      turnCharId,
    })
  }

  setPlayerDecision(decision: PlayerDecision): void {
    if (this.decisionResolver) {
      this.decisionResolver(decision)
      this.decisionResolver = null
    }
  }

  private async waitForPlayerDecision(char: Character): Promise<PlayerDecision> {
    const isEnemy = this.isEnemyTeam(char)
    const aliveEnemies = this.getAlive(isEnemy ? this.allies : this.enemies)
    const ownTeam = isEnemy ? this.enemies : this.allies
    const aliveAllies = this.getAlive(ownTeam).filter(a => a.instanceId !== char.instanceId)
    const abilities = char.getAbilities().filter(a => char.currentStats.mp >= a.mpCost)

    const info: NeedInputInfo = {
      charId: char.instanceId,
      availableAbilityIds: abilities.map(a => a.id),
      availableItems: char.inventory.filter(i => i.isConsumable()).map(i => ({ name: i.name, description: i.description })),
      aliveEnemies: aliveEnemies.map(e => this.toSnapshot(e)),
      aliveAllies: aliveAllies.map(a => this.toSnapshot(a)),
    }

    if (this.onNeedInput) this.onNeedInput(info)
    this.emitState(char.instanceId)

    return new Promise(resolve => {
      this.decisionResolver = resolve
    })
  }

  private getTurnOrder(): Character[] {
    const all = [...this.getAlive(this.allies), ...this.getAlive(this.enemies)]
    return all.sort((a, b) => {
      const spdA = a.getEffectiveStats().spd
      const spdB = b.getEffectiveStats().spd
      if (spdB !== spdA) return spdB - spdA
      return Math.random() - 0.5
    })
  }

  private getPetTurnOrder(): SummonedPet[] {
    return this.getAlivePets().sort((a, b) => {
      if (b.spd !== a.spd) return b.spd - a.spd
      return Math.random() - 0.5
    })
  }

  private isPlayerControlled(char: Character): boolean {
    return this.playerControlledIds.has(char.instanceId)
  }

  private getAttackStat(char: Character): { baseStat: number; weaponBonus: number } {
    const stats = char.getEffectiveStats()
    const baseStat = char.className === CharacterClass.MAGE ? stats.int
      : char.className === CharacterClass.ARCHER ? stats.dex
        : char.className === CharacterClass.DRUID ? stats.int
          : stats.str

    const weaponBonus = (() => {
      if (!char.equippedWeapon?.stats) return 0
      if (char.className === CharacterClass.MAGE) return char.equippedWeapon.stats.int ?? 0
      if (char.className === CharacterClass.ARCHER) return char.equippedWeapon.stats.dex ?? 0
      if (char.className === CharacterClass.DRUID) return char.equippedWeapon.stats.int ?? 0
      return char.equippedWeapon.stats.str ?? 0
    })()

    return { baseStat, weaponBonus }
  }

  private executeAttack(attacker: Character, target: Character): void {
    const { baseStat, weaponBonus } = this.getAttackStat(attacker)
    const atk = baseStat + weaponBonus
    const variance = 0.9 + Math.random() * 0.2
    const rawDamage = Math.round(atk * 5 * variance)
    const isCrit = Math.random() < (attacker.getEffectiveStats().dex / 150)
    const finalDamage = isCrit ? Math.round(rawDamage * 1.8) : rawDamage

    const usesMagic = attacker.className === CharacterClass.MAGE || attacker.className === CharacterClass.DRUID
    const dealt = usesMagic ? target.takeMagicDamage(finalDamage, Element.PHYSICAL) : target.takeDamage(finalDamage)

    attacker.damageThisBattle += dealt
    this.totalDamageDealt += dealt
    if (isCrit) this.criticalHits++

    if (attacker.className === CharacterClass.BERSERKER) {
      const hpCost = Math.round(attacker.currentStats.maxHp * 0.05)
      attacker.currentStats.hp = Math.max(1, attacker.currentStats.hp - hpCost)
    }

    this.log(`${isCrit ? '⚡ ¡CRÍTICO! ' : ''}${attacker.name} ataca a ${target.name} causando ${dealt} de daño.`)
    if (!target.isAlive) { this.log(`💀 ${target.name} ha sido derrotado!`); this.enemiesDefeated++ }
  }

  private executeAbility(user: Character, target: Character, ability: Ability): void {
    const stats = user.getEffectiveStats()
    const baseStat = (stats as any)[ability.statKey] ?? 0

    if (ability.id === 'golpe_sangriento') {
      const hpCost = Math.round(user.currentStats.maxHp * 0.1)
      user.currentStats.hp = Math.max(1, user.currentStats.hp - hpCost)
      this.log(`${user.name} sacrifica ${hpCost} HP para usar ${ability.name}!`)
    }

    const isHealSpell = ability.id === 'curar' || ability.id === 'curacion_divina' || ability.id === 'curacion_natural'
    if (isHealSpell || (ability.targetType === TargetType.SINGLE_ALLY && ability.power > 0)) {
      const healAmount = Math.round(baseStat * ability.power * 4 + 20)
      const healed = target.heal(healAmount)
      user.healingThisBattle += healed
      this.totalHealed += healed
      this.log(`${user.name} usa ${ability.name} restaurando ${healed} HP de ${target.name}!`)
      return
    }

    if (ability.id === 'invocar_lobo') {
      const talentBonus = user.talents.includes('companero') ? 1.5 : 1
      const pet: SummonedPet = {
        id: `lobo_${user.instanceId}`,
        name: '🐺 Lobo Ancestral',
        hp: Math.round(SUMMON_LOBO.baseStats.hp * talentBonus),
        maxHp: Math.round(SUMMON_LOBO.baseStats.maxHp * talentBonus),
        str: Math.round(SUMMON_LOBO.baseStats.str * talentBonus),
        def: SUMMON_LOBO.baseStats.def,
        spd: SUMMON_LOBO.baseStats.spd,
        dex: SUMMON_LOBO.baseStats.dex,
        isAlive: true,
        turnsLeft: SUMMON_LOBO.turnsLeft,
        ownerInstanceId: user.instanceId,
      }
      this.summonedPets.push(pet)
      this.log(`${user.name} invoca un ${pet.name}! (${pet.turnsLeft} turnos)`)
      return
    }

    if (ability.power > 0) {
      const hitCount = ability.hitCount || 1
      const targets = ability.targetType === TargetType.ALL_ENEMIES
        ? this.getAlive(this.enemies)
        : [target]

      for (const t of targets) {
        if (!t.isAlive) continue
        for (let hit = 0; hit < hitCount; hit++) {
          if (!t.isAlive) break
          const variance = 0.9 + Math.random() * 0.2
          const rawDamage = Math.round(baseStat * ability.power * 8 * variance)
          const usesDef = (ability.statKey === 'str' || ability.statKey === 'dex')
          const elemMult = this.getElementMultiplier(ability.element, t)
          const adjustedDamage = Math.round(rawDamage * elemMult)
          const dealt = usesDef ? t.takeDamage(adjustedDamage) : t.takeMagicDamage(adjustedDamage, ability.element)

          user.damageThisBattle += dealt
          this.totalDamageDealt += dealt

          const elemText = elemMult !== 1.0 ? (elemMult > 1 ? ' (👍 ventaja elemental!)' : ' (👎 resistencia...)') : ''
          const hitText = hitCount > 1 ? ` (${hit + 1}°)` : ''
          this.log(`${user.name} usa ${ability.name}${hitText} causando ${dealt} de daño a ${t.name}!${elemText}`)
          if (!t.isAlive) { this.log(`💀 ${t.name} ha sido derrotado!`); this.enemiesDefeated++ }
        }
      }
    }

    if (ability.statusEffect && target.isAlive) {
      target.addStatusEffect(ability.statusEffect)
      this.log(`${target.name} sufre ${ability.statusEffect.name}!`)
    }
  }

  private executeItem(user: Character, target: Character, item: Item): void {
    if (item.healAmount) {
      const healed = target.heal(item.healAmount)
      user.healingThisBattle += healed
      this.totalHealed += healed
      this.log(`${user.name} usa ${item.name} restaurando ${healed} HP.`)
    } else if (item.mpRestore) {
      const restored = target.restoreMp(item.mpRestore)
      this.log(`${user.name} usa ${item.name} restaurando ${restored} MP.`)
    } else if (item.effect) {
      for (const [key, val] of Object.entries(item.effect)) {
        const k = key as keyof typeof target.battleBuffs
        if (typeof val === 'number') target.battleBuffs[k] = (target.battleBuffs[k] || 0) + val
      }
      this.log(`${user.name} usa ${item.name} obteniendo buff!`)
    }
  }

  private executePetAttack(pet: SummonedPet, target: Character): void {
    const variance = 0.9 + Math.random() * 0.2
    const rawDamage = Math.round(pet.str * 4 * variance)
    const dealt = target.takeDamage(rawDamage)
    this.totalDamageDealt += dealt
    this.log(`${pet.name} muerde a ${target.name} causando ${dealt} de daño!`)
    if (!target.isAlive) { this.log(`💀 ${target.name} ha sido derrotado!`); this.enemiesDefeated++ }
  }

  private processDecision(char: Character, decision: PlayerDecision): void {
    const target = decision.targetId ? this.findChar(decision.targetId) || this.findPet(decision.targetId) as any : undefined
    if (decision.targetId && (!target || !(target as any).isAlive)) return

    switch (decision.action) {
      case BattleAction.ATTACK: {
        if (target && (target as Character).takeDamage) this.executeAttack(char, target as Character)
        break
      }
      case BattleAction.ABILITY: {
        const ability = decision.abilityId ? abilities[decision.abilityId] : undefined
        if (ability && char.currentStats.mp >= ability.mpCost) {
          char.currentStats.mp -= ability.mpCost
          if (ability.targetType === TargetType.ALL_ENEMIES) {
            this.executeAbility(char, this.getAlive(this.enemies)[0], ability)
          } else if (ability.targetType === TargetType.SELF) {
            this.executeAbility(char, char, ability)
          } else if (ability.targetType === TargetType.SINGLE_ALLY) {
            this.executeAbility(char, target as Character || char, ability)
          } else {
            if (target) this.executeAbility(char, target as Character, ability)
          }
        }
        break
      }
      case BattleAction.ITEM: {
        const idx = decision.itemIndex
        if (idx !== undefined && idx >= 0 && idx < char.inventory.length) {
          const item = char.inventory[idx]
          char.inventory.splice(idx, 1)
          this.executeItem(char, char, item)
        }
        break
      }
      case BattleAction.DEFEND: {
        char.isDefending = true
        this.log(`${char.name} se pone en posición defensiva!`)
        break
      }
    }
  }

  private getBattleResult(): BattleStatus {
    if (this.getAlive(this.enemies).length === 0) return BattleStatus.VICTORY
    if (this.getAlive(this.allies).length === 0 && this.getAlivePets().length === 0) return BattleStatus.DEFEAT
    return BattleStatus.ONGOING
  }

  async start(): Promise<BattleResult> {
    this.log('⚔ ¡LA BATALLA COMIENZA! ⚔')
    this.log(`Aliados: ${this.allies.map(c => c.name).join(', ')}`)
    this.log(`Enemigos: ${this.enemies.map(c => c.name).join(', ')}`)
    this.emitState()

    while (this.round < this.MAX_ROUNDS) {
      const status = this.getBattleResult()
      if (status !== BattleStatus.ONGOING) return this.finalizeBattle(status)

      this.round++
      this.log(`── Ronda ${this.round} ──`)

      const turnOrder = this.getTurnOrder()
      const petOrder = this.getPetTurnOrder()

      const allTurnOrder = [
        ...turnOrder,
        ...petOrder,
      ].sort((a, b) => {
        const spdA = (a as any).spd || (a as Character).getEffectiveStats().spd
        const spdB = (b as any).spd || (b as Character).getEffectiveStats().spd
        if (spdB !== spdA) return spdB - spdA
        return Math.random() - 0.5
      })

      for (const entity of allTurnOrder) {
        if (entity instanceof Character) {
          if (!entity.isAlive) continue

          const statusCheck = this.getBattleResult()
          if (statusCheck !== BattleStatus.ONGOING) return this.finalizeBattle(statusCheck)

          this.emitState(entity.instanceId)

          if (this.isPlayerControlled(entity)) {
            const decision = await this.waitForPlayerDecision(entity)
            this.processDecision(entity, decision)
          } else {
            const aiDecision = decideAIAction(
              entity,
              this.getAlive(this.enemies),
              this.getAlive(this.allies)
            )
            this.processAIDecision(entity, aiDecision)
          }

          const { messages } = entity.processStatusEffects()
          for (const msg of messages) this.log(msg)
          this.emitState()
        } else {
          const pet = entity as SummonedPet
          if (!pet.isAlive) continue

          const realEnemies = this.getAlive(this.enemies)
          if (realEnemies.length > 0) {
            const target = realEnemies.sort((a, b) => a.getHpPercent() - b.getHpPercent())[0]
            this.executePetAttack(pet, target)
          }

          pet.turnsLeft--
          if (pet.turnsLeft <= 0 || !pet.isAlive) {
            pet.isAlive = false
            this.log(`${pet.name} desaparece...`)
          }
          this.emitState()
        }
      }
    }

    return this.finalizeBattle(BattleStatus.DEFEAT)
  }

  private processAIDecision(char: Character, aiDecision: ReturnType<typeof decideAIAction>): void {
    const target = aiDecision.target?.isAlive ? aiDecision.target : undefined
    const realEnemies = this.getAlive(this.isEnemyTeam(char) ? this.allies : this.enemies)

    switch (aiDecision.action) {
      case BattleAction.ATTACK:
        if (target) this.executeAttack(char, target)
        else if (realEnemies.length > 0) this.executeAttack(char, realEnemies[Math.floor(Math.random() * realEnemies.length)])
        break
      case BattleAction.ABILITY:
        if (aiDecision.ability) {
          char.currentStats.mp -= aiDecision.ability.mpCost
          if (aiDecision.ability.targetType === TargetType.ALL_ENEMIES) {
            if (realEnemies.length > 0) this.executeAbility(char, realEnemies[0], aiDecision.ability)
          } else if (target) {
            this.executeAbility(char, target, aiDecision.ability)
          }
        }
        break
      case BattleAction.ITEM:
        if (aiDecision.itemIndex !== undefined && char.inventory[aiDecision.itemIndex]) {
          const item = char.inventory[aiDecision.itemIndex]
          char.inventory.splice(aiDecision.itemIndex, 1)
          this.executeItem(char, char, item)
        } else if (realEnemies.length > 0) {
          this.executeAttack(char, realEnemies[Math.floor(Math.random() * realEnemies.length)])
        }
        break
      case BattleAction.DEFEND:
        char.isDefending = true
        this.log(`${char.name} se defiende!`)
        break
    }
  }

  private finalizeBattle(status: BattleStatus): BattleResult {
    const totalXp = this.enemies
      .filter(e => !e.isAlive)
      .reduce((sum, e) => sum + e.xpReward, 0)

    this.emitState()

    if (status === BattleStatus.DEFEAT) {
      this.totalDamageTaken += this.allies.reduce((s, c) => s + (c.currentStats.maxHp - c.currentStats.hp), 0)
    }

    return {
      status,
      xpEarned: totalXp,
      loot: [],
      rounds: this.round,
      winner: status === BattleStatus.VICTORY ? 'Aliados' : 'Enemigos',
    }
  }
}
