import { readFile } from 'node:fs/promises';
import { validateCloudForumUpdate } from './validation/forum-cloud-validation.mjs';

const read = async name => JSON.parse(await readFile(new URL(name, import.meta.url), 'utf8'));
const { shops } = await read('./catalog.json');
const seed = await read('./forum-seed.json');
const source = JSON.parse(await readFile(process.argv[2] ?? new URL('./forum-daily.json', import.meta.url), 'utf8'));
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const response = await fetch('https://drink.bvivify.com/api/forum-daily', {
  headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(12000),
});
if (!response.ok) throw new Error('Cannot verify currently published data');
const { candidate, added, datesCorrected } = validateCloudForumUpdate(source, await response.json(), seed, shops, { today });
console.log(JSON.stringify({
  valid: true, rows: candidate.records.length, additions: added, datesCorrected,
  reviewedOn: candidate.reviewedOn,
}));
