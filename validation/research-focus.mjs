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
  let invalidRecords = 0;
  const recordsOf = value => Array.isArray(value) ? value : Array.isArray(value?.records) ? value.records : [];
  const records = [...recordsOf(seed), ...recordsOf(daily)];
  for (const record of records) {
    if (!record || !drinks.has(record.drinkId)) { invalidRecords++; continue; }
    try {
      const key = forumThreadKey(record);
      if (!evidence.has(record.drinkId)) evidence.set(record.drinkId, new Set());
      evidence.get(record.drinkId).add(key);
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
  return { date, catalogCounts: { brands: brands.size, drinks: drinks.size }, limits: { ...DAILY_LIMITS }, focusBrands, priorityDrinks, warnings };
}
