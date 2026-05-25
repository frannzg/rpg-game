# Añadir Nueva Clase de Personaje

Guía paso a paso para agregar una nueva clase jugable al RPG Terminal.

## Pasos

### 1. Añadir el enum en `src/types/index.ts`
```typescript
export enum CharacterClass {
  // ... existing classes ...
  YOUR_CLASS = 'NombreClase',
}
```

### 2. Crear plantilla en `src/data/characters.ts`
Añadir un objeto `CharacterTemplate` al array `characterTemplates`:
```typescript
{
  id: 'tu_clase',
  name: 'Tu Clase',
  className: CharacterClass.YOUR_CLASS,
  description: 'Descripción de la clase...',
  baseStats: { hp: 100, maxHp: 100, mp: 40, maxMp: 40, str: 10, def: 10, int: 10, res: 10, spd: 10, dex: 10 },
  abilityIds: ['habilidad1', 'habilidad2', 'habilidad3', 'habilidad4'],
  weaponId: 'arma_inicial',
  armorId: 'armadura_inicial',
  loot: [{ itemId: 'pocion_vida', chance: 0.5 }],
  xpReward: 50,
}
```

### 3. Añadir habilidades en `src/data/abilities.ts`
Añadir 4 habilidades al record `abilities`:
```typescript
tu_habilidad: {
  id: 'tu_habilidad', name: 'Tu Habilidad', description: 'Descripción',
  mpCost: 10, power: 1.5, statKey: 'str',
  targetType: TargetType.SINGLE_ENEMY, element: Element.PHYSICAL,
}
```

### 4. Añadir talentos en `src/data/talents.ts`
Añadir 3 talentos al record `talents` y registrarlos en `TALENT_POOLS`:
```typescript
tu_talento: { id: 'tu_talento', name: 'Tu Talento', description: 'desc', statModifiers: { str: 5 } }
```
```typescript
TALENT_POOLS: {
  // ...
  tu_clase: [['talento1', 'talento2', 'talento3']],
}
```

### 5. Añadir items iniciales en `src/data/items.ts`
Añadir arma y armadura inicial con `classRestriction: [CharacterClass.YOUR_CLASS]`

### 6. Añadir CSS en `src/web/public/styles.css`
```css
.class-TuClase { background: rgba(x,x,x,0.25); color: #xxxxxx; border: 1px solid rgba(x,x,x,0.3); }
```

### 7. Añadir mapeos en `src/web/public/app.js`
- `CLASS_MAP`: `tu_clase: 'TuClase'`
- `CLASS_EMOJI`: `tu_clase: '🔮'`
- `CHAR_ABILITIES`: `tu_clase: ['hab1','hab2','hab3','hab4']`
- `CHAR_STATS`: `tu_clase: { hp: 100, mp: 40, ... }`

### 8. Añadir descripción en `src/web/GameSession.ts`
En el mensaje `connected`, añadir entrada a `characters` array.
