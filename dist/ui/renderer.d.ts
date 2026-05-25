import { Character } from '../models/Character.js';
import { LogEntry } from '../types/index.js';
export declare function renderBattle(allies: Character[], enemies: Character[], log: LogEntry[], round: number): void;
export declare function renderVictory(xp: number, levels: string[]): void;
export declare function renderDefeat(): void;
export declare function renderLoot(items: string[]): void;
//# sourceMappingURL=renderer.d.ts.map