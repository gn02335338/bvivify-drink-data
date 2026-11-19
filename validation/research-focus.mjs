import { forumThreadKey } from './forum-analysis.mjs';

const DAY_MS = 86_400_000;
const DAILY_LIMITS = Object.freeze({ originalPosts: 12, additions: 5 });

function calendarDay(value, label = 'date') {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new RangeError(`${label} must be a valid Taiwan YYYY-MM-DD calendar date`);
  const time = Date.parse(value + 'T00:00:00.000Z');
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new RangeError(`${label} must be a valid Taiwan YYYY-MM-DD calendar date`);
  return time / DAY_MS;
}

function rotation(values, rotation, today, label) {
  if (!values.length || !rotation) return [];
  const anchor = calendarDay(rotation.anchorDate, `${label}.anchorDate`);
  // A plan can request less work, but never exceed the agreed three targets.
  const requested = rotation.itemsPerDay ?? rotation.brandsPerDay ?? 3;
  const stride = Number.isInteger(requested) && requested > 0 ? Math.min(3, requested) : 3;
  const count = Math.min(stride, values.length);
  const start = ((today - anchor) * stride % values.length + values.length) % values.length;
  return Array.from({ length: count }, (_, i) => values[(start + i) % values.length]);
}

/** Build a compact, deterministic research queue. Targets are not new evidence. */
export function researchFocus({ shops, plan, seed = [], daily = { records: [] }, date } = {}) {
  const today = calendarDay(date);
  if (!Array.isArray(shops) || !plan || typeof plan !== 'object') throw new TypeError('shops and plan are required');
  const warnings = [];
  const brands = new Map();
  const drinks = new Map();
  for (const shop of shops) {
    if (!shop || typeof shop.slug !== 'string' || brands.has(shop.slug) || !Array.isArray(shop.drinks)) throw new TypeError('Catalog brands must have unique slugs and drink arrays');
    brands.set(shop.slug, shop);
    for (const drink of shop.drinks) {
      if (!drink || typeof drink.id !== 'string' || !drink.id || drinks.has(drink.id)) throw new TypeError('Catalog drinks must have unique stable IDs');
      drinks.set(drink.id, { drink, shop });
    }
  }
  const evidence = new Map();
  const originals = new Map();
  let invalidRecords = 0;
  const recordsOf = value => Array.isArray(value) ? value : Array.isArray(value?.records) ? value.records : [];
  const records = [...recordsOf(seed), ...recordsOf(daily)];
  for (const record of records) {
    if (!record || !drinks.has(record.drinkId)) { invalidRecords++; continue; }
    try {
      const key = forumThreadKey(record);
      if (!evidence.has(record.drinkId)) evidence.set(record.drinkId, new Set());
      evidence.get(record.drinkId).add(key);
      if (!originals.has(key)) originals.set(key, { key, platform: record.platform, url: record.url, dates: new Set(), drinkIds: new Set() });
      const original = originals.get(key);
      original.drinkIds.add(record.drinkId);
      try { calendarDay(record.date); original.dates.add(record.date); } catch { /* Date remains unconfirmed. */ }
    } catch { invalidRecords++; }
  }
  if (invalidRecords) warnings.push(`Ignored ${invalidRecords} invalid or unknown evidence records`);
  const sampleCount = id => evidence.get(id)?.size ?? 0;
  const shopSamples = shop => new Set(shop.drinks.flatMap(drink => [...(evidence.get(drink.id) ?? [])])).size;
  const lowSampleDrinks = shop => shop.drinks.map((drink, position) => ({ drink, position }))
    .sort((a, b) => sampleCount(a.drink.id) - sampleCount(b.drink.id) || a.position - b.position)
    .slice(0, 2).map(item => item.drink.id);
  function knownValues(values, known, label) {
    const result = [];
    for (const value of Array.isArray(values) ? values : []) {
      if (typeof value !== 'string' || !known.has(value)) { warnings.push(`Ignored unknown ${label}: ${String(value)}`); continue; }
      if (!result.includes(value)) result.push(value);
    }
    return result;
  }
  const focusBrands = [];
  const priorityDrinks = [];
  const focused = new Map();
  const prioritized = new Map();
  function focus(shop, reason) {
    if (focused.has(shop.slug)) return;
    const target = { slug: shop.slug, name: shop.name, type: shop.type, sampleCount: shopSamples(shop), reason };
    focused.set(shop.slug, target); focusBrands.push(target);
  }
  function prioritize(id, reason) {
    if (prioritized.has(id)) return;
    const { drink, shop } = drinks.get(id);
    focus(shop, reason);
    const target = {
      id, name: drink.name, shopSlug: shop.slug, shopName: shop.name, type: shop.type,
      sourceUrl: drink.sourceUrl ?? shop.officialUrl ?? '', region: shop.region ?? '',
      order: drink.order ?? '', menuSourceLabel: shop.menuSourceLabel ?? '官方菜單',
      sampleCount: sampleCount(id), reason,
    };
    prioritized.set(id, target); priorityDrinks.push(target);
  }
  const recentSearches = [];
  const dateBackfillTargets = [];
  let freshness;
  const freshnessPlan = plan.freshnessResearch;
  if (freshnessPlan) {
    const corrections = new Map();
    const invalidCorrections = new Set();
    for (const correction of recordsOf(daily.dateCorrections)) {
      let key;
      try {
        key = forumThreadKey(correction);
        const posted = calendarDay(correction.date);
        const verified = calendarDay(correction.verifiedOn);
        if (!originals.has(key) || posted > verified || verified > today ||
          typeof correction.dateEvidence !== 'string' || correction.dateEvidence.trim().length < 20 || correction.dateEvidence.trim().length > 240) {
          throw new Error('Invalid date correction');
        }
        const known = originals.get(key).dates;
        if (known.size && (known.size !== 1 || !known.has(correction.date))) throw new Error('Conflicting original dates');
        if (corrections.has(key) && corrections.get(key) !== correction.date) throw new Error('Conflicting original dates');
        corrections.set(key, correction.date);
      } catch {
        if (key) invalidCorrections.add(key);
        warnings.push('Ignored an invalid or conflicting original publication-date correction');
      }
    }
    for (const key of invalidCorrections) corrections.delete(key);
    for (const original of originals.values()) {
      original.date = corrections.get(original.key) ?? (original.dates.size === 1 ? [...original.dates][0] : null);
    }
    const windows = [7, 30].map(days => ({ days, from: new Date((today - days + 1) * DAY_MS).toISOString().slice(0, 10), to: date }));
    const recentBrands = [];
    for (const type of ['tea', 'coffee']) {
      const candidates = [...brands.values()].filter(shop => shop.type === type && shop.drinks.length);
      for (const slug of rotation(candidates.map(shop => shop.slug), {
        anchorDate: freshnessPlan.anchorDate, brandsPerDay: 1,
      }, today, 'freshnessResearch')) {
        const shop = brands.get(slug);
        focus(shop, '近期原帖優先：確認原始發文日');
        recentBrands.push(shop);
      }
    }
    for (const window of windows) {
      for (const shop of recentBrands) recentSearches.push({
        windowDays: window.days, from: window.from, to: window.to,
        shopSlug: shop.slug, shopName: shop.name, type: shop.type,
        queryHint: shop.name + ' 飲用心得 ' + window.from + ' ' + window.to,
        rule: 'Read the original first-hand post and confirm its original publication date within this inclusive window. Search snippets, modified dates, crawl times and review times are not publication-date evidence.',
      });
    }
    const unknown = [...originals.values()].filter(original => !original.date);
    const count = Math.min(2, Number.isInteger(freshnessPlan.dateBackfillsPerDay) ? Math.max(0, freshnessPlan.dateBackfillsPerDay) : 2);
    const keys = rotation(unknown.map(original => original.key), {
      anchorDate: freshnessPlan.anchorDate, itemsPerDay: count || 1,
    }, today, 'freshnessResearch');
    for (const key of count ? keys.slice(0, count) : []) {
      const original = originals.get(key);
      dateBackfillTargets.push({
        platform: original.platform, url: original.url, drinkIds: [...original.drinkIds],
        rule: 'Confirm the original publication date from the original page. Append a dateCorrections entry with verifiedOn and 20–240 character dateEvidence; leave unknown if the original date is unavailable. Never use an update or modification timestamp.',
      });
    }
    freshness = {
      asOf: date,
      uniqueThreads: originals.size,
      unknownDateThreads: unknown.length,
      windows: windows.map(window => ({ ...window, verifiedOriginals: [...originals.values()].filter(original => original.date && original.date >= window.from && original.date <= window.to).length })),
    };
  }
  const expanded = plan.expandedDrinkRotation;
  const expandedIds = knownValues(expanded?.drinkIds, drinks, 'drink ID');
  for (const id of rotation(expandedIds, expanded, today, 'expandedDrinkRotation')) prioritize(id, '新擴充品項輪替');
  const onboarding = plan.onboardingRotation;
  const brandSlugs = knownValues(onboarding?.brandSlugs, brands, 'brand slug');
  for (const slug of rotation(brandSlugs, onboarding, today, 'onboardingRotation')) {
    const shop = brands.get(slug); focus(shop, '品牌輪替：低樣本優先');
    for (const id of lowSampleDrinks(shop)) prioritize(id, '品牌輪替：低樣本優先');
  }
  for (const type of ['tea', 'coffee']) {
    if (focusBrands.some(shop => shop.type === type)) continue;
    const shop = [...brands.values()].filter(shop => shop.type === type && shop.drinks.length)
      .sort((a, b) => shopSamples(a) - shopSamples(b))[0];
    if (!shop) { warnings.push(`No ${type} brand is available in the catalog`); continue; }
    const reason = type === 'tea' ? '補足手搖飲品牌：低樣本優先' : '補足咖啡品牌：低樣本優先';
    focus(shop, reason);
    for (const id of lowSampleDrinks(shop)) prioritize(id, reason);
  }
  return {
    date, catalogCounts: { brands: brands.size, drinks: drinks.size },
    limits: { ...DAILY_LIMITS, ...(freshnessPlan ? { dateCorrections: 2 } : {}) },
    ...(freshnessPlan ? { priorityStages: ['recent_7_days', 'recent_30_days', 'publication_date_backfill', 'expanded_drink_rotation', 'onboarding_rotation'], freshness, recentSearches, dateBackfillTargets } : {}),
    focusBrands, priorityDrinks, warnings,
  };
}
