const CLASS_MAP = {
  guerrero: 'Warrior',
  mago: 'Mage',
  picaro: 'Rogue',
  paladin: 'Paladin',
  arquero: 'Archer',
  berserker: 'Berserker',
  druida: 'Druid',
}

const CLASS_EMOJI = {
  guerrero: '⚔',
  mago: '🔮',
  picaro: '🗡',
  paladin: '🛡',
  arquero: '🏹',
  berserker: '💀',
  druida: '🌿',
}

const ABILITY_MAP = {
  golpe_poderoso: { name: 'Golpe Poderoso', targetType: 'single_enemy', desc: 'Ataque físico potente', mp: 8 },
  postura_defensiva: { name: 'Postura Defensiva', targetType: 'self', desc: 'Aumenta DEF 50% 3 turnos', mp: 5 },
  grito_guerra: { name: 'Grito de Guerra', targetType: 'self', desc: 'Aumenta STR equipo 25% 2 turnos', mp: 10 },
  tajo_giratorio: { name: 'Tajo Giratorio', targetType: 'all_enemies', desc: 'Golpea a todos los enemigos', mp: 12 },
  bola_fuego: { name: 'Bola de Fuego', targetType: 'single_enemy', desc: 'Hechizo de fuego que quema', mp: 12 },
  escarcha: { name: 'Escarcha', targetType: 'single_enemy', desc: 'Hielo que reduce velocidad', mp: 8 },
  rayo: { name: 'Rayo', targetType: 'all_enemies', desc: 'Relámpago a todos los enemigos', mp: 15 },
  curar: { name: 'Curar', targetType: 'single_ally', desc: 'Restaura 40% HP aliado', mp: 10 },
  golpe_sombra: { name: 'Golpe Sombra', targetType: 'single_enemy', desc: 'Ataque sigiloso +50% crítico', mp: 6 },
  veneno: { name: 'Envenenar', targetType: 'single_enemy', desc: 'Veneno que daña por turno', mp: 7 },
  doble_golpe: { name: 'Doble Golpe', targetType: 'single_enemy', desc: 'Ataca dos veces', mp: 10 },
  evasion: { name: 'Evasión', targetType: 'self', desc: 'Aumenta DEX 80% 2 turnos', mp: 4 },
  golpe_sagrado: { name: 'Golpe Sagrado', targetType: 'single_enemy', desc: 'Ignora 50% res mágica', mp: 8 },
  escudo_protector: { name: 'Escudo Protector', targetType: 'self', desc: 'Aumenta DEF/RES 40% 3 turnos', mp: 8 },
  curacion_divina: { name: 'Curación Divina', targetType: 'single_ally', desc: 'Restaura 60% HP aliado', mp: 14 },
  barrera_luz: { name: 'Barrera de Luz', targetType: 'self', desc: 'Reduce daño del equipo 2 turnos', mp: 16 },
  disparo_preciso: { name: 'Disparo Preciso', targetType: 'single_enemy', desc: 'Precisión +30% crítico', mp: 6 },
  lluvia_flechas: { name: 'Lluvia de Flechas', targetType: 'all_enemies', desc: 'Flechas a todos los enemigos', mp: 12 },
  disparo_penetrante: { name: 'Disparo Penetrante', targetType: 'single_enemy', desc: 'Ignora 60% defensa', mp: 10 },
  ojo_aguila: { name: 'Ojo de Águila', targetType: 'self', desc: 'Aumenta DEX 50% 3 turnos', mp: 5 },
  // Berserker abilities (from src/data/abilities.ts)
  furia: { name: 'Furia', targetType: 'self', desc: 'Aumenta STR 50% por 2 turnos', mp: 6 },
  golpe_sangriento: { name: 'Golpe Sangriento', targetType: 'single_enemy', desc: 'Ataque 2.2x que consume 10% HP', mp: 4 },
  tajo_salvaje: { name: 'Tajo Salvaje', targetType: 'all_enemies', desc: 'Golpea a todos los enemigos', mp: 14 },
  berreo: { name: 'Berreo', targetType: 'self', desc: 'Aumenta ATQ del equipo 30% 3 turnos', mp: 10 },
  // Druida abilities (from src/data/abilities.ts)
  curacion_natural: { name: 'Curación Natural', targetType: 'single_ally', desc: 'Restaura 50% HP con poder natural', mp: 8 },
  espinas: { name: 'Espinas', targetType: 'self', desc: 'Escudo que refleja 20% daño 3 turnos', mp: 8 },
  invocar_lobo: { name: 'Invocar Lobo', targetType: 'self', desc: 'Invoca un lobo que lucha 4 turnos', mp: 15 },
  tormenta: { name: 'Tormenta', targetType: 'all_enemies', desc: 'Tormenta eléctrica a todos los enemigos', mp: 14 },
}

