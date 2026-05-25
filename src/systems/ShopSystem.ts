import { Item } from '../models/Item.js'
import { itemDatabase, getItemsForClass } from '../data/items.js'
import { CharacterClass, ItemType, Rarity, RARITY_MULTIPLIER, SavedCharacter } from '../types/index.js'

export interface ShopItem {
  item: Item
  buyPrice: number
  sellPrice: number
}

export class ShopSystem {
  static generateInventory(partyLevel: number, partyClasses: CharacterClass[]): ShopItem[] {
    const available: ShopItem[] = []
    const classes = [...new Set(partyClasses)]

    for (const cls of classes) {
      const classItems = getItemsForClass(cls).filter(i => i.type === ItemType.WEAPON || i.type === ItemType.ARMOR)
      for (const itemData of classItems) {
        if (Math.random() < 0.3) {
          const mult = RARITY_MULTIPLIER[itemData.rarity]
          available.push({
            item: new Item(itemData),
            buyPrice: Math.round(itemData.price * (0.8 + Math.random() * 0.4) * mult),
            sellPrice: Math.round(itemData.price * 0.3 * mult),
          })
        }
      }
    }

    const consumables = Object.values(itemDatabase).filter(i => i.type === ItemType.CONSUMABLE)
    for (const itemData of consumables) {
      if (Math.random() < 0.5) {
        available.push({
          item: new Item(itemData),
          buyPrice: itemData.price,
          sellPrice: Math.round(itemData.price * 0.3),
        })
      }
    }

    return available.sort(() => Math.random() - 0.5).slice(0, 8)
  }

  static buyItem(shopItem: ShopItem, buyerIndex: number, party: SavedCharacter[], gold: number): { party: SavedCharacter[]; gold: number } | null {
    if (gold < shopItem.buyPrice) return null
    const newParty = [...party]
    newParty[buyerIndex] = { ...newParty[buyerIndex], inventory: [...newParty[buyerIndex].inventory, shopItem.item.id] }
    return { party: newParty, gold: gold - shopItem.buyPrice }
  }

  static sellItem(invIndex: number, sellerIndex: number, party: SavedCharacter[], shopItems: ShopItem[]): { item: Item; party: SavedCharacter[]; gold: number } | null {
    const seller = party[sellerIndex]
    const itemId = seller.inventory[invIndex]
    if (!itemId) return null
    const itemData = itemDatabase[itemId]
    if (!itemData) return null
    const item = new Item(itemData)
    const mult = RARITY_MULTIPLIER[itemData.rarity]
    const sellPrice = Math.round(itemData.price * 0.3 * mult)

    const newInv = [...seller.inventory]
    newInv.splice(invIndex, 1)
    const newParty = [...party]
    newParty[sellerIndex] = { ...seller, inventory: newInv }

    return { item, party: newParty, gold: sellPrice }
  }
}
