import type { Product } from '../../types/product'
import { formatPrice, getDiscountPercent } from '../../lib/format'
import { ArrowUpRight, HeartIcon, StarIcon, MessageCircleIcon } from '../icons'
import './products.css'

interface ProductCardProps {
  product: Product
  isSaved?: boolean
  onToggleSave?: (productId: string) => void
  onOpenOffer?: (product: Product) => void
  onSelectProduct?: (product: Product) => void
}

export function ProductCard({
  product,
  isSaved = false,
  onToggleSave,
  onOpenOffer,
  onSelectProduct,
}: ProductCardProps) {
  const discount = getDiscountPercent(product.price, product.compareAtPrice)

  const handleSelect = () => {
    if (onSelectProduct) {
      onSelectProduct(product)
    } else if (onOpenOffer) {
      onOpenOffer(product)
    }
  }

  return (
    <article className="product-card" onClick={handleSelect}>
      <div className="product-card__media">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />

        {product.sellerStatus || product.sellerActiveText ? (
          <div
            className={`product-card__status-tag product-card__status-tag--${
              product.sellerStatus ?? 'online'
            }`}
            aria-label={`Seller status: ${
              product.sellerActiveText ??
              (product.sellerStatus === 'online' ? 'Online Now' : 'Active recently')
            }`}
          >
            <span className="product-card__status-indicator" aria-hidden="true">
              <span className="product-card__status-dot" />
              <span className="product-card__status-ping" />
            </span>
            <span className="product-card__status-text">
              {product.sellerActiveText ??
                (product.sellerStatus === 'online' ? 'Online Now' : 'Active recently')}
            </span>
          </div>
        ) : product.badge ? (
          <>
            <span
              className={`product-card__corner-badge product-card__corner-badge--${product.badge.toLowerCase()}`}
              aria-hidden="true"
            >
              {product.badge}
            </span>
            <span className="product-card__sr-only">{product.badge}</span>
          </>
        ) : null}

        {discount ? (
          <div className="product-card__badges">
            <span className="product-chip product-chip--discount">
              −{discount}%
            </span>
          </div>
        ) : null}

        <button
          type="button"
          className={`product-card__wishlist ${isSaved ? 'is-saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSave?.(product.id)
          }}
          aria-label={`${isSaved ? 'Remove from' : 'Save to'} wishlist`}
        >
          <HeartIcon
            width={16}
            height={16}
            fill={isSaved ? 'var(--color-clay)' : 'none'}
            stroke={isSaved ? 'var(--color-clay)' : 'currentColor'}
          />
        </button>
      </div>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="product-card__category">
            {product.location ? `${product.location} · ${product.category}` : product.category}
          </span>
          {product.rating ? (
            <span
              className="product-card__rating"
              aria-label={`Rated ${product.rating} out of 5${
                product.reviewCount
                  ? ` from ${product.reviewCount} reviews`
                  : ''
              }`}
            >
              <StarIcon width={11} height={11} />
              {product.rating.toFixed(1)}
              {product.reviewCount ? (
                <span className="product-card__reviews">
                  ({product.reviewCount})
                </span>
              ) : null}
            </span>
          ) : null}
        </div>

        <h3 className="product-card__name">{product.name}</h3>

        {/* Live Buyer Buzz & Condition Tag */}
        {product.chatCount || product.condition ? (
          <div className="product-card__buzz">
            {product.chatCount ? (
              <span className="product-card__buzz-item">
                <MessageCircleIcon width={11} height={11} />
                <span>{product.chatCount} chatting</span>
              </span>
            ) : null}
            {product.condition ? (
              <span className="product-card__buzz-condition">
                {product.condition}
              </span>
            ) : null}
          </div>
        ) : null}

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__footer">
          <p className="product-card__price">
            <span>{formatPrice(product.price)}</span>
            {product.compareAtPrice ? (
              <s>{formatPrice(product.compareAtPrice)}</s>
            ) : null}
          </p>

          <button
            type="button"
            className="product-card__cta"
            onClick={(e) => {
              e.stopPropagation()
              handleSelect()
            }}
            aria-label={`View details and make offer for ${product.name}`}
          >
            <MessageCircleIcon width={12} height={12} className="product-card__cta-icon" />
            <span className="product-card__cta-text">
              View<span className="product-card__cta-word"> &amp; Deal</span>
            </span>
            <ArrowUpRight width={12} height={12} />
          </button>
        </div>
      </div>
    </article>
  )
}