const CHAR_ABILITIES = {
  guerrero: ['golpe_poderoso','postura_defensiva','grito_guerra','tajo_giratorio'],
  mago: ['bola_fuego','escarcha','rayo','curar'],
  picaro: ['golpe_sombra','veneno','doble_golpe','evasion'],
  paladin: ['golpe_sagrado','escudo_protector','curacion_divina','barrera_luz'],
  arquero: ['disparo_preciso','lluvia_flechas','disparo_penetrante','ojo_aguila'],
  berserker: ['furia','golpe_sangriento','tajo_salvaje','berreo'],
  druida: ['curacion_natural','espinas','invocar_lobo','tormenta'],
}

const CHAR_STATS = {
  guerrero: { hp: 120, mp: 30, str: 18, def: 14, int: 4, res: 6, spd: 7, dex: 8 },
  mago: { hp: 70, mp: 80, str: 3, def: 5, int: 20, res: 14, spd: 10, dex: 6 },
  picaro: { hp: 85, mp: 45, str: 12, def: 7, int: 6, res: 6, spd: 18, dex: 14 },
  paladin: { hp: 110, mp: 50, str: 14, def: 14, int: 10, res: 14, spd: 6, dex: 7 },
  arquero: { hp: 75, mp: 40, str: 10, def: 6, int: 5, res: 7, spd: 14, dex: 20 },
  berserker: { hp: 90, mp: 20, str: 22, def: 8, int: 3, res: 5, spd: 12, dex: 10 },
  druida: { hp: 90, mp: 65, str: 6, def: 8, int: 17, res: 12, spd: 9, dex: 7 },
}

let ws = null
let state = {
  sessionId: null,
  characters: [],
  playerId: null,
  selectedEnemies: [],
  pvp: { p1: null, p2: null },
  enemyCount: 0,
  // Campaign state
  campaign: null,
  partyPicks: [null, null, null],
  difficulty: 'normal',
  shopParty: null,
}

function connect() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
  ws = new WebSocket(`${proto}//${location.host}`)
  ws.onopen = () => console.log('Conectado')
  ws.onclose = () => setTimeout(connect, 2000)
  ws.onmessage = (e) => handleMessage(JSON.parse(e.data))
}

function send(data) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data))
}

const $ = (id) => document.getElementById(id)
const show = (id) => $(id).classList.remove('hidden')
const hide = (id) => $(id).classList.add('hidden')

// Hide all screens initially
const ALL_SCREENS = ['character-select','enemy-select','pvp-select','battle','result',
  'campaign-select','party-creation','campaign-hub','shop','talent-select']
ALL_SCREENS.forEach(id => hide(id))

// ─── Back arrows ───
document.addEventListener('click', (e) => {
  const arrow = e.target.closest('.back-arrow')
  if (!arrow) return
  const target = arrow.dataset.back
  if (target === 'menu') {
    ALL_SCREENS.forEach(id => hide(id))
    show('menu')
  } else if (target === 'character-select') {
    hide('enemy-select'); show('character-select')
  } else if (target === 'campaign-select') {
    hide('party-creation'); show('campaign-select')
  } else if (target === 'campaign-hub') {
    hide('shop'); show('campaign-hub')
  }
})

// ─── Menu buttons ───
document.querySelector('[data-action="pve"]').addEventListener('click', () => showCharSelect('pve'))
document.querySelector('[data-action="pvp"]').addEventListener('click', showPvPSelect)
document.querySelector('[data-action="campaign"]').addEventListener('click', showCampaignSelect)

$('back-to-menu').addEventListener('click', () => {
  hide('result'); show('menu')
})

$('back-to-hub')?.addEventListener('click', () => {
  hide('result'); sendCampaignHubRequest()
})

// ─── Character select (PvE) ───
function showCharSelect(mode) {
  hide('menu'); hide('result'); hide('campaign-select')
  show('character-select')
  state.selectedEnemies = []
  state.enemyCount = 0
  state.pvp = { p1: null, p2: null }

  const grid = $('char-grid')
  grid.innerHTML = ''

  state.characters.forEach(c => {
    const st = CHAR_STATS[c.id] || {}
    const cssClass = CLASS_MAP[c.id] || c.id
    const abilityNames = (CHAR_ABILITIES[c.id] || [])
      .map(id => ABILITY_MAP[id]?.name).filter(Boolean).join(', ')

    const card = document.createElement('div')
    card.className = 'char-card'
    card.style.animationDelay = `${Math.random() * 0.2}s`
    card.innerHTML = `
      <span class="class-badge class-${cssClass}">${c.className}</span>
      <h3>${c.name}</h3>
      <div class="stats">HP ${st.hp} · MP ${st.mp} · STR ${st.str} · DEF ${st.def}<br>INT ${st.int} · RES ${st.res} · SPD ${st.spd} · DEX ${st.dex}</div>
      <div class="desc">${c.description}</div>
      <div class="abilities-hint">${abilityNames}</div>
    `
    card.addEventListener('click', () => {
      if (mode === 'pve') { state.playerId = c.id; showEnemySelect() }
    })
    grid.appendChild(card)
  })
}

