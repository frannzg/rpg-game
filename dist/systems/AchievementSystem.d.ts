import { Achievement, GameStats, SavedCharacter } from '../types/index.js';
export declare const ACHIEVEMENT_LIST: Record<string, Achievement>;
export declare class AchievementSystem {
    static checkAll(stats: GameStats, unlocked: string[], currentLevel: number, difficulty: string, party: SavedCharacter[]): string[];
}
//# sourceMappingURL=AchievementSystem.d.ts.map