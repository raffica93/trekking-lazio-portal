import { CAI_SEZIONE_LINKS } from './cai-info.data';
import { sectionColor } from './section-color';

describe('sectionColor', () => {
  it('assigns a stable named color to known CAI sections', () => {
    expect(sectionColor('CAI Roma')).toBe('#BE0032');
    expect(sectionColor('cai roma')).toBe('#BE0032');
    expect(sectionColor('CAI Tivoli')).toBe('#00B8D4');
    expect(sectionColor('CAI Viterbo')).toBe('#111111');
  });

  it('gives every Lazio section a unique color', () => {
    const colors = CAI_SEZIONE_LINKS.map((section) => sectionColor(section.name));
    expect(new Set(colors).size).toBe(CAI_SEZIONE_LINKS.length);
  });

  it('keeps unknown organizers on a deterministic fallback', () => {
    expect(sectionColor('CAI Ignota')).toBe(sectionColor('CAI Ignota'));
    expect(sectionColor('CAI Ignota')).not.toBe(sectionColor('CAI Roma'));
  });
});
