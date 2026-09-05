export type DifficultyCode = 'T' | 'E' | 'EE' | 'EEA';

export interface DifficultyTone {
  code: DifficultyCode;
  color: string;
  label: string;
}

export const DIFFICULTIES: Record<DifficultyCode, DifficultyTone> = {
  T: { code: 'T', color: '#2F9E6B', label: 'Turistico' },
  E: { code: 'E', color: '#2F6FBD', label: 'Escursionistico' },
  EE: { code: 'EE', color: '#D4532B', label: 'Esperti' },
  EEA: { code: 'EEA', color: '#1C1917', label: 'Attrezzatura' }
};

export const DIFFICULTY_ORDER: DifficultyCode[] = ['T', 'E', 'EE', 'EEA'];

export function parseDifficultyCodes(category: string): DifficultyCode[] {
  const tokens = category.toUpperCase().split(/[^A-Z]+/).filter(Boolean);
  return DIFFICULTY_ORDER.filter((code) => tokens.includes(code));
}

export function primaryDifficulty(category: string): DifficultyTone {
  const codes = parseDifficultyCodes(category);
  return DIFFICULTIES[codes.at(-1) ?? 'E'];
}
