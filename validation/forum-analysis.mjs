const platformHosts = {
  PTT: ['ptt.cc'],
  Dcard: ['dcard.tw'],
  Threads: ['threads.com', 'threads.net'],
  Mobile01: ['mobile01.com', 'm.mobile01.com'],
};
export const forumReviewedOn = '2026-11-18';

function dateWeight(date, reviewedOn) {
  const age = (Date.parse(reviewedOn) - Date.parse(date ?? '')) / 86_400_000;
  if (!Number.isFinite(age) || age < 0) return 0.5;
  if (age <= 730) return 1;
  return age <= 1826 ? 0.65 : 0.3;
}

export function forumThreadKey(entry) {
  const url = new URL(entry.url);
  const host = url.hostname.replace(/^www\./, '');
  if (url.protocol !== 'https:' || url.username || url.password || !platformHosts[entry.platform]?.includes(host)) {
    throw new Error('Unrecognized forum source: ' + entry.url);
  }

  if (entry.platform === 'Dcard') {
    const id = url.pathname.match(/\/(?:p|post)\/(\d+)/)?.[1];
    if (id) return 'Dcard/' + id;
  }
  if (entry.platform === 'PTT' && /^\/bbs\/(?:Drink|Coffee)\/M\.[\w.]+\.html$/i.test(url.pathname)) {
    return 'PTT/' + url.pathname.toLowerCase();
  }
  if (entry.platform === 'Threads') {
    const id = url.pathname.match(/\/post\/([\w-]+)/)?.[1];
    if (id) return 'Threads/' + id;
  }
  if (entry.platform === 'Mobile01' && url.pathname === '/topicdetail.php') {
    const id = url.searchParams.get('t');
    if (/^\d+$/.test(id ?? '')) return 'Mobile01/' + id;
  }
  throw new Error('URL does not identify an original forum thread: ' + entry.url);
}

export function summarizeEvidence(entries, reviewedOn = forumReviewedOn) {
  const totals = { positive: 0, negative: 0, mixed: 0 };
  let weightedSupport = 0;
  let weight = 0;
  for (const { stance, date } of entries) {
    totals[stance] += 1;
    const entryWeight = dateWeight(date, reviewedOn);
    weight += entryWeight;
    if (stance === 'positive') weightedSupport += entryWeight;
    if (stance === 'mixed') weightedSupport += entryWeight / 2;
  }
  // A balanced prior of two positive and two negative signals shrinks tiny
  // samples toward neutral. A mixed thread contributes half to either side.
  const score = (weightedSupport + 2) / (weight + 4);
  return { ...totals, total: entries.length, score, entries };
}

export const emptyEvidence = Object.freeze(summarizeEvidence([]));

export function analyzeForum(records, shops, reviewedOn = forumReviewedOn) {
  const ids = new Set(shops.flatMap(shop => shop.drinks.map(drink => drink.id)));
  const byDrink = new Map();
  const threads = new Map();
  const confirmed = new Map();

  for (const entry of records) {
    if (!ids.has(entry.drinkId)) throw new Error('Forum item is outside the verified menu: ' + entry.drinkId);
    if (!['positive', 'negative', 'mixed'].includes(entry.stance) || !entry.note?.trim()) {
      throw new Error('Forum item is missing a usable opinion: ' + entry.url);
    }
    const thread = forumThreadKey(entry);
    const key = entry.drinkId + '|' + thread;
    const prior = confirmed.get(key);
    if (prior && prior.stance !== entry.stance) {
      confirmed.set(key, { ...prior, stance: 'mixed', note: prior.note + '。' + entry.note });
    } else if (!prior) {
      confirmed.set(key, entry);
    }
    threads.set(thread, entry.platform);
  }

  const dates = [];
  for (const entry of confirmed.values()) {
    if (!byDrink.has(entry.drinkId)) byDrink.set(entry.drinkId, []);
    byDrink.get(entry.drinkId).push(entry);
    if (entry.date) dates.push(entry.date);
  }
  for (const [id, entries] of byDrink) {
    entries.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '', 'en'));
    byDrink.set(id, summarizeEvidence(entries, reviewedOn));
  }

  const platforms = [...new Set(threads.values())].map(name => ({
    name,
    threads: [...threads.values()].filter(platform => platform === name).length,
  }));
  const allEntries = summarizeEvidence([...confirmed.values()], reviewedOn);
  dates.sort();
  return {
    byDrink,
    threadCount: threads.size,
    drinkCount: byDrink.size,
    rowCount: confirmed.size,
    reviewedOn,
    platforms,
    firstDate: dates.at(0) ?? null,
    lastDate: dates.at(-1) ?? null,
    totals: { positive: allEntries.positive, negative: allEntries.negative, mixed: allEntries.mixed },
  };
}
