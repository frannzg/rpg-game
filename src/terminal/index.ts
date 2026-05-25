import inquirer from 'inquirer'
import pc from 'picocolors'
import { Character } from '../models/Character.js'
import { createCharacterFromTemplate, getCharacterChoices, createAllCharacters } from '../models/classes/index.js'
import { distributeXp } from '../systems/LevelSystem.js'
import { generateLoot } from '../systems/LootSystem.js'
import { CampaignManager } from '../systems/CampaignManager.js'
import { SaveManager } from '../systems/SaveManager.js'
import { ShopSystem } from '../systems/ShopSystem.js'
import { itemDatabase } from '../data/items.js'
import { TerminalAdapter } from './TerminalAdapter.js'
import { talents } from '../data/talents.js'
import { AchievementSystem, ACHIEVEMENT_LIST } from '../systems/AchievementSystem.js'
import { renderVictory, renderDefeat, renderLoot } from '../ui/renderer.js'
import { BattleStatus, Difficulty, NeedInputInfo, BattleState, RARITY_MULTIPLIER } from '../types/index.js'

function showTitle(): void {
  console.clear()
  console.log(pc.bold(pc.yellow(`
╔══════════════════════════════════════════╗
║        ⚔  TERMINAL RPG  ⚔               ║
║    Batallas por turnos en la terminal    ║
╚══════════════════════════════════════════╝
`)))
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function displayPartyStatus(party: Character[]): void {
  for (const char of party) {
    const s = char.getEffectiveStats()
    console.log(`${pc.bold(char.name)} — ${char.className} ${pc.bold(`Lv.${char.level}`)}`)
    console.log(`  HP: ${char.currentStats.hp}/${s.maxHp}  MP: ${char.currentStats.mp}/${s.maxMp}`)
    console.log(`  STR:${s.str} DEF:${s.def} INT:${s.int} RES:${s.res} SPD:${s.spd} DEX:${s.dex}`)
    if (char.equippedWeapon) console.log(`  🗡 ${pc.gray(char.equippedWeapon.name)}`)
    if (char.equippedArmor) console.log(`  🛡 ${pc.gray(char.equippedArmor.name)}`)
    if (char.inventory.length > 0) console.log(`  🎒 ${char.inventory.map(i => i.name).join(', ')}`)
    if (char.talents.length > 0) console.log(`  ⭐ Talentos: ${char.talents.join(', ')}`)
    console.log('')
  }
}

async function mainMenu(): Promise<string> {
  showTitle()
  const { option } = await inquirer.prompt<{ option: string }>([
    {
      type: 'list', name: 'option', message: 'Selecciona modo de juego:',
      choices: [
        { name: '⚔  Campaña (20 niveles)', value: 'campaign' },
        { name: '⚔  Jugador vs CPU', value: 'pve' },
        { name: '👥  Jugador vs Jugador (2P)', value: 'pvp' },
        { name: '♾️  Supervivencia (oleadas)', value: 'survival' },
        { name: '📊  Ver personajes', value: 'info' },
        { name: '🚪  Salir', value: 'exit' },
      ],
    },
  ])
  return option
}

async function showCharacterInfo(): Promise<void> {
  showTitle()
  const allChars = createAllCharacters()
  for (const char of allChars) {
    const stats = char.getEffectiveStats()
    console.log(pc.bold(`\n${pc.yellow('✦')} ${pc.bold(char.name)} — ${char.className} (Nv.${char.level})`))
    console.log(`  ${pc.gray(char.description)}`)
    console.log(`  ${pc.green('HP:')} ${stats.maxHp}  ${pc.blue('MP:')} ${stats.maxMp}  ${pc.cyan('STR:')} ${stats.str}  ${pc.yellow('DEF:')} ${stats.def}`)
    console.log(`  ${pc.red('INT:')} ${stats.int}  ${pc.magenta('RES:')} ${stats.res}  ${pc.white('SPD:')} ${stats.spd}  ${pc.green('DEX:')} ${stats.dex}`)
    console.log(`  ${pc.gray('Habilidades:')} ${char.getAbilities().map(a => pc.cyan(a.name)).join(', ')}`)
    if (char.equippedWeapon) console.log(`  🗡 ${pc.gray(char.equippedWeapon.name)}`)
    if (char.equippedArmor) console.log(`  🛡 ${pc.gray(char.equippedArmor.name)}`)
  }
  await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para volver...' }])
}

async function selectCharacter(prompt: string): Promise<Character> {
  const choices = getCharacterChoices()
  choices.push({ name: '🎲  Aleatorio', value: 'random', short: 'Aleatorio' })
  const { id } = await inquirer.prompt<{ id: string }>([
    { type: 'list', name: 'id', message: prompt, choices },
  ])
  if (id === 'random') {
    const pick = getCharacterChoices()
    return createCharacterFromTemplate(pick[Math.floor(Math.random() * pick.length)].value)
  }
  return createCharacterFromTemplate(id)
}

async function selectEnemies(count: number): Promise<Character[]> {
  const enemies: Character[] = []
  const choices = getCharacterChoices()
  for (let i = 0; i < count; i++) {
    const available = choices.filter(c => !enemies.find(e => e.id === c.value))
    available.push({ name: '🎲  Aleatorio', value: 'random', short: 'Aleatorio' })
    const { id } = await inquirer.prompt<{ id: string }>([
      { type: 'list', name: 'id', message: `Enemigo ${i + 1} de ${count}:`, choices: available },
    ])
    const tid = id === 'random' ? choices[Math.floor(Math.random() * choices.length)].value : id
    enemies.push(createCharacterFromTemplate(tid))
  }
  return enemies
}

async function playPvE(): Promise<void> {
  showTitle()
  console.log(pc.bold(pc.green('📋 SELECCIONA TU PERSONAJE\n')))
  const playerChar = await selectCharacter('Elige tu personaje:')
  console.log(pc.cyan(`Has elegido a ${playerChar.name}!`))
  await sleep(300)

  showTitle()
  const { count } = await inquirer.prompt<{ count: number }>([
    { type: 'list', name: 'count', message: '¿Contra cuántos enemigos?',
      choices: [{ name: '1', value: 1 }, { name: '2', value: 2 }, { name: '3', value: 3 }] },
  ])

  const enemies = await selectEnemies(count)
  await sleep(300)
  console.log(pc.bold(pc.yellow('\n¡QUE COMIENCE LA BATALLA!\n')))
  await sleep(500)

  const adapter = new TerminalAdapter([playerChar], enemies, [playerChar.instanceId])
  const result = await adapter.getCombat().start()

  if (result.status === BattleStatus.VICTORY) {
    const defeated = enemies.filter(e => !e.isAlive)
    const loot = generateLoot(defeated)
    const xpResults = distributeXp([playerChar], result.xpEarned)
    const xpEntry = xpResults.get(playerChar.id)
    const levelMsgs: string[] = []
    if (xpEntry && xpEntry.levels > 0) {
      levelMsgs.push(`${playerChar.name} subió ${xpEntry.levels} nivel(es)! (Nv. ${playerChar.level})`)
    }
    renderVictory(result.xpEarned, levelMsgs)
    renderLoot(loot.map(i => `${i.name} — ${i.description}`))
    for (const item of loot) {
      if (item.canEquip(playerChar.className) && item.isEquippable()) {
        const { equip } = await inquirer.prompt([
          { type: 'confirm', name: 'equip', message: `¿Equipar ${item.name}?`, default: false },
        ])
        if (equip) playerChar.equipItem(item)
        else playerChar.addToInventory(item)
      } else {
        playerChar.addToInventory(item)
      }
    }
  } else {
    renderDefeat()
  }
  console.log(pc.gray(`\n${result.rounds} rondas · ${playerChar.name} Nv.${playerChar.level} (${playerChar.xp}/${playerChar.xpToNext} XP)`))
  await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para volver...' }])
}

async function playPvP(): Promise<void> {
  showTitle()
  console.log(pc.bold(pc.green('👤 JUGADOR 1\n')))
  const p1 = await selectCharacter('J1 elige:')
  console.log(pc.bold(pc.green('\n👤 JUGADOR 2\n')))
  const p2Choices = getCharacterChoices().filter(c => c.value !== p1.id)
  const { id } = await inquirer.prompt<{ id: string }>([
    { type: 'list', name: 'id', message: 'J2 elige:', choices: p2Choices },
  ])
  const p2 = createCharacterFromTemplate(id)

  console.log(pc.bold(pc.yellow(`\n${p1.name} vs ${p2.name}!\n`)))
  await sleep(500)

  const adapter = new TerminalAdapter([p1], [p2], [p1.instanceId, p2.instanceId])
  const result = await adapter.getCombat().start()

  if (result.status === BattleStatus.VICTORY) {
    const winner = p1.isAlive ? p1 : p2
    console.log(pc.green(`\n🏆 ¡${winner.name} gana!`))
  } else {
    renderDefeat()
  }
  console.log(pc.gray(`\n${result.rounds} rondas`))
  await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para volver...' }])
}

// ===== CAMPAIGN MODE =====
async function playCampaign(): Promise<void> {
  showTitle()
  const savedGames = SaveManager.listSlots()

  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: 'list', name: 'action', message: 'CAMPAÑA:',
      choices: [
        { name: '🆕  Nueva partida', value: 'new' },
        ...(savedGames[0] ? [{ name: `📂  Cargar partida (Nv.${savedGames[0].currentLevel} - ${savedGames[0].party.map(p => p.customName).join(', ')})`, value: 'load' }] : []),
        { name: '🗑️  Borrar partida', value: 'delete' },
        { name: '← Volver', value: 'back' },
      ],
    },
  ])

  if (action === 'back') return
  if (action === 'delete') {
    SaveManager.delete(0)
    console.log(pc.gray('Partida borrada.'))
    await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para volver...' }])
    return
  }

  let cm: CampaignManager

  if (action === 'load') {
    const save = savedGames[0]!
    cm = CampaignManager.loadFromSave(save)
    console.log(pc.green(`\n📂 Partida cargada — Nivel ${cm.state.currentLevel}`))
  } else {
    const { difficulty } = await inquirer.prompt<{ difficulty: string }>([
      {
        type: 'list', name: 'difficulty', message: 'Dificultad:',
        choices: [
          { name: '⚔ Normal', value: 'normal' },
          { name: '🔥 Difícil (enemigos +25%, XP +50%)', value: 'hard' },
          { name: '💀 Pesadilla (enemigos +50%, XP +100%, permadeath)', value: 'nightmare' },
        ],
      },
    ])

    const choices = getCharacterChoices()
    const selected: Character[] = []
    const names: string[] = []

    for (let i = 0; i < 3; i++) {
      showTitle()
      console.log(pc.bold(pc.yellow(`\nSELECCIONA PERSONAJE ${i + 1} DE 3\n`)))
      const available = choices.filter(c => !selected.find(s => s.id === c.value))
      const { id } = await inquirer.prompt<{ id: string }>([
        { type: 'list', name: 'id', message: 'Clase:', choices: available },
      ])
      const defaultName = available.find(c => c.value === id)?.short || id
      const { customName } = await inquirer.prompt<{ customName: string }>([
        { type: 'input', name: 'customName', message: 'Nombre personalizado:', default: defaultName },
      ])
      selected.push(createCharacterFromTemplate(id))
      names.push(customName || id)
    }

    cm = CampaignManager.createNew(
      selected.map(c => c.id),
      names,
      difficulty as Difficulty
    )
    console.log(pc.green('\n🌍 ¡Tu aventura comienza!'))
  }

  await sleep(500)

  while (cm.state.currentLevel <= 20 && !cm.state.isComplete) {
    showTitle()
    const levelData = cm.getLevelData()
    const isBoss = levelData?.enemyGroups.some(g => g.isBoss)

    console.log(pc.bold(pc.yellow(`\n═══════════ NIVEL ${cm.state.currentLevel} ═══════════`)))
    if (isBoss && levelData?.bossName) {
      console.log(pc.bold(pc.red(`\n👑 ¡JEFE: ${levelData.bossName}!`)))
      if (levelData.bossQuote) console.log(pc.italic(pc.gray(`  "${levelData.bossQuote}"`)))
    }
    console.log(pc.gray(`Oro: ${cm.state.gold}\n`))

    displayPartyStatus(cm.state.party)

    // Check for talent opportunities
    for (const char of cm.state.party) {
      const availableTalents = cm.getAvailableTalentsForLevel(char)
      if (availableTalents.length > 0) {
        console.log(pc.bold(pc.magenta(`\n⭐ ¡${char.name} puede elegir un talento!`)))
        const { talentId } = await inquirer.prompt<{ talentId: string }>([
          {
            type: 'list', name: 'talentId', message: 'Elige un talento:',
            choices: availableTalents.map(id => {
              const t = talents[id]
              return { name: `${t.name} — ${t.description}`, value: id }
            }),
          },
        ])
        cm.applyTalent(char, talentId)
        console.log(pc.green(`✨ ${char.name} aprendió ${talents[talentId]?.name}!`))
      }
    }

    const { choice } = await inquirer.prompt<{ choice: string }>([
      {
        type: 'list', name: 'choice', message: '¿Qué deseas hacer?',
        choices: [
          { name: isBoss ? '⚔ ¡ENFRENTAR AL JEFE!' : '⚔ Siguiente batalla', value: 'battle' },
          { name: '🏪 Tienda', value: 'shop' },
          { name: '🎒 Administrar inventario', value: 'inventory' },
          { name: '💾 Guardar y salir', value: 'save_exit' },
        ],
      },
    ])

    if (choice === 'save_exit') {
      cm.save()
      console.log(pc.green('💾 Partida guardada. ¡Hasta pronto!'))
      return
    }

    if (choice === 'shop') {
      await runShop(cm)
      continue
    }

    if (choice === 'inventory') {
      await runInventory(cm)
      continue
    }

    // Battle
    showTitle()
    console.log(pc.bold(pc.yellow(`\n⚔ BATALLA — NIVEL ${cm.state.currentLevel}\n`)))
    await sleep(500)

    const enemies = cm.getBattleEnemies()
    const allIds = cm.state.party.map(c => c.instanceId)
    const adapter = new TerminalAdapter(cm.state.party, enemies, allIds)
    const result = await adapter.getCombat().start()

    if (result.status === BattleStatus.VICTORY) {
      const defeated = enemies.filter(e => !e.isAlive)
      const loot = generateLoot(defeated)
      const totalXp = result.xpEarned * (cm.state.difficulty === Difficulty.HARD ? 1.5 : cm.state.difficulty === Difficulty.NIGHTMARE ? 2 : 1)
      const xpResults = distributeXp(cm.state.party, totalXp)
      const levelMsgs: string[] = []

      for (const char of cm.state.party) {
        const entry = xpResults.get(char.id)
        if (entry && entry.levels > 0) {
          levelMsgs.push(`${char.name} subió ${entry.levels} nivel(es)! (Nv. ${char.level})`)
        }
        const effective = char.getEffectiveStats()
        char.currentStats.hp = effective.maxHp
        char.currentStats.mp = effective.maxMp
      }

      cm.state.stats.battlesWon++
      cm.state.stats.totalDamageDealt += adapter.getCombat().totalDamageDealt
      cm.state.stats.criticalHits += adapter.getCombat().criticalHits
      cm.state.stats.totalHealed += adapter.getCombat().totalHealed
      cm.state.stats.enemiesDefeated += defeated.length
      cm.state.gold += levelData?.goldReward || 0
      renderVictory(totalXp, levelMsgs)

      cm.checkAchievements()
      if (cm.state.justUnlockedAchievements.length > 0) {
        console.log(pc.bold(pc.yellow('\n🏆 ¡LOGROS DESBLOQUEADOS!')))
        for (const id of cm.state.justUnlockedAchievements) {
          const a = ACHIEVEMENT_LIST[id]
          if (a) console.log(`  ✦ ${pc.bold(pc.yellow(a.name))}: ${a.description}`)
        }
        cm.state.justUnlockedAchievements = []
      }

      if (loot.length > 0) {
        renderLoot(loot.map(i => `${i.name} — ${i.description}`))
        for (const item of loot) {
          const owner = cm.state.party.find(c => item.canEquip(c.className)) || cm.state.party[0]
          if (item.isEquippable() && item.canEquip(owner.className)) {
            const { equip } = await inquirer.prompt([
              { type: 'confirm', name: 'equip', message: `¿Equipar ${item.name} en ${owner.name}?`, default: false },
            ])
            if (equip) owner.equipItem(item)
            else owner.addToInventory(item)
          } else {
            owner.addToInventory(item)
          }
        }
      }

      if (isBoss) cm.state.stats.bossesDefeated++

      if (cm.state.currentLevel >= 20) {
        console.log(pc.bold(pc.green('\n══════════════════════════════════════')))
        console.log(pc.bold(pc.green('║      🏆 ¡CAMPAÑA COMPLETADA! 🏆     ║')))
        console.log(pc.bold(pc.green('══════════════════════════════════════')))
        cm.state.isComplete = true
        cm.save()
        await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para continuar...' }])
        return
      } else {
        cm.state.currentLevel++
        cm.save()
        console.log(pc.gray(`\n📈 Avanzas al nivel ${cm.state.currentLevel}!`))
        await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para continuar...' }])
      }
    } else {
      renderDefeat()
      cm.state.stats.battlesLost++
      if (cm.state.difficulty === Difficulty.NIGHTMARE) {
        console.log(pc.red('\n💀 PERMA-DEATH: Tu partida ha sido borrada.'))
        SaveManager.delete(0)
      } else {
        console.log(pc.yellow('\n🔄 Puedes reintentar el nivel.'))
      }
      await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para continuar...' }])
    }
  }
}

