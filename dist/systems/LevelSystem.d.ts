import { Character } from '../models/Character.js';
export declare function calculateXpForLevel(level: number): number;
export declare function distributeXp(party: Character[], totalXp: number): Map<string, {
    gained: number;
    levels: number;
}>;
//# sourceMappingURL=LevelSystem.d.ts.map