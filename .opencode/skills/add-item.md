# Añadir Nuevo Item

Guía para agregar nuevos items (armas, armaduras, consumibles) al juego.

## Pasos

### 1. Definir datos en `src/data/items.ts`
Añadir entrada al record `itemDatabase`:

**Arma:**
```typescript
mi_arma: {
  id: 'mi_arma', name: 'Mi Espada', description: 'Una espada legendaria',
  type: ItemType.WEAPON, slot: EquipSlot.WEAPON,
  stats: { str: 15 },   // Stats que otorga al equipar
  price: 300, rarity: Rarity.RARE,
  classRestriction: [CharacterClass.WARRIOR],
}
```

**Armadura:**
```typescript
mi_armadura: {
  id: 'mi_armadura', name: 'Mi Armadura', description: 'Protección mística',
  type: ItemType.ARMOR, slot: EquipSlot.ARMOR,
  stats: { def: 12, res: 8 },
  price: 350, rarity: Rarity.UNCOMMON,
  elementalResistance: { [Element.FIRE]: 15 },  // Resistencia elemental
}
```

**Consumible:**
```typescript
mi_pocion: {
  id: 'mi_pocion', name: 'Poción Misteriosa', description: 'Efecto desconocido',
  type: ItemType.CONSUMABLE,
  price: 50, rarity: Rarity.UNCOMMON,
  healAmount: 60,        // Curación
  mpRestore: 30,         // Restauración de MP
  effect: { str: 5 },    // Buff para toda la batalla (opcional)
  duration: 1,           // Duración del buff
}
```

### 2. Añadir al loot table (opcional)
En `src/data/characters.ts`, añadir a `loot` del template:
```typescript
loot: [
  { itemId: 'mi_arma', chance: 0.1 },  // 10% de probabilidad
]
```

### 3. Implementar efectos especiales (si es necesario)
Si el item tiene un efecto único, implementar en `executeItem()` en `src/systems/CombatSystem.ts`

### Campos disponibles en `ItemData`
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id` | string | ✅ | Identificador único |
| `name` | string | ✅ | Nombre mostrado |
| `description` | string | ✅ | Descripción |
| `type` | ItemType | ✅ | WEAPON, ARMOR, o CONSUMABLE |
| `slot` | EquipSlot | Para WEAPON/ARMOR | WEAPON o ARMOR |
| `stats` | Partial\<Stats\> | No | Bonus de stats al equipar |
| `price` | number | ✅ | Precio base |
| `rarity` | Rarity | No | COMMON por defecto |
| `classRestriction` | CharacterClass[] | No | Clases que pueden equiparlo |
| `healAmount` | number | No | HP que restaura (consumible) |
| `mpRestore` | number | No | MP que restaura (consumible) |
| `effect` | Modifiers | No | Buff permanente de batalla |
| `duration` | number | No | Duración del buff (turnos) |
| `elementalResistance` | Partial\<Record\<Element, number\>\> | No | Resistencia elemental |

### Rarezas disponibles
`COMMON`, `UNCOMMON`, `RARE`, `EPIC`, `LEGENDARY`
