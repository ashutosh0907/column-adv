import { getAllMarketplaceAds } from '../../config/ads'
import { ArrowUpRight } from '../icons'

interface MobileAdRailProps {
  position?: 'top' | 'bottom'
}

/**
 * Mobile running ad marquee banner that appears only on mobile screens (< 1024px).
 * Displays all marketplace ads continuously running in a smooth, slow-speed horizontal bar.
 */
export function MobileAdRail({ position = 'top' }: MobileAdRailProps) {
  const allAds = getAllMarketplaceAds()

  if (allAds.length === 0) {
    return null
  }

  // Duplicate items to ensure a seamless -50% CSS infinite marquee loop
  const duplicatedAds = [...allAds, ...allAds]

  return (
    <div
      className={`mobile-running-ad-bar mobile-running-ad-bar--${position}`}
      aria-label={`Sponsored running highlights, ${position} bar`}
    >
      <div
        className={`mobile-running-ad-track mobile-running-ad-track--${position}`}
      >
        {duplicatedAds.map((ad, idx) => (
          <div
            key={`${ad.id}-${idx}`}
            className={`mobile-running-ad-card ad-banner--${ad.tone ?? 'sand'}`}
          >
            {ad.image ? (
              <div className="mobile-running-ad-media">
                <img
                  src={ad.image}
                  alt=""
                  className="mobile-running-ad-img"
                  loading="lazy"
                />
              </div>
            ) : null}

            <div className="mobile-running-ad-content">
              {ad.eyebrow ? (
                <span className="mobile-running-ad-tag">{ad.eyebrow}</span>
              ) : null}

              <p className="mobile-running-ad-desc">
                {ad.description || ad.title}
              </p>

              <div className="mobile-running-ad-link">
                <span>{ad.ctaLabel ?? 'Explore'}</span>
                <ArrowUpRight width={12} height={12} aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
