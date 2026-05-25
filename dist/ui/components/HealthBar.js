import { hpColor } from '../colors.js';
const BAR_LENGTH = 16;
export function renderHealthBar(current, max) {
    const percent = current / max;
    const filled = Math.round(percent * BAR_LENGTH);
    const empty = BAR_LENGTH - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const colorFn = hpColor(percent);
    return `${colorFn(bar)} ${current}/${max}`;
}
export function renderMpBar(current, max) {
    const percent = current / max;
    const filled = Math.round(percent * BAR_LENGTH);
    const empty = BAR_LENGTH - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `\x1b[34m${bar}\x1b[0m ${current}/${max}`;
}
//# sourceMappingURL=HealthBar.js.map