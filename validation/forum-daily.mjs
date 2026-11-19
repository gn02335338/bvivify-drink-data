import { analyzeForum, forumReviewedOn, forumThreadKey } from './forum-analysis.mjs';

export const forumDailyKey = 'forum-daily-v1';

export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = Date.parse(value);
  return Number.isFinite(date) && new Date(date).toISOString().slice(0, 10) === value;
}

export function validateForumReviewDate(reviewedOn, {
  today = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10),
} = {}) {
  if (!validDate(today)) throw new Error('A valid Taiwan run date is required');
  if (!validDate(reviewedOn)) throw new Error('A valid review date is required');
  if (reviewedOn > today) throw new Error('Review date is in the future');
  return reviewedOn;
}

export function validateDailyForum(batch, seed, shops) {
  if (!batch || !Array.isArray(batch.records)) throw new Error('Daily forum batch must contain records');
  if (batch.dateCorrections !== undefined && !Array.isArray(batch.dateCorrections)) throw new Error('Date corrections must be an array');
  const suppliedCorrections = batch.dateCorrections ?? [];
  if ((batch.records.length || suppliedCorrections.length) && !validDate(batch.reviewedOn)) {
    throw new Error('Daily forum batch needs a valid review date');
  }
  const records = batch.records.map(entry => {
    const { drinkId, platform, url, date, stance, note } = entry;
    if (date !== null && (!validDate(date) || date > batch.reviewedOn)) throw new Error('Invalid original post date');
    if (typeof note !== 'string' || !note.trim() || note.length > 160) throw new Error('An original summary is required');
    return { drinkId, platform, url, date, stance, note: note.trim() };
  });
  const originals = new Map();
  for (const record of [...seed, ...records]) {
    const key = forumThreadKey(record);
    if (!originals.has(key)) originals.set(key, []);
    originals.get(key).push(record);
  }
  // Publication date belongs to the original thread, not the drink annotation.
  // A new drink ID must not let an old post acquire a different recent date.
  for (const [key, existing] of originals) {
    const knownDates = new Set(existing.filter(record => record.date !== null).map(record => record.date));
    if (knownDates.size > 1) throw new Error('Conflicting original post dates for ' + key);
  }
  const correctedDates = new Map();
  const dateCorrections = suppliedCorrections.map(correction => {
    const { platform, url, date, verifiedOn, dateEvidence } = correction;
    const key = forumThreadKey({ platform, url });
    const existing = originals.get(key);
    if (!existing) throw new Error('Date correction does not identify an existing original thread');
    if (!existing.some(record => record.date === null)) throw new Error('Date correction requires a missing original post date');
    if (correctedDates.has(key)) throw new Error('Duplicate original date correction');
    if (!validDate(date) || !validDate(verifiedOn) || date > verifiedOn || verifiedOn > batch.reviewedOn) {
      throw new Error('Invalid verified original post date');
    }
    if (typeof dateEvidence !== 'string' || dateEvidence.trim().length < 20 || dateEvidence.trim().length > 240) {
      throw new Error('Original published-date evidence must contain 20 to 240 characters');
    }
    if (existing.some(record => record.date !== null && record.date !== date)) {
      throw new Error('Date correction conflicts with a known original post date');
    }
    correctedDates.set(key, date);
    return { platform, url, date, verifiedOn, dateEvidence: dateEvidence.trim() };
  });
  const reviewedOn = records.length || dateCorrections.length ? batch.reviewedOn : forumReviewedOn;
  // Seed evidence and the append-only daily batch have separate review dates.
  // Adding a newly reviewed brand must not invalidate an older daily batch.
  const datedRecords = [...seed, ...records].map(record => {
    const corrected = correctedDates.get(forumThreadKey(record));
    return record.date === null && corrected ? { ...record, date: corrected } : record;
  });
  const analysis = analyzeForum(datedRecords, shops, reviewedOn > forumReviewedOn ? reviewedOn : forumReviewedOn);
  if (analysis.rowCount !== seed.length + records.length) throw new Error('Duplicate thread and drink pair');
  return { records, dateCorrections, reviewedOn, analysis };
}

// Date backfills are separate append-only evidence. Historical record fields,
// including their originally unknown dates, remain unchanged in storage.
export function compareDailyForumHistory(current, incoming) {
  const key = record => record.drinkId + '|' + forumThreadKey(record);
  const incomingByKey = new Map(incoming.records.map(record => [key(record), record]));
  for (const record of current.records) {
    if (JSON.stringify(incomingByKey.get(key(record))) !== JSON.stringify(record)) {
      throw new Error('Published records must be preserved: ' + key(record));
    }
  }
  const corrections = new Map(incoming.dateCorrections.map(correction => [forumThreadKey(correction), correction]));
  for (const correction of current.dateCorrections) {
    if (JSON.stringify(corrections.get(forumThreadKey(correction))) !== JSON.stringify(correction)) {
      throw new Error('Published date corrections must be preserved: ' + forumThreadKey(correction));
    }
  }
  return {
    added: incoming.records.length - current.records.length,
    datesCorrected: incoming.dateCorrections.length - current.dateCorrections.length,
  };
}
