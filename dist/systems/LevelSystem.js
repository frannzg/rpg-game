export function calculateXpForLevel(level) {
    return Math.round(level * 100 + Math.pow(level - 1, 2) * 50);
}
export function distributeXp(party, totalXp) {
    const result = new Map();
    const alive = party.filter(c => c.isAlive);
    if (alive.length === 0)
        return result;
    const xpPerChar = Math.round(totalXp / alive.length);
    for (const char of alive) {
        const prevLevel = char.level;
        const gained = char.addXp(xpPerChar);
        result.set(char.id, { gained: xpPerChar, levels: char.level - prevLevel });
    }
    return result;
}
//# sourceMappingURL=LevelSystem.js.map