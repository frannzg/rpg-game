import { Character } from '../models/Character.js'

export function calculateXpForLevel(level: number): number {
  return Math.round(level * 100 + Math.pow(level - 1, 2) * 50)
}

export function distributeXp(party: Character[], totalXp: number): Map<string, { gained: number; levels: number }> {
  const result = new Map<string, { gained: number; levels: number }>()
  const alive = party.filter(c => c.isAlive)
  const xpPerChar = Math.round(totalXp / alive.length)

  for (const char of alive) {
    const prevLevel = char.level
    const gained = char.addXp(xpPerChar)
    result.set(char.id, { gained: xpPerChar, levels: char.level - prevLevel })
  }

  return result
}
