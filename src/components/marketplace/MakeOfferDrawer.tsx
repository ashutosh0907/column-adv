import { useState, useEffect, type FormEvent } from 'react'
import type { Product } from '../../types/product'
import { formatPrice } from '../../lib/format'
import { CloseIcon, SendIcon, CheckIcon, MapPinIcon } from '../icons'
import Loader from '../Loader'
import './marketplace.css'

interface MakeOfferDrawerProps {
  product: Product | null
  onClose: () => void
  onSubmitOffer: (product: Product, amount: number, message: string) => void
}

export function MakeOfferDrawer({ product, onClose, onSubmitOffer }: MakeOfferDrawerProps) {
  if (!product) return null

  // Calculate 1-tap quick discount offers
  const discount15 = Math.round((product.price * 0.85) / 100) * 100
  const discount10 = Math.round((product.price * 0.9) / 100) * 100
  const discount5 = Math.round((product.price * 0.95) / 100) * 100

  const [offerAmount, setOfferAmount] = useState<number>(discount10)
  const [message, setMessage] = useState<string>('Hi, is this still available? Can we meet locally?')
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [product, onClose])

  const quickMessages = [
    'Hi, is this still available?',
    `Can we meet today in ${product.location?.split(',')[0] ?? 'public'}?`,
    'Is the price negotiable for immediate cash?',
    'Does it come with original invoice and accessories?',
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!offerAmount || offerAmount <= 0) return

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setIsSent(true)
      setTimeout(() => {
        onSubmitOffer(product, offerAmount, message)
        onClose()
      }, 900)
    }, 600)
  }

  return (
    <>
      {isSending && <Loader fullPage />}
      <div
        className="offer-drawer-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-drawer-title"
      >
        <div className="offer-drawer" onClick={(e) => e.stopPropagation()}>
          {/* Mobile Sheet Handle */}
          <div className="modal-sheet-handle-bar offer-drawer__handle-bar" aria-hidden="true">
            <span className="modal-sheet-handle" />
          </div>

          {/* Header */}
          <div className="offer-drawer__header">
            <div>
              <p className="offer-drawer__eyebrow">
                <span className="offer-drawer__live-dot" />
                Direct Local Chat &amp; Instant Offer
              </p>
              <h2 id="offer-drawer-title" className="offer-drawer__title">
                Deal with Seller
              </h2>
            </div>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <CloseIcon width={16} height={16} />
            </button>
          </div>

          {/* Product Summary Card */}
          <div className="offer-drawer__product">
            <img
              src={product.image}
              alt={product.name}
              className="offer-drawer__product-img"
            />
            <div className="offer-drawer__product-info">
              <h3 className="offer-drawer__product-name">{product.name}</h3>
              <p className="offer-drawer__product-location">
                <MapPinIcon width={12} height={12} />
                <span>{product.location ?? 'India'} · {product.distance ?? 'Nearby'}</span>
              </p>
              <div className="offer-drawer__product-price">
                <span className="offer-drawer__asking-label">Asking:</span>
                <span className="offer-drawer__asking-val">{formatPrice(product.price)}</span>
                {product.compareAtPrice ? (
                  <s className="offer-drawer__compare-val">{formatPrice(product.compareAtPrice)}</s>
                ) : null}
              </div>
            </div>
          </div>

          {/* Seller Status Pill */}
          <div className="offer-drawer__seller-status">
            <span className="offer-drawer__seller-dot" />
            <span>
              Seller is <strong>{product.sellerActiveText ?? 'Online Now'}</strong> · Typically replies in &lt; 5 mins
            </span>
          </div>

          {isSent ? (
            <div className="offer-drawer__success">
              <div className="offer-drawer__success-icon">
                <CheckIcon width={24} height={24} />
              </div>
              <h4>Offer Sent Successfully!</h4>
              <p>
                Your offer of <strong>{formatPrice(offerAmount)}</strong> has been sent to the seller in {product.location}.
                Connecting to direct chat...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="offer-drawer__form">
              {/* Quick Offer Presets */}
              <div className="offer-drawer__field">
                <label className="offer-drawer__label">
                  Select Quick Offer or enter amount (₹):
                </label>
                <div className="offer-drawer__chip-row offer-drawer__chip-row--presets">
                  <button
                    type="button"
                    onClick={() => setOfferAmount(discount15)}
                    className={`offer-drawer__chip ${offerAmount === discount15 ? 'is-selected' : ''}`}
                  >
                    <span>{formatPrice(discount15)}</span>
                    <small>−15%</small>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfferAmount(discount10)}
                    className={`offer-drawer__chip ${offerAmount === discount10 ? 'is-selected' : ''}`}
                  >
                    <span>{formatPrice(discount10)}</span>
                    <small>−10%</small>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfferAmount(discount5)}
                    className={`offer-drawer__chip ${offerAmount === discount5 ? 'is-selected' : ''}`}
                  >
                    <span>{formatPrice(discount5)}</span>
                    <small>−5%</small>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfferAmount(product.price)}
                    className={`offer-drawer__chip ${offerAmount === product.price ? 'is-selected' : ''}`}
                  >
                    <span>{formatPrice(product.price)}</span>
                    <small>Asking</small>
                  </button>
                </div>
              </div>

              {/* Custom amount */}
              <div className="offer-drawer__field">
                <div className="offer-drawer__input-group">
                  <span className="offer-drawer__currency-symbol">₹</span>
                  <input
                    type="number"
                    value={offerAmount || ''}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    min={1}
                    max={product.price * 2}
                    className="offer-drawer__input"
                    placeholder="Enter your counter offer"
                    required
                  />
                </div>
              </div>

              {/* Quick Questions */}
              <div className="offer-drawer__field">
                <label className="offer-drawer__label">Quick message to seller:</label>
                <div className="offer-drawer__chip-row">
                  {quickMessages.map((qm) => (
                    <button
                      key={qm}
                      type="button"
                      onClick={() => setMessage(qm)}
                      className={`offer-drawer__chip offer-drawer__chip--msg ${
                        message === qm ? 'is-selected' : ''
                      }`}
                    >
                      {qm}
                    </button>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="offer-drawer__textarea"
                  placeholder="Add any specific questions (condition, accessories, meetup time)..."
                />
              </div>

              <div className="offer-drawer__actions">
                <button
                  type="submit"
                  disabled={isSending || !offerAmount}
                  className="offer-drawer__submit-btn"
                >
                  <SendIcon width={14} height={14} />
                  <span>Send Offer of {formatPrice(offerAmount)} &amp; Chat</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
