# Column — product listing with ad rails

A responsive React + TypeScript product listing page with config-driven
advertisement placements. Built with Vite and plain CSS.

## Run it

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Structure

```
src/
  App.tsx                    page composition
  config/ads.ts              ad formats + placements (edit this to add ads)
  data/products.ts           mock product catalogue
  types/                     shared ad + product types
  lib/format.ts              price and discount helpers
  components/
    ads/
      AdSlot.tsx             low-level sized ad container
      AdBanner.tsx           placeholder creative
      AdSidebar.tsx          left/right sticky rail
      MobileAdRail.tsx       placements shown below 900px
      ads.css
    products/
      ProductGrid.tsx        collection header + responsive grid
      ProductCard.tsx        image, price, rating, CTA
      products.css
    layout/
      SiteHeader.tsx
      SiteFooter.tsx
```

## Adding an advertisement

All ad sizing lives in `src/config/ads.ts`:

1. Add a size preset to `adFormats`, for example:

   ```ts
   square: { label: 'Square', width: '100%', height: 280 },
   ```

2. Reference it from a placement under `left`, `right`, or `mobile`:

   ```ts
   {
     id: 'right-square',
     format: 'square',
     eyebrow: 'New season',
     title: 'A softer kind of workspace.',
     ctaLabel: 'Explore',
     tone: 'sage',
   }
   ```

Placements can also override `width`/`height` for one-off sizes. The
`AdBanner` creative adapts to its slot using CSS container queries, so new
sizes do not require changes to the product components or page layout.

## Layout

Page proportions are controlled by tokens in `src/index.css`:

- `--ad-rail-left`, `--ad-rail-right`
- `--layout-gap`, `--page-gutter`, `--container-max`
- `--radius-card`, `--radius-ad`

Breakpoints:

- `>= 1024px` — three columns with sticky ad rails and a 4-up product grid
- `800–1023px` — side rails hidden, mobile ad placement above the grid, 4-up products
- `521–799px` — 2-up product grid
- `<= 520px` — single product column

The product card is a container-query context, so the CTA collapses to an
icon button and labels compress when the four-up center column gets tight. Ad
cards use a smaller radius than product cards to keep the two systems visually
distinct.

## Notes

Product images are local SVG studio plates under `public/products/`. Ad
creative is placeholder content and is intentionally isolated in
`AdBanner.tsx` / `config/ads.ts` for a future ad integration.
