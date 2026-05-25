import { Character } from '../models/Character.js'
import { Item } from '../models/Item.js'
import { itemDatabase } from '../data/items.js'
import { ItemData } from '../types/index.js'

export function generateLoot(defeatedEnemies: Character[]): Item[] {
  const loot: Item[] = []

  for (const enemy of defeatedEnemies) {
    for (const entry of enemy.lootTable) {
      if (Math.random() <= entry.chance) {
        const itemData = itemDatabase[entry.itemId]
        if (itemData) {
          loot.push(new Item(itemData))
        }
      }
    }
  }

  return loot
}
