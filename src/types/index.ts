export enum CharacterClass {
  WARRIOR = 'Guerrero',
  MAGE = 'Mago',
  ROGUE = 'Pícaro',
  PALADIN = 'Paladín',
  ARCHER = 'Arquero',
  BERSERKER = 'Berserker',
  DRUID = 'Druida',
}

export enum ItemType {
  WEAPON = 'arma',
  ARMOR = 'armadura',
  CONSUMABLE = 'consumible',
}

export enum EquipSlot {
  WEAPON = 'arma',
  ARMOR = 'armadura',
}

export enum BattleAction {
  ATTACK = 'Atacar',
  ABILITY = 'Habilidad',
  ITEM = 'Objeto',
  DEFEND = 'Defender',
}

export enum BattleStatus {
  ONGOING = 'ongoing',
  VICTORY = 'victory',
  DEFEAT = 'defeat',
}

export enum TargetType {
  SINGLE_ENEMY = 'single_enemy',
  ALL_ENEMIES = 'all_enemies',
  SELF = 'self',
  SINGLE_ALLY = 'single_ally',
  ALL_ALLIES = 'all_allies',
}

export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export enum Element {
  PHYSICAL = 'physical',
  FIRE = 'fire',
  ICE = 'ice',
  LIGHTNING = 'lightning',
  EARTH = 'earth',
  HOLY = 'holy',
  SHADOW = 'shadow',
}

export enum Difficulty {
  NORMAL = 'normal',
  HARD = 'hard',
  NIGHTMARE = 'nightmare',
}

export interface Stats {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  str: number
  def: number
  int: number
  res: number
  spd: number
  dex: number
}

export interface Modifiers {
  str?: number
  def?: number
  int?: number
  res?: number
  spd?: number
  dex?: number
  hp?: number
  maxHp?: number
  mp?: number
  maxMp?: number
}

export interface StatusEffect {
  id: string
  name: string
  description: string
  duration: number
  statModifiers: Modifiers
  damagePerTurn?: number
  element?: Element
}

export interface Ability {
  id: string
  name: string
  description: string
  mpCost: number
  power: number
  statKey: keyof Stats
  targetType: TargetType
  element: Element
  statusEffect?: StatusEffect
  hitsMultiple?: boolean
  hitCount?: number
}

export interface ItemData {
  id: string
  name: string
  description: string
  type: ItemType
  slot?: EquipSlot
  stats?: Partial<Stats>
  price: number
  rarity: Rarity
  classRestriction?: CharacterClass[]
  healAmount?: number
  mpRestore?: number
  effect?: Modifiers
  duration?: number
  elementalResistance?: Partial<Record<Element, number>>
}

export interface LootEntry {
  itemId: string
  chance: number
}

export interface CharacterTemplate {
  id: string
  name: string
  className: CharacterClass
  baseStats: Stats
  abilityIds: string[]
  weaponId: string
  armorId: string
  description: string
  loot: LootEntry[]
  xpReward: number
}

export interface Talent {
  id: string
  name: string
  description: string
  statModifiers: Modifiers
  specialEffect?: string
}

export interface LogEntry {
  text: string
  color?: string
}

export interface BattleResult {
  status: BattleStatus
  xpEarned: number
  loot: ItemData[]
  rounds: number
  winner: string
}

export interface PlayerDecision {
  action: BattleAction
  targetId?: string
  abilityId?: string
  itemIndex?: number
}

export interface CharSnapshot {
  id: string
  instanceId: string
  name: string
  className: string
  level: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  str: number
  def: number
  int: number
  res: number
  spd: number
  dex: number
  isAlive: boolean
  isDefending: boolean
  statusEffects: string[]
  weaponName: string | null
  armorName: string | null
}

export interface NeedInputInfo {
  charId: string
  availableAbilityIds: string[]
  availableItems: { name: string; description: string }[]
  aliveEnemies: CharSnapshot[]
  aliveAllies: CharSnapshot[]
}

export interface BattleState {
  round: number
  allies: CharSnapshot[]
  enemies: CharSnapshot[]
  log: LogEntry[]
  status: BattleStatus
  turnCharId?: string
}

export interface SavedCharacter {
  templateId: string
  customName: string
  className: CharacterClass
  level: number
  xp: number
  xpToNext: number
  baseStats: Stats
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  inventory: string[]
  equippedWeapon: string | null
  equippedArmor: string | null
  talents: string[]
}

export interface GameStats {
  battlesWon: number
  battlesLost: number
  totalDamageDealt: number
  totalDamageTaken: number
  totalHealed: number
  criticalHits: number
  enemiesDefeated: number
  bossesDefeated: number
}

export interface SaveGame {
  slot: number
  difficulty: Difficulty
  party: SavedCharacter[]
  currentLevel: number
  gold: number
  achievements: string[]
  stats: GameStats
}

export interface CampaignLevel {
  level: number
  enemyGroups: { templateId: string; isBoss: boolean; count: number }[]
  goldReward: number
  bossName?: string
  bossQuote?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
}

export interface SummonedPet {
  name: string
  className: CharacterClass
  baseStats: Stats
  currentStats: Stats
  isAlive: boolean
  level: number
  turnsLeft: number
  ownerInstanceId: string
}

export interface WsMessage {
  type: string
  [key: string]: unknown
}

export const ELEMENT_ADVANTAGE: Record<string, Record<string, number>> = {
  [Element.FIRE]: { [Element.ICE]: 1.3, [Element.EARTH]: 0.7 },
  [Element.ICE]: { [Element.EARTH]: 1.3, [Element.LIGHTNING]: 0.7 },
  [Element.EARTH]: { [Element.LIGHTNING]: 1.3, [Element.FIRE]: 0.7 },
  [Element.LIGHTNING]: { [Element.FIRE]: 1.3, [Element.ICE]: 0.7 },
  [Element.HOLY]: { [Element.SHADOW]: 1.3 },
  [Element.SHADOW]: { [Element.HOLY]: 1.3 },
}

export const RARITY_MULTIPLIER: Record<Rarity, number> = {
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 1.5,
  [Rarity.RARE]: 2.5,
  [Rarity.EPIC]: 4,
  [Rarity.LEGENDARY]: 8,
}

export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: '#c8c8d0',
  [Rarity.UNCOMMON]: '#4a4',
  [Rarity.RARE]: '#44a',
  [Rarity.EPIC]: '#a6a',
  [Rarity.LEGENDARY]: '#da4',
}
