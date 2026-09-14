export interface ShopifyImage {
  url: string
  altText?: string | null
}

export interface ShopifyVariant {
  id: string
  title: string
  availableForSale?: boolean
  price: {
    amount: string
    currencyCode: string
  }
  selectedOptions?: {
    name: string
    value: string
  }[]
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  productType?: string
  description?: string
  descriptionHtml?: string
  availableForSale?: boolean
  tags?: string[]
  options?: {
    name: string
    values: string[]
  }[]
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: {
      node: ShopifyImage
    }[]
  }
  variants: {
    edges: {
      node: ShopifyVariant
    }[]
  }
}

export interface CartLineItem {
  id: string
  merchandiseId: string
  productId: string
  title: string
  variantTitle: string
  price: number
  currencyCode: string
  quantity: number
  image?: string
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: {
      node: {
        id: string
        quantity: number
        merchandise: {
          id: string
          title: string
          price: {
            amount: string
            currencyCode: string
          }
          product: {
            id: string
            title: string
            handle: string
            images: {
              edges: {
                node: {
                  url: string
                }
              }[]
            }
          }
        }
      }
    }[]
  }
}
