import * as fs from 'node:fs'
import * as path from 'node:path'
import { SaveGame } from '../types/index.js'

const SAVE_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.rpg-terminal')
const SAVE_FILE = (slot: number) => path.join(SAVE_DIR, `save_${slot}.json`)

export class SaveManager {
  static ensureDir(): void {
    try { if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true }) }
    catch { /* web mode - ignore */ }
  }

  static save(slot: number, game: SaveGame): boolean {
    try {
      this.ensureDir()
      game.slot = slot
      const data = JSON.stringify(game, null, 2)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`rpg_save_${slot}`, data)
      } else {
        fs.writeFileSync(SAVE_FILE(slot), data, 'utf-8')
      }
      return true
    } catch { return false }
  }

  static load(slot: number): SaveGame | null {
    try {
      let data: string | null = null
      if (typeof localStorage !== 'undefined') {
        data = localStorage.getItem(`rpg_save_${slot}`)
      } else {
        this.ensureDir()
        if (fs.existsSync(SAVE_FILE(slot))) {
          data = fs.readFileSync(SAVE_FILE(slot), 'utf-8')
        }
      }
      if (!data) return null
      return JSON.parse(data) as SaveGame
    } catch { return null }
  }

  static delete(slot: number): boolean {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`rpg_save_${slot}`)
      } else {
        this.ensureDir()
        if (fs.existsSync(SAVE_FILE(slot))) fs.unlinkSync(SAVE_FILE(slot))
      }
      return true
    } catch { return false }
  }

  static listSlots(): (SaveGame | null)[] {
    const slots: (SaveGame | null)[] = []
    for (let i = 0; i < 3; i++) {
      slots.push(this.load(i))
    }
    return slots
  }
}
