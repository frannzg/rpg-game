# RPG Terminal Agent

Eres un agente experto en el proyecto **Ragnarok Terminal RPG**, un juego RPG por turnos en TypeScript que corre en terminal y en web.

## Stack Tecnológico
- **Lenguaje:** TypeScript (ES2022, ESNext modules)
- **Runtime:** Node.js 18+
- **Terminal:** inquirer (menús interactivos), picocolors (colores ANSI)
- **Web:** Express 5, ws (WebSockets), vanilla HTML/CSS/JS
- **Frontend Web:** Sin frameworks — HTML + CSS + JavaScript vanilla, WebSocket para comunicación en tiempo real

## Convenciones de Código
- **Sin comentarios** en producción (salvo JSDoc en interfaces públicas)
- Nombres en español para datos del juego (habilidades, personajes, items)
- Nombres en inglés para código técnico (sistemas, modelos, tipos)
- Usar enums de TypeScript para categorías fijas (CharacterClass, ItemType, etc.)
- Los tipos se definen en `src/types/index.ts`
- Los datos estáticos van en `src/data/` (abilities, items, characters, talents, campaign)
- La lógica de negocio va en `src/systems/`
- Los modelos del dominio van en `src/models/`
- La UI de terminal va en `src/terminal/` y `src/ui/`
- La UI web va en `src/web/`

## Arquitectura del Proyecto
```
src/
├── types/index.ts        → Todos los tipos, interfaces y enums compartidos
├── data/                 → Datos estáticos (habilidades, items, personajes, talentos, campaña)
├── models/               → Clases del dominio (Character, Item, classes factory)
├── systems/              → Sistemas del juego (Combat, AI, Campaign, Level, Loot, Shop, Save, Achievement)
├── terminal/             → Interfaz de línea de comandos
├── ui/                   → Componentes visuales compartidos (terminal)
└── web/                  → Servidor web, sesiones WebSocket, frontend público
```

## Patrones Clave

### Sistema de Combate (`src/systems/CombatSystem.ts`)
- Motor asíncrono con `async/await` para esperar decisiones del jugador
- Usa `Promise` + callback `decisionResolver` para pausar el flujo
- `onNeedInput` y `onBattleState` son callbacks para la UI
- El orden de turnos se calcula por SPD (mayor primero)
- Los personajes que no controla el jugador usan IA (`AISystem.decideAIAction`)

### Sistema de Campaña (`src/systems/CampaignManager.ts`)
- Singleton-like, estado mutable en `CampaignState`
- Método `loadFromSave()` restaura estado desde `SaveGame`
- Los enemigos se escalan según nivel actual de campaña y dificultad

### Guardado (`src/systems/SaveManager.ts`)
- Guarda en archivo JSON (`~/.rpg-terminal/save_N.json`) o `localStorage` (web)
- 3 slots disponibles

### WebSocket (`src/web/GameSession.ts`)
- Protocolo JSON asíncrono request/response
- Un `GameSession` por conexión WebSocket
- Maneja mensajes como `start_pve`, `player_action`, `request_battle`
- El frontend (`app.js`) es vanilla JS sin frameworks

## Cómo Añadir Nuevo Contenido

### Nueva Clase de Personaje
1. Añadir entrada a `CharacterClass` enum en `types/index.ts`
2. Añadir template en `src/data/characters.ts` (stats, habilidades, equipo inicial, loot)
3. Añadir habilidades en `src/data/abilities.ts`
4. Añadir talentos en `src/data/talents.ts` + `TALENT_POOLS`
5. Añadir items iniciales en `src/data/items.ts`
6. Añadir mapeo CSS en `src/web/public/styles.css` (`.class-Nombre`)
7. Añadir mapeo en `src/web/public/app.js` (`CLASS_MAP`, `CLASS_EMOJI`, `CHAR_ABILITIES`, `CHAR_STATS`)

### Nueva Habilidad
1. Añadir entrada en `abilities` record en `src/data/abilities.ts`
2. Si es heal: implementar en `executeAbility()` en `CombatSystem.ts`
3. Si es summon: implementar lógica de mascota en `CombatSystem.ts` y `SummonedPet`
4. Añadir mapeo en `ABILITY_MAP` en `app.js` (frontend web)

### Nuevo Item
1. Añadir entrada en `itemDatabase` record en `src/data/items.ts`
2. Si tiene efecto especial, implementar en `executeItem()` en `CombatSystem.ts`

## Comandos
- `npm run build` — Compila TypeScript a `dist/`
- `npm start` — Ejecuta el juego en terminal
- `npm run dev` — Build + ejecución terminal
- `npm run web` — Ejecuta servidor web en `http://localhost:3000`
- `npm run dev:web` — Build + servidor web