async function runShop(cm: CampaignManager): Promise<void> {
  showTitle()
  console.log(pc.bold(pc.yellow('\n═══════════ 🏪 TIENDA ═══════════\n')))
  console.log(pc.gray(`Oro: ${cm.state.gold}`))

  const shopItems = ShopSystem.generateInventory(
    cm.state.currentLevel,
    cm.state.party.map(c => c.className)
  )

  const { shopAction } = await inquirer.prompt<{ shopAction: string }>([
    {
      type: 'list', name: 'shopAction', message: '¿Qué deseas hacer?',
      choices: [
        { name: '🛒 Comprar', value: 'buy' },
        { name: '💰 Vender', value: 'sell' },
        { name: '← Volver', value: 'back' },
      ],
    },
  ])

  if (shopAction === 'buy') {
    const buyChoices = shopItems.map((si, idx) => ({
      name: `${si.item.name} — ${si.item.description} (${si.buyPrice} oro) [${si.item.rarity}]`,
      value: idx,
    }))
    buyChoices.push({ name: '← Volver', value: -1 })

    const { buyIdx } = await inquirer.prompt<{ buyIdx: number }>([
      { type: 'list', name: 'buyIdx', message: 'Selecciona item:', choices: buyChoices },
    ])

    if (buyIdx >= 0) {
      const { charIdx } = await inquirer.prompt<{ charIdx: number }>([
        {
          type: 'list', name: 'charIdx', message: '¿Para quién?',
          choices: cm.state.party.map((c, i) => ({ name: `${c.name} (${c.className})`, value: i })),
        },
      ])

      const result = ShopSystem.buyItem(shopItems[buyIdx], charIdx, cm.toSaveGame().party, cm.state.gold)
      if (result) {
        cm.state.gold = result.gold
        const char = cm.state.party[charIdx]
        char.addToInventory(shopItems[buyIdx].item)
        console.log(pc.green(`✅ ${shopItems[buyIdx].item.name} equipado a ${char.name}!`))
      } else {
        console.log(pc.red('❌ No tienes suficiente oro.'))
      }
    }
  } else if (shopAction === 'sell') {
    const { charIdx } = await inquirer.prompt<{ charIdx: number }>([
      {
        type: 'list', name: 'charIdx', message: '¿De quién?',
        choices: cm.state.party.map((c, i) => ({ name: `${c.name} (${c.className} — ${c.inventory.length} items)`, value: i })),
      },
    ])

    const char = cm.state.party[charIdx]
    if (char.inventory.length === 0) {
      console.log(pc.gray('No hay items para vender.'))
    } else {
      const sellChoices = char.inventory.map((item, idx) => {
        const rarityMult = RARITY_MULTIPLIER[item.rarity] || 1
        const price = Math.round(item.price * 0.3 * rarityMult)
        return { name: `${item.name} — ${price} oro`, value: idx }
      })
      sellChoices.push({ name: '← Volver', value: -1 })

      const { sellIdx } = await inquirer.prompt<{ sellIdx: number }>([
        { type: 'list', name: 'sellIdx', message: 'Selecciona item:', choices: sellChoices },
      ])

      if (sellIdx >= 0) {
        const sold = char.removeFromInventory(sellIdx)
        if (sold) {
          const rarityMult = RARITY_MULTIPLIER[sold.rarity] || 1
          const price = Math.round(sold.price * 0.3 * rarityMult)
          cm.state.gold += price
          console.log(pc.green(`💰 Vendiste ${sold.name} por ${price} oro!`))
        }
      }
    }
  }

  if (shopAction !== 'back') {
    await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para continuar...' }])
  }
}

