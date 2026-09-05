import { primaryDifficulty, parseDifficultyCodes } from './difficulty';

describe('difficulty', () => {
  it('picks the hardest code from mixed CAI categories', () => {
    expect(parseDifficultyCodes('T - E')).toEqual(['T', 'E']);
    expect(primaryDifficulty('percorsi da E a EE').code).toBe('EE');
    expect(primaryDifficulty('E - EEA').code).toBe('EEA');
    expect(primaryDifficulty('T').color).toBe('#2F9E6B');
  });
});
