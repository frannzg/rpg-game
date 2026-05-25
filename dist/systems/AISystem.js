import { TargetType, BattleAction } from '../types/index.js';
export function decideAIAction(aiChar, allies, enemies) {
    const effectiveStats = aiChar.getEffectiveStats();
    const abilities = aiChar.getAbilities();
    const aliveEnemies = enemies.filter(e => e.isAlive);
    const aliveAllies = allies.filter(a => a.isAlive && a.id !== aiChar.id);
    const lowHpAllies = aliveAllies.filter(a => a.getHpPercent() < 0.4);
    const healingAbilities = abilities.filter(a => a.targetType === TargetType.SINGLE_ALLY && a.statKey === 'int');
    if (aiChar.getHpPercent() < 0.5) {
        const selfHeal = healingAbilities.find(a => effectiveStats.mp >= a.mpCost);
        if (selfHeal) {
            return { action: BattleAction.ABILITY, ability: selfHeal, target: aiChar };
        }
    }
    const hasHealingAbility = healingAbilities[0];
    if (hasHealingAbility && lowHpAllies.length > 0 && effectiveStats.mp >= hasHealingAbility.mpCost) {
        const target = lowHpAllies.sort((a, b) => a.getHpPercent() - b.getHpPercent())[0];
        return { action: BattleAction.ABILITY, ability: hasHealingAbility, target };
    }
    if (aiChar.getHpPercent() < 0.3) {
        const healItem = aiChar.inventory.findIndex(item => item.healAmount && item.healAmount > 0);
        if (healItem !== -1) {
            return { action: BattleAction.ITEM, target: aiChar, itemIndex: healItem };
        }
        return { action: BattleAction.DEFEND, target: aiChar };
    }
    const usableAbilities = abilities.filter(a => effectiveStats.mp >= a.mpCost && a.targetType !== TargetType.SINGLE_ALLY);
    if (usableAbilities.length > 0 && Math.random() < 0.5) {
        const ability = usableAbilities[Math.floor(Math.random() * usableAbilities.length)];
        if (ability.targetType === TargetType.ALL_ENEMIES) {
            return { action: BattleAction.ABILITY, ability, target: aliveEnemies[0] };
        }
        const target = aliveEnemies.sort((a, b) => a.getHpPercent() - b.getHpPercent())[0];
        return { action: BattleAction.ABILITY, ability, target };
    }
    const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    return { action: BattleAction.ATTACK, target };
}
//# sourceMappingURL=AISystem.js.map