import { Achievement, GameStats } from '../types/index.js';
export declare const ACHIEVEMENT_LIST: Record<string, Achievement>;
export declare class AchievementSystem {
    static checkAll(stats: GameStats, currentLevel: number, difficultiesCompleted: string[]): string[];
    static check(id: string, unlocked: string[], stats: GameStats): boolean;
}
//# sourceMappingURL=AchievementSystem.d.ts.map