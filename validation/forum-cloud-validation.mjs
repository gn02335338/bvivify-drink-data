import { validateDailyForum, validDate, compareDailyForumHistory, validateForumReviewDate } from './forum-daily.mjs';
import { forumThreadKey } from './forum-analysis.mjs';

// These are publication caps for the existing subscription-only daily job,
// not a request to create a second job or buy additional research capacity.
export function validateCloudForumUpdate(source, liveSource, seed, shops, { today } = {}) {
  if (!validDate(today)) throw new Error('A valid Taiwan run date is required');
  const candidate = validateDailyForum(source, seed, shops);
  const live = validateDailyForum(liveSource, seed, shops);
  validateForumReviewDate(candidate.reviewedOn, { today });
  if (candidate.reviewedOn < live.reviewedOn) throw new Error('Review date is older than production');
  const { added, customAdded, datesCorrected } = compareDailyForumHistory(live, candidate);
  if (!added && !customAdded && !datesCorrected && candidate.reviewedOn !== live.reviewedOn) {
    throw new Error('Do not advance the date without new evidence or a verified publication-date backfill');
  }
  if (added + customAdded > 5) throw new Error('At most five standard and custom additions combined per cloud run');
  if (datesCorrected > 2) throw new Error('At most two publication-date corrections per cloud run');
  const customKey = record => JSON.stringify([record.recipeId, forumThreadKey(record)]);
  const publishedCustom = new Set(live.customRecords.map(customKey));
  const customFrom = new Date(Date.parse(today + 'T00:00:00.000Z') - 29 * 86_400_000).toISOString().slice(0, 10);
  for (const record of candidate.customRecords) {
    if (!publishedCustom.has(customKey(record)) && (!record.date || record.date < customFrom)) {
      throw new Error('New cloud custom records need an original publication date within the last 30 Taiwan calendar days');
    }
  }
  return { candidate, added, customAdded, datesCorrected };
}
