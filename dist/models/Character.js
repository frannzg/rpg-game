import { EquipSlot } from '../types/index.js';
import { abilities } from '../data/abilities.js';
import { itemDatabase } from '../data/items.js';
import { talents } from '../data/talents.js';
import { Item } from './Item.js';
export class Character {
    static nextId = 1;
    id;
    instanceId;
    name;
    className;
    description;
    level = 1;
    xp = 0;
    xpToNext = 100;
    gold = 0;
    baseStats;
    currentStats;
    statusEffects = [];
    isDefending = false;
    isAlive = true;
    abilityIds;
    lootTable;
    xpReward;
    equippedWeapon;
    equippedArmor;
    inventory = [];
    battleBuffs = {};
    talents = [];
    elementalResistance = {};
    damageThisBattle = 0;
    healingThisBattle = 0;
    constructor(template) {
        this.id = template.id;
        this.instanceId = `${template.id}_${Character.nextId++}`;
        this.name = template.name;
        this.className = template.className;
        this.description = template.description;
        this.baseStats = { ...template.baseStats };
        this.currentStats = { ...template.baseStats };
        this.abilityIds = [...template.abilityIds];
        this.lootTable = [...template.loot];
        this.xpReward = template.xpReward;
        const weaponData = itemDatabase[template.weaponId];
        const armorData = itemDatabase[template.armorId];
        this.equippedWeapon = weaponData ? new Item(weaponData) : null;
        this.equippedArmor = armorData ? new Item(armorData) : null;
    }
    getAbilities() {
        return this.abilityIds
            .map(id => abilities[id])
            .filter(Boolean);
    }
    getEffectiveStats() {
        const s = { ...this.currentStats };
        if (this.equippedWeapon?.stats) {
            for (const [key, val] of Object.entries(this.equippedWeapon.stats)) {
                const k = key;
                if (typeof val === 'number')
                    s[k] = s[k] + val;
            }
        }
        if (this.equippedArmor?.stats) {
            for (const [key, val] of Object.entries(this.equippedArmor.stats)) {
                const k = key;
                if (typeof val === 'number')
                    s[k] = s[k] + val;
            }
        }
        for (const effect of this.statusEffects) {
            const mods = effect.statModifiers;
            for (const [key, val] of Object.entries(mods)) {
                const k = key;
                if (typeof val === 'number')
                    s[k] = Math.round(s[k] * (1 + val));
            }
        }
        for (const [key, val] of Object.entries(this.battleBuffs)) {
            const k = key;
            if (typeof val === 'number')
                s[k] = s[k] + val;
        }
        for (const talentId of this.talents) {
            const talent = talents[talentId];
            if (talent) {
                for (const [key, val] of Object.entries(talent.statModifiers)) {
                    const k = key;
                    if (typeof val === 'number')
                        s[k] = s[k] + val;
                }
            }
        }
        if (this.equippedArmor?.elementalResistance) {
            for (const [elem, val] of Object.entries(this.equippedArmor.elementalResistance)) {
                this.elementalResistance[elem] = val;
            }
        }
        s.maxHp = this.currentStats.maxHp;
        s.maxMp = this.currentStats.maxMp;
        if (s.hp > s.maxHp)
            s.hp = s.maxHp;
        if (s.mp > s.maxMp)
            s.mp = s.maxMp;
        return s;
    }
    getElementalResistance(element) {
        return this.elementalResistance[element] || 0;
    }
    takeDamage(amount) {
        const effectiveStats = this.getEffectiveStats();
        let reduced = Math.max(1, Math.round(amount * (100 / (100 + effectiveStats.def))));
        if (this.isDefending) {
            reduced = Math.round(reduced * 0.5);
            this.isDefending = false;
        }
        this.currentStats.hp = Math.max(0, this.currentStats.hp - reduced);
        if (this.currentStats.hp <= 0) {
            this.isAlive = false;
            this.currentStats.hp = 0;
        }
        return reduced;
    }
    takeMagicDamage(amount, element) {
        let effectiveStats = this.getEffectiveStats();
        let resistance = element ? this.getElementalResistance(element) : 0;
        let reduced = Math.max(1, Math.round(amount * (100 / (100 + effectiveStats.res + resistance))));
        if (this.isDefending) {
            reduced = Math.round(reduced * 0.5);
            this.isDefending = false;
        }
        this.currentStats.hp = Math.max(0, this.currentStats.hp - reduced);
        if (this.currentStats.hp <= 0) {
            this.isAlive = false;
            this.currentStats.hp = 0;
        }
        return reduced;
    }
    heal(amount) {
        const before = this.currentStats.hp;
        this.currentStats.hp = Math.min(this.currentStats.maxHp, this.currentStats.hp + amount);
        return this.currentStats.hp - before;
    }
    restoreMp(amount) {
        const before = this.currentStats.mp;
        this.currentStats.mp = Math.min(this.currentStats.maxMp, this.currentStats.mp + amount);
        return this.currentStats.mp - before;
    }
    addStatusEffect(effect) {
        const existing = this.statusEffects.find(e => e.id === effect.id);
        if (existing)
            existing.duration = effect.duration;
        else
            this.statusEffects.push({ ...effect });
    }
    processStatusEffects() {
        const messages = [];
        let totalDamage = 0;
        for (const effect of this.statusEffects) {
            if (effect.damagePerTurn) {
                const dmg = Math.round(effect.damagePerTurn * (this.currentStats.maxHp / 100));
                this.currentStats.hp = Math.max(0, this.currentStats.hp - dmg);
                totalDamage += dmg;
                if (this.currentStats.hp <= 0) {
                    this.isAlive = false;
                    this.currentStats.hp = 0;
                }
                messages.push(`${this.name} recibe ${dmg} de daño por ${effect.name}`);
            }
            effect.duration--;
        }
        this.statusEffects = this.statusEffects.filter(e => e.duration > 0);
        return { damage: totalDamage, messages };
    }
    addXp(amount) {
        this.xp += amount;
        let levelsGained = 0;
        while (this.xp >= this.xpToNext) {
            this.xp -= this.xpToNext;
            this.levelUp();
            levelsGained++;
        }
        return levelsGained;
    }
    levelUp() {
        this.level++;
        this.xpToNext = Math.round(this.level * 100 + Math.pow(this.level - 1, 2) * 50);
        const growth = {
            maxHp: Math.round(this.currentStats.maxHp * 0.08 + 3),
            maxMp: Math.round(this.currentStats.maxMp * 0.06 + 2),
            str: Math.round(this.currentStats.str * 0.05 + 1),
            def: Math.round(this.currentStats.def * 0.05 + 1),
            int: Math.round(this.currentStats.int * 0.05 + 1),
            res: Math.round(this.currentStats.res * 0.05 + 1),
            spd: Math.round(this.currentStats.spd * 0.04 + 1),
            dex: Math.round(this.currentStats.dex * 0.04 + 1),
        };
        for (const [key, val] of Object.entries(growth)) {
            if (typeof val === 'number') {
                this.baseStats[key] = (this.baseStats[key] || 0) + val;
                this.currentStats[key] = (this.currentStats[key] || 0) + val;
            }
        }
        this.currentStats.hp = this.currentStats.maxHp;
        this.currentStats.mp = this.currentStats.maxMp;
    }
    equipItem(item) {
        if (!item.canEquip(this.className))
            return false;
        if (item.slot === EquipSlot.WEAPON) {
            if (this.equippedWeapon)
                this.inventory.push(this.equippedWeapon);
            this.equippedWeapon = item;
            return true;
        }
        if (item.slot === EquipSlot.ARMOR) {
            if (this.equippedArmor)
                this.inventory.push(this.equippedArmor);
            this.equippedArmor = item;
            return true;
        }
        return false;
    }
    addToInventory(item) {
        this.inventory.push(item);
    }
    removeFromInventory(index) {
        if (index < 0 || index >= this.inventory.length)
            return null;
        return this.inventory.splice(index, 1)[0];
    }
    getHpPercent() {
        return this.currentStats.hp / this.currentStats.maxHp;
    }
    getMpPercent() {
        return this.currentStats.mp / this.currentStats.maxMp;
    }
    resetForBattle() {
        this.currentStats = { ...this.baseStats };
        this.isAlive = true;
        this.isDefending = false;
        this.statusEffects = [];
        this.battleBuffs = {};
        this.elementalResistance = {};
        this.damageThisBattle = 0;
        this.healingThisBattle = 0;
    }
}
//# sourceMappingURL=Character.js.map