async function runInventory(cm: CampaignManager): Promise<void> {
  showTitle()
  console.log(pc.bold(pc.yellow('\n═══════════ 🎒 INVENTARIO ═══════════\n')))

  const { charIdx } = await inquirer.prompt<{ charIdx: number }>([
    {
      type: 'list', name: 'charIdx', message: 'Selecciona personaje:',
      choices: cm.state.party.map((c, i) => ({ name: `${c.name} (${c.className}) — ${c.inventory.length} items`, value: i })),
    },
  ])

  const char = cm.state.party[charIdx]
  const choices = char.inventory.map((item, idx) => {
    const equipText = item.isEquippable() ? (item.canEquip(char.className) ? ' [✅ EQUIPABLE]' : ' [❌ NO EQUIPABLE]') : ''
    return { name: `${item.name}${equipText} — ${item.description}`, value: idx }
  })

  if (choices.length === 0) {
    console.log(pc.gray('No hay items.'))
    await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para continuar...' }])
    return
  }

  choices.push({ name: '← Volver', value: -1 })

  const { action } = await inquirer.prompt<{ action: number }>([
    { type: 'list', name: 'action', message: 'Selecciona item:', choices },
  ])

  if (action >= 0) {
    const item = char.inventory[action]
    if (item.isEquippable() && item.canEquip(char.className)) {
      const { equip } = await inquirer.prompt([
        { type: 'confirm', name: 'equip', message: `¿Equipar ${item.name}?`, default: false },
      ])
      if (equip) {
        char.removeFromInventory(action)
        char.equipItem(item)
        console.log(pc.green(`✅ ${item.name} equipado!`))
      }
    } else if (item.isConsumable()) {
      const { use } = await inquirer.prompt([
        { type: 'confirm', name: 'use', message: `¿Usar ${item.name}?`, default: false },
      ])
      if (use) {
        char.removeFromInventory(action)
        if (item.healAmount) { char.heal(item.healAmount); console.log(pc.green(`❤️ +${item.healAmount} HP!`)) }
        if (item.mpRestore) { char.restoreMp(item.mpRestore); console.log(pc.blue(`💧 +${item.mpRestore} MP!`)) }
      }
    } else {
      console.log(pc.gray(`${item.name} no se puede equipar a ${char.className}.`))
    }
    await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para continuar...' }])
  }
}

