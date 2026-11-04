import type {
  AdFormat,
  AdPlacement,
  AdPosition,
  ResolvedAdPlacement,
} from '../types/ads'

/**
 * Ad size presets. Add a new format here and reference it from a placement —
 * no product or layout component needs to change.
 */
export const adFormats = {
  leaderboard: { label: 'Leaderboard', width: '100%', height: 96 },
  compact: { label: 'Compact', width: '100%', height: 132 },
  strip: { label: 'Mobile strip', width: '100%', height: 128 },
  featured: { label: 'Featured', width: '100%', height: 232 },
  tall: { label: 'Half page', width: '100%', height: 360 },
  skyscraper: { label: 'Skyscraper', width: '100%', height: 288 },
} satisfies Record<string, AdFormat>

export type AdFormatKey = keyof typeof adFormats

/**
 * Ad placements grouped by page position. Placeholder creative lives here so
 * real ad integration can replace this file without touching page components.
 */
export const adPlacements: Record<AdPosition, AdPlacement<AdFormatKey>[]> = {
  left: [
    {
      id: 'left-featured',
      format: 'tall',
      eyebrow: 'Instant Cash',
      title: 'Got unused stuff? Sell it today.',
      description:
        'Post free ads for electronics, mobiles, furniture, or bikes and connect with verified local buyers in minutes.',
      ctaLabel: 'Sell an item free',
      image: '/products/camera.svg',
      tone: 'sage',
    },
    {
      id: 'left-compact',
      format: 'compact',
      eyebrow: 'Bargain Radar',
      title: 'Save up to 60% on pre-owned gear.',
      description:
        'Find top-rated headphones, smartphones, cameras, and audio gear nearby.',
      ctaLabel: 'Explore deals',
      image: '/products/headphones.svg',
      tone: 'sand',
    },
  ],
  right: [
    {
      id: 'right-leaderboard',
      format: 'leaderboard',
      eyebrow: 'Zero Commission',
      title: '100% direct buyer-to-seller chat.',
      description:
        'Connect directly on WhatsApp or call with no platform cut or hidden fees.',
      ctaLabel: 'Post an ad',
      image: '/products/watch.svg',
      tone: 'clay',
    },
    {
      id: 'right-featured',
      format: 'featured',
      eyebrow: 'Local Safety',
      title: 'Meet in person. Inspect & pay.',
      description:
        'Meet at convenient public places, test the item thoroughly, and pay directly to the seller.',
      ctaLabel: 'Safety tips',
      image: '/products/backpack.svg',
      tone: 'ink',
    },
    {
      id: 'right-skyscraper',
      format: 'skyscraper',
      eyebrow: 'Fast Liquidity',
      title: 'Turn your clutter into cash.',
      description:
        'Over 10,000+ local buyers browsing daily for smartphones, laptops, vehicles, and furniture.',
      ctaLabel: 'Start selling',
      image: '/products/keyboard.svg',
      tone: 'sky',
    },
  ],
  mobile: [
    {
      id: 'mobile-strip',
      format: 'strip',
      eyebrow: 'Quick Sell',
      title: 'Sell anything locally in 60 seconds.',
      description:
        'Snap a photo, set your price, and deal with verified nearby buyers today.',
      ctaLabel: 'Post ad free',
      image: '/products/speaker.svg',
      tone: 'clay',
    },
  ],
}

/** Resolve a position's placements against their size formats. */
export function getPlacementAds(position: AdPosition): ResolvedAdPlacement[] {
  return adPlacements[position].map((placement) => {
    const format = adFormats[placement.format]

    return {
      ...placement,
      formatLabel: format.label,
      width: placement.width ?? format.width,
      height: placement.height ?? format.height,
    }
  })
}

/** Get all placements across all rails for the mobile running marquee banner */
export function getAllMarketplaceAds(): ResolvedAdPlacement[] {
  const allPlacements = [
    ...adPlacements.left,
    ...adPlacements.right,
    ...adPlacements.mobile,
  ]

  return allPlacements.map((placement) => {
    const format = adFormats[placement.format]

    return {
      ...placement,
      formatLabel: format.label,
      width: placement.width ?? format.width,
      height: placement.height ?? format.height,
    }
  })
}
