import { readFile } from 'node:fs/promises';
import { validateDailyForum, validDate } from './validation/forum-daily.mjs';
import { forumThreadKey } from './validation/forum-analysis.mjs';

const read = async name => JSON.parse(await readFile(new URL(name, import.meta.url), 'utf8'));
const { shops } = await read('./catalog.json');
const seed = await read('./forum-seed.json');
const source = JSON.parse(await readFile(process.argv[2] ?? new URL('./forum-daily.json', import.meta.url), 'utf8'));
const candidate = validateDailyForum(source, seed, shops);
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
if (!validDate(candidate.reviewedOn) || candidate.reviewedOn > today) throw new Error('Review date is in the future');
const response = await fetch('https://drink.bvivify.com/api/forum-daily', { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(12000) });
if (!response.ok) throw new Error('Cannot verify currently published data');
const live = validateDailyForum(await response.json(), seed, shops);
if (candidate.reviewedOn < live.reviewedOn) throw new Error('Review date is older than production');
const key = record => record.drinkId + '|' + forumThreadKey(record);
const indexed = new Map(candidate.records.map(record => [key(record), record]));
for (const entry of live.records) {
  if (JSON.stringify(indexed.get(key(entry))) !== JSON.stringify(entry)) throw new Error('Published records must be preserved: ' + key(entry));
}
if (candidate.records.length === live.records.length && candidate.reviewedOn !== live.reviewedOn) throw new Error('Do not advance the date without new evidence');
if (candidate.records.length - live.records.length > 5) throw new Error('At most five additions per cloud run');
console.log(JSON.stringify({ valid: true, rows: candidate.records.length, additions: candidate.records.length - live.records.length, reviewedOn: candidate.reviewedOn }));