// ===== SURVIVAL MODE =====
async function playSurvival(): Promise<void> {
  showTitle()
  console.log(pc.bold(pc.yellow('\n♾️  MODO SUPERVIVENCIA\n')))
  console.log(pc.gray('Oleadas infinitas. ¿Cuántas sobrevivirás?\n'))

  const playerChar = await selectCharacter('Elige tu campeón:')
  playerChar.currentStats.hp = playerChar.currentStats.maxHp
  playerChar.currentStats.mp = playerChar.currentStats.maxMp

  let wave = 0
  let alive = true

  while (alive) {
    wave++
    showTitle()
    console.log(pc.bold(pc.red(`\n═══════════ OLEADA ${wave} ═══════════\n`)))
    console.log(`${pc.bold(playerChar.name)} — Lv.${playerChar.level}`)
    console.log(`HP: ${playerChar.currentStats.hp}/${playerChar.currentStats.maxHp}  MP: ${playerChar.currentStats.mp}/${playerChar.currentStats.maxMp}\n`)

    await sleep(500)

    const enemyCount = Math.min(1 + Math.floor(wave / 3), 4)
    const choices = getCharacterChoices()
    const enemies: Character[] = []

    for (let i = 0; i < enemyCount; i++) {
      const pick = choices[Math.floor(Math.random() * choices.length)].value
      const enemy = createCharacterFromTemplate(pick)
      const scale = 1 + 0.15 * (wave - 1)
      for (const stat of Object.keys(enemy.baseStats) as (keyof import('../types/index.js').Stats)[]) {
        if (stat === 'maxHp' || stat === 'maxMp') continue
        ;(enemy.baseStats as any)[stat] = Math.round(((enemy.baseStats as any)[stat] || 0) * scale)
      }
      enemy.currentStats = { ...enemy.baseStats }
      enemy.currentStats.hp = enemy.baseStats.maxHp
      enemy.currentStats.mp = enemy.baseStats.maxMp
      enemies.push(enemy)
    }

    const adapter = new TerminalAdapter([playerChar], enemies, [playerChar.instanceId])
    const result = await adapter.getCombat().start()

    if (result.status === BattleStatus.VICTORY) {
      const xpResults = distributeXp([playerChar], result.xpEarned)
      const entry = xpResults.get(playerChar.id)
      const levelMsgs: string[] = []
      if (entry && entry.levels > 0) {
        levelMsgs.push(`${playerChar.name} subió ${entry.levels} nivel(es)! (Nv. ${playerChar.level})`)
      }

      renderVictory(result.xpEarned, levelMsgs)

      const healPct = 0.3
      playerChar.currentStats.hp = Math.min(playerChar.currentStats.maxHp, playerChar.currentStats.hp + Math.round(playerChar.currentStats.maxHp * healPct))
      playerChar.currentStats.mp = Math.min(playerChar.currentStats.maxMp, playerChar.currentStats.mp + Math.round(playerChar.currentStats.maxMp * healPct))

      const defeated = enemies.filter(e => !e.isAlive)
      const loot = generateLoot(defeated)
      if (loot.length > 0) renderLoot(loot.map(i => i.name))

      const { continue: cont } = await inquirer.prompt<{ continue: boolean }>([
        { type: 'confirm', name: 'continue', message: '¿Siguiente oleada?', default: true },
      ])
      if (!cont) alive = false
    } else {
      renderDefeat()
      console.log(pc.yellow(`\n🏆 Sobreviviste ${wave} oleadas!`))
      alive = false
      await inquirer.prompt([{ type: 'input', name: 'c', message: 'Enter para volver...' }])
    }
  }
}

async function main(): Promise<void> {
  let running = true
  while (running) {
    const option = await mainMenu()
    switch (option) {
      case 'campaign': await playCampaign(); break
      case 'pve': await playPvE(); break
      case 'pvp': await playPvP(); break
      case 'survival': await playSurvival(); break
      case 'info': await showCharacterInfo(); break
      case 'exit': running = false; break
    }
  }
}

main().catch(console.error)
