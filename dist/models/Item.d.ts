import { ItemData, ItemType, EquipSlot, CharacterClass, Stats, Rarity, Element } from '../types/index.js';
export declare class Item {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly type: ItemType;
    readonly slot?: EquipSlot;
    readonly stats?: Partial<Stats>;
    readonly price: number;
    readonly rarity: Rarity;
    readonly classRestriction?: CharacterClass[];
    readonly healAmount?: number;
    readonly mpRestore?: number;
    readonly effect?: Partial<Stats>;
    readonly duration?: number;
    readonly elementalResistance?: Partial<Record<Element, number>>;
    constructor(data: ItemData);
    canEquip(characterClass: CharacterClass): boolean;
    isEquippable(): boolean;
    isConsumable(): boolean;
}
//# sourceMappingURL=Item.d.ts.map