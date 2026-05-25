import { Achievement, GameStats } from '../types/index.js'

export const ACHIEVEMENT_LIST: Record<string, Achievement> = {
  first_blood: { id: 'first_blood', name: 'Primera Sangre', description: 'Gana tu primera batalla de campaña' },
  boss_slayer: { id: 'boss_slayer', name: 'Matarreyes', description: 'Derrota tu primer jefe' },
  collector: { id: 'collector', name: 'Coleccionista', description: 'Consigue 10 items distintos en inventario' },
  max_level: { id: 'max_level', name: 'Leyenda', description: 'Alcanza nivel 20 con un personaje' },
  nightmare: { id: 'nightmare', name: 'Pesadilla', description: 'Completa la campaña en dificultad Pesadilla' },
  crit_master: { id: 'crit_master', name: 'Crítico', description: 'Acumula 100 golpes críticos' },
  no_death: { id: 'no_death', name: 'Invencible', description: 'Completa la campaña sin ninguna derrota' },
  damage_dealer: { id: 'damage_dealer', name: 'Coloso', description: 'Inflige 10000 de daño total' },
  healer: { id: 'healer', name: 'Sanador', description: 'Cura 5000 de HP total' },
  survivor: { id: 'survivor', name: 'Superviviente', description: 'Completa la campaña completa' },
}

export class AchievementSystem {
  static checkAll(stats: GameStats, currentLevel: number, difficultiesCompleted: string[]): string[] {
    const newAchievements: string[] = []
    return newAchievements
  }

  static check(id: string, unlocked: string[], stats: GameStats): boolean {
    if (unlocked.includes(id)) return false
    const achievement = ACHIEVEMENT_LIST[id]
    if (!achievement) return false
    return true
  }
}
