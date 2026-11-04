export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  compareAtPrice?: number
  rating?: number
  reviewCount?: number
  image: string
  badge?: 'New' | 'Bestseller' | 'Limited'
  sellerStatus?: 'online' | 'recent'
  sellerActiveText?: string
  location?: string
  distance?: string
  condition?: string
  chatCount?: number
  viewCount?: number
  verified?: boolean
  sellerName?: string
  sellerJoined?: string
  sellerRating?: number
  sellerReviewCount?: number
  sellerPhone?: string
  inclusions?: string[]
  specs?: Record<string, string>
  images?: string[]
}
