import { Character } from '../models/Character.js';
import { Item } from '../models/Item.js';
import { Difficulty, SaveGame, BattleStatus, GameStats } from '../types/index.js';
export interface CampaignState {
    party: Character[];
    currentLevel: number;
    gold: number;
    difficulty: Difficulty;
    stats: GameStats;
    isComplete: boolean;
    achievements: string[];
    justUnlockedAchievements: string[];
    partyTalents: Map<string, string[]>;
}
export declare class CampaignManager {
    state: CampaignState;
    private onStateChange?;
    constructor(onStateChange?: () => void);
    static loadFromSave(save: SaveGame): CampaignManager;
    static createNew(characterIds: string[], names: string[], difficulty: Difficulty): CampaignManager;
    getLevelData(): import("../types/index.js").CampaignLevel | undefined;
    getBattleEnemies(): Character[];
    runBattle(onNeedInput: (info: import('../types/index.js').NeedInputInfo) => void, onBattleState: (state: import('../types/index.js').BattleState) => void): Promise<{
        status: BattleStatus;
        xpEarned: number;
        loot: Item[];
        levelUps: {
            name: string;
            levels: number;
            newLevel: number;
        }[];
    }>;
    healParty(): void;
    getAvailableTalentsForLevel(char: Character): string[];
    applyTalent(char: Character, talentId: string): void;
    checkAchievements(): void;
    save(): boolean;
    toSaveGame(): SaveGame;
}
//# sourceMappingURL=CampaignManager.d.ts.map