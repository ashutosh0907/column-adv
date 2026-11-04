import { useState, useEffect, useRef } from 'react'
import type { Product } from '../../types/product'
import { formatPrice } from '../../lib/format'
import { MessageCircleIcon, ArrowUpRight, FlameIcon, SparklesIcon, MapPinIcon } from '../icons'
import './boosted.css'

interface BoostedPostsRotatorProps {
  products: Product[]
  onOpenOffer?: (product: Product) => void
  onSelectProduct?: (product: Product) => void
  onBoostClick?: () => void
}

export function BoostedPostsRotator({
  products,
  onOpenOffer,
  onSelectProduct,
  onBoostClick,
}: BoostedPostsRotatorProps) {
  // Filter or prioritize products that have high buzz or badges
  const boostedList = products.slice(0, 6)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const count = boostedList.length

  useEffect(() => {
    if (count <= 1 || isHovered) return

    timerRef.current = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % count)
        setIsTransitioning(false)
      }, 220)
    }, 4000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [count, isHovered])

  if (count === 0) return null

  const currentProduct = boostedList[currentIndex]

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + count) % count)
      setIsTransitioning(false)
    }, 150)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % count)
      setIsTransitioning(false)
    }, 150)
  }

  const handleSelectProduct = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product)
    } else if (onOpenOffer) {
      onOpenOffer(product)
    }
  }

  return (
    <div
      className="boosted-rotator"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Boosted marketplace listings"
    >
      {/* Header with live lightning badge and navigation */}
      <div className="boosted-rotator__header">
        <div className="boosted-rotator__badge">
          <SparklesIcon width={12} height={12} className="boosted-rotator__sparkle" />
          <span>Boosted Post</span>
        </div>

        <div className="boosted-rotator__nav">
          <button
            type="button"
            className="boosted-rotator__arrow"
            onClick={handlePrev}
            aria-label="Previous boosted post"
          >
            ‹
          </button>
          <span className="boosted-rotator__count">
            {currentIndex + 1}/{count}
          </span>
          <button
            type="button"
            className="boosted-rotator__arrow"
            onClick={handleNext}
            aria-label="Next boosted post"
          >
            ›
          </button>
        </div>
      </div>

      {/* Rotating rectangular card */}
      <div
        className={`boosted-rotator__card ${isTransitioning ? 'is-transitioning' : ''}`}
        onClick={() => handleSelectProduct(currentProduct)}
      >
        <div className="boosted-rotator__media">
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="boosted-rotator__img"
            loading="lazy"
          />
          <span className="boosted-rotator__tag">Featured</span>
        </div>

        <div className="boosted-rotator__details">
          <h4 className="boosted-rotator__title">{currentProduct.name}</h4>

          <div className="boosted-rotator__price-row">
            <span className="boosted-rotator__price">
              {formatPrice(currentProduct.price)}
            </span>
            {currentProduct.compareAtPrice ? (
              <s className="boosted-rotator__compare">
                {formatPrice(currentProduct.compareAtPrice)}
              </s>
            ) : null}
          </div>

          <p className="boosted-rotator__location">
            <MapPinIcon width={11} height={11} />
            <span>{currentProduct.location?.split(',')[0] ?? 'Local'} · {currentProduct.distance ?? 'Nearby'}</span>
          </p>

          {currentProduct.chatCount ? (
            <div className="boosted-rotator__buzz">
              <FlameIcon width={11} height={11} />
              <span>{currentProduct.chatCount} buyers chatting now</span>
            </div>
          ) : null}

          <button
            type="button"
            className="boosted-rotator__cta"
            onClick={(e) => {
              e.stopPropagation()
              handleSelectProduct(currentProduct)
            }}
          >
            <MessageCircleIcon width={12} height={12} />
            <span>View &amp; Deal</span>
            <ArrowUpRight width={12} height={12} />
          </button>
        </div>
      </div>

      {/* Dots indicator */}
      <div className="boosted-rotator__dots" aria-hidden="true">
        {boostedList.map((_, idx) => (
          <span
            key={idx}
            className={`boosted-rotator__dot ${idx === currentIndex ? 'is-active' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(idx)
            }}
          />
        ))}
      </div>

      {/* Seller Promotion Footnote */}
      <div className="boosted-rotator__promo" onClick={onBoostClick}>
        <span>⚡ Sell faster · Boost your ad for ₹49</span>
        <ArrowUpRight width={11} height={11} />
      </div>
    </div>
  )
}
