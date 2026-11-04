import type { ResolvedAdPlacement } from '../../types/ads'
import { ArrowUpRight } from '../icons'
import { AdSlot } from './AdSlot'

interface AdBannerProps {
  ad: ResolvedAdPlacement
}

/**
 * Placeholder creative for one configured placement. Real ad markup can replace
 * the inner content without changing the slot or the page layout.
 */
export function AdBanner({ ad }: AdBannerProps) {
  return (
    <AdSlot
      width={ad.width}
      height={ad.height}
      label={ad.formatLabel}
      className={`ad-banner ad-banner--${ad.tone ?? 'sand'}`}
    >
      <div className="ad-banner__inner">
        <span className="ad-banner__tag">Ad</span>
        <span className="ad-banner__ornament" aria-hidden="true" />
        <div className="ad-banner__content">
          <p className="ad-banner__eyebrow">{ad.eyebrow}</p>
          <p className="ad-banner__title">{ad.title}</p>
          {ad.description ? (
            <p className="ad-banner__description">{ad.description}</p>
          ) : null}
          {ad.ctaLabel ? (
            <span className="ad-banner__cta">
              {ad.ctaLabel}
              <ArrowUpRight width={14} height={14} />
            </span>
          ) : null}
        </div>
      </div>
    </AdSlot>
  )
}
