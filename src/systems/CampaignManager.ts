import { Character } from '../models/Character.js'
import { Item } from '../models/Item.js'
import { createCharacterFromTemplate } from '../models/classes/index.js'
import { CombatSystem } from './CombatSystem.js'
import { SaveManager } from './SaveManager.js'
import { ShopSystem, ShopItem } from './ShopSystem.js'
import { generateLoot } from './LootSystem.js'
import { distributeXp } from './LevelSystem.js'
import { campaignLevels, getCampaignLevel } from '../data/campaign.js'
import { itemDatabase, getItemsForClass } from '../data/items.js'
import { talents, TALENT_POOLS } from '../data/talents.js'
import {
  Difficulty, SaveGame, SavedCharacter, CharacterClass,
  Stats, BattleStatus, Rarity, RARITY_MULTIPLIER, GameStats,
} from '../types/index.js'

export interface CampaignState {
  party: Character[]
  currentLevel: number
  gold: number
  difficulty: Difficulty
  stats: GameStats
  isComplete: boolean
  justUnlockedAchievements: string[]
  partyTalents: Map<string, string[]>  // templateId -> talentIds[]
}

export class CampaignManager {
  state: CampaignState
  private onStateChange?: () => void

  constructor(onStateChange?: () => void) {
    this.state = {
      party: [],
      currentLevel: 1,
      gold: 0,
      difficulty: Difficulty.NORMAL,
      stats: { battlesWon: 0, battlesLost: 0, totalDamageDealt: 0, totalDamageTaken: 0, totalHealed: 0, criticalHits: 0, enemiesDefeated: 0, bossesDefeated: 0 },
      isComplete: false,
      justUnlockedAchievements: [],
      partyTalents: new Map(),
    }
    this.onStateChange = onStateChange
  }

  static loadFromSave(save: SaveGame): CampaignManager {
    const cm = new CampaignManager()
    cm.state.currentLevel = save.currentLevel
    cm.state.gold = save.gold
    cm.state.difficulty = save.difficulty
    cm.state.stats = save.stats
    cm.state.partyTalents = new Map()

    cm.state.party = save.party.map((sc, idx) => {
      const char = createCharacterFromTemplate(sc.templateId)
      char.name = sc.customName
      char.level = sc.level
      char.xp = sc.xp
      char.xpToNext = sc.xpToNext
      char.baseStats = { ...sc.baseStats }
      char.currentStats = { ...sc.baseStats, hp: sc.hp, maxHp: sc.maxHp, mp: sc.mp, maxMp: sc.maxMp }
      char.inventory = sc.inventory.map(id => new Item(itemDatabase[id])).filter(Boolean)
      char.talents = sc.talents || []
      if (sc.equippedWeapon && itemDatabase[sc.equippedWeapon]) char.equippedWeapon = new Item(itemDatabase[sc.equippedWeapon])
      if (sc.equippedArmor && itemDatabase[sc.equippedArmor]) char.equippedArmor = new Item(itemDatabase[sc.equippedArmor])
      cm.state.partyTalents.set(sc.templateId, sc.talents || [])
      return char
    })

    return cm
  }

  static createNew(characterIds: string[], names: string[], difficulty: Difficulty): CampaignManager {
    const cm = new CampaignManager()
    cm.state.difficulty = difficulty
    cm.state.party = characterIds.map((id, idx) => {
      const char = createCharacterFromTemplate(id)
      char.name = names[idx] || char.name
      return char
    })
    return cm
  }

  getLevelData() {
    return getCampaignLevel(this.state.currentLevel)
  }

  getBattleEnemies(): Character[] {
    const levelData = this.getLevelData()
    if (!levelData) return []
    const enemies: Character[] = []
    const diffMult = this.state.difficulty === Difficulty.HARD ? 1.25 : this.state.difficulty === Difficulty.NIGHTMARE ? 1.5 : 1

    for (const group of levelData.enemyGroups) {
      for (let i = 0; i < group.count; i++) {
        const char = createCharacterFromTemplate(group.templateId)
        const scale = 1 + 0.12 * (this.state.currentLevel - 1)
        for (const stat of Object.keys(char.baseStats) as (keyof Stats)[]) {
          if (stat === 'maxHp' || stat === 'maxMp') continue
          const val = (char.baseStats as any)[stat] || 0
          ;(char.baseStats as any)[stat] = Math.round(val * scale * diffMult)
        }
        char.level = this.state.currentLevel

        if (group.isBoss) {
          char.baseStats.maxHp = Math.round(char.baseStats.maxHp * 2.5)
          char.baseStats.hp = char.baseStats.maxHp
          char.baseStats.str = Math.round(char.baseStats.str * 1.4)
          char.baseStats.def = Math.round(char.baseStats.def * 1.3)
          char.baseStats.int = Math.round(char.baseStats.int * 1.4)
          char.baseStats.res = Math.round(char.baseStats.res * 1.3)
        }

        char.currentStats = { ...char.baseStats }
        char.currentStats.hp = char.baseStats.maxHp
        char.currentStats.mp = char.baseStats.maxMp
        char.currentStats.maxHp = char.baseStats.maxHp
        char.currentStats.maxMp = char.baseStats.maxMp

        enemies.push(char)
      }
    }
    return enemies
  }

