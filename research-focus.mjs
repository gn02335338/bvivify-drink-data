import { readFile } from 'node:fs/promises';
import { researchFocus } from './validation/research-focus.mjs';
const read = async name => JSON.parse(await readFile(new URL(name, import.meta.url), 'utf8'));
const [catalog, plan, seed, daily] = await Promise.all(['catalog.json', 'research-plan.json', 'forum-seed.json', 'forum-daily.json'].map(read));
const date = process.argv[2] ?? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
console.log(JSON.stringify(researchFocus({ shops: catalog.shops, plan, seed, daily, date }), null, 2));
