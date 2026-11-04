import type { Product } from '../../types/product'
import { ProductCard } from './ProductCard'
import './products.css'

interface ProductGridProps {
  id?: string
  products: Product[]
  eyebrow?: string
  title?: string
  emptyMessage?: string
  savedItemIds?: Set<string>
  onToggleSave?: (productId: string) => void
  onOpenOffer?: (product: Product) => void
  onSelectProduct?: (product: Product) => void
}

export function ProductGrid({
  id = 'products',
  products,
  eyebrow = 'Verified Local Marketplace',
  title = 'Items for sale',
  emptyMessage = 'No items found for sale.',
  savedItemIds,
  onToggleSave,
  onOpenOffer,
  onSelectProduct,
}: ProductGridProps) {
  const headingId = `${id}-heading`

  return (
    <section id={id} className="products" aria-labelledby={headingId}>
      <header className="products__header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={headingId} className="products__title">
            {title}
          </h2>
        </div>
        <p className="products__count">
          {products.length} {products.length === 1 ? 'item for sale' : 'items for sale'}
        </p>
      </header>

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSaved={savedItemIds?.has(product.id)}
              onToggleSave={onToggleSave}
              onOpenOffer={onOpenOffer}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <p className="products__empty">{emptyMessage}</p>
      )}
    </section>
  )
}
