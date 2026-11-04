import { useState, useEffect, useRef, type FormEvent } from 'react'
import type { Product } from '../../types/product'
import { formatPrice, getDiscountPercent } from '../../lib/format'
import {
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  StarIcon,
  MapPinIcon,
  MessageCircleIcon,
  CheckIcon,
  SendIcon,
  ShieldCheckIcon,
  PhoneIcon,
  TagIcon,
  ClockIcon,
  BoxIcon,
  ArrowUpRight,
  FlameIcon,
} from '../icons'
import Loader from '../Loader'
import './pdp.css'

interface ProductDetailPageProps {
  product: Product
  onBack: () => void
  isSaved?: boolean
  onToggleSave?: (productId: string) => void
  onSubmitOffer?: (product: Product, amount: number, message: string) => void
  onSelectProduct?: (product: Product) => void
  relatedProducts?: Product[]
}

export function ProductDetailPage({
  product,
  onBack,
  isSaved = false,
  onToggleSave,
  onSubmitOffer,
  onSelectProduct,
  relatedProducts = [],
}: ProductDetailPageProps) {
  // Gallery images (fallback to multiple angles of the product image)
  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.image, product.image, product.image]

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showPhone, setShowPhone] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [offerSuccessMessage, setOfferSuccessMessage] = useState<string | null>(null)

  // Quick offer presets
  const discount15 = Math.round((product.price * 0.85) / 100) * 100
  const discount10 = Math.round((product.price * 0.9) / 100) * 100
  const discount5 = Math.round((product.price * 0.95) / 100) * 100

  const [customOfferAmount, setCustomOfferAmount] = useState<number>(discount10)
  const [chatMessage, setChatMessage] = useState<string>(
    'Hi, is this still available? Can we meet locally today?'
  )

  const offerSectionRef = useRef<HTMLDivElement>(null)

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const mainEl = document.querySelector('.viewport-center-column')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setActiveImageIndex(0)
    setOfferSuccessMessage(null)
    setShowPhone(false)
  }, [product.id])

  const discountPercent = getDiscountPercent(product.price, product.compareAtPrice)

  // Seller computed properties with realistic fallbacks
  const sellerName = product.sellerName ?? 'Vikram R.'
  const sellerRating = product.sellerRating ?? product.rating ?? 4.9
  const sellerReviews = product.sellerReviewCount ?? product.reviewCount ?? 38
  const sellerJoined = product.sellerJoined ?? 'Member since 2022'
  const sellerPhone = product.sellerPhone ?? '+91 98450 •••••'
  const sellerFullPhone = '+91 98450 12894'

  const quickQuestions = [
    'Is this item still available?',
    `Can we meet today in ${product.location?.split(',')[0] ?? 'public'}?`,
    'Is the price negotiable for immediate cash?',
    'Do you have the original bill and box?',
  ]

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} on Column`,
          text: `Check out ${product.name} for ${formatPrice(product.price)} on Column Classifieds!`,
          url: window.location.href,
        })
        return
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    navigator.clipboard?.writeText(window.location.href)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2500)
  }

  const handleQuickOfferSelect = (amount: number) => {
    setCustomOfferAmount(amount)
    setChatMessage(`Hi, would you accept ${formatPrice(amount)} for ${product.name}? I can meet today.`)
  }

  const handleOfferSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!customOfferAmount || customOfferAmount <= 0) return

    setIsSubmittingOffer(true)
    setTimeout(() => {
      setIsSubmittingOffer(false)
      setOfferSuccessMessage(
        `✓ Offer of ${formatPrice(customOfferAmount)} sent to ${sellerName}! The seller has been notified via instant chat.`
      )
      onSubmitOffer?.(product, customOfferAmount, chatMessage)
    }, 700)
  }

  const scrollToOffer = () => {
    offerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const input = document.getElementById('pdp-offer-input')
    if (input) {
      input.focus()
    }
  }

  return (
    <div className="pdp-page" role="main" aria-label={`Product details for ${product.name}`}>
      {isSubmittingOffer && <Loader fullPage />}

      {/* Top Navigation & Breadcrumbs Bar */}
      <div className="pdp-topbar">
        <div className="pdp-topbar__inner">
          <button
            type="button"
            className="pdp-back-button"
            onClick={onBack}
            aria-label="Back to listings"
          >
            <ArrowLeftIcon width={16} height={16} />
            <span>Back to Listings</span>
          </button>

          <nav className="pdp-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <button type="button" onClick={onBack} className="pdp-breadcrumb-link">
                  Classifieds
                </button>
              </li>
              <li>
                <span>{product.location ? product.location.split(',')[0] : 'India'}</span>
              </li>
              <li>
                <span>{product.category}</span>
              </li>
              <li aria-current="page" className="pdp-breadcrumb-current">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="pdp-topbar__actions">
            <button
              type="button"
              className="pdp-action-btn"
              onClick={handleShare}
              title="Share listing"
              aria-label="Share listing"
            >
              <ShareIcon width={16} height={16} />
              <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              className={`pdp-action-btn pdp-action-btn--wishlist ${isSaved ? 'is-saved' : ''}`}
              onClick={() => onToggleSave?.(product.id)}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <HeartIcon
                width={16}
                height={16}
                fill={isSaved ? 'var(--color-clay)' : 'none'}
                stroke={isSaved ? 'var(--color-clay)' : 'currentColor'}
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main PDP Grid: Left (Visuals & Specs) + Right (Pricing, Deal & Seller) */}
      <div className="pdp-content-container">
        <div className="pdp-grid">
          {/* ================= LEFT COLUMN ================= */}
          <div className="pdp-left-col">
            {/* Visual Media Gallery */}
            <div className="pdp-gallery-card">
              <div className="pdp-main-media">
                <img
                  src={galleryImages[activeImageIndex] || product.image}
                  alt={`${product.name} view ${activeImageIndex + 1}`}
                  className="pdp-main-image"
                />

                {/* Overlaid Badges */}
                <div className="pdp-image-badges">
                  {product.condition ? (
                    <span className="pdp-badge pdp-badge--condition">
                      {product.condition}
                    </span>
                  ) : null}

                  {product.verified ? (
                    <span className="pdp-badge pdp-badge--verified">
                      <ShieldCheckIcon width={13} height={13} />
                      <span>Verified Listing</span>
                    </span>
                  ) : null}

                  {discountPercent ? (
                    <span className="pdp-badge pdp-badge--discount">
                      −{discountPercent}% OFF
                    </span>
                  ) : null}
                </div>

                {/* Live Social Proof Badge */}
                <div className="pdp-live-viewer-chip">
                  <FlameIcon width={13} height={13} className="pdp-flame-icon" />
                  <span>
                    <strong>{product.viewCount ?? 14} people</strong> looking right now ·{' '}
                    {product.chatCount ?? 4} active chats
                  </span>
                </div>
              </div>

              {/* Multi-angle Thumbnail Strip */}
              <div className="pdp-thumbnails" role="tablist" aria-label="Product image thumbnails">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={activeImageIndex === idx}
                    className={`pdp-thumb-btn ${activeImageIndex === idx ? 'is-active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img src={img} alt="" aria-hidden="true" />
                    <span className="pdp-thumb-label">
                      {idx === 0 ? 'Primary' : idx === 1 ? 'Angle 2' : 'Angle 3'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Inclusions & Guarantees Highlights Bar */}
            <div className="pdp-highlights-row">
              <div className="pdp-highlight-pill">
                <BoxIcon width={13} height={13} className="pdp-pill-icon" />
                <span className="pdp-pill-title">Inclusions:</span>
                <span className="pdp-pill-sub">Box, Bill &amp; Cable</span>
              </div>

              <div className="pdp-highlight-pill">
                <ShieldCheckIcon width={13} height={13} className="pdp-pill-icon" />
                <span className="pdp-pill-title">Safety:</span>
                <span className="pdp-pill-sub">100% In-Person Test</span>
              </div>

              <div className="pdp-highlight-pill">
                <MapPinIcon width={13} height={13} className="pdp-pill-icon" />
                <span className="pdp-pill-title">Locality:</span>
                <span className="pdp-pill-sub">{product.location ?? 'Bengaluru'}</span>
              </div>

              <div className="pdp-highlight-pill">
                <ClockIcon width={13} height={13} className="pdp-pill-icon" />
                <span className="pdp-pill-title">Handover:</span>
                <span className="pdp-pill-sub">Same Day Deal</span>
              </div>
            </div>

            {/* Item Specifications */}
            <section className="pdp-section-card" aria-labelledby="pdp-specs-heading">
              <div className="pdp-section-card__header">
                <TagIcon width={16} height={16} />
                <h2 id="pdp-specs-heading" className="pdp-section-title">
                  Item Specifications &amp; Details
                </h2>
              </div>

              <div className="pdp-specs-grid">
                <div className="pdp-spec-item">
                  <span className="pdp-spec-label">Category</span>
                  <span className="pdp-spec-val">{product.category}</span>
                </div>
                <div className="pdp-spec-item">
                  <span className="pdp-spec-label">Condition</span>
                  <span className="pdp-spec-val">{product.condition ?? 'Like New'}</span>
                </div>
                <div className="pdp-spec-item">
                  <span className="pdp-spec-label">Location</span>
                  <span className="pdp-spec-val">
                    {product.location ?? 'India'} ({product.distance ?? 'Nearby'})
                  </span>
                </div>
                <div className="pdp-spec-item">
                  <span className="pdp-spec-label">Verified Device</span>
                  <span className="pdp-spec-val pdp-spec-val--green">
                    ✓ Authenticity Checked
                  </span>
                </div>
                <div className="pdp-spec-item">
                  <span className="pdp-spec-label">Original Box &amp; Bill</span>
                  <span className="pdp-spec-val">Available with Seller</span>
                </div>
                <div className="pdp-spec-item">
                  <span className="pdp-spec-label">Price Negotiable</span>
                  <span className="pdp-spec-val">Yes, open to reasonable offers</span>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="pdp-section-card" aria-labelledby="pdp-desc-heading">
              <div className="pdp-section-card__header">
                <MessageCircleIcon width={16} height={16} />
                <h2 id="pdp-desc-heading" className="pdp-section-title">
                  Description from Seller
                </h2>
              </div>

              <div className="pdp-description-body">
                <p>{product.description}</p>
                <p>
                  Selling because upgraded recently. The item has been maintained meticulously in a
                  smoke-free home. No physical damages, scratches, or functional issues. Feel free
                  to inspect and test the device thoroughly during meetup before paying.
                </p>
                <div className="pdp-desc-bullet-list">
                  <div className="pdp-desc-bullet">
                    <CheckIcon width={14} height={14} className="pdp-check" />
                    <span>Tested fully operational with zero defects</span>
                  </div>
                  <div className="pdp-desc-bullet">
                    <CheckIcon width={14} height={14} className="pdp-check" />
                    <span>All original accessories &amp; documentation included</span>
                  </div>
                  <div className="pdp-desc-bullet">
                    <CheckIcon width={14} height={14} className="pdp-check" />
                    <span>Ready for immediate handover in {product.location ?? 'public area'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Safety & Local Deal Guarantee Banner */}
            <div className="pdp-safety-banner">
              <div className="pdp-safety-banner__icon">
                <ShieldCheckIcon width={24} height={24} />
              </div>
              <div className="pdp-safety-banner__body">
                <h3 className="pdp-safety-banner__title">Column Local Meetup Safety Tips</h3>
                <ul className="pdp-safety-banner__list">
                  <li>Meet the seller in a safe, busy public place (Metro station, cafe, or mall).</li>
                  <li>Inspect and verify the item and all accessories thoroughly before payment.</li>
                  <li>Never transfer advance tokens or UPI deposits prior to physical inspection.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN (STICKY) ================= */}
          <div className="pdp-right-col">
            <div className="pdp-sidebar-sticky">
              {/* Main Price & Title Card */}
              <div className="pdp-summary-card">
                <div className="pdp-summary-card__header">
                  <div className="pdp-pricing-headline">
                    <span className="pdp-price">{formatPrice(product.price)}</span>
                    {product.compareAtPrice ? (
                      <span className="pdp-compare-price">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    ) : null}
                    {discountPercent ? (
                      <span className="pdp-discount-tag">
                        Save {discountPercent}%
                      </span>
                    ) : null}
                  </div>

                  <div className="pdp-negotiable-badge">
                    <span className="pdp-negotiable-dot" />
                    <span>Price Negotiable · Direct Deal</span>
                  </div>
                </div>

                <h1 className="pdp-product-title">{product.name}</h1>

                <div className="pdp-item-submeta">
                  <span className="pdp-submeta-item">
                    <MapPinIcon width={13} height={13} />
                    <span>{product.location ?? 'Bengaluru, India'}</span>
                  </span>
                  <span className="pdp-submeta-divider">•</span>
                  <span className="pdp-submeta-item">
                    <ClockIcon width={13} height={13} />
                    <span>Posted 2 hours ago</span>
                  </span>
                </div>
              </div>

              {/* Direct Deal & Instant Offer Box (Replaces Bottom Sheet Modal) */}
              <div
                ref={offerSectionRef}
                className="pdp-offer-box"
                aria-labelledby="pdp-offer-heading"
              >
                <div className="pdp-offer-box__header">
                  <div>
                    <span className="pdp-offer-badge">1-Tap Direct Deal</span>
                    <h2 id="pdp-offer-heading" className="pdp-offer-title">
                      Make an Offer to Seller
                    </h2>
                  </div>
                  <span className="pdp-zero-fee-chip">0% Commission</span>
                </div>

                {offerSuccessMessage ? (
                  <div className="pdp-offer-success" role="alert">
                    <div className="pdp-offer-success__icon">
                      <CheckIcon width={18} height={18} />
                    </div>
                    <div>
                      <p className="pdp-offer-success__text">{offerSuccessMessage}</p>
                      <button
                        type="button"
                        className="pdp-offer-reset-btn"
                        onClick={() => setOfferSuccessMessage(null)}
                      >
                        Send another counter-offer
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleOfferSubmit} className="pdp-offer-form">
                    {/* Quick discount chips */}
                    <div className="pdp-quick-presets" aria-label="Quick discount offers">
                      <button
                        type="button"
                        className={`pdp-preset-btn ${customOfferAmount === discount15 ? 'is-selected' : ''}`}
                        onClick={() => handleQuickOfferSelect(discount15)}
                      >
                        <span className="pdp-preset-val">{formatPrice(discount15)}</span>
                        <span className="pdp-preset-sub">−15% Deal</span>
                      </button>

                      <button
                        type="button"
                        className={`pdp-preset-btn ${customOfferAmount === discount10 ? 'is-selected' : ''}`}
                        onClick={() => handleQuickOfferSelect(discount10)}
                      >
                        <span className="pdp-preset-val">{formatPrice(discount10)}</span>
                        <span className="pdp-preset-sub">−10% Deal</span>
                      </button>

                      <button
                        type="button"
                        className={`pdp-preset-btn ${customOfferAmount === discount5 ? 'is-selected' : ''}`}
                        onClick={() => handleQuickOfferSelect(discount5)}
                      >
                        <span className="pdp-preset-val">{formatPrice(discount5)}</span>
                        <span className="pdp-preset-sub">−5% Deal</span>
                      </button>

                      <button
                        type="button"
                        className={`pdp-preset-btn ${customOfferAmount === product.price ? 'is-selected' : ''}`}
                        onClick={() => handleQuickOfferSelect(product.price)}
                      >
                        <span className="pdp-preset-val">{formatPrice(product.price)}</span>
                        <span className="pdp-preset-sub">Full Asking</span>
                      </button>
                    </div>

                    {/* Numeric Offer Amount Input */}
                    <div className="pdp-input-group">
                      <label htmlFor="pdp-offer-input" className="pdp-input-label">
                        Your Offer Amount (₹)
                      </label>
                      <div className="pdp-input-wrapper">
                        <span className="pdp-currency-symbol">₹</span>
                        <input
                          id="pdp-offer-input"
                          type="number"
                          min={Math.round(product.price * 0.4)}
                          max={product.price * 1.5}
                          step={100}
                          value={customOfferAmount}
                          onChange={(e) => setCustomOfferAmount(Number(e.target.value))}
                          className="pdp-input-field"
                          placeholder="Enter your offer"
                          required
                        />
                      </div>
                    </div>

                    {/* Quick inquiry pills */}
                    <div className="pdp-quick-queries">
                      <p className="pdp-queries-label">Quick message suggestion:</p>
                      <div className="pdp-queries-list">
                        {quickQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="pdp-query-chip"
                            onClick={() => setChatMessage(q)}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat note textarea */}
                    <div className="pdp-input-group">
                      <label htmlFor="pdp-chat-note" className="pdp-input-label">
                        Message to Seller
                      </label>
                      <textarea
                        id="pdp-chat-note"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="pdp-textarea"
                        rows={2}
                        placeholder="Write a message to seller..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="pdp-submit-offer-btn">
                      <SendIcon width={16} height={16} />
                      <span>Send Offer &amp; Start Chat</span>
                      <ArrowUpRight width={15} height={15} />
                    </button>
                  </form>
                )}
              </div>

              {/* Verified Seller Card */}
              <div className="pdp-seller-card" aria-label="Seller profile">
                <div className="pdp-seller-header">
                  <div className="pdp-seller-avatar">
                    <span>{sellerName.charAt(0)}</span>
                    <span
                      className={`pdp-seller-ping ${
                        product.sellerStatus === 'online' ? 'is-online' : ''
                      }`}
                      title={product.sellerActiveText ?? 'Online'}
                    />
                  </div>

                  <div className="pdp-seller-info">
                    <div className="pdp-seller-name-row">
                      <h3 className="pdp-seller-name">{sellerName}</h3>
                      <span className="pdp-seller-verified-tag">
                        <ShieldCheckIcon width={12} height={12} />
                        Verified
                      </span>
                    </div>

                    <div className="pdp-seller-rating-row">
                      <span className="pdp-seller-stars">
                        <StarIcon width={12} height={12} />
                        <span>{sellerRating}</span>
                      </span>
                      <span className="pdp-seller-reviews">({sellerReviews} deals)</span>
                      <span className="pdp-submeta-divider">•</span>
                      <span className="pdp-seller-since">{sellerJoined}</span>
                    </div>
                  </div>
                </div>

                <div className="pdp-seller-badges-row">
                  <span className="pdp-seller-stat-chip">✓ ID &amp; Phone Verified</span>
                  <span className="pdp-seller-stat-chip">⚡ Replies in 5 mins</span>
                </div>

                <div className="pdp-seller-actions">
                  <button
                    type="button"
                    className="pdp-seller-call-btn"
                    onClick={() => setShowPhone((prev) => !prev)}
                    title={showPhone ? 'Click to hide' : 'Click to reveal phone number'}
                  >
                    <PhoneIcon width={14} height={14} />
                    <span>{showPhone ? sellerFullPhone : `Call (${sellerPhone})`}</span>
                  </button>

                  <button
                    type="button"
                    className="pdp-seller-chat-btn"
                    onClick={scrollToOffer}
                  >
                    <MessageCircleIcon width={14} height={14} />
                    <span>Chat with Seller</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings Row */}
        {relatedProducts.length > 0 ? (
          <section className="pdp-related-section" aria-labelledby="pdp-related-heading">
            <div className="pdp-related-header">
              <div>
                <p className="eyebrow">Explore More</p>
                <h2 id="pdp-related-heading" className="pdp-related-title">
                  Similar Deals in {product.category}
                </h2>
              </div>
              <button
                type="button"
                className="pdp-related-view-all"
                onClick={onBack}
              >
                <span>View All Listings</span>
                <ArrowUpRight width={14} height={14} />
              </button>
            </div>

            <div className="pdp-related-grid">
              {relatedProducts.slice(0, 4).map((rel) => {
                const relDiscount = getDiscountPercent(rel.price, rel.compareAtPrice)
                return (
                  <article
                    key={rel.id}
                    className="pdp-related-card"
                    onClick={() => onSelectProduct?.(rel)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSelectProduct?.(rel)
                    }}
                  >
                    <div className="pdp-related-card__media">
                      <img src={rel.image} alt={rel.name} loading="lazy" />
                      {relDiscount ? (
                        <span className="pdp-related-discount">−{relDiscount}%</span>
                      ) : null}
                    </div>

                    <div className="pdp-related-card__info">
                      <h4 className="pdp-related-card__title">{rel.name}</h4>
                      <div className="pdp-related-card__price-row">
                        <span className="pdp-related-card__price">
                          {formatPrice(rel.price)}
                        </span>
                        {rel.compareAtPrice ? (
                          <s className="pdp-related-card__compare">
                            {formatPrice(rel.compareAtPrice)}
                          </s>
                        ) : null}
                      </div>
                      <p className="pdp-related-card__meta">
                        <MapPinIcon width={11} height={11} />
                        <span>{rel.location?.split(',')[0] ?? 'Local'}</span>
                        <span className="pdp-submeta-divider">•</span>
                        <span>{rel.condition ?? 'Like New'}</span>
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
