import { Stats, CharacterClass, Ability, StatusEffect, EquipSlot, Element, Talent } from '../types/index.js'
import { abilities } from '../data/abilities.js'
import { itemDatabase } from '../data/items.js'
import { talents } from '../data/talents.js'
import { Item } from './Item.js'

export class Character {
  private static nextId = 1
  public readonly id: string
  public readonly instanceId: string
  public name: string
  public readonly className: CharacterClass
  public readonly description: string
  public level: number = 1
  public xp: number = 0
  public xpToNext: number = 100
  public gold: number = 0

  public baseStats: Stats
  public currentStats: Stats
  public statusEffects: StatusEffect[] = []
  public isDefending: boolean = false
  public isAlive: boolean = true
  public readonly abilityIds: string[]
  public readonly lootTable: { itemId: string; chance: number }[]
  public readonly xpReward: number

  public equippedWeapon: Item | null
  public equippedArmor: Item | null
  public inventory: Item[] = []
  public battleBuffs: Partial<Stats> = {}
  public talents: string[] = []

  public elementalResistance: Partial<Record<Element, number>> = {}
  public damageThisBattle: number = 0
  public healingThisBattle: number = 0

  constructor(template: {
    id: string
    name: string
    className: CharacterClass
    description: string
    baseStats: Stats
    abilityIds: string[]
    weaponId: string
    armorId: string
    loot: { itemId: string; chance: number }[]
    xpReward: number
  }) {
    this.id = template.id
    this.instanceId = `${template.id}_${Character.nextId++}`
    this.name = template.name
    this.className = template.className
    this.description = template.description
    this.baseStats = { ...template.baseStats }
    this.currentStats = { ...template.baseStats }
    this.abilityIds = [...template.abilityIds]
    this.lootTable = [...template.loot]
    this.xpReward = template.xpReward

    const weaponData = itemDatabase[template.weaponId]
    const armorData = itemDatabase[template.armorId]
    this.equippedWeapon = weaponData ? new Item(weaponData) : null
    this.equippedArmor = armorData ? new Item(armorData) : null
  }

  getAbilities(): Ability[] {
    return this.abilityIds
      .map(id => abilities[id])
      .filter(Boolean) as Ability[]
  }

  getEffectiveStats(): Stats {
    const s = { ...this.currentStats }

    if (this.equippedWeapon?.stats) {
      for (const [key, val] of Object.entries(this.equippedWeapon.stats)) {
        const k = key as keyof Stats
        if (typeof val === 'number') (s as any)[k] = (s as any)[k] + val
      }
    }
    if (this.equippedArmor?.stats) {
      for (const [key, val] of Object.entries(this.equippedArmor.stats)) {
        const k = key as keyof Stats
        if (typeof val === 'number') (s as any)[k] = (s as any)[k] + val
      }
    }
    for (const effect of this.statusEffects) {
      const mods = effect.statModifiers
      for (const [key, val] of Object.entries(mods)) {
        const k = key as keyof Stats
        if (typeof val === 'number') (s as any)[k] = Math.round((s as any)[k] * (1 + val))
      }
    }
    for (const [key, val] of Object.entries(this.battleBuffs)) {
      const k = key as keyof Stats
      if (typeof val === 'number') (s as any)[k] = (s as any)[k] + val
    }
    for (const talentId of this.talents) {
      const talent = talents[talentId]
      if (talent) {
        for (const [key, val] of Object.entries(talent.statModifiers)) {
          const k = key as keyof Stats
          if (typeof val === 'number') (s as any)[k] = (s as any)[k] + val
        }
      }
    }

    if (this.equippedArmor?.elementalResistance) {
      for (const [elem, val] of Object.entries(this.equippedArmor.elementalResistance)) {
        this.elementalResistance[elem as Element] = val
      }
    }

    if (s.hp > s.maxHp) s.hp = s.maxHp
    if (s.mp > s.maxMp) s.mp = s.maxMp
    return s
  }

  getElementalResistance(element: Element): number {
    return this.elementalResistance[element] || 0
  }

  takeDamage(amount: number): number {
    const effectiveStats = this.getEffectiveStats()
    let reduced = Math.max(1, Math.round(amount * (100 / (100 + effectiveStats.def))))
    if (this.isDefending) { reduced = Math.round(reduced * 0.5); this.isDefending = false }
    this.currentStats.hp = Math.max(0, this.currentStats.hp - reduced)
    if (this.currentStats.hp <= 0) { this.isAlive = false; this.currentStats.hp = 0 }
    return reduced
  }

