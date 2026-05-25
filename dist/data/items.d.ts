import { ItemData, ItemType, CharacterClass, Rarity } from '../types/index.js';
export declare const itemDatabase: Record<string, ItemData>;
export declare function getItem(id: string): ItemData | undefined;
export declare function getItemsByType(type: ItemType): ItemData[];
export declare function getItemsByRarity(rarity: Rarity): ItemData[];
export declare function getItemsForClass(className: CharacterClass): ItemData[];
//# sourceMappingURL=items.d.ts.map