  async runBattle(onNeedInput: (info: import('../types/index.js').NeedInputInfo) => void,
    onBattleState: (state: import('../types/index.js').BattleState) => void): Promise<{ status: BattleStatus; xpEarned: number; loot: Item[]; levelUps: { name: string; levels: number; newLevel: number }[] }> {

    const enemies = this.getBattleEnemies()
    const allIds = this.state.party.map(c => c.instanceId)
    const combat = new CombatSystem(this.state.party, enemies, allIds)

    combat.onNeedInput = onNeedInput
    combat.onBattleState = onBattleState

    const result = await combat.start()

    this.state.stats.totalDamageDealt += combat.totalDamageDealt
    this.state.stats.criticalHits += combat.criticalHits

    if (result.status === BattleStatus.VICTORY) {
      this.state.stats.battlesWon++
      this.state.stats.enemiesDefeated += combat.enemiesDefeated || enemies.filter(e => !e.isAlive).length
      const hasBoss = this.getLevelData()?.enemyGroups.some(g => g.isBoss)
      if (hasBoss) this.state.stats.bossesDefeated++

      const defeated = enemies.filter(e => !e.isAlive)
      const loot = generateLoot(defeated)
      const totalXp = result.xpEarned * (this.state.difficulty === Difficulty.HARD ? 1.5 : this.state.difficulty === Difficulty.NIGHTMARE ? 2 : 1)
      const xpResults = distributeXp(this.state.party, totalXp)

      const levelUps = this.state.party.map(char => {
        const entry = xpResults.get(char.id)
        if (!entry || entry.levels <= 0) return null
        return { name: char.name, levels: entry.levels, newLevel: char.level }
      }).filter(Boolean) as { name: string; levels: number; newLevel: number }[]

      for (const char of this.state.party) {
        char.currentStats.hp = char.currentStats.maxHp
        char.currentStats.mp = char.currentStats.maxMp
      }

      const goldReward = this.getLevelData()?.goldReward || 0
      this.state.gold += goldReward

      if (this.state.currentLevel >= 20) {
        this.state.isComplete = true
      } else {
        this.state.currentLevel++
      }

      this.save()

      return { status: BattleStatus.VICTORY, xpEarned: totalXp, loot, levelUps }
    } else {
      this.state.stats.battlesLost++
      if (this.state.difficulty === Difficulty.NIGHTMARE) {
        SaveManager.delete(0)
        SaveManager.delete(1)
        SaveManager.delete(2)
      }
      return { status: BattleStatus.DEFEAT, xpEarned: 0, loot: [], levelUps: [] }
    }
  }

  healParty(): void {
    for (const char of this.state.party) {
      char.currentStats.hp = char.currentStats.maxHp
      char.currentStats.mp = char.currentStats.maxMp
    }
  }

  getAvailableTalentsForLevel(char: Character): string[] {
    const pool = TALENT_POOLS[char.id]
    if (!pool) return []
    const talentIndex = Math.floor(this.state.currentLevel / 5) - 1
    if (talentIndex < 0 || talentIndex >= pool.length) return []
    const existing = this.state.partyTalents.get(char.id) || []
    return pool[talentIndex].filter(id => !existing.includes(id))
  }

  applyTalent(char: Character, talentId: string): void {
    const talent = talents[talentId]
    if (!talent) return
    const existing = this.state.partyTalents.get(char.id) || []
    if (existing.includes(talentId)) return
    this.state.partyTalents.set(char.id, [...existing, talentId])
    char.talents = [...existing, talentId]
  }

  save(): boolean {
    const save = this.toSaveGame()
    return SaveManager.save(0, save)
  }

  toSaveGame(): SaveGame {
    return {
      slot: 0,
      difficulty: this.state.difficulty,
      party: this.state.party.map(char => ({
        templateId: char.id,
        customName: char.name,
        className: char.className,
        level: char.level,
        xp: char.xp,
        xpToNext: char.xpToNext,
        baseStats: { ...char.baseStats },
        hp: char.currentStats.hp,
        maxHp: char.currentStats.maxHp,
        mp: char.currentStats.mp,
        maxMp: char.currentStats.maxMp,
        inventory: char.inventory.map(i => i.id),
        equippedWeapon: char.equippedWeapon?.id || null,
        equippedArmor: char.equippedArmor?.id || null,
        talents: char.talents || [],
      })),
      currentLevel: this.state.currentLevel,
      gold: this.state.gold,
      achievements: [],
      stats: this.state.stats,
    }
  }
}
