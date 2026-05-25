import pc from 'picocolors'
import { hpColor } from '../colors.js'

const BAR_LENGTH = 16

export function renderHealthBar(current: number, max: number): string {
  const percent = current / max
  const filled = Math.round(percent * BAR_LENGTH)
  const empty = BAR_LENGTH - filled

  const bar = '█'.repeat(filled) + '░'.repeat(empty)
  const colorFn = hpColor(percent)

  return `${colorFn(bar)} ${current}/${max}`
}

export function renderMpBar(current: number, max: number): string {
  const percent = current / max
  const filled = Math.round(percent * BAR_LENGTH)
  const empty = BAR_LENGTH - filled

  const bar = '█'.repeat(filled) + '░'.repeat(empty)
  return `${pc.blue(bar)} ${current}/${max}`
}
