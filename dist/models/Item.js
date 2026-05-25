import { ItemType, Rarity } from '../types/index.js';
export class Item {
    id;
    name;
    description;
    type;
    slot;
    stats;
    price;
    rarity;
    classRestriction;
    healAmount;
    mpRestore;
    effect;
    duration;
    elementalResistance;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.type = data.type;
        this.slot = data.slot;
        this.stats = data.stats;
        this.price = data.price;
        this.rarity = data.rarity || Rarity.COMMON;
        this.classRestriction = data.classRestriction;
        this.healAmount = data.healAmount;
        this.mpRestore = data.mpRestore;
        this.effect = data.effect;
        this.duration = data.duration;
        this.elementalResistance = data.elementalResistance;
    }
    canEquip(characterClass) {
        if (!this.classRestriction || this.classRestriction.length === 0)
            return true;
        return this.classRestriction.includes(characterClass);
    }
    isEquippable() {
        return this.type === ItemType.WEAPON || this.type === ItemType.ARMOR;
    }
    isConsumable() {
        return this.type === ItemType.CONSUMABLE;
    }
}
//# sourceMappingURL=Item.js.map