import * as fs from 'node:fs';
import * as path from 'node:path';
const SAVE_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.rpg-terminal');
const SAVE_FILE = (slot) => path.join(SAVE_DIR, `save_${slot}.json`);
export class SaveManager {
    static ensureDir() {
        try {
            if (!fs.existsSync(SAVE_DIR))
                fs.mkdirSync(SAVE_DIR, { recursive: true });
        }
        catch { /* web mode - ignore */ }
    }
    static save(slot, game) {
        try {
            this.ensureDir();
            game.slot = slot;
            const data = JSON.stringify(game, null, 2);
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(`rpg_save_${slot}`, data);
            }
            else {
                fs.writeFileSync(SAVE_FILE(slot), data, 'utf-8');
            }
            return true;
        }
        catch {
            return false;
        }
    }
    static load(slot) {
        try {
            let data = null;
            if (typeof localStorage !== 'undefined') {
                data = localStorage.getItem(`rpg_save_${slot}`);
            }
            else {
                this.ensureDir();
                if (fs.existsSync(SAVE_FILE(slot))) {
                    data = fs.readFileSync(SAVE_FILE(slot), 'utf-8');
                }
            }
            if (!data)
                return null;
            return JSON.parse(data);
        }
        catch {
            return null;
        }
    }
    static delete(slot) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(`rpg_save_${slot}`);
            }
            else {
                this.ensureDir();
                if (fs.existsSync(SAVE_FILE(slot)))
                    fs.unlinkSync(SAVE_FILE(slot));
            }
            return true;
        }
        catch {
            return false;
        }
    }
    static listSlots() {
        const slots = [];
        for (let i = 0; i < 3; i++) {
            slots.push(this.load(i));
        }
        return slots;
    }
}
//# sourceMappingURL=SaveManager.js.map