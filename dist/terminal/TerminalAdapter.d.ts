import { CombatSystem } from '../systems/CombatSystem.js';
import { Character } from '../models/Character.js';
export declare class TerminalAdapter {
    private allies;
    private enemies;
    private combat;
    constructor(allies: Character[], enemies: Character[], playerControlledIds: string[]);
    private handleNeedInput;
    private handleBattleState;
    private pickTarget;
    private pickAbility;
    getCombat(): CombatSystem;
}
//# sourceMappingURL=TerminalAdapter.d.ts.map