export const talents = {
    // ===== Guerrero =====
    muro_acer: { id: 'muro_acer', name: 'Muro de Acero', description: 'DEF+5, RES+3', statModifiers: { def: 5, res: 3 } },
    furia_impar: { id: 'furia_impar', name: 'Furia Imparable', description: 'STR+5, SPD+2', statModifiers: { str: 5, spd: 2 } },
    veteran: { id: 'veteran', name: 'Veteranía', description: 'MaxHP+40, DEF+2', statModifiers: { maxHp: 40, def: 2 } },
    // ===== Mago =====
    maest_arc: { id: 'maest_arc', name: 'Maestría Arcana', description: 'INT+5, MaxMP+20', statModifiers: { int: 5, maxMp: 20 } },
    canalizar: { id: 'canalizar', name: 'Canalizar', description: 'MaxMP+40, hechizos cuestan 20% menos MP', statModifiers: { maxMp: 40 } },
    sabiduria: { id: 'sabiduria', name: 'Sabiduría', description: 'INT+3, RES+5', statModifiers: { int: 3, res: 5 } },
    // ===== Pícaro =====
    sombra_let: { id: 'sombra_let', name: 'Sombra Letal', description: 'DEX+5, SPD+3', statModifiers: { dex: 5, spd: 3 } },
    veneno_pot: { id: 'veneno_pot', name: 'Veneno Potente', description: 'STR+4, daño de veneno +50%', statModifiers: { str: 4 } },
    esquivo: { id: 'esquivo', name: 'Esquivo', description: 'SPD+5, DEX+3', statModifiers: { spd: 5, dex: 3 } },
    // ===== Paladín =====
    fe_inqueb: { id: 'fe_inqueb', name: 'Fe Inquebrantable', description: 'RES+5, MaxHP+30', statModifiers: { res: 5, maxHp: 30 } },
    justicia: { id: 'justicia', name: 'Justicia Divina', description: 'STR+4, ataques sagrados +25%', statModifiers: { str: 4 } },
    protector: { id: 'protector', name: 'Protector', description: 'DEF+5, curación +20%', statModifiers: { def: 5 } },
    // ===== Arquero =====
    punteria: { id: 'punteria', name: 'Puntería Infalible', description: 'DEX+6, crítico +5%', statModifiers: { dex: 6 } },
    lluvia_mort: { id: 'lluvia_mort', name: 'Lluvia Mortal', description: 'SPD+4, ataques múltiples +20%', statModifiers: { spd: 4 } },
    ojo_linx: { id: 'ojo_linx', name: 'Ojo de Lince', description: 'DEX+4, STR+3', statModifiers: { dex: 4, str: 3 } },
    // ===== Berserker =====
    sede_sangre: { id: 'sede_sangre', name: 'Sede de Sangre', description: 'Al matar enemigo, recupera 20% HP', statModifiers: {} },
    rabia: { id: 'rabia', name: 'Rabia', description: 'STR+6, DEF-2', statModifiers: { str: 6, def: -2 } },
    inquebrant: { id: 'inquebrant', name: 'Inquebrantable', description: 'Resucita con 20% HP 1 vez por batalla', statModifiers: { maxHp: 20 } },
    // ===== Druida =====
    companero: { id: 'companero', name: 'Compañero', description: 'Lobo invocado tiene +50% HP y STR', statModifiers: {} },
    naturaleza: { id: 'naturaleza', name: 'Naturaleza', description: 'Curación +30%, tormenta +20%', statModifiers: { int: 3 } },
    escudo_verde: { id: 'escudo_verde', name: 'Escudo Verde', description: 'RES+5, al recibir daño mágico recupera 10% HP', statModifiers: { res: 5 } },
};
export const TALENT_POOLS = {
    guerrero: [['muro_acer', 'furia_impar', 'veteran']],
    mago: [['maest_arc', 'canalizar', 'sabiduria']],
    picaro: [['sombra_let', 'veneno_pot', 'esquivo']],
    paladin: [['fe_inqueb', 'justicia', 'protector']],
    arquero: [['punteria', 'lluvia_mort', 'ojo_linx']],
    berserker: [['sede_sangre', 'rabia', 'inquebrant']],
    druida: [['companero', 'naturaleza', 'escudo_verde']],
};
//# sourceMappingURL=talents.js.map