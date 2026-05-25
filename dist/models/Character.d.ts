import { Stats, CharacterClass, Ability, StatusEffect, Element } from '../types/index.js';
import { Item } from './Item.js';
export declare class Character {
    private static nextId;
    readonly id: string;
    readonly instanceId: string;
    name: string;
    readonly className: CharacterClass;
    readonly description: string;
    level: number;
    xp: number;
    xpToNext: number;
    gold: number;
    baseStats: Stats;
    currentStats: Stats;
    statusEffects: StatusEffect[];
    isDefending: boolean;
    isAlive: boolean;
    readonly abilityIds: string[];
    readonly lootTable: {
        itemId: string;
        chance: number;
    }[];
    readonly xpReward: number;
    equippedWeapon: Item | null;
    equippedArmor: Item | null;
    inventory: Item[];
    battleBuffs: Partial<Stats>;
    talents: string[];
    elementalResistance: Partial<Record<Element, number>>;
    damageThisBattle: number;
    healingThisBattle: number;
    constructor(template: {
        id: string;
        name: string;
        className: CharacterClass;
        description: string;
        baseStats: Stats;
        abilityIds: string[];
        weaponId: string;
        armorId: string;
        loot: {
            itemId: string;
            chance: number;
        }[];
        xpReward: number;
    });
    getAbilities(): Ability[];
    getEffectiveStats(): Stats;
    getElementalResistance(element: Element): number;
    takeDamage(amount: number): number;
    takeMagicDamage(amount: number, element?: Element): number;
    heal(amount: number): number;
    restoreMp(amount: number): number;
    addStatusEffect(effect: StatusEffect): void;
    processStatusEffects(): {
        damage: number;
        messages: string[];
    };
    addXp(amount: number): number;
    private levelUp;
    equipItem(item: Item): boolean;
    addToInventory(item: Item): void;
    removeFromInventory(index: number): Item | null;
    getHpPercent(): number;
    getMpPercent(): number;
    resetForBattle(): void;
}
//# sourceMappingURL=Character.d.ts.map