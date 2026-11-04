import { useRef, type ChangeEvent } from 'react'
import {
  SearchIcon,
  CloseIcon,
  MapPinIcon,
  FlameIcon,
  SparklesIcon,
  ChevronDownIcon,
} from '../icons'
import './marketplace.css'

export interface CategoryOption {
  id: string
  label: string
  icon: string
  count: number
}

interface MarketplaceDiscoveryProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
  categories: CategoryOption[]
  selectedCity: string
  onSelectCity: (city: string) => void
  maxDistance: string
  onSelectDistance: (dist: string) => void
  onlineOnly: boolean
  onToggleOnlineOnly: () => void
  dealsOnly: boolean
  onToggleDealsOnly: () => void
  topRatedOnly: boolean
  onToggleTopRatedOnly: () => void
  onResetFilters: () => void
  isFiltered: boolean
}

const CITIES = [
  { id: 'all', label: 'All India' },
  { id: 'Mumbai', label: 'Mumbai' },
  { id: 'Bengaluru', label: 'Bengaluru' },
  { id: 'Delhi', label: 'Delhi NCR' },
  { id: 'Hyderabad', label: 'Hyderabad' },
]

const DISTANCES = [
  { id: 'all', label: 'Any Distance' },
  { id: '2', label: 'Within 2 km' },
  { id: '5', label: 'Within 5 km' },
  { id: '10', label: 'Within 10 km' },
]

const TRENDING_TAGS = ['iPhone', 'Headphones', 'Camera', 'Keyboard', 'Speaker', 'Watch']

export function MarketplaceDiscovery({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  selectedCity,
  onSelectCity,
  maxDistance,
  onSelectDistance,
  onlineOnly,
  onToggleOnlineOnly,
  dealsOnly,
  onToggleDealsOnly,
  topRatedOnly,
  onToggleTopRatedOnly,
  onResetFilters,
  isFiltered,
}: MarketplaceDiscoveryProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleClearSearch = () => {
    onSearchChange('')
    searchInputRef.current?.focus()
  }

  return (
    <section className="marketplace-discovery" aria-label="Find local classifieds">
      {/* 1. Search Bar & Location Pickers */}
      <div className="marketplace-discovery__top-row">
        {/* Search input with live clear */}
        <div className="marketplace-search">
          <SearchIcon width={16} height={16} className="marketplace-search__icon" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            placeholder="Search phones, electronics, cameras, furniture nearby..."
            className="marketplace-search__input"
            aria-label="Search classified listings"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="marketplace-search__clear"
              aria-label="Clear search input"
            >
              <CloseIcon width={13} height={13} />
            </button>
          ) : null}
        </div>

        {/* City Dropdown */}
        <div className="marketplace-select-wrapper">
          <MapPinIcon width={14} height={14} className="marketplace-select__icon" />
          <select
            value={selectedCity}
            onChange={(e) => onSelectCity(e.target.value)}
            className="marketplace-select"
            aria-label="Select city"
          >
            {CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon width={12} height={12} className="marketplace-select__arrow" />
        </div>

        {/* Distance Radius Dropdown */}
        <div className="marketplace-select-wrapper">
          <select
            value={maxDistance}
            onChange={(e) => onSelectDistance(e.target.value)}
            className="marketplace-select marketplace-select--distance"
            aria-label="Filter by distance radius"
          >
            {DISTANCES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon width={12} height={12} className="marketplace-select__arrow" />
        </div>
      </div>

      {/* 2. Trending searches */}
      <div className="marketplace-trending">
        <span className="marketplace-trending__label">
          <FlameIcon width={11} height={11} />
          Trending:
        </span>
        <div className="marketplace-trending__chips">
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSearchChange(tag)}
              className={`marketplace-trending__chip ${
                searchQuery.toLowerCase() === tag.toLowerCase() ? 'is-active' : ''
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Pills Bar */}
      <div className="marketplace-categories" role="tablist" aria-label="Browse by Category">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.id)}
              className={`marketplace-category-chip ${isActive ? 'is-active' : ''}`}
            >
              <span className="marketplace-category-chip__icon" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="marketplace-category-chip__label">{cat.label}</span>
              <span className="marketplace-category-chip__count">({cat.count})</span>
            </button>
          )
        })}
      </div>

      {/* 4. Active Filter Toggles */}
      <div className="marketplace-filter-toggles">
        <button
          type="button"
          onClick={onToggleOnlineOnly}
          className={`marketplace-filter-toggle ${onlineOnly ? 'is-active' : ''}`}
          aria-pressed={onlineOnly}
        >
          <span className="marketplace-filter-toggle__dot" />
          <span>Online Sellers</span>
        </button>

        <button
          type="button"
          onClick={onToggleDealsOnly}
          className={`marketplace-filter-toggle ${dealsOnly ? 'is-active' : ''}`}
          aria-pressed={dealsOnly}
        >
          <SparklesIcon width={12} height={12} />
          <span>Price Drops</span>
        </button>

        <button
          type="button"
          onClick={onToggleTopRatedOnly}
          className={`marketplace-filter-toggle ${topRatedOnly ? 'is-active' : ''}`}
          aria-pressed={topRatedOnly}
        >
          <span>⭐ 4.7+ Rated</span>
        </button>

        {isFiltered ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="marketplace-filter-reset"
            aria-label="Reset all filters"
          >
            <CloseIcon width={11} height={11} />
            <span>Reset filters</span>
          </button>
        ) : null}
      </div>
    </section>
  )
}