// ─── Enemy select (PvE) ───
function showEnemySelect() {
  hide('character-select'); show('enemy-select')
  $('enemy-picks').classList.add('hidden')
  state.selectedEnemies = []
  state.enemyCount = 0
}

document.querySelectorAll('.btn-count').forEach(btn => {
  btn.addEventListener('click', () => {
    state.enemyCount = parseInt(btn.dataset.count)
    $('enemy-count-select').classList.add('hidden')
    $('enemy-picks').classList.remove('hidden')
    renderEnemyPicks()
  })
})

function renderEnemyPicks() {
  const grid = $('enemy-grid')
  grid.innerHTML = ''

  for (let i = 0; i < state.enemyCount; i++) {
    const container = document.createElement('div')
    container.innerHTML = `<h3 style="color:#e08060;text-align:center;margin:8px 0;font-family:'Cinzel',serif;font-size:0.85em;letter-spacing:2px">ENEMIGO ${i+1}</h3>`
    const innerGrid = document.createElement('div')
    innerGrid.className = 'char-grid'
    innerGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))'

    state.characters.forEach(c => {
      const cssClass = CLASS_MAP[c.id] || c.id
      const card = document.createElement('div')
      card.className = 'char-card'
      const alreadyTaken = state.selectedEnemies.find(e => e.slot === i)
      if (alreadyTaken && alreadyTaken.id === c.id) card.classList.add('selected')
      card.innerHTML = `
        <span class="class-badge class-${cssClass}">${c.className}</span>
        <h3>${c.name}</h3>
      `
      card.addEventListener('click', () => {
        state.selectedEnemies = state.selectedEnemies.filter(e => e.slot !== i)
        state.selectedEnemies.push({ id: c.id, slot: i })
        renderEnemyPicks()
      })
      innerGrid.appendChild(card)
    })

    container.appendChild(innerGrid)
    grid.appendChild(container)
  }
}

$('start-battle').addEventListener('click', () => {
  const enemyIds = state.selectedEnemies.sort((a, b) => a.slot - b.slot).map(e => e.id)
  if (enemyIds.length < state.enemyCount) return alert('Selecciona todos los enemigos')
  hide('enemy-select')
  send({ type: 'start_pve', character: state.playerId, enemies: enemyIds })
})

// ─── PvP ───
function showPvPSelect() {
  hide('menu'); show('pvp-select')
  state.pvp = { p1: null, p2: null }
  $('start-pvp').classList.add('hidden')

  const renderPicker = (containerId, num) => {
    const grid = $(containerId)
    grid.innerHTML = ''
    state.characters.forEach(c => {
      const st = CHAR_STATS[c.id] || {}
      const cssClass = CLASS_MAP[c.id] || c.id
      const card = document.createElement('div')
      card.className = 'char-card'
      card.innerHTML = `
        <span class="class-badge class-${cssClass}">${c.className}</span>
        <h3>${c.name}</h3>
        <div class="stats">HP ${st.hp} · STR ${st.str} · DEF ${st.def} · SPD ${st.spd}</div>
        <div class="desc">${c.description}</div>
      `
      card.addEventListener('click', () => {
        const key = num === 1 ? 'p1' : 'p2'
        state.pvp[key] = c.id
        grid.querySelectorAll('.char-card').forEach(el => el.classList.remove('selected'))
        card.classList.add('selected')
        if (state.pvp.p1 && state.pvp.p2) $('start-pvp').classList.remove('hidden')
      })
      grid.appendChild(card)
    })
  }

  renderPicker('p1-grid', 1)
  renderPicker('p2-grid', 2)
}

$('start-pvp').addEventListener('click', () => {
  hide('pvp-select')
  send({ type: 'start_pvp', p1: state.pvp.p1, p2: state.pvp.p2 })
})

// ═══════════════════════════════════════════
//  CAMPAIGN MODE
// ═══════════════════════════════════════════

function showCampaignSelect() {
  hide('menu'); show('campaign-select')

  // Check if save exists
  send({ type: 'check_save' })
  // Also try loading to check
  setTimeout(() => {
    const loadBtn = $('campaign-load')
    const loadSub = $('campaign-load-sub')
    const deleteBtn = $('campaign-delete')
    // Default: assume no save until server confirms
  }, 100)
}

$('campaign-new').addEventListener('click', () => {
  hide('campaign-select'); show('party-creation')
  state.partyPicks = [null, null, null]
  state.difficulty = 'normal'
  renderPartyCreation()
})

$('campaign-load').addEventListener('click', () => {
  send({ type: 'load_campaign' })
})

$('campaign-delete').addEventListener('click', () => {
  // Just send a delete signal, go back to menu
  send({ type: 'delete_campaign' })
  hide('campaign-select'); show('menu')
})

