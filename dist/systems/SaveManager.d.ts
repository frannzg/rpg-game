import { SaveGame } from '../types/index.js';
export declare class SaveManager {
    static ensureDir(): void;
    static save(slot: number, game: SaveGame): boolean;
    static load(slot: number): SaveGame | null;
    static delete(slot: number): boolean;
    static listSlots(): (SaveGame | null)[];
}
//# sourceMappingURL=SaveManager.d.ts.map