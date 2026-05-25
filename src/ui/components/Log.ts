import pc from 'picocolors'
import { LogEntry } from '../../types/index.js'

const MAX_LOG = 8

export function renderBattleLog(log: LogEntry[]): string {
  const recent = log.slice(-MAX_LOG)
  const lines: string[] = [pc.bold(pc.yellow('\n═══ REGISTRO DE BATALLA ═══'))]

  for (const entry of recent) {
    const colorMap: Record<string, (s: string) => string> = {
      red: pc.red,
      green: pc.green,
      yellow: pc.yellow,
      cyan: pc.cyan,
      magenta: pc.magenta,
      blue: pc.blue,
      white: (s: string) => s,
      gray: pc.gray,
    }
    const colorFn = entry.color ? colorMap[entry.color] || pc.white : pc.white
    lines.push(`  ${colorFn(entry.text)}`)
  }

  lines.push(pc.gray('──────────────────────────'))
  return lines.join('\n')
}