  takeMagicDamage(amount: number, element?: Element): number {
    let effectiveStats = this.getEffectiveStats()
    let resistance = element ? this.getElementalResistance(element) : 0
    let reduced = Math.max(1, Math.round(amount * (100 / (100 + effectiveStats.res + resistance))))
    if (this.isDefending) { reduced = Math.round(reduced * 0.5); this.isDefending = false }
    this.currentStats.hp = Math.max(0, this.currentStats.hp - reduced)
    if (this.currentStats.hp <= 0) { this.isAlive = false; this.currentStats.hp = 0 }
    return reduced
  }

  heal(amount: number): number {
    const before = this.currentStats.hp
    const effectiveMaxHp = this.getEffectiveStats().maxHp
    this.currentStats.hp = Math.min(effectiveMaxHp, this.currentStats.hp + amount)
    return this.currentStats.hp - before
  }

  restoreMp(amount: number): number {
    const before = this.currentStats.mp
    const effectiveMaxMp = this.getEffectiveStats().maxMp
    this.currentStats.mp = Math.min(effectiveMaxMp, this.currentStats.mp + amount)
    return this.currentStats.mp - before
  }

  addStatusEffect(effect: StatusEffect): void {
    const existing = this.statusEffects.find(e => e.id === effect.id)
    if (existing) existing.duration = effect.duration
    else this.statusEffects.push({ ...effect })
  }

  processStatusEffects(): { damage: number; messages: string[] } {
    const messages: string[] = []
    let totalDamage = 0
    for (const effect of this.statusEffects) {
      if (effect.damagePerTurn) {
        const dmg = Math.round(effect.damagePerTurn * (this.currentStats.maxHp / 100))
        this.currentStats.hp = Math.max(0, this.currentStats.hp - dmg)
        totalDamage += dmg
        if (this.currentStats.hp <= 0) { this.isAlive = false; this.currentStats.hp = 0 }
        messages.push(`${this.name} recibe ${dmg} de daño por ${effect.name}`)
      }
      effect.duration--
    }
    this.statusEffects = this.statusEffects.filter(e => e.duration > 0)
    return { damage: totalDamage, messages }
  }

  addXp(amount: number): number {
    this.xp += amount
    let levelsGained = 0
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext; this.levelUp(); levelsGained++
    }
    return levelsGained
  }

  private levelUp(): void {
    this.level++
    this.xpToNext = Math.round(this.level * 100 + Math.pow(this.level - 1, 2) * 50)
    const growth: Record<string, number> = {
      maxHp: Math.round(this.baseStats.maxHp * 0.08 + 3),
      maxMp: Math.round(this.baseStats.maxMp * 0.06 + 2),
      str: Math.round(this.baseStats.str * 0.05 + 1),
      def: Math.round(this.baseStats.def * 0.05 + 1),
      int: Math.round(this.baseStats.int * 0.05 + 1),
      res: Math.round(this.baseStats.res * 0.05 + 1),
      spd: Math.round(this.baseStats.spd * 0.04 + 1),
      dex: Math.round(this.baseStats.dex * 0.04 + 1),
    }
    for (const [key, val] of Object.entries(growth)) {
      if (typeof val === 'number') {
        (this.baseStats as any)[key] = ((this.baseStats as any)[key] || 0) + val
        ;(this.currentStats as any)[key] = ((this.currentStats as any)[key] || 0) + val
      }
    }
    this.currentStats.hp = this.currentStats.maxHp
    this.currentStats.mp = this.currentStats.maxMp
  }

  equipItem(item: Item): boolean {
    if (!item.canEquip(this.className)) return false
    if (item.slot === EquipSlot.WEAPON) {
      if (this.equippedWeapon) this.inventory.push(this.equippedWeapon)
      this.equippedWeapon = item; return true
    }
    if (item.slot === EquipSlot.ARMOR) {
      if (this.equippedArmor) this.inventory.push(this.equippedArmor)
      this.equippedArmor = item; return true
    }
    return false
  }

  addToInventory(item: Item): void {
    this.inventory.push(item)
  }

  removeFromInventory(index: number): Item | null {
    if (index < 0 || index >= this.inventory.length) return null
    return this.inventory.splice(index, 1)[0]
  }

  getHpPercent(): number {
    return this.currentStats.hp / this.currentStats.maxHp
  }

  getMpPercent(): number {
    return this.currentStats.mp / this.currentStats.maxMp
  }

  resetForBattle(): void {
    this.currentStats = { ...this.baseStats }
    this.isAlive = true; this.isDefending = false
    this.statusEffects = []; this.battleBuffs = {}
    this.elementalResistance = {}
    this.damageThisBattle = 0; this.healingThisBattle = 0
  }
}
