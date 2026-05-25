import { Character } from '../models/Character.js';
import { Ability, BattleAction } from '../types/index.js';
export interface AIDecision {
    action: BattleAction;
    ability?: Ability;
    target: Character;
    itemIndex?: number;
}
export declare function decideAIAction(aiChar: Character, allies: Character[], enemies: Character[]): AIDecision;
//# sourceMappingURL=AISystem.d.ts.map