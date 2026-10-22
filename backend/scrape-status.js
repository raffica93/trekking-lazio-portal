const { SOURCES, sourceMeta } = require('./sources');

function belongingTo(source, excursion) {
  return excursion?.sourceId ? excursion.sourceId === source.id : Boolean(excursion?.id?.startsWith(`${source.id}-`));
}

function countBySource(excursions = [], sources = SOURCES) {
  const counts = Object.fromEntries(sources.map((source) => [source.id, 0]));
  const ordered = [...sources].sort((a, b) => b.id.length - a.id.length);
  for (const event of excursions || []) {
    const id = event.sourceId || ordered.find((source) => belongingTo(source, event))?.id;
    if (id && id in counts) counts[id] += 1;
  }
  return counts;
}

function catalogRow(source, extras = {}) {
  return {
    ...sourceMeta(source),
    status: extras.status || (source.enabled ? 'idle' : 'disabled'),
    excursions: extras.excursions ?? 0,
    error: extras.error || null,
    hash: extras.hash || null,
    updatedAt: extras.updatedAt || null,
    documents: extras.documents || [],
    methods: extras.methods || [],
    issues: extras.issues || [],
    extractedEvents: extras.extractedEvents ?? null
  };
}

function discoveryQueueComplete(run) {
  const discovery = run?.discovery;
  return discovery?.complete === true
    && Number.isInteger(discovery.knownCandidates)
    && Number.isInteger(discovery.visitedCandidates)
    && Number.isInteger(discovery.remainingCandidates)
    && discovery.remainingCandidates === 0
    && discovery.visitedCandidates >= discovery.knownCandidates;
}

function buildScrapeStatus({
  sources = SOURCES,
  existingStatus = {},
  result = null,
  excursions = [],
  continuationSourceId = null,
  continuationSourceUrls = [],
  generatedAt = new Date().toISOString()
} = {}) {
  const previous = new Map(
    (Array.isArray(existingStatus.sources) ? existingStatus.sources : [])
      .map((row) => [row.id, row])
  );
  const counts = countBySource(
    result?.excursions || excursions,
    sources
  );
  const resultsById = new Map((result?.results || []).map((item) => [item.source.id, item]));
  const failuresById = new Map(
    (result?.failures || []).map((item) => [item.source.id, item.error?.message || String(item.error)])
  );

  const rows = sources.map((source) => {
    const prior = previous.get(source.id) || {};
    const run = resultsById.get(source.id);
    if (run) {
      if (source.id === continuationSourceId) {
        const requested = new Set((continuationSourceUrls || []).map((url) => String(url)));
        const currentDocuments = Array.isArray(run.documents) ? run.documents : [];
        const priorDocuments = Array.isArray(prior.documents) ? prior.documents : [];
        const documentsByUrl = new Map();
        for (const document of priorDocuments) {
          if (document?.url) documentsByUrl.set(document.url, document);
        }
        for (const document of currentDocuments) {
          if (document?.url) documentsByUrl.set(document.url, document);
        }
        const documents = [...documentsByUrl.values()];
        const currentIssues = Array.isArray(run.issues) ? run.issues : [];
        const successfulUrls = new Set(currentDocuments.map((document) => document?.url).filter(Boolean));
        // Ordinary URL-scoped failures clear when explicitly retried. A
        // discovery-limit is different: re-reading its URL through a bounded
        // --source-url continuation does not traverse the old candidate queue.
        // Only a normal full-source run can clear it, by replacing the issue
        // list with its current result below.
        const retainedIssues = (Array.isArray(prior.issues) ? prior.issues : [])
          .filter((issue) => issue?.code === 'discovery-limit'
            || !issue?.url
            || !requested.has(issue.url)
            || !successfulUrls.has(issue.url));
        const mergedIssues = new Map();
        for (const issue of [...retainedIssues, ...currentIssues]) {
          const key = `${issue?.code || ''}\u0000${issue?.url || ''}`;
          // Prefer the latest issue for the same code and URL, including an
          // updated remaining-candidate count.
          mergedIssues.set(key, issue);
        }
        const issues = [...mergedIssues.values()];
        const unvisitedPriorDocuments = priorDocuments.some((document) => (
          document?.url && !requested.has(document.url)
        ));
        const incomplete = unvisitedPriorDocuments || retainedIssues.length > 0
          || (prior.status === 'partial' && currentDocuments.length < priorDocuments.length);
        const methods = [...new Set([
          ...(Array.isArray(prior.methods) ? prior.methods : []),
          ...(Array.isArray(run.methods) ? run.methods : [])
        ])];
        return catalogRow(source, {
          status: incomplete ? 'partial' : run.status,
          excursions: run.excursions.length,
          error: failuresById.get(source.id) || (issues.length ? prior.error || null : null),
          hash: incomplete ? prior.hash || run.hash || null : run.hash || null,
          updatedAt: generatedAt,
          documents,
          methods,
          issues,
          extractedEvents: incomplete ? prior.extractedEvents ?? run.extractedEvents : run.extractedEvents
        });
      }
      const currentIssues = Array.isArray(run.issues) ? run.issues : [];
      const retainedDiscoveryIssues = discoveryQueueComplete(run)
        ? []
        : (Array.isArray(prior.issues) ? prior.issues : []).filter((issue) => issue?.code === 'discovery-limit');
      const mergedIssues = new Map();
      for (const issue of [...retainedDiscoveryIssues, ...currentIssues]) {
        const key = `${issue?.code || ''}\u0000${issue?.url || ''}`;
        mergedIssues.set(key, issue);
      }
      const issues = [...mergedIssues.values()];
      return catalogRow(source, {
        status: issues.length && run.status !== 'failed' ? 'partial' : run.status,
        excursions: run.excursions.length,
        error: failuresById.get(source.id) || (issues.length ? prior.error || null : null),
        hash: run.hash || null,
        updatedAt: generatedAt,
        documents: run.documents,
        methods: run.methods,
        issues,
        extractedEvents: run.extractedEvents
      });
    }
    if (failuresById.has(source.id)) {
      return catalogRow(source, {
        status: 'failed',
        excursions: counts[source.id] || 0,
        error: failuresById.get(source.id),
        hash: prior.hash || null,
        updatedAt: generatedAt
      });
    }
    return catalogRow(source, {
      status: prior.status || (source.enabled ? 'idle' : 'disabled'),
      excursions: counts[source.id] ?? prior.excursions ?? 0,
      error: prior.error || null,
      hash: prior.hash || null,
      updatedAt: prior.updatedAt || null,
      documents: prior.documents,
      methods: prior.methods,
      issues: prior.issues,
      extractedEvents: prior.extractedEvents
    });
  });

  return {
    generatedAt,
    coverage: result?.coverage || existingStatus.coverage || null,
    sources: rows
  };
}

function hardFailures(result, existing = []) {
  return (result?.failures || []).filter((item) => {
    const cached = existing.filter((excursion) => belongingTo(item.source, excursion));
    return cached.length === 0;
  });
}

module.exports = {
  buildScrapeStatus,
  catalogRow,
  countBySource,
  hardFailures
};
