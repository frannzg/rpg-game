import { Ability, TargetType, Element } from '../types/index.js'

export const abilities: Record<string, Ability> = {
  // ===== Guerrero =====
  golpe_poderoso: {
    id: 'golpe_poderoso', name: 'Golpe Poderoso', description: 'Ataque físico potente',
    mpCost: 8, power: 1.8, statKey: 'str', targetType: TargetType.SINGLE_ENEMY, element: Element.PHYSICAL,
  },
  postura_defensiva: {
    id: 'postura_defensiva', name: 'Postura Defensiva', description: 'Aumenta DEF en 50% por 3 turnos',
    mpCost: 5, power: 0, statKey: 'def', targetType: TargetType.SELF, element: Element.PHYSICAL,
    statusEffect: { id: 'def_up', name: 'DEF+', description: 'Defensa aumentada', duration: 3, statModifiers: { def: 0.5 } },
  },
  grito_guerra: {
    id: 'grito_guerra', name: 'Grito de Guerra', description: 'Aumenta STR del equipo en 25% por 2 turnos',
    mpCost: 10, power: 0, statKey: 'str', targetType: TargetType.SELF, element: Element.PHYSICAL,
    statusEffect: { id: 'str_up_team', name: 'STR+', description: 'Fuerza aumentada', duration: 2, statModifiers: { str: 0.25 } },
  },
  tajo_giratorio: {
    id: 'tajo_giratorio', name: 'Tajo Giratorio', description: 'Golpea a todos los enemigos',
    mpCost: 12, power: 0.8, statKey: 'str', targetType: TargetType.ALL_ENEMIES, element: Element.PHYSICAL,
  },

  // ===== Mago =====
  bola_fuego: {
    id: 'bola_fuego', name: 'Bola de Fuego', description: 'Poderoso hechizo de fuego que quema',
    mpCost: 12, power: 2.0, statKey: 'int', targetType: TargetType.SINGLE_ENEMY, element: Element.FIRE,
    statusEffect: { id: 'burn', name: '🔥 Quemadura', description: 'Daño de fuego por turno', duration: 3, statModifiers: {}, damagePerTurn: 5 },
  },
  escarcha: {
    id: 'escarcha', name: 'Escarcha', description: 'Hechizo de hielo que reduce velocidad',
    mpCost: 8, power: 1.3, statKey: 'int', targetType: TargetType.SINGLE_ENEMY, element: Element.ICE,
    statusEffect: { id: 'slow', name: '❄️ Lento', description: 'Velocidad reducida', duration: 3, statModifiers: { spd: -0.3 } },
  },
  rayo: {
    id: 'rayo', name: 'Rayo', description: 'Poderoso relámpago que golpea a todos los enemigos',
    mpCost: 15, power: 1.2, statKey: 'int', targetType: TargetType.ALL_ENEMIES, element: Element.LIGHTNING,
  },
  curar: {
    id: 'curar', name: 'Curar', description: 'Restaura 40% de HP a un aliado',
    mpCost: 10, power: 0.4, statKey: 'int', targetType: TargetType.SINGLE_ALLY, element: Element.HOLY,
  },

  // ===== Pícaro =====
  golpe_sombra: {
    id: 'golpe_sombra', name: 'Golpe Sombra', description: 'Ataque sigiloso con 50% más crítico',
    mpCost: 6, power: 1.4, statKey: 'str', targetType: TargetType.SINGLE_ENEMY, element: Element.SHADOW,
  },
  veneno: {
    id: 'veneno', name: 'Envenenar', description: 'Aplica veneno que daña cada turno',
    mpCost: 7, power: 0.5, statKey: 'dex', targetType: TargetType.SINGLE_ENEMY, element: Element.EARTH,
    statusEffect: { id: 'poison', name: '☠️ Veneno', description: 'Daño por veneno cada turno', duration: 4, statModifiers: {}, damagePerTurn: 8 },
  },
  doble_golpe: {
    id: 'doble_golpe', name: 'Doble Golpe', description: 'Ataca dos veces con 70% de daño cada golpe',
    mpCost: 10, power: 0.7, statKey: 'str', targetType: TargetType.SINGLE_ENEMY, element: Element.PHYSICAL, hitCount: 2,
  },
  evasion: {
    id: 'evasion', name: 'Evasión', description: 'Aumenta DEX en 80% por 2 turnos',
    mpCost: 4, power: 0, statKey: 'dex', targetType: TargetType.SELF, element: Element.PHYSICAL,
    statusEffect: { id: 'dex_up', name: '💨 DEX+', description: 'Evasión aumentada', duration: 2, statModifiers: { dex: 0.8 } },
  },

  // ===== Paladín =====
  golpe_sagrado: {
    id: 'golpe_sagrado', name: 'Golpe Sagrado', description: 'Ataque sagrado que daña a los impuros',
    mpCost: 8, power: 1.5, statKey: 'str', targetType: TargetType.SINGLE_ENEMY, element: Element.HOLY,
  },
  escudo_protector: {
    id: 'escudo_protector', name: 'Escudo Protector', description: 'Aumenta DEF y RES en 40% por 3 turnos',
    mpCost: 8, power: 0, statKey: 'def', targetType: TargetType.SELF, element: Element.HOLY,
    statusEffect: { id: 'def_res_up', name: '🛡️✨ Escudo+', description: 'Defensa y resistencia aumentadas', duration: 3, statModifiers: { def: 0.4, res: 0.4 } },
  },
  curacion_divina: {
    id: 'curacion_divina', name: 'Curación Divina', description: 'Restaura 60% de HP a un aliado',
    mpCost: 14, power: 0.6, statKey: 'int', targetType: TargetType.SINGLE_ALLY, element: Element.HOLY,
  },
  barrera_luz: {
    id: 'barrera_luz', name: 'Barrera de Luz', description: 'Protege al equipo reduciendo daño 2 turnos',
    mpCost: 16, power: 0, statKey: 'res', targetType: TargetType.SELF, element: Element.HOLY,
    statusEffect: { id: 'barrier', name: '✨ Barrera', description: 'Daño recibido reducido', duration: 2, statModifiers: { def: 0.25, res: 0.25 } },
  },

  // ===== Arquero =====
  disparo_preciso: {
    id: 'disparo_preciso', name: 'Disparo Preciso', description: 'Ataque de alta precisión con 30% crítico',
    mpCost: 6, power: 1.6, statKey: 'dex', targetType: TargetType.SINGLE_ENEMY, element: Element.PHYSICAL,
  },
  lluvia_flechas: {
    id: 'lluvia_flechas', name: 'Lluvia de Flechas', description: 'Flechas a todos los enemigos',
    mpCost: 12, power: 0.7, statKey: 'dex', targetType: TargetType.ALL_ENEMIES, element: Element.PHYSICAL,
  },
  disparo_penetrante: {
    id: 'disparo_penetrante', name: 'Disparo Penetrante', description: 'Ignora 60% de la defensa enemiga',
    mpCost: 10, power: 1.4, statKey: 'dex', targetType: TargetType.SINGLE_ENEMY, element: Element.PHYSICAL,
  },
  ojo_aguila: {
    id: 'ojo_aguila', name: 'Ojo de Águila', description: 'Aumenta DEX y crítico por 3 turnos',
    mpCost: 5, power: 0, statKey: 'dex', targetType: TargetType.SELF, element: Element.PHYSICAL,
    statusEffect: { id: 'dex_crit_up', name: '🎯 Precisión+', description: 'Precisión y crítico aumentados', duration: 3, statModifiers: { dex: 0.5 } },
  },

  // ===== Berserker =====
  furia: {
    id: 'furia', name: 'Furia', description: 'Aumenta STR en 50% por 2 turnos',
    mpCost: 6, power: 0, statKey: 'str', targetType: TargetType.SELF, element: Element.PHYSICAL,
    statusEffect: { id: 'furia_str', name: '⚔️ Furia', description: 'Fuerza aumentada', duration: 2, statModifiers: { str: 0.5 } },
  },
  golpe_sangriento: {
    id: 'golpe_sangriento', name: 'Golpe Sangriento', description: 'Ataque poderoso que consume 10% de HP',
    mpCost: 4, power: 2.2, statKey: 'str', targetType: TargetType.SINGLE_ENEMY, element: Element.PHYSICAL,
  },
  tajo_salvaje: {
    id: 'tajo_salvaje', name: 'Tajo Salvaje', description: 'Golpea a todos los enemigos con violencia',
    mpCost: 14, power: 0.9, statKey: 'str', targetType: TargetType.ALL_ENEMIES, element: Element.PHYSICAL,
  },
  berreo: {
    id: 'berreo', name: 'Berreo', description: 'Aumenta el ATQ de todo el equipo por 3 turnos',
    mpCost: 10, power: 0, statKey: 'str', targetType: TargetType.SELF, element: Element.PHYSICAL,
    statusEffect: { id: 'berreo_atq', name: '🗯️ Berreo', description: 'Ataque del equipo aumentado', duration: 3, statModifiers: { str: 0.3 } },
  },

  // ===== Druida =====
  curacion_natural: {
    id: 'curacion_natural', name: 'Curación Natural', description: 'Restaura HP con poder de la naturaleza',
    mpCost: 8, power: 0.5, statKey: 'int', targetType: TargetType.SINGLE_ALLY, element: Element.EARTH,
  },
  espinas: {
    id: 'espinas', name: 'Espinas', description: 'Escudo de espinas que refleja daño 3 turnos',
    mpCost: 8, power: 0, statKey: 'def', targetType: TargetType.SELF, element: Element.EARTH,
    statusEffect: { id: 'thorns', name: '🌿 Espinas', description: 'Refleja 20% de daño', duration: 3, statModifiers: { def: 0.15 } },
  },
  invocar_lobo: {
    id: 'invocar_lobo', name: 'Invocar Lobo', description: 'Invoca un lobo ancestral que lucha 4 turnos',
    mpCost: 15, power: 0, statKey: 'int', targetType: TargetType.SELF, element: Element.EARTH,
  },
  tormenta: {
    id: 'tormenta', name: 'Tormenta', description: 'Tormenta eléctrica que golpea a todos los enemigos',
    mpCost: 14, power: 1.1, statKey: 'int', targetType: TargetType.ALL_ENEMIES, element: Element.LIGHTNING,
  },
}

export const SUMMON_LOBO = {
  id: 'lobo_invocado',
  name: 'Lobo Ancestral',
  baseStats: { hp: 80, maxHp: 80, mp: 0, maxMp: 0, str: 14, def: 8, int: 2, res: 6, spd: 16, dex: 12 },
  turnsLeft: 4,
}
