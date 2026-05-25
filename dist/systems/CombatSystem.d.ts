import { Character } from '../models/Character.js';
import { BattleResult, PlayerDecision, NeedInputInfo, BattleState } from '../types/index.js';
export interface SummonedPet {
    id: string;
    name: string;
    hp: number;
    maxHp: number;
    str: number;
    def: number;
    spd: number;
    dex: number;
    isAlive: boolean;
    turnsLeft: number;
    ownerInstanceId: string;
}
export declare class CombatSystem {
    private allies;
    private enemies;
    private battleLog;
    private round;
    private playerControlledIds;
    private decisionResolver;
    private readonly MAX_ROUNDS;
    private summonedPets;
    onNeedInput?: (info: NeedInputInfo) => void;
    onBattleState?: (state: BattleState) => void;
    totalDamageDealt: number;
    totalDamageTaken: number;
    totalHealed: number;
    criticalHits: number;
    enemiesDefeated: number;
    constructor(allies: Character[], enemies: Character[], playerControlledIds?: string[]);
    private log;
    private getAlive;
    private getAlivePets;
    private findChar;
    private findPet;
    private isEnemyTeam;
    private getElementMultiplier;
    private toSnapshot;
    private emitState;
    setPlayerDecision(decision: PlayerDecision): void;
    private waitForPlayerDecision;
    private getTurnOrder;
    private getPetTurnOrder;
    private isPlayerControlled;
    private getAttackStat;
    private executeAttack;
    private executeAbility;
    private executeItem;
    private executePetAttack;
    private processDecision;
    private getBattleResult;
    start(): Promise<BattleResult>;
    private processAIDecision;
    private finalizeBattle;
}
//# sourceMappingURL=CombatSystem.d.ts.map