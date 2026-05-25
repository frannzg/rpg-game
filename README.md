# ⚔ Ragnarok Terminal — RPG por Turnos

Juego RPG por turnos que se ejecuta tanto en **terminal** como en **navegador web**. Construido con TypeScript, con un sistema de combate completo, 7 clases de personajes, 20 niveles de campaña con jefes, objetos, talentos, y más.

---

## 🎮 Modos de Juego

### Campaña (20 niveles)
- Escoge 3 personajes para formar tu grupo
- 3 dificultades: **Normal**, **Difícil** (+25% enemigos, +50% XP), **Pesadilla** (+50% enemigos, +100% XP, permadeath)
- 20 niveles con enemigos escalados, jefes cada 5 niveles
- Tienda entre batallas para comprar/vender equipo
- Subes de nivel y aprendes talentos cada 5 niveles
- Al perder en Pesadilla, la partida se borra permanentemente

### Jugador vs CPU (PvE)
- Elige tu campeón y enfréntate a 1-3 enemigos controlados por IA
- Ganas XP, loot y subes de nivel

### Duelo de Campeones (PvP local)
- Dos jugadores en el mismo teclado/pantalla eligen sus campeones
- Combate por turnos controlado por ambos jugadores

### Supervivencia
- Oleadas infinitas de enemigos cada vez más fuertes
- Solo un personaje contra el mundo
- Recuperas 30% HP/MP entre oleadas
- ¿Cuántas oleadas puedes sobrevivir?

---

## 🧙 Clases de Personajes

| Clase | HP | MP | STR | DEF | INT | RES | SPD | DEX | Descripción |
|-------|----|----|-----|-----|-----|-----|-----|-----|-------------|
| **Guerrero** | 120 | 30 | 18 | 14 | 4 | 6 | 7 | 8 | Robusto, gran resistencia y fuerza bruta |
| **Mago** | 70 | 80 | 3 | 5 | 20 | 14 | 10 | 6 | Maestro arcano, frágil pero letal |
| **Pícaro** | 85 | 45 | 12 | 7 | 6 | 6 | 18 | 14 | Astuto, golpes rápidos y veneno |
| **Paladín** | 110 | 50 | 14 | 14 | 10 | 14 | 6 | 7 | Campeón divino, protege y cura |
| **Arquero** | 75 | 40 | 10 | 6 | 5 | 7 | 14 | 20 | Tirador de élite, ataques a distancia |
| **Berserker** | 90 | 20 | 22 | 8 | 3 | 5 | 12 | 10 | Frenético, más daño mientras menos HP |
| **Druida** | 90 | 65 | 6 | 8 | 17 | 12 | 9 | 7 | Guardián natural, invoca lobo y cura |

### Habilidades por Clase

**Guerrero:** Golpe Poderoso (1.8x), Postura Defensiva (DEF+50%), Grito de Guerra (STR+25% equipo), Tajo Giratorio (todos los enemigos)

**Mago:** Bola de Fuego (2.0x + quemadura), Escarcha (1.3x + ralentiza), Rayo (todos los enemigos), Curar (restaura 40% HP)

**Pícaro:** Golpe Sombra (1.4x + 50% crítico), Envenenar (veneno 4 turnos), Doble Golpe (2 golpes al 70%), Evasión (DEX+80%)

**Paladín:** Golpe Sagrado (1.5x sagrado), Escudo Protector (DEF/RES+40%), Curación Divina (restaura 60% HP), Barrera de Luz (reduce daño equipo)

**Arquero:** Disparo Preciso (1.6x + 30% crítico), Lluvia de Flechas (todos), Disparo Penetrante (ignora 60% DEF), Ojo de Águila (DEX+50%)

**Berserker:** Furia (STR+50%), Golpe Sangriento (2.2x + consume 10% HP), Tajo Salvaje (todos), Berreo (STR+30% equipo)

**Druida:** Curación Natural (restaura 50% HP), Espinas (refleja 20% daño), Invocar Lobo (4 turnos), Tormenta (todos, eléctrico)

---

## ⚔ Sistema de Combate

- **Por turnos** basado en velocidad (SPD)
- Fórmula de daño físico: `ATK * 5 * varianza(0.9-1.1)` — reducido por `DEF * (100/(100+DEF))`
- Fórmula de daño mágico: `INT * poder * 8 * varianza` — reducido por `RES + resistencia elemental`
- Golpes críticos: probabilidad `DEX/150`, daño x1.8
- Berserker: pierde 5% HP máximo por ataque básico
- Defensa: reduce daño recibido 50% por ese turno
- Máximo 50 rondas por batalla (empate = derrota)

### Sistema Elemental

| Ataque ↴ | Ventaja vs → |
|----------|-------------|
| Fuego | Hielo (1.3x) |
| Hielo | Tierra (1.3x) |
| Tierra | Rayo (1.3x) |
| Rayo | Fuego (1.3x) |
| Sagrado | Sombra (1.3x) |
| Sombra | Sagrado (1.3x) |

