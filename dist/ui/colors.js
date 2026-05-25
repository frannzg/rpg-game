import pc from 'picocolors';
export const colors = {
    hp: pc.green,
    hpLow: pc.red,
    mp: pc.blue,
    team: pc.green,
    enemy: pc.red,
    highlight: pc.yellow,
    ability: pc.cyan,
    damage: pc.red,
    heal: pc.green,
    buff: pc.magenta,
    system: pc.gray,
    title: pc.bold,
    critical: pc.yellow,
    xp: pc.cyan,
    loot: pc.yellow,
    header: pc.bold,
    white: (s) => s,
};
export function hpColor(percent) {
    if (percent > 0.5)
        return colors.hp;
    if (percent > 0.25)
        return colors.highlight;
    return colors.hpLow;
}
//# sourceMappingURL=colors.js.map