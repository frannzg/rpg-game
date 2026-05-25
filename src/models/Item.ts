import { ItemData, ItemType, EquipSlot, CharacterClass, Stats, Rarity, Element } from '../types/index.js'

export class Item {
  public readonly id: string
  public readonly name: string
  public readonly description: string
  public readonly type: ItemType
  public readonly slot?: EquipSlot
  public readonly stats?: Partial<Stats>
  public readonly price: number
  public readonly rarity: Rarity
  public readonly classRestriction?: CharacterClass[]
  public readonly healAmount?: number
  public readonly mpRestore?: number
  public readonly effect?: Partial<Stats>
  public readonly duration?: number
  public readonly elementalResistance?: Partial<Record<Element, number>>

  constructor(data: ItemData) {
    this.id = data.id
    this.name = data.name
    this.description = data.description
    this.type = data.type
    this.slot = data.slot
    this.stats = data.stats
    this.price = data.price
    this.rarity = data.rarity || Rarity.COMMON
    this.classRestriction = data.classRestriction
    this.healAmount = data.healAmount
    this.mpRestore = data.mpRestore
    this.effect = data.effect
    this.duration = data.duration
    this.elementalResistance = data.elementalResistance
  }

  canEquip(characterClass: CharacterClass): boolean {
    if (!this.classRestriction || this.classRestriction.length === 0) return true
    return this.classRestriction.includes(characterClass)
  }

  isEquippable(): boolean {
    return this.type === ItemType.WEAPON || this.type === ItemType.ARMOR
  }

  isConsumable(): boolean {
    return this.type === ItemType.CONSUMABLE
  }
}