- Desventaja: 0.7x contra el elemento que le resiste
- Las armaduras pueden otorgar resistencias elementales

### Efectos de Estado

- **Quemadura** 🔥 — Daño de fuego por turno (5% HP)
- **Veneno** ☠️ — Daño por turno (8% HP)
- **Lento** ❄️ — SPD -30%
- **DEF+/RES+** 🛡️ — Modificadores de stats por varios turnos
- **Espinas** 🌿 — Refleja 20% de daño recibido

### Mascotas Invocadas

- El Druida puede invocar un **Lobo Ancestral** que lucha 4 turnos
- El talento **Compañero** aumenta HP/STR del lobo en 50%
- Las mascotas tienen su propio turno basado en SPD

---

## 🎒 Objetos y Equipo

### Tipos
- **Armas** 🗡️ — Aumentan STR/DEX/INT según clase
- **Armaduras** 🛡️ — Aumentan DEF/RES y pueden dar resistencias elementales
- **Consumibles** 🧪 — Pociones de vida/maná, elixires de batalla

### Rarezas
| Rareza | Multiplicador | Color |
|--------|:------------:|-------|
| Común | 1x | Gris |
| Poco Común | 1.5x | Verde |
| Raro | 2.5x | Azul |
| Épico | 4x | Púrpura |
| Legendario | 8x | Dorado |

### Tienda
- Inventario generado según nivel del grupo y clases disponibles
- Precios variables (±20%) con multiplicador por rareza
- Venta al 30% del precio base (ajustado por rareza)

---

## ⭐ Sistema de Talentos

Cada 5 niveles (5, 10, 15, 20) puedes elegir 1 talento de un pool específico por clase:

| Clase | Talentos disponibles |
|-------|---------------------|
| Guerrero | Muro de Acero (DEF+5/RES+3), Furia Imparable (STR+5/SPD+2), Veteranía (MaxHP+40/DEF+2) |
| Mago | Maestría Arcana (INT+5/MaxMP+20), Canalizar (MaxMP+40), Sabiduría (INT+3/RES+5) |
| Pícaro | Sombra Letal (DEX+5/SPD+3), Veneno Potente (STR+4), Esquivo (SPD+5/DEX+3) |
| Paladín | Fe Inquebrantable (RES+5/MaxHP+30), Justicia Divina (STR+4), Protector (DEF+5) |
| Arquero | Puntería Infalible (DEX+6), Lluvia Mortal (SPD+4), Ojo de Lince (DEX+4/STR+3) |
| Berserker | Sede de Sangre (recupera 20% HP al matar), Rabia (STR+6/DEF-2), Inquebrantable (resucita 1 vez) |
| Druida | Compañero (lobo +50% HP/STR), Naturaleza (cura +30%/tormenta +20%), Escudo Verde (RES+5) |

---

## 🏆 Logros

| Logro | Requisito |
|-------|-----------|
| Primera Sangre | Gana tu primera batalla |
| Matarreyes | Derrota tu primer jefe |
| Coleccionista | Consigue 10 items distintos |
| Leyenda | Alcanza nivel 20 con un personaje |
| Pesadilla | Completa la campaña en Pesadilla |
| Crítico | 100 golpes críticos |
| Invencible | Completa la campaña sin derrotas |
| Coloso | Inflige 10,000 de daño total |
| Sanador | Cura 5,000 HP total |
| Superviviente | Completa la campaña completa |

---

## 🧠 Sistema de IA

Los enemigos controlados por IA siguen estas prioridades:
1. Si HP < 50% y tiene curación, se cura a sí mismo
2. Si hay aliados con HP < 40%, los cura
3. Si HP < 30%, usa objeto curativo o se defiende
4. 50% probabilidad de usar habilidad disponible
5. Por defecto, ataca al enemigo más débil

---

## 🏗️ Arquitectura del Proyecto

