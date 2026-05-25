import pc from 'picocolors';
const MAX_LOG = 8;
export function renderBattleLog(log) {
    const recent = log.slice(-MAX_LOG);
    const lines = [pc.bold(pc.yellow('\n═══ REGISTRO DE BATALLA ═══'))];
    for (const entry of recent) {
        const colorMap = {
            red: pc.red,
            green: pc.green,
            yellow: pc.yellow,
            cyan: pc.cyan,
            magenta: pc.magenta,
            blue: pc.blue,
            white: (s) => s,
            gray: pc.gray,
        };
        const colorFn = entry.color ? colorMap[entry.color] || pc.white : pc.white;
        lines.push(`  ${colorFn(entry.text)}`);
    }
    lines.push(pc.gray('──────────────────────────'));
    return lines.join('\n');
}
//# sourceMappingURL=Log.js.map