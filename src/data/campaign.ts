import { CampaignLevel } from '../types/index.js'

export const campaignLevels: CampaignLevel[] = [
  { level: 1, enemyGroups: [{ templateId: 'picaro', isBoss: false, count: 1 }, { templateId: 'guerrero', isBoss: false, count: 1 }], goldReward: 30 },
  { level: 2, enemyGroups: [{ templateId: 'mago', isBoss: false, count: 1 }, { templateId: 'picaro', isBoss: false, count: 1 }], goldReward: 40 },
  { level: 3, enemyGroups: [{ templateId: 'arquero', isBoss: false, count: 1 }, { templateId: 'guerrero', isBoss: false, count: 1 }], goldReward: 50 },
  { level: 4, enemyGroups: [{ templateId: 'guerrero', isBoss: false, count: 1 }, { templateId: 'mago', isBoss: false, count: 1 }, { templateId: 'picaro', isBoss: false, count: 1 }], goldReward: 60 },
  { level: 5, enemyGroups: [{ templateId: 'berserker', isBoss: true, count: 1 }, { templateId: 'guerrero', isBoss: false, count: 1 }, { templateId: 'mago', isBoss: false, count: 1 }], goldReward: 100, bossName: 'Capitán Berserker', bossQuote: '¡Os haré picadillo!' },

  { level: 6, enemyGroups: [{ templateId: 'paladin', isBoss: false, count: 1 }, { templateId: 'arquero', isBoss: false, count: 1 }, { templateId: 'picaro', isBoss: false, count: 1 }], goldReward: 80 },
  { level: 7, enemyGroups: [{ templateId: 'berserker', isBoss: false, count: 1 }, { templateId: 'druida', isBoss: false, count: 1 }, { templateId: 'mago', isBoss: false, count: 1 }], goldReward: 90 },
  { level: 8, enemyGroups: [{ templateId: 'guerrero', isBoss: false, count: 2 }, { templateId: 'arquero', isBoss: false, count: 1 }], goldReward: 100 },
  { level: 9, enemyGroups: [{ templateId: 'mago', isBoss: false, count: 2 }, { templateId: 'picaro', isBoss: false, count: 1 }], goldReward: 110 },
  { level: 10, enemyGroups: [{ templateId: 'paladin', isBoss: true, count: 1 }, { templateId: 'berserker', isBoss: false, count: 1 }, { templateId: 'druida', isBoss: false, count: 1 }], goldReward: 180, bossName: 'Paladín Oscuro', bossQuote: 'La luz me abandonó... ahora solo quedan tinieblas.' },

  { level: 11, enemyGroups: [{ templateId: 'druida', isBoss: false, count: 1 }, { templateId: 'picaro', isBoss: false, count: 1 }, { templateId: 'arquero', isBoss: false, count: 1 }], goldReward: 140 },
  { level: 12, enemyGroups: [{ templateId: 'berserker', isBoss: false, count: 2 }, { templateId: 'mago', isBoss: false, count: 1 }], goldReward: 150 },
  { level: 13, enemyGroups: [{ templateId: 'guerrero', isBoss: false, count: 2 }, { templateId: 'druida', isBoss: false, count: 1 }], goldReward: 160 },
  { level: 14, enemyGroups: [{ templateId: 'paladin', isBoss: false, count: 1 }, { templateId: 'mago', isBoss: false, count: 1 }, { templateId: 'arquero', isBoss: false, count: 1 }], goldReward: 170 },
  { level: 15, enemyGroups: [{ templateId: 'berserker', isBoss: true, count: 1 }, { templateId: 'paladin', isBoss: false, count: 1 }, { templateId: 'druida', isBoss: false, count: 1 }], goldReward: 280, bossName: 'Rey Berserker', bossQuote: '¡MI HACHA HABLA! ¿QUIERES OÍRLA?' },

  { level: 16, enemyGroups: [{ templateId: 'picaro', isBoss: false, count: 2 }, { templateId: 'arquero', isBoss: false, count: 2 }], goldReward: 220 },
  { level: 17, enemyGroups: [{ templateId: 'guerrero', isBoss: false, count: 2 }, { templateId: 'mago', isBoss: false, count: 2 }], goldReward: 240 },
  { level: 18, enemyGroups: [{ templateId: 'berserker', isBoss: false, count: 2 }, { templateId: 'druida', isBoss: false, count: 2 }], goldReward: 260 },
  { level: 19, enemyGroups: [{ templateId: 'paladin', isBoss: false, count: 2 }, { templateId: 'arquero', isBoss: false, count: 1 }, { templateId: 'mago', isBoss: false, count: 1 }], goldReward: 300 },
  { level: 20, enemyGroups: [{ templateId: 'berserker', isBoss: true, count: 1 }, { templateId: 'paladin', isBoss: true, count: 1 }, { templateId: 'mago', isBoss: false, count: 1 }, { templateId: 'druida', isBoss: false, count: 1 }], goldReward: 500, bossName: '👑 Señor de la Guerra', bossQuote: 'Habéis llegado lejos... pero este es vuestro final.' },
]

export function getCampaignLevel(level: number): CampaignLevel | undefined {
  return campaignLevels.find(l => l.level === level)
}
