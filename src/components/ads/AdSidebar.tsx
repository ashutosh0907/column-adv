import type { Product } from '../../types/product'
import { getPlacementAds } from '../../config/ads'
import { AdBanner } from './AdBanner'
import { BoostedPostsRotator } from './BoostedPostsRotator'

interface AdSidebarProps {
  position: 'left' | 'right'
  boostedProducts?: Product[]
  onOpenOffer?: (product: Product) => void
  onSelectProduct?: (product: Product) => void
  onOpenSellModal?: () => void
}

/**
 * Vertical ad rail. Placements and sizes come from `config/ads.ts`; the
 * sidebar only decides how the rail behaves on the page.
 */
export function AdSidebar({
  position,
  boostedProducts = [],
  onOpenOffer,
  onSelectProduct,
  onOpenSellModal,
}: AdSidebarProps) {
  const ads = getPlacementAds(position)

  // On the right rail, the top slot rotates boosted posts instead of the static 'right-leaderboard'
  const displayAds =
    position === 'right'
      ? ads.filter((ad) => ad.id !== 'right-leaderboard')
      : ads

  return (
    <aside
      className={`ad-rail ad-rail--${position}`}
      aria-label={`Sponsored placements, ${position} column`}
    >
      <div className="ad-rail__sticky">
        <div className="ad-rail__header">
          <span>{position === 'right' ? 'Sponsored & Boosted' : 'Sponsored'}</span>
          <span className="ad-rail__rule" aria-hidden="true" />
        </div>

        {position === 'right' && boostedProducts.length > 0 ? (
          <BoostedPostsRotator
            products={boostedProducts}
            onOpenOffer={onOpenOffer}
            onSelectProduct={onSelectProduct}
            onBoostClick={onOpenSellModal}
          />
        ) : null}

        {displayAds.map((ad) => (
          <AdBanner key={ad.id} ad={ad} />
        ))}
        <p className="ad-rail__footnote">Advertisement space</p>
      </div>
    </aside>
  )
}
