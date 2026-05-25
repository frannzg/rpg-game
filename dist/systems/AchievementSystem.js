export const ACHIEVEMENT_LIST = {
    first_blood: { id: 'first_blood', name: 'Primera Sangre', description: 'Gana tu primera batalla de campaña' },
    boss_slayer: { id: 'boss_slayer', name: 'Matarreyes', description: 'Derrota tu primer jefe' },
    collector: { id: 'collector', name: 'Coleccionista', description: 'Consigue 10 items distintos en inventario' },
    max_level: { id: 'max_level', name: 'Leyenda', description: 'Alcanza nivel 20 con un personaje' },
    nightmare: { id: 'nightmare', name: 'Pesadilla', description: 'Completa la campaña en dificultad Pesadilla' },
    crit_master: { id: 'crit_master', name: 'Crítico', description: 'Acumula 100 golpes críticos' },
    no_death: { id: 'no_death', name: 'Invencible', description: 'Completa la campaña sin ninguna derrota' },
    damage_dealer: { id: 'damage_dealer', name: 'Coloso', description: 'Inflige 10000 de daño total' },
    healer: { id: 'healer', name: 'Sanador', description: 'Cura 5000 de HP total' },
    survivor: { id: 'survivor', name: 'Superviviente', description: 'Completa la campaña completa' },
};
export class AchievementSystem {
    static checkAll(stats, unlocked, currentLevel, difficulty, party) {
        const newAchievements = [];
        const checks = [
            { id: 'first_blood', condition: () => stats.battlesWon >= 1 },
            { id: 'boss_slayer', condition: () => stats.bossesDefeated >= 1 },
            { id: 'collector', condition: () => party.some(c => c.inventory.length >= 10) },
            { id: 'max_level', condition: () => party.some(c => c.level >= 20) },
            { id: 'nightmare', condition: () => difficulty === 'nightmare' && currentLevel >= 20 },
            { id: 'crit_master', condition: () => stats.criticalHits >= 100 },
            { id: 'no_death', condition: () => stats.battlesLost === 0 && currentLevel >= 20 },
            { id: 'damage_dealer', condition: () => stats.totalDamageDealt >= 10000 },
            { id: 'healer', condition: () => stats.totalHealed >= 5000 },
            { id: 'survivor', condition: () => currentLevel >= 20 },
        ];
        for (const { id, condition } of checks) {
            if (!unlocked.includes(id) && condition()) {
                newAchievements.push(id);
            }
        }
        return newAchievements;
    }
}
//# sourceMappingURL=AchievementSystem.js.map