function renderPartyCreation() {
  const slots = document.querySelectorAll('.party-slot')
  slots.forEach((slotEl, idx) => {
    const grid = slotEl.querySelector('.party-pick-grid')
    const input = slotEl.querySelector('.party-name-input')
    grid.innerHTML = ''

    state.characters.forEach(c => {
      const cssClass = CLASS_MAP[c.id] || c.id
      const card = document.createElement('div')
      card.className = 'char-card'
      const alreadyPicked = state.partyPicks.some((p, i) => p === c.id && i !== idx)
      if (state.partyPicks[idx] === c.id) card.classList.add('selected')
      if (alreadyPicked) card.classList.add('disabled')
      card.innerHTML = `
        <span class="class-badge class-${cssClass}">${c.className}</span>
        <h3>${c.name}</h3>
        <div class="desc">${c.description}</div>
      `
      card.addEventListener('click', () => {
        if (alreadyPicked) return
        state.partyPicks[idx] = c.id
        input.value = c.name
        renderPartyCreation()
        checkPartyReady()
      })
      grid.appendChild(card)
    })
  })

  // Difficulty buttons
  document.querySelectorAll('.btn-difficulty').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.diff === state.difficulty)
  })
}

document.querySelectorAll('.btn-difficulty').forEach(btn => {
  btn.addEventListener('click', () => {
    state.difficulty = btn.dataset.diff
    document.querySelectorAll('.btn-difficulty').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
  })
})

document.querySelectorAll('.party-name-input').forEach((input, idx) => {
  input.addEventListener('input', () => {
    // Name is read from input when starting
  })
})

function checkPartyReady() {
  const ready = state.partyPicks.every(p => p !== null)
  $('start-campaign').classList.toggle('hidden', !ready)
}

$('start-campaign').addEventListener('click', () => {
  const names = []
  document.querySelectorAll('.party-name-input').forEach((input, idx) => {
    names.push(input.value.trim() || state.characters.find(c => c.id === state.partyPicks[idx])?.name || state.partyPicks[idx])
  })
  hide('party-creation')
  send({
    type: 'start_campaign',
    party: state.partyPicks,
    names,
    difficulty: state.difficulty,
  })
})

function sendCampaignHubRequest() {
  send({ type: 'request_campaign_hub' })
}

