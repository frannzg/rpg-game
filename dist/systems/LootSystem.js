import { Item } from '../models/Item.js';
import { itemDatabase } from '../data/items.js';
export function generateLoot(defeatedEnemies) {
    const loot = [];
    for (const enemy of defeatedEnemies) {
        for (const entry of enemy.lootTable) {
            if (Math.random() <= entry.chance) {
                const itemData = itemDatabase[entry.itemId];
                if (itemData) {
                    loot.push(new Item(itemData));
                }
            }
        }
    }
    return loot;
}
//# sourceMappingURL=LootSystem.js.map