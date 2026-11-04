import { HeartIcon, PlusIcon, SearchIcon } from '../icons'

interface SiteHeaderProps {
  onOpenSellModal?: () => void
  savedCount?: number
  onFocusSearch?: () => void
  onOpenSavedDrawer?: () => void
  onNavigateHome?: () => void
}

export function SiteHeader({
  onOpenSellModal,
  savedCount = 0,
  onFocusSearch,
  onOpenSavedDrawer,
  onNavigateHome,
}: SiteHeaderProps) {
  const handleHomeClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault()
      onNavigateHome()
    }
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a
          className="brand"
          href="#products"
          onClick={handleHomeClick}
          aria-label="Column — shop all products"
        >
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand__name">
            Column<span className="brand__dot">.</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <a href="#products" className="is-active" onClick={handleHomeClick}>
            Browse
          </a>
          <a href="#products" onClick={handleHomeClick}>
            Neighborhoods
          </a>
          <a href="#products" onClick={handleHomeClick}>
            Deals
          </a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="sell-header-button"
            onClick={onOpenSellModal}
            aria-label="Post an ad to sell an item"
          >
            <PlusIcon width={13} height={13} />
            <span>Sell</span>
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={onFocusSearch}
            aria-label="Search classifieds"
          >
            <SearchIcon width={19} height={19} />
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onOpenSavedDrawer}
            aria-label={`Saved watchlist (${savedCount} items)`}
          >
            <HeartIcon width={19} height={19} />
            {savedCount > 0 ? (
              <span className="cart-count" aria-hidden="true">
                {savedCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  )
}
