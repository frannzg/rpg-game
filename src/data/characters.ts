import { CharacterTemplate, CharacterClass } from '../types/index.js'

export const characterTemplates: CharacterTemplate[] = [
  {
    id: 'guerrero', name: 'Guerrero', className: CharacterClass.WARRIOR,
    description: 'Guerrero robusto con gran resistencia y fuerza bruta.',
    baseStats: { hp: 120, maxHp: 120, mp: 30, maxMp: 30, str: 18, def: 14, int: 4, res: 6, spd: 7, dex: 8 },
    abilityIds: ['golpe_poderoso', 'postura_defensiva', 'grito_guerra', 'tajo_giratorio'],
    weaponId: 'espada_hierro', armorId: 'armadura_placas',
    loot: [{ itemId: 'pocion_vida', chance: 0.5 }, { itemId: 'espada_acerada', chance: 0.15 }, { itemId: 'elixir_fuerza', chance: 0.2 }],
    xpReward: 50,
  },
  {
    id: 'mago', name: 'Mago', className: CharacterClass.MAGE,
    description: 'Maestro de las artes arcanas. Gran poder mágico pero frágil.',
    baseStats: { hp: 70, maxHp: 70, mp: 80, maxMp: 80, str: 3, def: 5, int: 20, res: 14, spd: 10, dex: 6 },
    abilityIds: ['bola_fuego', 'escarcha', 'rayo', 'curar'],
    weaponId: 'baston_arcano', armorId: 'tunica_mago',
    loot: [{ itemId: 'pocion_mana', chance: 0.6 }, { itemId: 'baston_anciano', chance: 0.1 }, { itemId: 'pocion_vida', chance: 0.3 }],
    xpReward: 60,
  },
  {
    id: 'picaro', name: 'Pícaro', className: CharacterClass.ROGUE,
    description: 'Astuto y letal. Golpea desde las sombras con ataques rápidos.',
    baseStats: { hp: 85, maxHp: 85, mp: 45, maxMp: 45, str: 12, def: 7, int: 6, res: 6, spd: 18, dex: 14 },
    abilityIds: ['golpe_sombra', 'veneno', 'doble_golpe', 'evasion'],
    weaponId: 'dagas_aceradas', armorId: 'cuero_reforzado',
    loot: [{ itemId: 'pocion_vida', chance: 0.4 }, { itemId: 'dagas_oscuras', chance: 0.12 }, { itemId: 'elixir_fuerza', chance: 0.25 }],
    xpReward: 55,
  },
  {
    id: 'paladin', name: 'Paladín', className: CharacterClass.PALADIN,
    description: 'Campeón de la luz. Combina fuerza marcial con poder divino.',
    baseStats: { hp: 110, maxHp: 110, mp: 50, maxMp: 50, str: 14, def: 14, int: 10, res: 14, spd: 6, dex: 7 },
    abilityIds: ['golpe_sagrado', 'escudo_protector', 'curacion_divina', 'barrera_luz'],
    weaponId: 'espada_hierro', armorId: 'armadura_placas',
    loot: [{ itemId: 'pocion_vida_grande', chance: 0.3 }, { itemId: 'elixir_defensa', chance: 0.3 }, { itemId: 'armadura_runica', chance: 0.1 }],
    xpReward: 55,
  },
  {
    id: 'arquero', name: 'Arquero', className: CharacterClass.ARCHER,
    description: 'Tirador de élite con puntería infalible y ataques a distancia.',
    baseStats: { hp: 75, maxHp: 75, mp: 40, maxMp: 40, str: 10, def: 6, int: 5, res: 7, spd: 14, dex: 20 },
    abilityIds: ['disparo_preciso', 'lluvia_flechas', 'disparo_penetrante', 'ojo_aguila'],
    weaponId: 'arco_largo', armorId: 'cuero_reforzado',
    loot: [{ itemId: 'pocion_vida', chance: 0.5 }, { itemId: 'arco_elfico', chance: 0.1 }, { itemId: 'elixir_fuerza', chance: 0.2 }],
    xpReward: 55,
  },
  {
    id: 'berserker', name: 'Berserker', className: CharacterClass.BERSERKER,
    description: 'Guerrero frenético que entra en trance de batalla. Mientras menos HP, más daño.',
    baseStats: { hp: 90, maxHp: 90, mp: 20, maxMp: 20, str: 22, def: 8, int: 3, res: 5, spd: 12, dex: 10 },
    abilityIds: ['furia', 'golpe_sangriento', 'tajo_salvaje', 'berreo'],
    weaponId: 'hacha_batalla', armorId: 'tapa_guerrera',
    loot: [{ itemId: 'pocion_vida', chance: 0.4 }, { itemId: 'elixir_fuerza', chance: 0.3 }],
    xpReward: 60,
  },
  {
    id: 'druida', name: 'Druida', className: CharacterClass.DRUID,
    description: 'Guardián de la naturaleza. Invoca animales y usa el poder de la tierra.',
    baseStats: { hp: 90, maxHp: 90, mp: 65, maxMp: 65, str: 6, def: 8, int: 17, res: 12, spd: 9, dex: 7 },
    abilityIds: ['curacion_natural', 'espinas', 'invocar_lobo', 'tormenta'],
    weaponId: 'baston_silvestre', armorId: 'tunica_naturaleza',
    loot: [{ itemId: 'pocion_vida', chance: 0.5 }, { itemId: 'elixir_defensa', chance: 0.2 }],
    xpReward: 60,
  },
]

export function getCharacterTemplate(id: string): CharacterTemplate | undefined {
  return characterTemplates.find(c => c.id === id)
}
