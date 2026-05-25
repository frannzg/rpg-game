import { Character } from '../Character.js'
import { characterTemplates } from '../../data/characters.js'

export function createCharacterFromTemplate(templateId: string): Character {
  const template = characterTemplates.find(t => t.id === templateId)
  if (!template) throw new Error(`Template not found: ${templateId}`)
  return new Character(template)
}

export function createAllCharacters(): Character[] {
  return characterTemplates.map(t => new Character(t))
}

export function getCharacterChoices() {
  return characterTemplates.map(t => ({
    name: `${t.name} (${t.className}) — ${t.description.slice(0, 60)}...`,
    value: t.id,
    short: t.name,
  }))
}
