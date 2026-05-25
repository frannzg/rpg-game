import { WebSocket } from 'ws'
import { Character } from '../models/Character.js'
import { createCharacterFromTemplate } from '../models/classes/index.js'
import { CombatSystem } from '../systems/CombatSystem.js'
import { CampaignManager } from '../systems/CampaignManager.js'
import { SaveManager } from '../systems/SaveManager.js'
import { ShopSystem, ShopItem } from '../systems/ShopSystem.js'
import { generateLoot } from '../systems/LootSystem.js'
import { distributeXp } from '../systems/LevelSystem.js'
import { talents } from '../data/talents.js'
import {
  BattleStatus, PlayerDecision, BattleState, WsMessage, Difficulty,
  RARITY_MULTIPLIER,
} from '../types/index.js'

export class GameSession {
  private combat: CombatSystem | null = null
  private playerChar: Character | null = null
  private enemies: Character[] = []
  private ws: WebSocket
  private sessionId: string
  private campaign: CampaignManager | null = null
  private shopItems: ShopItem[] = []

  constructor(ws: WebSocket) {
    this.ws = ws
    this.sessionId = Math.random().toString(36).slice(2, 8)
    this.setupListeners()
  }

  private send(data: WsMessage): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  private setupListeners(): void {
    this.ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as WsMessage
        this.handleMessage(msg)
      } catch {
        this.send({ type: 'error', message: 'Mensaje inválido' })
      }
    })

    this.ws.on('close', () => {
      console.log(`[${this.sessionId}] Sesión cerrada`)
    })

    this.send({
      type: 'connected',
      sessionId: this.sessionId,
      characters: [
        { id: 'guerrero', name: 'Guerrero', className: 'Guerrero', description: 'Alto HP/STR/DEF, baja velocidad' },
        { id: 'mago', name: 'Mago', className: 'Mago', description: 'Alto INT/MP, baja DEF/HP' },
        { id: 'picaro', name: 'Pícaro', className: 'Pícaro', description: 'Alta SPD/CRIT, ataques rápidos' },
        { id: 'paladin', name: 'Paladín', className: 'Paladín', description: 'Balanceado, cura y protege' },
        { id: 'arquero', name: 'Arquero', className: 'Arquero', description: 'Alta DEX, ataques a distancia' },
        { id: 'berserker', name: 'Berserker', className: 'Berserker', description: 'Fuerza bruta, sacrifica HP por poder' },
        { id: 'druida', name: 'Druida', className: 'Druida', description: 'Naturaleza, curación y lobo invocado' },
      ],
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleMessage(msg: any): void {
    switch (msg.type) {
      case 'start_pve':
        this.startPvE(msg.character, msg.enemies || [])
        break
      case 'start_pvp':
        this.startPvP(msg.p1, msg.p2)
        break
      case 'player_action':
        if (this.combat) {
          this.combat.setPlayerDecision(msg.decision as PlayerDecision)
        }
        break
      case 'start_campaign':
        this.startCampaign(msg.party, msg.names, msg.difficulty)
        break
      case 'load_campaign':
        this.loadCampaign()
        break
      case 'request_battle':
        this.runCampaignBattle()
        break
      case 'request_shop':
        this.showShop()
        break
      case 'buy_item':
        this.buyItem(msg.shopIndex, msg.charIndex)
        break
      case 'sell_item':
        this.sellItem(msg.charIndex, msg.invIndex)
        break
      case 'equip_item':
        this.equipItem(msg.charIndex, msg.invIndex)
        break
      case 'select_talent':
        this.applyTalent(msg.charIndex, msg.talentId)
        break
      case 'save_exit_campaign':
        if (this.campaign) { this.campaign.save(); this.send({ type: 'campaign_saved' }) }
        break
      case 'request_campaign_hub':
        this.sendCampaignHub()
        break
      case 'delete_campaign':
        SaveManager.delete(0)
        SaveManager.delete(1)
        SaveManager.delete(2)
        this.send({ type: 'campaign_deleted' })
        break
    }
  }

  private sendCampaignHub(): void {
    if (!this.campaign) return
    const cm = this.campaign
    this.send({
      type: 'campaign_hub',
      party: cm.state.party.map(c => ({
        instanceId: c.instanceId,
        id: c.id,
        name: c.name,
        className: c.className,
        level: c.level,
        xp: c.xp,
        xpToNext: c.xpToNext,
        hp: c.currentStats.hp,
        maxHp: c.currentStats.maxHp,
        mp: c.currentStats.mp,
        maxMp: c.currentStats.maxMp,
        str: c.getEffectiveStats().str,
        def: c.getEffectiveStats().def,
        int: c.getEffectiveStats().int,
        res: c.getEffectiveStats().res,
        spd: c.getEffectiveStats().spd,
        dex: c.getEffectiveStats().dex,
        talents: c.talents || [],
        weaponName: c.equippedWeapon?.name || null,
        armorName: c.equippedArmor?.name || null,
        inventoryCount: c.inventory.length,
      })),
      currentLevel: cm.state.currentLevel,
      gold: cm.state.gold,
      difficulty: cm.state.difficulty,
      isComplete: cm.state.isComplete,
      levelData: cm.getLevelData() ? {
        enemyGroups: cm.getLevelData()!.enemyGroups.map(g => ({
          templateId: g.templateId,
          count: g.count,
          isBoss: g.isBoss || false,
        })),
        bossName: cm.getLevelData()!.bossName || null,
        bossQuote: cm.getLevelData()!.bossQuote || null,
        goldReward: cm.getLevelData()!.goldReward || 0,
      } : null,
      talentOpportunities: cm.state.party.map((char, idx) => ({
        charIndex: idx,
        talents: cm.getAvailableTalentsForLevel(char),
      })).filter(t => t.talents.length > 0),
    })
  }

  private async startCampaign(party: string[], names: string[], difficulty: string): Promise<void> {
    try {
      this.campaign = CampaignManager.createNew(
        party,
        names,
        difficulty as Difficulty
      )
      this.campaign.save()
      this.sendCampaignHub()
    } catch (err) {
      this.send({ type: 'error', message: `Error: ${err}` })
    }
  }

  private async loadCampaign(): Promise<void> {
    try {
      const saved = SaveManager.load(0)
      if (!saved) {
        this.send({ type: 'error', message: 'No hay partida guardada' })
        return
      }
      this.campaign = CampaignManager.loadFromSave(saved)
      this.sendCampaignHub()
    } catch (err) {
      this.send({ type: 'error', message: `Error: ${err}` })
    }
  }

  private async runCampaignBattle(): Promise<void> {
    if (!this.campaign) return
    try {
      const enemies = this.campaign.getBattleEnemies()
      const allIds = this.campaign.state.party.map(c => c.instanceId)
      this.combat = new CombatSystem(this.campaign.state.party, enemies, allIds)
      this.combat.onNeedInput = (info) => {
        this.send({ type: 'need_input', ...info })
      }
      this.combat.onBattleState = (state) => {
        this.send({ type: 'battle_state', ...state })
      }

      this.send({
        type: 'battle_start',
        playerId: '',
        playerName: 'Campaign Party',
        enemyNames: enemies.map(e => e.name),
        isCampaign: true,
        currentLevel: this.campaign.state.currentLevel,
      })

      const result = await this.combat.start()

      if (result.status === BattleStatus.VICTORY) {
        const defeated = enemies.filter(e => !e.isAlive)
        const loot = generateLoot(defeated)
        const totalXp = result.xpEarned * (this.campaign.state.difficulty === Difficulty.HARD ? 1.5 : this.campaign.state.difficulty === Difficulty.NIGHTMARE ? 2 : 1)
        const xpResults = distributeXp(this.campaign.state.party, totalXp)

        const levelUps = this.campaign.state.party.map(char => {
          const entry = xpResults.get(char.id)
          return {
            name: char.name,
            levels: entry ? entry.levels : 0,
            newLevel: char.level,
            gained: entry ? entry.levels > 0 : false,
          }
        }).filter(l => l.gained)

        for (const char of this.campaign.state.party) {
          char.currentStats.hp = char.currentStats.maxHp
          char.currentStats.mp = char.currentStats.maxMp
        }

        const goldReward = this.campaign.getLevelData()?.goldReward || 0
        this.campaign.state.gold += goldReward
        this.campaign.state.stats.battlesWon++
        this.campaign.state.stats.enemiesDefeated += defeated.length

        if (this.campaign.state.currentLevel >= 20) {
          this.campaign.state.isComplete = true
          this.campaign.save()
          this.send({
            type: 'campaign_battle_result',
            status: 'victory',
            xpEarned: totalXp,
            party: this.campaign.state.party.map(c => ({
              name: c.name,
              level: c.level,
              xp: c.xp,
              xpToNext: c.xpToNext,
              levelUp: levelUps.find(l => l.name === c.name) || null,
            })),
            loot: loot.map(i => ({
              id: i.id, name: i.name, description: i.description,
              isEquippable: i.isEquippable(),
               canEquip: (cName: string) => i.canEquip(cName as any),
            })),
            goldReward,
            rounds: result.rounds,
            isComplete: true,
          })
          return
        }

        this.campaign.state.currentLevel++
        this.campaign.save()

        this.send({
          type: 'campaign_battle_result',
          status: 'victory',
          xpEarned: totalXp,
          party: this.campaign.state.party.map(c => ({
            name: c.name,
            level: c.level,
            xp: c.xp,
            xpToNext: c.xpToNext,
            levelUp: levelUps.find(l => l.name === c.name) || null,
          })),
          loot: loot.map(i => ({
            id: i.id, name: i.name, description: i.description,
            isEquippable: i.isEquippable(),
            canEquip: (cName: string) => i.canEquip(cName as any),
          })),
          goldReward,
          rounds: result.rounds,
          isComplete: false,
        })
      } else {
        this.campaign.state.stats.battlesLost++
        const isNightmare = this.campaign.state.difficulty === Difficulty.NIGHTMARE
        if (isNightmare) {
          SaveManager.delete(0)
          SaveManager.delete(1)
          SaveManager.delete(2)
        }
        this.send({
          type: 'campaign_battle_result',
          status: 'defeat',
          rounds: result.rounds,
          isNightmare,
        })
      }

      this.combat = null
    } catch (err) {
      this.send({ type: 'error', message: `Error en batalla: ${err}` })
    }
  }

  private showShop(): void {
    if (!this.campaign) return
    this.shopItems = ShopSystem.generateInventory(
      this.campaign.state.currentLevel,
      this.campaign.state.party.map(c => c.className)
    )
    this.send({
      type: 'shop_data',
      items: this.shopItems.map(si => ({
        shopIndex: this.shopItems.indexOf(si),
        name: si.item.name,
        description: si.item.description,
        rarity: si.item.rarity,
        buyPrice: si.buyPrice,
        sellPrice: si.sellPrice,
        isEquippable: si.item.isEquippable(),
        type: si.item.type,
        forClasses: (si.item as any).allowedClasses || [],
      })),
      gold: this.campaign.state.gold,
      party: this.campaign.state.party.map((c, idx) => ({
        index: idx, name: c.name, className: c.className,
        inventory: c.inventory.map((item, iidx) => ({
          index: iidx, name: item.name, description: item.description,
          type: item.type, isEquippable: item.isEquippable(),
          canEquip: item.canEquip(c.className),
        })),
      })),
    })
  }

  private buyItem(shopIndex: number, charIndex: number): void {
    if (!this.campaign || shopIndex < 0 || shopIndex >= this.shopItems.length) return
    const item = this.shopItems[shopIndex]
    if (this.campaign.state.gold < item.buyPrice) {
      this.send({ type: 'shop_error', message: 'No tienes suficiente oro' })
      return
    }
    this.campaign.state.gold -= item.buyPrice
    this.campaign.state.party[charIndex].addToInventory(item.item)
    this.shopItems.splice(shopIndex, 1)
    this.send({
      type: 'shop_bought',
      gold: this.campaign.state.gold,
      message: `Compraste ${item.item.name}`,
    })
  }

  private sellItem(charIndex: number, invIndex: number): void {
    if (!this.campaign) return
    const char = this.campaign.state.party[charIndex]
    const item = char.inventory[invIndex]
    if (!item) return
    const price = Math.round(item.price * 0.3 * (1 + (this.campaign.state.currentLevel * 0.05)))
    char.removeFromInventory(invIndex)
    this.campaign.state.gold += price
    this.send({
      type: 'shop_sold',
      gold: this.campaign.state.gold,
      message: `Vendiste ${item.name} por ${price} oro`,
    })
  }

  private equipItem(charIndex: number, invIndex: number): void {
    if (!this.campaign) return
    const char = this.campaign.state.party[charIndex]
    const item = char.inventory[invIndex]
    if (!item || !item.isEquippable() || !item.canEquip(char.className)) {
      this.send({ type: 'shop_error', message: 'No se puede equipar' })
      return
    }
    char.removeFromInventory(invIndex)
    char.equipItem(item)
    this.send({
      type: 'item_equipped',
      message: `${item.name} equipado a ${char.name}`,
      charIndex,
      weaponName: char.equippedWeapon?.name || null,
      armorName: char.equippedArmor?.name || null,
    })
  }

  private applyTalent(charIndex: number, talentId: string): void {
    if (!this.campaign) return
    const char = this.campaign.state.party[charIndex]
    this.campaign.applyTalent(char, talentId)
    this.send({
      type: 'talent_applied',
      message: `${char.name} aprendió ${talents[talentId]?.name}!`,
      charIndex,
      talentId,
      talents: char.talents,
    })
  }

  // PvE and PvP methods unchanged from before
  private async startPvE(playerId: string, enemyIds: string[]): Promise<void> {
    try {
      this.playerChar = createCharacterFromTemplate(playerId)
      this.enemies = enemyIds.map(id => createCharacterFromTemplate(id))

      const allIds = [this.playerChar.instanceId]
      this.combat = new CombatSystem([this.playerChar], this.enemies, allIds)
      this.combat.onNeedInput = (info) => {
        this.send({ type: 'need_input', ...info })
      }
      this.combat.onBattleState = (state) => {
        this.send({ type: 'battle_state', ...state })
      }

      this.send({
        type: 'battle_start',
        playerId: this.playerChar.id,
        playerName: this.playerChar.name,
        enemyNames: this.enemies.map(e => e.name),
      })

      const result = await this.combat.start()

      if (result.status === BattleStatus.VICTORY) {
        const defeated = this.enemies.filter(e => !e.isAlive)
        const loot = generateLoot(defeated)
        const xpMap = distributeXp([this.playerChar], result.xpEarned)
        const xpEntry = xpMap.get(this.playerChar.id)

        this.send({
          type: 'battle_result',
          status: 'victory',
          xpEarned: result.xpEarned,
          levels: xpEntry ? xpEntry.levels : 0,
          playerLevel: this.playerChar.level,
          playerXp: this.playerChar.xp,
          playerXpToNext: this.playerChar.xpToNext,
          loot: loot.map(i => ({
            id: i.id,
            name: i.name,
            description: i.description,
            isEquippable: i.isEquippable(),
            canEquip: i.canEquip(this.playerChar!.className),
          })),
          rounds: result.rounds,
        })
      } else {
        this.send({
          type: 'battle_result',
          status: 'defeat',
          rounds: result.rounds,
        })
      }
    } catch (err) {
      this.send({ type: 'error', message: `Error: ${err}` })
    }
  }

  private async startPvP(p1Id: string, p2Id: string): Promise<void> {
    try {
      const p1 = createCharacterFromTemplate(p1Id)
      const p2 = createCharacterFromTemplate(p2Id)

      this.combat = new CombatSystem([p1], [p2], [p1.instanceId, p2.instanceId])
      this.combat.onNeedInput = (info) => {
        this.send({ type: 'need_input', ...info })
      }
      this.combat.onBattleState = (state) => {
        this.send({ type: 'battle_state', ...state })
      }

      this.send({
        type: 'battle_start',
        p1: { id: p1.id, name: p1.name },
        p2: { id: p2.id, name: p2.name },
      })

      const result = await this.combat.start()

      if (result.status === BattleStatus.VICTORY) {
        const winner = p1.isAlive ? p1.name : p2.name
        this.send({
          type: 'battle_result',
          status: 'victory',
          winner,
          rounds: result.rounds,
        })
      } else {
        this.send({
          type: 'battle_result',
          status: 'defeat',
          rounds: result.rounds,
        })
      }
    } catch (err) {
      this.send({ type: 'error', message: `Error: ${err}` })
    }
  }
}
