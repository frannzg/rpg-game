import { Item } from '../models/Item.js';
import { CharacterClass, SavedCharacter } from '../types/index.js';
export interface ShopItem {
    item: Item;
    buyPrice: number;
    sellPrice: number;
}
export declare class ShopSystem {
    static generateInventory(partyLevel: number, partyClasses: CharacterClass[]): ShopItem[];
    static buyItem(shopItem: ShopItem, buyerIndex: number, party: SavedCharacter[], gold: number): {
        party: SavedCharacter[];
        gold: number;
    } | null;
    static sellItem(invIndex: number, sellerIndex: number, party: SavedCharacter[], shopItems: ShopItem[]): {
        item: Item;
        party: SavedCharacter[];
        gold: number;
    } | null;
}
//# sourceMappingURL=ShopSystem.d.ts.map