```
rpg-terminal/
├── src/
│   ├── types/index.ts          # Tipos, enums, interfaces (Stats, Ability, Item, etc.)
│   ├── data/                   # Datos estáticos del juego
│   │   ├── abilities.ts        # 28 habilidades + summon
│   │   ├── campaign.ts         # 20 niveles de campaña
│   │   ├── characters.ts       # 7 plantillas de personajes
│   │   ├── items.ts            # 35+ items (armas, armaduras, consumibles)
│   │   └── talents.ts          # 21 talentos clasificados
│   ├── models/                 # Clases del núcleo
│   │   ├── Character.ts        # Stats, equipo, inventario, efectos, nivel
│   │   ├── Item.ts             # Datos de item con restricciones
│   │   └── classes/index.ts    # Fábrica de personajes
│   ├── systems/                # Sistemas del juego
│   │   ├── CombatSystem.ts     # Motor de combate por turnos (500+ líneas)
│   │   ├── AISystem.ts         # Decisiones de IA para enemigos
│   │   ├── CampaignManager.ts  # Gestión de campaña, guardado/carga
│   │   ├── LevelSystem.ts      # Cálculo de XP y subida de nivel
│   │   ├── LootSystem.ts       # Generación de botín
│   │   ├── ShopSystem.ts       # Tienda con compra/venta
│   │   ├── SaveManager.ts      # Persistencia JSON (archivo + localStorage)
│   │   └── AchievementSystem.ts# Sistema de logros
│   ├── terminal/               # Interfaz de terminal
│   │   ├── index.ts            # Menú principal, campaña, PvE, PvP, supervivencia
│   │   └── TerminalAdapter.ts  # Adaptador de combate interactivo con inquirer
│   ├── ui/                     # Componentes visuales
│   │   ├── colors.ts           # Paleta de colores y helpers
│   │   ├── renderer.ts         # Renderizado de victoria/derrota/loot
│   │   └── components/
│   │       ├── BattleHUD.ts    # HUD de combate con stats
│   │       ├── HealthBar.ts    # Barras de HP/MP
│   │       └── Log.ts          # Registro de batalla
│   └── web/                    # Interfaz web
│       ├── server.ts           # Express + WebSocket server
│       ├── GameSession.ts      # Sesión WebSocket con manejo de mensajes
│       └── public/
│           ├── index.html      # 235 líneas de HTML semántico
│           ├── styles.css      # 987 líneas de CSS con animaciones
│           └── app.js          # 899 líneas de JS vanilla
├── copy-public.mjs             # Script para copiar assets web al dist
├── tsconfig.json               # TypeScript ES2022/ESNext/bundler
└── package.json                # Dependencias y scripts
```

---

## 🚀 Instalación y Ejecución

```bash
# Requisitos: Node.js 18+

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Modo terminal
npm start

# Modo terminal con recarga (build + ejecución)
npm run dev

# Modo web (navegador en http://localhost:3000)
npm run web

# Modo web con recarga
npm run dev:web
```

### Dependencias

**Producción:**
- `inquirer` ^12.4.2 — Menús interactivos en terminal
- `picocolors` ^1.1.1 — Colores ANSI en terminal
- `express` ^5.2.1 — Servidor web
- `ws` ^8.21.0 — WebSockets para comunicación en tiempo real

**Desarrollo:**
- `typescript` ^5.7.3
- `@types/node`, `@types/express`, `@types/inquirer`, `@types/ws`

---

## 💾 Persistencia

- Las partidas se guardan en `~/.rpg-terminal/save_0.json` (Linux/Mac) o en `localStorage` (Web)
- Slot único por defecto (3 slots disponibles en `SaveManager`)
- Formato JSON completo con todo el estado del grupo
- En dificultad Pesadilla, perder borra la partida (permadeath)

---

## 🔌 API WebSocket (Frontend Web)

El frontend web se comunica con el servidor mediante mensajes JSON sobre WebSocket:

| Mensaje (cliente → servidor) | Descripción |
|------------------------------|-------------|
| `start_pve` | Inicia PvE con personaje y enemigos |
| `start_pvp` | Inicia duelo PvP |
| `start_campaign` | Nueva campaña con grupo y dificultad |
| `load_campaign` | Carga partida guardada |
| `request_battle` | Solicita siguiente batalla de campaña |
| `request_shop` | Abre la tienda |
| `player_action` | Envía decisión del jugador (ataque/habilidad/item/defensa) |
| `buy_item` / `sell_item` | Compra/venta en tienda |
| `equip_item` | Equipa un item del inventario |

| Mensaje (servidor → cliente) | Descripción |
|------------------------------|-------------|
| `connected` | Confirmación de conexión con datos de personajes |
| `battle_start` | Inicio de batalla |
| `battle_state` | Estado actualizado de la batalla (stats, logs) |
| `need_input` | Solicita decisión al jugador (habilidades disponibles, objetivos) |
| `battle_result` | Resultado final (victoria/derrota, XP, loot) |
| `campaign_hub` | Estado del hub de campaña (grupo, nivel, oro) |
| `shop_data` | Datos de la tienda (items, precios) |

---

## 🧪 Estructura de Tipos Clave

```typescript
// Estadísticas base de personajes
interface Stats { hp, maxHp, mp, maxMp, str, def, int, res, spd, dex }

// Habilidad
interface Ability {
  id, name, description, mpCost, power, statKey,
  targetType: SINGLE_ENEMY | ALL_ENEMIES | SELF | SINGLE_ALLY | ALL_ALLIES,
  element: PHYSICAL | FIRE | ICE | LIGHTNING | EARTH | HOLY | SHADOW,
  statusEffect?, hitCount?
}

// Decisión del jugador en combate
interface PlayerDecision {
  action: ATTACK | ABILITY | ITEM | DEFEND,
  targetId?, abilityId?, itemIndex?
}

// Estado completo de batalla
interface BattleState {
  round, allies: CharSnapshot[], enemies: CharSnapshot[],
  log: LogEntry[], status: ONGOING | VICTORY | DEFEAT, turnCharId?
}
```

---

## 📜 Licencia

MIT — Proyecto personal desarrollado en TypeScript.
