import { validateDailyForum, validDate, compareDailyForumHistory, validateForumReviewDate } from './forum-daily.mjs';

// These are publication caps for the existing subscription-only daily job,
// not a request to create a second job or buy additional research capacity.
export function validateCloudForumUpdate(source, liveSource, seed, shops, { today } = {}) {
  if (!validDate(today)) throw new Error('A valid Taiwan run date is required');
  const candidate = validateDailyForum(source, seed, shops);
  const live = validateDailyForum(liveSource, seed, shops);
  validateForumReviewDate(candidate.reviewedOn, { today });
  if (candidate.reviewedOn < live.reviewedOn) throw new Error('Review date is older than production');
  const { added, datesCorrected } = compareDailyForumHistory(live, candidate);
  if (!added && !datesCorrected && candidate.reviewedOn !== live.reviewedOn) {
    throw new Error('Do not advance the date without new evidence or a verified publication-date backfill');
  }
  if (added > 5) throw new Error('At most five additions per cloud run');
  if (datesCorrected > 2) throw new Error('At most two publication-date corrections per cloud run');
  return { candidate, added, datesCorrected };
}
