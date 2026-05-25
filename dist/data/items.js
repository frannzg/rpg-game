import { ItemType, EquipSlot, CharacterClass, Rarity } from '../types/index.js';
export const itemDatabase = {
    // ===== Armas Comunes =====
    espada_hierro: {
        id: 'espada_hierro', name: 'Espada de Hierro', description: 'Espada básica de hierro forjado',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 8 }, price: 100, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.WARRIOR, CharacterClass.PALADIN],
    },
    espada_acerada: {
        id: 'espada_acerada', name: 'Espada de Acero', description: 'Espada de acero templado',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 15 }, price: 250, rarity: Rarity.UNCOMMON,
        classRestriction: [CharacterClass.WARRIOR, CharacterClass.PALADIN],
    },
    baston_arcano: {
        id: 'baston_arcano', name: 'Bastón Arcano', description: 'Bastón imbuido con energía mágica',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { int: 10 }, price: 100, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.MAGE],
    },
    baston_anciano: {
        id: 'baston_anciano', name: 'Bastón del Anciano', description: 'Antiguo bastón con poder mágico superior',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { int: 18 }, price: 300, rarity: Rarity.UNCOMMON,
        classRestriction: [CharacterClass.MAGE],
    },
    dagas_aceradas: {
        id: 'dagas_aceradas', name: 'Dagas Aceleradas', description: 'Par de dagas ligeras y letales',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 6, spd: 5 }, price: 120, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.ROGUE],
    },
    dagas_oscuras: {
        id: 'dagas_oscuras', name: 'Dagas de la Sombra', description: 'Dagas imbuidas con energía oscura',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 10, spd: 8 }, price: 280, rarity: Rarity.UNCOMMON,
        classRestriction: [CharacterClass.ROGUE],
    },
    arco_largo: {
        id: 'arco_largo', name: 'Arco Largo', description: 'Arco de gran alcance y precisión',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { dex: 10 }, price: 100, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.ARCHER],
    },
    arco_elfico: {
        id: 'arco_elfico', name: 'Arco Élfico', description: 'Arco élfico de precisión sobrenatural',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { dex: 18 }, price: 300, rarity: Rarity.UNCOMMON,
        classRestriction: [CharacterClass.ARCHER],
    },
    martillo_guerra: {
        id: 'martillo_guerra', name: 'Martillo de Guerra', description: 'Martillo pesado que causa gran daño',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 12, spd: -2 }, price: 150, rarity: Rarity.UNCOMMON,
        classRestriction: [CharacterClass.WARRIOR, CharacterClass.PALADIN],
    },
    hacha_batalla: {
        id: 'hacha_batalla', name: 'Hacha de Batalla', description: 'Hacha pesada de doble filo',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 9 }, price: 110, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.BERSERKER],
    },
    baston_silvestre: {
        id: 'baston_silvestre', name: 'Bastón Silvestre', description: 'Bastón de madera viva con poder natural',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { int: 8, res: 3 }, price: 110, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.DRUID],
    },
    // ===== Armas Raras (Jefes/Tienda) =====
    espada_runica: {
        id: 'espada_runica', name: 'Espada Rúnica', description: 'Espada grabada con runas de poder antiguo',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 22, int: 5 }, price: 600, rarity: Rarity.RARE,
        classRestriction: [CharacterClass.WARRIOR, CharacterClass.PALADIN],
    },
    baston_elemental: {
        id: 'baston_elemental', name: 'Bastón Elemental', description: 'Bastón que canaliza los elementos',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { int: 25, spd: 3 }, price: 650, rarity: Rarity.RARE,
        classRestriction: [CharacterClass.MAGE],
    },
    cuchillas_sombra: {
        id: 'cuchillas_sombra', name: 'Cuchillas de Sombra', description: 'Dagas que cortan la luz misma',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 14, spd: 12, dex: 5 }, price: 600, rarity: Rarity.RARE,
        classRestriction: [CharacterClass.ROGUE],
    },
    arco_dragon: {
        id: 'arco_dragon', name: 'Arco del Dragón', description: 'Arco hecho con tendones de dragón',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { dex: 28 }, price: 700, rarity: Rarity.RARE,
        classRestriction: [CharacterClass.ARCHER],
    },
    hacha_titan: {
        id: 'hacha_titan', name: 'Hacha del Titán', description: 'Hacha forjada en el corazón de un volcán',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 24, def: -3 }, price: 600, rarity: Rarity.RARE,
        classRestriction: [CharacterClass.BERSERKER],
    },
    baston_druidico: {
        id: 'baston_druidico', name: 'Bastón Drídico', description: 'Bastón del Gran Roble',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { int: 16, res: 8, maxHp: 20 }, price: 600, rarity: Rarity.RARE,
        classRestriction: [CharacterClass.DRUID],
    },
    // ===== Armas Épicas (Jefes intermedios) =====
    espada_legendaria: {
        id: 'espada_legendaria', name: 'Espada Legendaria', description: 'La espada de los héroes antiguos',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { str: 35, def: 5, spd: 3 }, price: 1500, rarity: Rarity.EPIC,
        classRestriction: [CharacterClass.WARRIOR, CharacterClass.PALADIN],
    },
    baston_infinito: {
        id: 'baston_infinito', name: 'Bastón del Infinito', description: 'Contiene el poder del cosmos',
        type: ItemType.WEAPON, slot: EquipSlot.WEAPON, stats: { int: 38, maxMp: 40 }, price: 1600, rarity: Rarity.EPIC,
        classRestriction: [CharacterClass.MAGE],
    },
    // ===== Armaduras Comunes =====
    armadura_placas: {
        id: 'armadura_placas', name: 'Armadura de Placas', description: 'Armadura pesada de placas de acero',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { def: 10, spd: -2 }, price: 150, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.WARRIOR, CharacterClass.PALADIN],
    },
    armadura_runica: {
        id: 'armadura_runica', name: 'Armadura Rúnica', description: 'Armadura grabada con runas protectoras',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { def: 15, res: 5 }, price: 350, rarity: Rarity.UNCOMMON,
        classRestriction: [CharacterClass.WARRIOR, CharacterClass.PALADIN],
    },
    tunica_mago: {
        id: 'tunica_mago', name: 'Túnica de Mago', description: 'Túnica ligera para concentración mágica',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { int: 4, res: 6 }, price: 120, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.MAGE],
    },
    tunica_arcana: {
        id: 'tunica_arcana', name: 'Túnica Arcana', description: 'Túnica tejida con hilos de maná',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { int: 8, res: 10 }, price: 320, rarity: Rarity.UNCOMMON,
        classRestriction: [CharacterClass.MAGE],
    },
    cuero_reforzado: {
        id: 'cuero_reforzado', name: 'Armadura de Cuero Reforzado', description: 'Armadura ligera que permite gran movilidad',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { def: 5, spd: 3 }, price: 100, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.ROGUE, CharacterClass.ARCHER],
    },
    cuero_oscuro: {
        id: 'cuero_oscuro', name: 'Armadura de Cuero Oscuro', description: 'Armadura sombría que otorga sigilo',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { def: 8, spd: 5, dex: 3 }, price: 260, rarity: Rarity.UNCOMMON,
        classRestriction: [CharacterClass.ROGUE, CharacterClass.ARCHER],
    },
    tapa_guerrera: {
        id: 'tapa_guerrera', name: 'Tapa Guerrera', description: 'Armadura ligera que no restringe movimiento',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { def: 6, spd: 1 }, price: 120, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.BERSERKER],
    },
    tunica_naturaleza: {
        id: 'tunica_naturaleza', name: 'Túnica de la Naturaleza', description: 'Tejida con plantas vivas que protegen',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { def: 4, res: 6 }, price: 120, rarity: Rarity.COMMON,
        classRestriction: [CharacterClass.DRUID],
    },
    // ===== Armaduras Raras/Épicas =====
    armadura_sagrada: {
        id: 'armadura_sagrada', name: 'Armadura Sagrada', description: 'Bendecida por los dioses',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { def: 20, res: 15, maxHp: 30 }, price: 800, rarity: Rarity.RARE,
        classRestriction: [CharacterClass.WARRIOR, CharacterClass.PALADIN],
    },
    tunica_eterea: {
        id: 'tunica_eterea', name: 'Túnica Etérea', description: 'Hecha de pura energía mágica',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { int: 12, res: 18, maxMp: 30 }, price: 800, rarity: Rarity.RARE,
        classRestriction: [CharacterClass.MAGE],
    },
    armadura_dragon: {
        id: 'armadura_dragon', name: 'Armadura de Dragón', description: 'Forjada con escamas de dragón anciano',
        type: ItemType.ARMOR, slot: EquipSlot.ARMOR, stats: { def: 28, res: 20, str: 8 }, price: 2000, rarity: Rarity.EPIC,
    },
    // ===== Consumibles =====
    pocion_vida: {
        id: 'pocion_vida', name: 'Poción de Vida', description: 'Restaura 40 HP',
        type: ItemType.CONSUMABLE, price: 30, rarity: Rarity.COMMON, healAmount: 40,
    },
    pocion_vida_grande: {
        id: 'pocion_vida_grande', name: 'Poción de Vida Grande', description: 'Restaura 100 HP',
        type: ItemType.CONSUMABLE, price: 80, rarity: Rarity.UNCOMMON, healAmount: 100,
    },
    pocion_vida_suprema: {
        id: 'pocion_vida_suprema', name: 'Poción de Vida Suprema', description: 'Restaura todo el HP',
        type: ItemType.CONSUMABLE, price: 200, rarity: Rarity.RARE, healAmount: 9999,
    },
    pocion_mana: {
        id: 'pocion_mana', name: 'Poción de Maná', description: 'Restaura 25 MP',
        type: ItemType.CONSUMABLE, price: 35, rarity: Rarity.COMMON, mpRestore: 25,
    },
    pocion_mana_grande: {
        id: 'pocion_mana_grande', name: 'Poción de Maná Grande', description: 'Restaura 60 MP',
        type: ItemType.CONSUMABLE, price: 90, rarity: Rarity.UNCOMMON, mpRestore: 60,
    },
    pocion_mana_suprema: {
        id: 'pocion_mana_suprema', name: 'Poción de Maná Suprema', description: 'Restaura todo el MP',
        type: ItemType.CONSUMABLE, price: 220, rarity: Rarity.RARE, mpRestore: 9999,
    },
    elixir_fuerza: {
        id: 'elixir_fuerza', name: 'Elixir de Fuerza', description: 'Aumenta STR en 5 para toda la batalla',
        type: ItemType.CONSUMABLE, price: 60, rarity: Rarity.UNCOMMON, effect: { str: 5 },
    },
    elixir_defensa: {
        id: 'elixir_defensa', name: 'Elixir de Defensa', description: 'Aumenta DEF en 5 para toda la batalla',
        type: ItemType.CONSUMABLE, price: 60, rarity: Rarity.UNCOMMON, effect: { def: 5 },
    },
    elixir_poder: {
        id: 'elixir_poder', name: 'Elixir de Poder', description: 'Aumenta STR e INT en 8 para toda la batalla',
        type: ItemType.CONSUMABLE, price: 150, rarity: Rarity.RARE, effect: { str: 8, int: 8 },
    },
};
export function getItem(id) {
    return itemDatabase[id];
}
export function getItemsByType(type) {
    return Object.values(itemDatabase).filter(item => item.type === type);
}
export function getItemsByRarity(rarity) {
    return Object.values(itemDatabase).filter(item => item.rarity === rarity);
}
export function getItemsForClass(className) {
    return Object.values(itemDatabase).filter(item => !item.classRestriction || item.classRestriction.length === 0 || item.classRestriction.includes(className));
}
//# sourceMappingURL=items.js.map