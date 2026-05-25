# Añadir Nueva Habilidad

Guía para agregar una nueva habilidad a una clase existente o nueva.

## Pasos

### 1. Definir datos en `src/data/abilities.ts`
Añadir entrada al record `abilities`:
```typescript
mi_habilidad: {
  id: 'mi_habilidad',
  name: 'Mi Habilidad',
  description: 'Una habilidad poderosa',
  mpCost: 12,
  power: 1.8,                     // Multiplicador de daño (0 = sin daño directo)
  statKey: 'int',                  // Stat base: str | int | dex | def | res | spd
  targetType: TargetType.SINGLE_ENEMY,  // SINGLE_ENEMY | ALL_ENEMIES | SELF | SINGLE_ALLY | ALL_ALLIES
  element: Element.FIRE,
  // Opcionales:
  statusEffect?: { id, name, description, duration, statModifiers, damagePerTurn? }
  hitCount?: 2,                    // Ataques múltiples
  hitsMultiple?: true,
}
```

### 2. Implementar lógica (si es necesario)
- Si es una **curación**: la lógica automática detecta `targetType === SINGLE_ALLY && power > 0`
- Si es un **summon** (invocar mascota): añadir caso `ability.id === 'invocar_lobo'` en `executeAbility()` de `CombatSystem.ts`
- Si la habilidad tiene efecto especial único, añadir lógica en `executeAbility()`

### 3. Vincular a un personaje
Añadir el `id` de la habilidad al array `abilityIds` del template en `src/data/characters.ts`

### 4. Añadir al frontend web en `src/web/public/app.js`
Añadir entrada en `ABILITY_MAP`:
```javascript
mi_habilidad: { name: 'Mi Habilidad', targetType: 'single_enemy', desc: 'Descripción', mp: 12 }
```
Y en `CHAR_ABILITIES` de la clase correspondiente.

### Tipos de target
- `single_enemy` → pide seleccionar objetivo enemigo
- `all_enemies` → se aplica a todos los enemigos automáticamente
- `self` → se aplica al usuario directamente
- `single_ally` → pide seleccionar aliado
- `all_allies` → se aplica a todos los aliados
