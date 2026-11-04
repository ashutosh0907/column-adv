import { useState, useEffect, useMemo } from 'react'
import type { Product } from './types/product'
import { AdSidebar } from './components/ads/AdSidebar'
import { MobileAdRail } from './components/ads/MobileAdRail'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { ProductGrid } from './components/products/ProductGrid'
import { ProductDetailPage } from './components/products/ProductDetailPage'
import { PostAdModal } from './components/seller/PostAdModal'
import { MarketplaceDiscovery } from './components/marketplace/MarketplaceDiscovery'
import { MarketplaceLivePulse } from './components/marketplace/MarketplaceLivePulse'
import { FloatingSellButton } from './components/marketplace/FloatingSellButton'
import Loader from './components/Loader'
import { products as initialProducts } from './data/products'
import './App.css'

export default function App() {
  const [productList, setProductList] = useState<Product[]>(initialProducts)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Engagement & Discovery Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [maxDistance, setMaxDistance] = useState('all')
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [dealsOnly, setDealsOnly] = useState(false)
  const [topRatedOnly, setTopRatedOnly] = useState(false)
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(
    new Set(['aero-headphones', 'iphone-15-pro']),
  )
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isWatchlistActive, setIsWatchlistActive] = useState(false)

  // Listen to URL hash for direct item links (#item-productId) and browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#item-')) {
        const id = hash.replace('#item-', '')
        const found = productList.find((p) => p.id === id)
        if (found) {
          setSelectedProduct(found)
        }
      } else if (!hash || hash === '#products') {
        setSelectedProduct(null)
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [productList])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Dynamic category tabs with real counts
  const categories = useMemo(() => {
    const allCount = productList.length
    const getCatCount = (cat: string) => productList.filter((p) => p.category === cat).length

    return [
      { id: 'all', label: 'All Items', icon: '🔥', count: allCount },
      { id: 'Mobiles', label: 'Mobiles', icon: '📱', count: getCatCount('Mobiles') },
      { id: 'Audio', label: 'Audio', icon: '🎧', count: getCatCount('Audio') },
      { id: 'Wearables', label: 'Wearables', icon: '⌚', count: getCatCount('Wearables') },
      { id: 'Desk', label: 'Desk & Tech', icon: '⌨️', count: getCatCount('Desk') },
      { id: 'Cameras', label: 'Cameras', icon: '📷', count: getCatCount('Cameras') },
      { id: 'Furniture', label: 'Furniture', icon: '🛋️', count: getCatCount('Furniture') },
      { id: 'Lighting', label: 'Lighting', icon: '💡', count: getCatCount('Lighting') },
      { id: 'Bags', label: 'Bags & Gear', icon: '🎒', count: getCatCount('Bags') },
    ]
  }, [productList])

  // Count active online sellers
  const onlineCount = useMemo(() => {
    return productList.filter((p) => p.sellerStatus === 'online').length
  }, [productList])

  // Check if any filter is active
  const isFiltered = Boolean(
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedCity !== 'all' ||
    maxDistance !== 'all' ||
    onlineOnly ||
    dealsOnly ||
    topRatedOnly ||
    isWatchlistActive
  )

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedCity('all')
    setMaxDistance('all')
    setOnlineOnly(false)
    setDealsOnly(false)
    setTopRatedOnly(false)
    setIsWatchlistActive(false)
    setToastMessage('Filters reset to all items.')
    setTimeout(() => setToastMessage(null), 2500)
  }

  // Filtered product feed
  const filteredProducts = useMemo(() => {
    return productList.filter((item) => {
      // Watchlist filter
      if (isWatchlistActive && !savedItemIds.has(item.id)) {
        return false
      }

      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false
      }

      // City / Locality
      if (selectedCity !== 'all') {
        if (!item.location?.toLowerCase().includes(selectedCity.toLowerCase())) {
          return false
        }
      }

      // Distance radius (e.g. "1.2 km" -> 1.2 <= maxDistance)
      if (maxDistance !== 'all' && item.distance) {
        const distNum = parseFloat(item.distance)
        if (!isNaN(distNum) && distNum > parseFloat(maxDistance)) {
          return false
        }
      }

      // Online sellers only
      if (onlineOnly && item.sellerStatus !== 'online') {
        return false
      }

      // Deals only (items with discount)
      if (dealsOnly && (!item.compareAtPrice || item.compareAtPrice <= item.price)) {
        return false
      }

      // Top rated only (4.7+)
      if (topRatedOnly && (!item.rating || item.rating < 4.7)) {
        return false
      }

      // Live search across title, category, description, and locality
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.name.toLowerCase().includes(q)
        const matchCategory = item.category.toLowerCase().includes(q)
        const matchDesc = item.description.toLowerCase().includes(q)
        const matchLoc = item.location?.toLowerCase().includes(q) ?? false
        if (!matchName && !matchCategory && !matchDesc && !matchLoc) {
          return false
        }
      }

      return true
    })
  }, [
    productList,
    isWatchlistActive,
    savedItemIds,
    selectedCategory,
    selectedCity,
    maxDistance,
    onlineOnly,
    dealsOnly,
    topRatedOnly,
    searchQuery,
  ])

  // Watchlist save/unsave handler
  const handleToggleSave = (productId: string) => {
    setSavedItemIds((prev) => {
      const next = new Set(prev)
      const product = productList.find((p) => p.id === productId)
      if (next.has(productId)) {
        next.delete(productId)
        setToastMessage(`Removed "${product?.name ?? 'Item'}" from Watchlist.`)
      } else {
        next.add(productId)
        setToastMessage(`❤️ Added to Watchlist! You'll get instant alerts if price drops.`)
      }
      setTimeout(() => setToastMessage(null), 3500)
      return next
    })
  }

  // Publish new product from seller modal
  const handlePublishProduct = (newProduct: Product) => {
    setProductList((prev) => [newProduct, ...prev])
    setToastMessage(`✓ "${newProduct.name}" is now live in ${newProduct.location ?? 'feed'}!`)
    setTimeout(() => setToastMessage(null), 4500)

    const el = document.getElementById('products')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Offer submitted handler
  const handleSubmitOffer = (product: Product, amount: number, message?: string) => {
    setToastMessage(
      `💬 Offer of ₹${amount.toLocaleString('en-IN')} sent to seller for "${product.name}"${
        message ? ` ("${message.slice(0, 32)}...")` : ''
      }! Direct chat initiated.`,
    )
    setTimeout(() => setToastMessage(null), 5000)
  }

  // Handle navigating to Product Detail Page (PDP)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product)
    window.location.hash = `item-${product.id}`
    const mainEl = document.querySelector('.viewport-center-column')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Return from PDP back to Listings
  const handleBackToListings = () => {
    setSelectedProduct(null)
    if (window.location.hash.startsWith('#item-')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search)
    }
    const mainEl = document.querySelector('.viewport-center-column')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Related products for PDP recommendations
  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return []
    return productList.filter(
      (p) =>
        p.id !== selectedProduct.id &&
        (p.category === selectedProduct.category ||
          p.location?.split(',')[0] === selectedProduct.location?.split(',')[0]),
    )
  }, [productList, selectedProduct])

  // Focus search input on header search tap
  const handleFocusSearch = () => {
    if (selectedProduct) {
      handleBackToListings()
    }
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('.marketplace-search__input')
      if (input) {
        input.focus()
        input.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 60)
  }

  // Toggle watchlist mode from header
  const handleOpenSavedDrawer = () => {
    if (selectedProduct) {
      handleBackToListings()
    }
    setIsWatchlistActive((prev) => {
      const next = !prev
      if (next) {
        setToastMessage(`Showing your Watchlist (${savedItemIds.size} saved items)`)
      } else {
        setToastMessage('Showing all marketplace items')
      }
      setTimeout(() => setToastMessage(null), 3000)
      return next
    })
    const el = document.getElementById('products')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="marketplace-viewport">
      {isLoading && <Loader fullPage />}

      <a className="skip-link" href="#products">
        Skip to products
      </a>

      {/* 1. Extreme Left Sponsored Rail - Touching the left edge of the screen */}
      <aside className="viewport-ad-rail viewport-ad-rail--left" aria-label="Sponsored rail left">
        <AdSidebar position="left" />
      </aside>

      {/* 2. Center Column - Header, Discovery, Search, Listings, and Footer in between */}
      <div className="viewport-center-column">
        <SiteHeader
          onOpenSellModal={() => setIsSellModalOpen(true)}
          savedCount={savedItemIds.size}
          onFocusSearch={handleFocusSearch}
          onOpenSavedDrawer={handleOpenSavedDrawer}
          onNavigateHome={handleBackToListings}
        />

        {/* Top Running Ad Rail - Running on ALL screens, ALL pages */}
        <MobileAdRail position="top" />

        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={handleBackToListings}
            isSaved={savedItemIds.has(selectedProduct.id)}
            onToggleSave={handleToggleSave}
            onSubmitOffer={handleSubmitOffer}
            onSelectProduct={handleSelectProduct}
            relatedProducts={relatedProducts}
          />
        ) : (
          <main id="main" className="viewport-main">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li>
                  <a href="#products">Classifieds</a>
                </li>
                <li>
                  <a href="#products">{selectedCity === 'all' ? 'India' : selectedCity}</a>
                </li>
                <li aria-current="page">
                  {selectedCategory === 'all' ? 'All categories' : selectedCategory}
                </li>
              </ol>
            </nav>

            <section className="catalog-intro" aria-labelledby="page-title">
              <div>
                <p className="eyebrow catalog-intro__eyebrow">
                  <span className="catalog-intro__dot" aria-hidden="true" />
                  Verified Local Marketplace · Buy &amp; Sell Anything
                </p>
                <h1 id="page-title">Buy &amp; Sell Anything Nearby</h1>
              </div>

              <p className="catalog-intro__lede">
                India's direct marketplace to buy and sell pre-owned phones, electronics, vehicles,
                furniture, and everyday essentials — chat instantly and deal locally with verified sellers.
              </p>
            </section>

            {/* Live Traffic Social Proof Strip */}
            <MarketplaceLivePulse
              totalListings={productList.length}
              onlineCount={onlineCount}
              city={selectedCity === 'all' ? 'India' : selectedCity}
            />

            {/* Interactive Search, City Selector, Category Carousel & Filter Toggles */}
            <MarketplaceDiscovery
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              categories={categories}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              maxDistance={maxDistance}
              onSelectDistance={setMaxDistance}
              onlineOnly={onlineOnly}
              onToggleOnlineOnly={() => setOnlineOnly((prev) => !prev)}
              dealsOnly={dealsOnly}
              onToggleDealsOnly={() => setDealsOnly((prev) => !prev)}
              topRatedOnly={topRatedOnly}
              onToggleTopRatedOnly={() => setTopRatedOnly((prev) => !prev)}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
            />

            <ProductGrid
              id="products"
              products={filteredProducts}
              eyebrow={
                isWatchlistActive
                  ? `Your Saved Watchlist (${filteredProducts.length})`
                  : isFiltered
                    ? `${filteredProducts.length} matching results`
                    : `${filteredProducts.length} verified listings`
              }
              title={
                isWatchlistActive
                  ? 'Your Saved Items'
                  : selectedCategory !== 'all'
                    ? `${selectedCategory} for sale`
                    : selectedCity !== 'all'
                      ? `Deals in ${selectedCity}`
                      : 'Fresh deals near you'
              }
              emptyMessage="No matching items found. Try changing your search query or location filter."
              savedItemIds={savedItemIds}
              onToggleSave={handleToggleSave}
              onSelectProduct={handleSelectProduct}
            />
          </main>
        )}

        <SiteFooter />

        {/* Footer Mobile Ad Rail - Only shown on mobile */}
        <MobileAdRail position="bottom" />
      </div>

      {/* 3. Extreme Right Sponsored Rail - Touching the right edge of screen, above the header too */}
      <aside className="viewport-ad-rail viewport-ad-rail--right" aria-label="Sponsored rail right">
        <AdSidebar
          position="right"
          boostedProducts={productList}
          onSelectProduct={handleSelectProduct}
          onOpenSellModal={() => setIsSellModalOpen(true)}
        />
      </aside>

      {/* Mobile Floating Action Button: + Sell */}
      <FloatingSellButton onOpenSellModal={() => setIsSellModalOpen(true)} />

      <PostAdModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onPublish={handlePublishProduct}
      />

      {toastMessage ? (
        <div className="marketplace-toast" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      ) : null}
    </div>
  )
}
