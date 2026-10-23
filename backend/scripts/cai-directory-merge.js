'use strict';

const { canonicalRegion } = require('./cai-directory-region');

function normalize(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function sectionIdentity(section) {
  const region = normalize(section.region);
  const organizer = normalize(section.organizer || section.name || '');
  return region && organizer ? `${region}:${organizer}` : null;
}

function assertCompleteSubsections(subsectionFailures) {
  if (Array.isArray(subsectionFailures) && subsectionFailures.length > 0) {
    throw new Error(`Official subsection directory incomplete (${subsectionFailures.length} failure(s)); existing registry retained`);
  }
}

function mergeDirectorySections(freshSections, previousSections, { scopeRegion = null } = {}) {
  const scope = scopeRegion ? canonicalRegion(scopeRegion) : null;
  const oldByDirectoryId = new Map();
  const newByDirectoryId = new Map();
  const oldByIdentity = new Map();
  const newByIdentity = new Map();
  const ambiguities = [];
  const add = (map, key, value) => {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(value);
  };
  for (const section of previousSections || []) {
    add(oldByDirectoryId, String(section.directoryId || '').trim(), section);
    add(oldByIdentity, sectionIdentity(section), section);
  }
  for (const section of freshSections || []) {
    add(newByDirectoryId, String(section.directoryId || '').trim(), section);
    add(newByIdentity, sectionIdentity(section), section);
  }

  const matches = new Map();
  const usedPrevious = new Set();
  const ambiguityKeys = new Set();
  const noteAmbiguity = (key, fresh, previous) => {
    const token = `${key}:${fresh.map(x => x.id).sort().join(',')}:${previous.map(x => x.id).sort().join(',')}`;
    if (ambiguityKeys.has(token)) return;
    ambiguityKeys.add(token);
    ambiguities.push({ key, freshIds: fresh.map(x => x.id).sort(), previousIds: previous.map(x => x.id).sort() });
  };

  // Prefer the official directory code. Never choose arbitrarily if either side is duplicated.
  for (const [directoryId, fresh] of newByDirectoryId) {
    if (!directoryId) continue;
    const previousAll = oldByDirectoryId.get(directoryId) || [];
    const previous = scope
      ? previousAll.filter(section => canonicalRegion(section.region) === scope)
      : previousAll;
    if (scope) {
      const crossRegion = previousAll.filter(section => canonicalRegion(section.region) !== scope);
      if (crossRegion.length) noteAmbiguity(`directoryId:${directoryId}:cross-region`, fresh, crossRegion);
    }
    if (fresh.length === 1 && previous.length === 1) {
      matches.set(fresh[0], previous[0]);
      usedPrevious.add(previous[0]);
    } else if (previous.length || fresh.length > 1) {
      noteAmbiguity(`directoryId:${directoryId}`, fresh, previous);
    }
  }

  // A changed/missing directory code may still be linked by a unique source identity.
  for (const [identity, freshCandidates] of newByIdentity) {
    const fresh = freshCandidates.filter(section => !matches.has(section));
    if (!fresh.length) continue;
    const previous = (oldByIdentity.get(identity) || []).filter(section => !usedPrevious.has(section)
      && (!scope || canonicalRegion(section.region) === scope));
    if (fresh.length === 1 && previous.length === 1) {
      matches.set(fresh[0], previous[0]);
      usedPrevious.add(previous[0]);
    } else if (previous.length || fresh.length > 1) {
      noteAmbiguity(`identity:${identity}`, fresh, previous);
    }
  }

  const freshToMergedId = new Map();
  for (const section of freshSections || []) {
    freshToMergedId.set(section.id, matches.get(section)?.id || section.id);
  }
  const sections = (freshSections || []).map(fresh => {
    const previous = matches.get(fresh);
    if (!previous) return { ...fresh };
    const result = { ...fresh, ...previous };
    // These fields are grounded in the current official directory response.
    for (const key of ['directoryId', 'region', 'organizer', 'sectionType', 'municipality', 'province', 'directoryUrl']) {
      if (fresh[key] !== undefined) result[key] = fresh[key];
    }
    // A missing directory website is not evidence that a curated website is invalid.
    result.website = fresh.website || previous.website || null;
    // Preserve curated identifiers, calendar configuration/status, and coordinates from `previous`.
    result.id = previous.id;
    const hasCuratedCalendar = (previous.calendarUrls || []).length > 0 || (previous.calendarEvidence || []).length > 0;
    const wasUnconfiguredWithoutWebsite = !previous.website
      && previous.status === 'missing-website'
      && previous.enabled === false
      && previous.kind === 'discover'
      && previous.template === 'calendar-discovery'
      && !hasCuratedCalendar;
    if (fresh.website && wasUnconfiguredWithoutWebsite) {
      // A newly supplied official website makes this section a pending discovery target.
      result.url = fresh.website;
      result.kind = fresh.kind || 'discover';
      result.template = fresh.template || 'calendar-discovery';
      result.enabled = true;
      result.status = 'pending-discovery';
    }
    result.parentSectionId = fresh.parentSectionId
      ? freshToMergedId.get(fresh.parentSectionId) || fresh.parentSectionId
      : previous.parentSectionId;
    result.evidenceUrls = [...new Set([...(previous.evidenceUrls || []), ...(fresh.evidenceUrls || [])])];
    return result;
  });
  const retainedPrevious = (previousSections || []).filter(section => !usedPrevious.has(section));
  const ambiguousPreviousIds = [...new Set(ambiguities.flatMap(item => item.previousIds))].sort();
  return {
    sections: [...sections, ...retainedPrevious.map(section => ({ ...section }))],
    ambiguities,
    retainedPreviousIds: retainedPrevious.map(section => section.id).sort(),
    ambiguousPreviousIds
  };
}

module.exports = { assertCompleteSubsections, mergeDirectorySections };
