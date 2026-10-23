'use strict';

function title(value) {
  return String(value || '').trim().toLocaleLowerCase('it').replace(/(^|[\s-])\p{L}/gu, char => char.toLocaleUpperCase('it'));
}

function canonicalRegion(raw) {
  const region = title(raw).replace('Valle D\'aosta', "Valle d'Aosta");
  return region === 'Extra Regione' ? 'Nazionale' : region;
}

function directorySubsectionTargets(sections) {
  return (sections || []).filter(section => !section.parentSectionId && section.sectionType !== 'subsection');
}

function selectDirectoryRegion(sections, requestedRegion) {
  if (typeof requestedRegion !== 'string' || !requestedRegion.trim()) {
    throw new Error('--directory-only requires a non-empty --region <name>');
  }
  const region = canonicalRegion(requestedRegion.trim());
  const selected = (sections || []).filter(section => canonicalRegion(section.region) === region);
  if (!selected.length) throw new Error(`Unknown directory region: ${region}`);
  const parents = directorySubsectionTargets(selected);
  if (!parents.length) throw new Error(`Directory region has no parent sections: ${region}`);
  return { region, sections: selected, parents };
}

function directoryOnlyRegion(argv) {
  if (!(argv || []).includes('--directory-only')) return null;
  const positions = (argv || []).reduce((items, value, index) => value === '--region' ? [...items, index] : items, []);
  if (positions.length !== 1) throw new Error('--directory-only requires exactly one --region <name>');
  const value = argv[positions[0] + 1];
  if (!value || value.startsWith('--')) throw new Error('--directory-only requires a non-empty --region <name>');
  return value;
}

module.exports = { canonicalRegion, directoryOnlyRegion, directorySubsectionTargets, selectDirectoryRegion };