// ─── Campaign Hub ───
function showCampaignHub(msg) {
  hide('result'); hide('shop'); hide('party-creation')
  ALL_SCREENS.forEach(id => hide(id))
  show('campaign-hub')

  const levelDisplay = $('hub-level-display')
  const isBoss = msg.levelData?.bossName
  levelDisplay.innerHTML = `
    <h3>${isBoss ? '👑 NIVEL ' + msg.currentLevel + ' — JEFE' : '⚔ NIVEL ' + msg.currentLevel}</h3>
    ${msg.levelData?.bossName ? `<div style="color:#e08040;font-size:1.1em">${msg.levelData.bossName}</div>` : ''}
    ${msg.levelData?.bossQuote ? `<div style="color:#a08070;font-style:italic;font-size:0.85em">"${msg.levelData.bossQuote}"</div>` : ''}
    ${msg.levelData ? `<div style="color:rgba(200,200,208,0.5);font-size:0.8em;margin-top:4px">Oro: +${msg.levelData.goldReward}</div>` : ''}
  `

  $('hub-gold').textContent = `💰 ${msg.gold} oro`

  const partyDiv = $('hub-party')
  partyDiv.innerHTML = ''
  msg.party.forEach(c => {
    const cssClass = CLASS_MAP[c.id] || c.id
    const emoji = CLASS_EMOJI[c.id] || '🧙'
    const el = document.createElement('div')
    el.className = 'hub-char'
    const talentText = c.talents?.length ? `⭐ ${c.talents.join(', ')}` : ''
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <span class="class-badge class-${cssClass}" style="font-size:0.7em">${emoji} ${c.className}</span>
        <strong>${c.name}</strong>
        <span style="color:rgba(200,200,208,0.4);font-size:0.8em">Lv.${c.level}</span>
      </div>
      <div style="display:flex;gap:16px;font-size:0.85em;margin-top:4px">
        <span>❤️${c.hp}/${c.maxHp}</span>
        <span>💧${c.mp}/${c.maxMp}</span>
        <span>⚔${c.str}</span>
        <span>🛡${c.def}</span>
        <span>✨${c.int}</span>
        <span>🔮${c.res}</span>
        <span>💨${c.spd}</span>
        <span>🎯${c.dex}</span>
      </div>
      <div style="display:flex;gap:8px;font-size:0.75em;margin-top:4px">
        ${c.weaponName ? `<span style="color:#c8a060">🗡 ${c.weaponName}</span>` : ''}
        ${c.armorName ? `<span style="color:#80a0b0">🛡 ${c.armorName}</span>` : ''}
        <span style="color:rgba(200,200,208,0.3)">🎒 ${c.inventoryCount} items</span>
      </div>
      ${talentText ? `<div style="font-size:0.8em;margin-top:2px;color:#c080ff">${talentText}</div>` : ''}
    `
    partyDiv.appendChild(el)
  })

  // Update battle button text
  const battleBtn = $('hub-battle')
  const battleSub = battleBtn.querySelector('.btn-sub')
  if (isBoss) {
    battleBtn.querySelector('.btn-text').textContent = '👑 ¡ENFRENTAR AL JEFE!'
    battleSub.textContent = 'Prepara tus mejores habilidades'
  } else {
    battleBtn.querySelector('.btn-text').textContent = '⚔ Siguiente batalla'
    battleSub.textContent = `Nivel ${msg.currentLevel}`
  }

  // Show talent opportunities
  if (msg.talentOpportunities && msg.talentOpportunities.length > 0) {
    // We'll handle this when we get talent_options from server
  }

  state.campaign = msg
}

$('hub-battle').addEventListener('click', () => {
  hide('campaign-hub')
  send({ type: 'request_battle' })
})

$('hub-shop').addEventListener('click', () => {
  hide('campaign-hub')
  send({ type: 'request_shop' })
})

$('hub-save').addEventListener('click', () => {
  send({ type: 'save_exit_campaign' })
  hide('campaign-hub'); show('menu')
})

// ─── Shop ───
function showShop(msg) {
  show('shop')
  state.shopParty = msg.party
  $('shop-gold').textContent = `💰 ${msg.gold} oro`

  // Buy grid
  const buyGrid = $('shop-buy-grid')
  buyGrid.innerHTML = ''
  if (msg.items.length === 0) {
    buyGrid.innerHTML = '<div style="color:rgba(200,200,208,0.3);text-align:center;padding:20px">No hay items disponibles</div>'
  } else {
    msg.items.forEach((item, idx) => {
      const card = document.createElement('div')
      card.className = 'shop-card'
      card.innerHTML = `
        <div><strong>${item.name}</strong> <span style="font-size:0.7em;color:${rarityColor(item.rarity)}">[${item.rarity}]</span></div>
        <div style="font-size:0.8em;color:rgba(200,200,208,0.5)">${item.description}</div>
        <div style="margin-top:6px">💰 ${item.buyPrice} oro</div>
      `
      card.addEventListener('click', () => {
        const charIdx = prompt('¿Para quién? (0-' + (msg.party.length-1) + '):', '0')
        if (charIdx !== null) {
          send({ type: 'buy_item', shopIndex: idx, charIndex: parseInt(charIdx) })
        }
      })
      buyGrid.appendChild(card)
    })
  }

  // Sell grid
  const sellGrid = $('shop-sell-grid')
  sellGrid.innerHTML = ''
  msg.party.forEach((char, charIdx) => {
    if (char.inventory.length === 0) return
    const charHeader = document.createElement('h4')
    charHeader.textContent = `${char.name} (${char.className})`
    charHeader.style.cssText = 'margin:12px 0 4px;color:#c08060'
    sellGrid.appendChild(charHeader)

    char.inventory.forEach((item, invIdx) => {
      const card = document.createElement('div')
      card.className = 'shop-card'
      card.innerHTML = `
        <div><strong>${item.name}</strong></div>
        <div style="font-size:0.8em;color:rgba(200,200,208,0.5)">${item.description}</div>
        <div style="margin-top:6px;color:#80c080">💰 vender</div>
      `
      card.addEventListener('click', () => {
        send({ type: 'sell_item', charIndex: charIdx, invIndex: invIdx })
      })
      sellGrid.appendChild(card)
    })
  })

  if (sellGrid.children.length === 0) {
    sellGrid.innerHTML = '<div style="color:rgba(200,200,208,0.3);text-align:center;padding:20px">No hay items para vender</div>'
  }
}

function rarityColor(rarity) {
  const map = { common: '#a0a0b0', uncommon: '#40c040', rare: '#4080ff', epic: '#c040c0', legendary: '#ff8000' }
  return map[rarity?.toLowerCase()] || '#a0a0b0'
}

// ─── Talent Select ───
function showTalentSelect(msg) {
  show('talent-select')
  const info = $('talent-info')
  const choices = $('talent-choices')
  choices.innerHTML = ''

  info.textContent = `⭐ ¡${msg.charName} puede elegir un nuevo talento!`

  msg.talents.forEach(t => {
    const btn = document.createElement('button')
    btn.className = 'btn btn-hero'
    btn.style.cssText = 'margin:8px 0;padding:12px'
    btn.innerHTML = `
      <span style="font-size:1em">${t.name}</span>
      <span style="font-size:0.75em;color:rgba(200,200,208,0.5);display:block">${t.description}</span>
    `
    btn.addEventListener('click', () => {
      send({ type: 'select_talent', charIndex: msg.charIndex, talentId: t.id })
    })
    choices.appendChild(btn)
  })
}

// ─── Battle ───
function showBattle(msg) {
  ALL_SCREENS.forEach(id => hide(id))
  hide('result'); hide('campaign-hub')
  show('battle')
  $('action-bar').classList.add('hidden')
  $('submenu').classList.add('hidden')
  $('log').innerHTML = ''
  $('allies').innerHTML = ''
  $('enemies').innerHTML = ''
}

function renderBattleState(msg) {
  $('round-display').textContent = `RONDA ${toRoman(msg.round)}`
  renderBattleTeam('allies', msg.allies, false)
  renderBattleTeam('enemies', msg.enemies, true)

  const logEl = $('log')
  if (msg.log) {
    logEl.innerHTML = msg.log.map(e => {
      let cls = 'log-entry'
      const t = (e.text || '').toLowerCase()
      if (t.includes('crítico')) cls += ' crit'
      else if (t.includes('derrotado')) cls += ' death'
      else if (t.includes('restaurando') || t.includes('recupera')) cls += ' heal'
      else if (t.includes('sufre') || t.includes('buff')) cls += ' buff'
      else if (t.includes('causando') || t.includes('daño')) cls += ' damage'
      else if (t.includes('──') || t.includes('══')) cls += ' system'
      else if (t.includes('defiende') || t.includes('se prepara')) cls += ' buff'
      else if (t.includes('invoca') || t.includes('aparece')) cls += ' summon'
      return `<div class="${cls}">${e.text}</div>`
    }).join('')
    logEl.scrollTop = logEl.scrollHeight
  }

  document.querySelectorAll('.battle-char').forEach(el => {
    el.classList.toggle('active-turn', el.dataset.charId === msg.turnCharId)
  })
}

function renderBattleTeam(containerId, chars) {
  const container = $(containerId)
  container.innerHTML = ''

  chars.forEach(c => {
    if (!c.isAlive && containerId === 'enemies') return

    const el = document.createElement('div')
    el.className = 'battle-char'
    el.dataset.charId = c.instanceId
    if (!c.isAlive) el.classList.add('dead')

    const hpPct = Math.round((c.hp / c.maxHp) * 100)
    const mpPct = Math.round((c.mp / c.maxMp) * 100)
    const hpClass = hpPct < 25 ? 'hp-low' : 'hp'
    const statusText = c.statusEffects && c.statusEffects.length
      ? `<div class="status-effect">✦ ${c.statusEffects.join(' · ')}</div>` : ''
    const defText = c.isDefending ? ' <span class="defending">🛡 DEFENDIENDO</span>' : ''

    const emoji = CLASS_EMOJI[c.id] || (containerId === 'allies' ? '🧙' : '👹')

    el.innerHTML = `
      <div class="char-header">
        <span class="char-name">${emoji} ${c.name}</span>
        <span class="char-level">Lv.${c.level}</span>
      </div>
      <div class="char-class">${c.className}${defText}</div>
      ${statusText}
      <div class="bar-container">
        <div class="bar-fill ${hpClass}" style="width:${hpPct}%"></div>
        <div class="bar-text">${c.hp} / ${c.maxHp}</div>
      </div>
      <div class="bar-container">
        <div class="bar-fill mp" style="width:${mpPct}%"></div>
        <div class="bar-text">${c.mp} / ${c.maxMp}</div>
      </div>
      <div class="details">
        <span>⚔${c.str}</span>
        <span>🛡${c.def}</span>
        <span>✨${c.int}</span>
        <span>🔮${c.res}</span>
        <span>💨${c.spd}</span>
        <span>🎯${c.dex}</span>
      </div>
      ${c.weaponName ? `<div class="equip">🗡 ${c.weaponName}</div>` : ''}
      ${c.armorName ? `<div class="equip">🛡 ${c.armorName}</div>` : ''}
    `

    container.appendChild(el)
  })
}

// ─── Action Bar ───
let currentNeedInput = null

function showActionBar(info) {
  currentNeedInput = info
  $('action-bar').classList.remove('hidden')
  $('submenu').classList.add('hidden')

  const abilityBtn = $('action-bar').querySelector('[data-action="ability"]')
  abilityBtn.style.display = info.availableAbilityIds?.length ? '' : 'none'
  const itemBtn = $('action-bar').querySelector('[data-action="item"]')
  itemBtn.style.display = info.availableItems?.length ? '' : 'none'

  document.querySelectorAll('.targetable').forEach(el => el.classList.remove('targetable'))
}

$('action-bar').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]')
  if (!btn) return
  const action = btn.dataset.action
  hide('action-bar')
  switch (action) {
    case 'attack': showTargetSelection('enemies', { action: 'ATTACK' }); break
    case 'ability': showAbilitySelection(); break
    case 'item': showItemSelection(); break
    case 'defend': submitDecision({ action: 'DEFEND' }); break
  }
})

function showAbilitySelection() {
  const sub = $('submenu')
  sub.classList.remove('hidden')
  sub.innerHTML = '<h3>— SELECCIONA PODER —</h3><div class="sub-choices"></div>'
  const container = sub.querySelector('.sub-choices')

  currentNeedInput.availableAbilityIds.forEach(id => {
    const ab = ABILITY_MAP[id]
    if (!ab) return
    const btn = document.createElement('button')
    btn.className = 'btn btn-sm'
    btn.title = `${ab.desc} (MP: ${ab.mp})`
    btn.innerHTML = `${ab.name} <span style="color:#5a7acc;font-size:0.75em">[MP:${ab.mp}]</span>`
    btn.addEventListener('click', () => {
      if (ab.targetType === 'self') submitDecision({ action: 'ABILITY', abilityId: id, targetId: currentNeedInput.charId })
      else if (ab.targetType === 'all_enemies') submitDecision({ action: 'ABILITY', abilityId: id })
      else if (ab.targetType === 'single_ally') showTargetSelection('allies', { action: 'ABILITY', abilityId: id })
      else showTargetSelection('enemies', { action: 'ABILITY', abilityId: id })
    })
    container.appendChild(btn)
  })

  const back = document.createElement('button')
  back.className = 'btn btn-sm btn-back'
  back.style.cssText = 'background:rgba(40,25,25,0.8);border-color:rgba(100,60,60,0.3);color:#c08080'
  back.textContent = '← Volver'
  back.addEventListener('click', () => { sub.classList.add('hidden'); show('action-bar') })
  container.appendChild(back)
}

function showItemSelection() {
  const sub = $('submenu')
  sub.classList.remove('hidden')
  sub.innerHTML = '<h3>— SELECCIONA OBJETO —</h3><div class="sub-choices"></div>'
  const container = sub.querySelector('.sub-choices')

  currentNeedInput.availableItems.forEach((item, idx) => {
    const btn = document.createElement('button')
    btn.className = 'btn btn-sm'
    btn.textContent = `${item.name} — ${item.description}`
    btn.addEventListener('click', () => submitDecision({ action: 'ITEM', itemIndex: idx }))
    container.appendChild(btn)
  })

  const back = document.createElement('button')
  back.className = 'btn btn-sm btn-back'
  back.style.cssText = 'background:rgba(40,25,25,0.8);border-color:rgba(100,60,60,0.3);color:#c08080'
  back.textContent = '← Volver'
  back.addEventListener('click', () => { sub.classList.add('hidden'); show('action-bar') })
  container.appendChild(back)
}

function showTargetSelection(team, partial) {
  const targets = team === 'enemies' ? currentNeedInput.aliveEnemies : currentNeedInput.aliveAllies
  if (targets.length === 0) { submitDecision({ ...partial, targetId: currentNeedInput.charId }); return }
  const container = team === 'enemies' ? $('enemies') : $('allies')

  container.querySelectorAll('.battle-char').forEach(el => {
    if (targets.some(t => t.instanceId === el.dataset.charId)) el.classList.add('targetable')
  })

  const handler = (e) => {
    const el = e.target.closest('.battle-char')
    if (!el || !el.classList.contains('targetable')) return
    container.querySelectorAll('.targetable').forEach(x => x.classList.remove('targetable'))
    document.removeEventListener('click', handler)
    submitDecision({ ...partial, targetId: el.dataset.charId })
  }

  setTimeout(() => document.addEventListener('click', handler), 50)
}

function submitDecision(decision) {
  $('submenu').classList.add('hidden')
  currentNeedInput = null
  send({ type: 'player_action', decision })
}

// ─── Result ───
function showResult(msg) {
  hide('battle'); hide('action-bar'); hide('submenu')
  show('result')

  const title = $('result-title')
  const details = $('result-details')
  const backMenu = $('back-to-menu')
  const backHub = $('back-to-hub')

  backMenu.classList.add('hidden')
  if (backHub) backHub.classList.add('hidden')

  if (msg.status === 'victory') {
    $('result').className = 'victory'
    title.className = 'victory'
    title.textContent = msg.winner ? `🏆 ¡${msg.winner} TRIUNFA!` : '🏆 ¡VICTORIA!'
    let html = ''
    if (msg.xpEarned) html += `<p>✨ XP total: <strong>+${msg.xpEarned}</strong></p>`
    if (msg.party) {
      msg.party.forEach(p => {
        html += `<p>${p.name} — Nv.${p.level} (${p.xp}/${p.xpToNext} XP)`
        if (p.levelUp?.levels > 0) html += ` ⬆ ${p.levelUp.levels} nivel(es)!`
        html += '</p>'
      })
    }
    if (msg.levels > 0 && !msg.party) html += `<p>⬆ Nivel <strong>${msg.playerLevel}</strong> (${msg.levels} subidas)</p>`
    if (msg.playerXp !== undefined) html += `<p>📊 ${msg.playerXp} / ${msg.playerXpToNext} XP</p>`
    if (msg.goldReward) html += `<p>💰 Oro: <strong>+${msg.goldReward}</strong></p>`
    if (msg.achievements && msg.achievements.length) {
      html += '<p style="margin-top:16px">🏆 LOGROS:</p><div class="achievement-list">'
      const achievementNames = {
        first_blood: 'Primera Sangre', boss_slayer: 'Matarreyes', collector: 'Coleccionista',
        max_level: 'Leyenda', nightmare: 'Pesadilla', crit_master: 'Crítico',
        no_death: 'Invencible', damage_dealer: 'Coloso', healer: 'Sanador', survivor: 'Superviviente',
      }
      msg.achievements.forEach(id => {
        html += `<div style="color:#ffd700;font-size:0.9em;margin:4px 0">✦ ${achievementNames[id] || id}</div>`
      })
      html += '</div>'
    }
    if (msg.loot && msg.loot.length) {
      html += '<p style="margin-top:16px">🎁 BOTÍN:</p><div>'
      msg.loot.forEach((item, idx) => {
        const canEquip = item.isEquippable
        html += `<span class="loot-item" data-loot-idx="${idx}" style="cursor:${canEquip ? 'pointer' : 'default'}">${item.name}</span> `
      })
      html += '</div>'
    }
    html += `<p style="margin-top:16px;color:rgba(200,200,208,0.4);font-size:0.75em">⚔ ${msg.rounds} rondas</p>`
    details.innerHTML = html

    if (msg.isComplete) {
      // Campaign complete
      title.textContent = '🏆 ¡CAMPAÑA COMPLETADA!'
      details.innerHTML = '<h2 style="color:#ffd700">¡Has vencido a todos los jefes y completado la campaña!</h2>'
      backMenu.classList.remove('hidden')
    } else if (msg.party) {
      // Campaign battle
      backHub.classList.remove('hidden')
    } else {
      backMenu.classList.remove('hidden')
    }
  } else {
    $('result').className = 'defeat'
    title.className = 'defeat'
    if (msg.isNightmare) {
      title.textContent = '💀 PERMA-DEATH'
      details.innerHTML = '<p>Tu partida ha sido borrada...</p><p>La pesadilla te ha consumido.</p>'
      backMenu.classList.remove('hidden')
    } else {
      title.textContent = '💀 CAÍSTE EN BATALLA'
      details.innerHTML = `<p>Los dioses no estaban de tu lado...</p><p style="margin-top:16px;color:rgba(200,200,208,0.4);font-size:0.75em">⚔ ${msg.rounds} rondas</p>`
      if (msg.party) {
        backHub.classList.remove('hidden')
      } else {
        backMenu.classList.remove('hidden')
      }
    }
  }
}

function toRoman(n) {
  if (n > 10) return String(n)
  const map = { 10:'X',9:'IX',5:'V',4:'IV',1:'I' }
  let result = ''
  for (const [k,v] of Object.entries(map)) {
    while (n >= k) { result += v; n -= k }
  }
  return result
}

// ─── WebSocket message handler ───
function handleMessage(msg) {
  switch (msg.type) {
    case 'connected':
      state.sessionId = msg.sessionId
      state.characters = msg.characters
      // Update campaign load button
      break
    case 'battle_start':
      if (msg.playerId) state.playerId = msg.playerId
      showBattle(msg)
      break
    case 'battle_state':
      renderBattleState(msg)
      break
    case 'need_input':
      showActionBar(msg)
      break
    case 'battle_result':
      showResult(msg)
      break
    case 'campaign_battle_result':
      showResult(msg)
      break
    case 'campaign_hub':
      showCampaignHub(msg)
      // Check for talent opportunities
      if (msg.talentOpportunities && msg.talentOpportunities.length > 0) {
        // For now, talents are shown in hub but selection handled later
      }
      break
    case 'shop_data':
      showShop(msg)
      break
    case 'shop_bought':
      alert(msg.message)
      send({ type: 'request_shop' })
      break
    case 'shop_sold':
      alert(msg.message)
      send({ type: 'request_shop' })
      break
    case 'shop_error':
      alert(msg.message)
      break
    case 'item_equipped':
      alert(msg.message)
      send({ type: 'request_shop' })
      break
    case 'talent_options':
      showTalentSelect(msg)
      break
    case 'talent_applied':
      alert(msg.message)
      hide('talent-select')
      sendCampaignHubRequest()
      break
    case 'campaign_saved':
      // Do nothing, already showed menu
      break
    case 'error':
      alert('Error: ' + msg.message)
      break
  }
}

connect()
