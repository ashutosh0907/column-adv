import { FlameIcon, SparklesIcon } from '../icons'
import './marketplace.css'

interface MarketplaceLivePulseProps {
  totalListings: number
  onlineCount: number
  city?: string
}

export function MarketplaceLivePulse({
  totalListings,
  onlineCount,
  city = 'India',
}: MarketplaceLivePulseProps) {
  return (
    <div className="marketplace-live-pulse" role="status" aria-label="Marketplace live activity">
      <div className="marketplace-live-pulse__item">
        <span className="marketplace-live-pulse__indicator">
          <span className="marketplace-live-pulse__dot" />
          <span className="marketplace-live-pulse__ping" />
        </span>
        <span className="marketplace-live-pulse__text">
          <strong>{totalListings} verified listings</strong> · <strong>{onlineCount || 6} online now</strong> in {city}
        </span>
      </div>

      <div className="marketplace-live-pulse__divider" aria-hidden="true" />

      <div className="marketplace-live-pulse__item">
        <FlameIcon width={13} height={13} className="marketplace-live-pulse__icon--flame" />
        <span className="marketplace-live-pulse__text">
          <strong>18 verified deals</strong> closed nearby today
        </span>
      </div>

      <div className="marketplace-live-pulse__divider" aria-hidden="true" />

      <div className="marketplace-live-pulse__item">
        <SparklesIcon width={13} height={13} className="marketplace-live-pulse__icon--sparkle" />
        <span className="marketplace-live-pulse__text">
          Avg. seller reply time: <strong>&lt; 5 mins</strong> · Zero commission
        </span>
      </div>
    </div>
  )
}
