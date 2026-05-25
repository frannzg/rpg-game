export var CharacterClass;
(function (CharacterClass) {
    CharacterClass["WARRIOR"] = "Guerrero";
    CharacterClass["MAGE"] = "Mago";
    CharacterClass["ROGUE"] = "P\u00EDcaro";
    CharacterClass["PALADIN"] = "Palad\u00EDn";
    CharacterClass["ARCHER"] = "Arquero";
    CharacterClass["BERSERKER"] = "Berserker";
    CharacterClass["DRUID"] = "Druida";
})(CharacterClass || (CharacterClass = {}));
export var ItemType;
(function (ItemType) {
    ItemType["WEAPON"] = "arma";
    ItemType["ARMOR"] = "armadura";
    ItemType["CONSUMABLE"] = "consumible";
})(ItemType || (ItemType = {}));
export var EquipSlot;
(function (EquipSlot) {
    EquipSlot["WEAPON"] = "arma";
    EquipSlot["ARMOR"] = "armadura";
})(EquipSlot || (EquipSlot = {}));
export var BattleAction;
(function (BattleAction) {
    BattleAction["ATTACK"] = "Atacar";
    BattleAction["ABILITY"] = "Habilidad";
    BattleAction["ITEM"] = "Objeto";
    BattleAction["DEFEND"] = "Defender";
})(BattleAction || (BattleAction = {}));
export var BattleStatus;
(function (BattleStatus) {
    BattleStatus["ONGOING"] = "ongoing";
    BattleStatus["VICTORY"] = "victory";
    BattleStatus["DEFEAT"] = "defeat";
})(BattleStatus || (BattleStatus = {}));
export var TargetType;
(function (TargetType) {
    TargetType["SINGLE_ENEMY"] = "single_enemy";
    TargetType["ALL_ENEMIES"] = "all_enemies";
    TargetType["SELF"] = "self";
    TargetType["SINGLE_ALLY"] = "single_ally";
    TargetType["ALL_ALLIES"] = "all_allies";
})(TargetType || (TargetType = {}));
export var Rarity;
(function (Rarity) {
    Rarity["COMMON"] = "common";
    Rarity["UNCOMMON"] = "uncommon";
    Rarity["RARE"] = "rare";
    Rarity["EPIC"] = "epic";
    Rarity["LEGENDARY"] = "legendary";
})(Rarity || (Rarity = {}));
export var Element;
(function (Element) {
    Element["PHYSICAL"] = "physical";
    Element["FIRE"] = "fire";
    Element["ICE"] = "ice";
    Element["LIGHTNING"] = "lightning";
    Element["EARTH"] = "earth";
    Element["HOLY"] = "holy";
    Element["SHADOW"] = "shadow";
})(Element || (Element = {}));
export var Difficulty;
(function (Difficulty) {
    Difficulty["NORMAL"] = "normal";
    Difficulty["HARD"] = "hard";
    Difficulty["NIGHTMARE"] = "nightmare";
})(Difficulty || (Difficulty = {}));
export const ELEMENT_ADVANTAGE = {
    [Element.FIRE]: { [Element.ICE]: 1.3, [Element.EARTH]: 0.7 },
    [Element.ICE]: { [Element.EARTH]: 1.3, [Element.LIGHTNING]: 0.7 },
    [Element.EARTH]: { [Element.LIGHTNING]: 1.3, [Element.FIRE]: 0.7 },
    [Element.LIGHTNING]: { [Element.FIRE]: 1.3, [Element.ICE]: 0.7 },
    [Element.HOLY]: { [Element.SHADOW]: 1.3 },
    [Element.SHADOW]: { [Element.HOLY]: 1.3 },
};
export const RARITY_MULTIPLIER = {
    [Rarity.COMMON]: 1,
    [Rarity.UNCOMMON]: 1.5,
    [Rarity.RARE]: 2.5,
    [Rarity.EPIC]: 4,
    [Rarity.LEGENDARY]: 8,
};
export const RARITY_COLORS = {
    [Rarity.COMMON]: '#c8c8d0',
    [Rarity.UNCOMMON]: '#4a4',
    [Rarity.RARE]: '#44a',
    [Rarity.EPIC]: '#a6a',
    [Rarity.LEGENDARY]: '#da4',
};
//# sourceMappingURL=index.js.map