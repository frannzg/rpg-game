import { WebSocket } from 'ws';
export declare class GameSession {
    private combat;
    private playerChar;
    private enemies;
    private ws;
    private sessionId;
    private campaign;
    private shopItems;
    constructor(ws: WebSocket);
    private send;
    private setupListeners;
    private handleMessage;
    private sendCampaignHub;
    private startCampaign;
    private loadCampaign;
    private runCampaignBattle;
    private showShop;
    private buyItem;
    private sellItem;
    private equipItem;
    private applyTalent;
    private startPvE;
    private startPvP;
}
//# sourceMappingURL=GameSession.d.ts.map