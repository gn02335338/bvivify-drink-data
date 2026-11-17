import { analyzeForum, forumReviewedOn } from './forum-analysis.mjs';

export const forumDailyKey = 'forum-daily-v1';

export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = Date.parse(value);
  return Number.isFinite(date) && new Date(date).toISOString().slice(0, 10) === value;
}

export function validateDailyForum(batch, seed, shops) {
  if (!batch || !Array.isArray(batch.records)) throw new Error('Daily forum batch must contain records');
  if (batch.records.length && !validDate(batch.reviewedOn)) {
    throw new Error('Daily forum batch needs a valid review date');
  }
  const records = batch.records.map(entry => {
    const { drinkId, platform, url, date, stance, note } = entry;
    if (date !== null && (!validDate(date) || date > batch.reviewedOn)) throw new Error('Invalid original post date');
    if (typeof note !== 'string' || !note.trim() || note.length > 160) throw new Error('An original summary is required');
    return { drinkId, platform, url, date, stance, note: note.trim() };
  });
  const reviewedOn = records.length ? batch.reviewedOn : forumReviewedOn;
  // Seed evidence and the append-only daily batch have separate review dates.
  // Adding a newly reviewed brand must not invalidate an older daily batch.
  const analysis = analyzeForum([...seed, ...records], shops, reviewedOn > forumReviewedOn ? reviewedOn : forumReviewedOn);
  if (analysis.rowCount !== seed.length + records.length) throw new Error('Duplicate thread and drink pair');
  return { records, reviewedOn, analysis };
}
