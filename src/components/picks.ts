import { getCollection } from 'astro:content';

// One shape for every card on the Picks page and the homepage teaser,
// whether it came from a Picks entry or from a review with "Add to OTD Picks" checked.
export interface PickItem {
  key: string;
  title: string;
  description: string;
  category: string;
  retailer: string;
  shopUrl: string;
  reviewLink?: string;
  rating?: string;
  priceNoted?: string;
  date?: string;
  entry?: any; // the original Picks entry, so its notes can still render
}

// Turn a shop link into a retailer name: amzn.to -> Amazon, surfshark.club -> Surfshark, anything else -> its address
export function retailerFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'amzn.to' || host.startsWith('amazon.')) return 'Amazon';
    // Brands whose referral links use a different domain than their name
    const known: Record<string, string> = { surfshark: 'Surfshark', lifewave: 'LifeWave' };
    const base = host.split('.').slice(-2, -1)[0] || host;
    if (known[base]) return known[base];
    // Otherwise show the site's own address, e.g. beanproducts.com
    return host;
  } catch {
    return 'Shop';
  }
}

export async function getAllPicks(): Promise<PickItem[]> {
  const manual = await getCollection('picks', ({ data }: any) => data.active !== false);
  const manualItems: PickItem[] = manual.map((p: any) => ({
    key: `picks/${p.id}`,
    title: p.data.title,
    description: p.data.description,
    category: p.data.category ?? '',
    retailer: p.data.retailer || retailerFromUrl(p.data.affiliateUrl),
    shopUrl: p.data.affiliateUrl,
    reviewLink: p.data.reviewLink || undefined,
    rating: p.data.rating || undefined,
    priceNoted: p.data.priceNoted || undefined,
    entry: p,
  }));

  // A review already linked from a hand-made Pick shows only once
  const linked = new Set(manualItems.map((m) => (m.reviewLink ?? '').replace(/\/+$/, '')));

  const gear = await getCollection('gear', ({ data }: any) => data.addToPicks === true && !data.draft);
  const reviewItems: PickItem[] = gear
    .map((g: any) => {
      const slug = g.id.replace(/\.mdoc$/, '');
      const path = `/gear/${slug}`;
      const first = (g.data.affiliateLinks ?? []).find((l: any) => l?.url);
      // Shop link: the review's affiliate link if it has one, otherwise its retailer link
      const shopUrl = first?.url || g.data.website || g.data.manufacturerUrl || '';
      return {
        key: `gear/${slug}`,
        title: g.data.title,
        description: g.data.picksBlurb || g.data.description || '',
        category: g.data.picksCategory ?? '',
        retailer: retailerFromUrl(shopUrl),
        shopUrl,
        reviewLink: path,
        rating: g.data.rating || undefined,
        priceNoted: first?.priceNoted || undefined,
        date: g.data.date,
      } as PickItem;
    })
    .filter((r: PickItem) => r.shopUrl && !linked.has(r.reviewLink!))
    .sort((a: PickItem, b: PickItem) => new Date(b.date!).valueOf() - new Date(a.date!).valueOf());

  // Newest reviewed picks first, then the hand-made Picks in their usual order
  return [...reviewItems, ...manualItems];
}
