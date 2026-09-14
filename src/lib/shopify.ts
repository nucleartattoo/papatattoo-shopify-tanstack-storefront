import { ShopifyProduct } from '../types/shopify'
import premiumMatrixProduct from '../data/premiumMatrixProduct.json'
import standardMatrixProduct from '../data/standardMatrixProduct.json'
import openTipMatrixProduct from '../data/openTipMatrixProduct.json'

const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || 'ftff5p-yr.myshopify.com'
const PUBLIC_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_PUBLIC_TOKEN || '7cfda415ab91273e91e6e7b69f9789cf'
const API_VERSION = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_VERSION || '2025-01'

const ENDPOINT = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`

export async function shopifyFetch<T = any>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': PUBLIC_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Shopify API HTTP error ${response.status}: ${errorText}`)
  }

  const json = await response.json()
  if (json.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

// Fetch single product by handle
export async function getProductByHandle(handle: string, language = 'EN'): Promise<ShopifyProduct | null> {
  if (handle === 'papa-premium-tattoo-cartridges') {
    // Try storefront first, fallback to verified matrix product with 62 variants
    try {
      const query = `
        query getProductByHandle($handle: String!, $language: LanguageCode) @inContext(language: $language) {
          product(handle: $handle) {
            id
            title
            handle
            description
            descriptionHtml
            availableForSale
            tags
            options {
              name
              values
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      `
      const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle, language })
      if (data?.product) {
        return data.product
      }
    } catch {
      // ignore and use consolidated matrix product
    }
    return premiumMatrixProduct as unknown as ShopifyProduct
  }

  if (handle === 'papa-standard-tattoo-cartridges') {
    try {
      const query = `
        query getProductByHandle($handle: String!, $language: LanguageCode) @inContext(language: $language) {
          product(handle: $handle) {
            id
            title
            handle
            description
            descriptionHtml
            availableForSale
            tags
            options {
              name
              values
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      `
      const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle, language })
      if (data?.product) {
        return data.product
      }
    } catch {
      // ignore and use consolidated matrix product
    }
    return standardMatrixProduct as unknown as ShopifyProduct
  }

  if (handle === 'papa-open-tip-tattoo-cartridges') {
    try {
      const query = `
        query getProductByHandle($handle: String!, $language: LanguageCode) @inContext(language: $language) {
          product(handle: $handle) {
            id
            title
            handle
            description
            descriptionHtml
            availableForSale
            tags
            options {
              name
              values
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      `
      const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle, language })
      if (data?.product) {
        return data.product
      }
    } catch {
      // ignore and use consolidated matrix product
    }
    return openTipMatrixProduct as unknown as ShopifyProduct
  }

  const query = `
    query getProductByHandle($handle: String!, $language: LanguageCode) @inContext(language: $language) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        availableForSale
        tags
        options {
          name
          values
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `

  try {
    const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle, language })
    return data.product
  } catch (err) {
    console.error(`Failed to fetch product with handle "${handle}":`, err)
    return null
  }
}

// Reusable Product Fields Fragment
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    availableForSale
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 6) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`

// Helper to identify and filter out old single-needle un-consolidated products
export function isGranularCartridge(prod: { handle?: string; title?: string }): boolean {
  if (!prod) return false
  const handle = prod.handle || ''
  // Keep the 2 consolidated master products
  if (handle === 'papa-premium-tattoo-cartridges' || handle === 'papa-standard-tattoo-cartridges') {
    return false
  }
  const title = (prod.title || '').toLowerCase()
  // Exclude non-needle equipment like grips, machines, power, etc.
  if (
    title.includes('grip') ||
    title.includes('machine') ||
    title.includes('pen') ||
    title.includes('power') ||
    title.includes('tray') ||
    title.includes('stencil') ||
    title.includes('cord') ||
    title.includes('pedal') ||
    title.includes('hat') ||
    title.includes('shirt') ||
    title.includes('apron')
  ) {
    return false
  }
  // If it is a cartridge needle or contains needle specs (RL, RS, M1, etc.), it's a granular product
  if (
    title.includes('cartridge') ||
    title.includes('needle') ||
    title.includes('liner') ||
    title.includes('shader') ||
    title.includes('magnum') ||
    /\b\d{3,4}(rl|rs|m1|m1c|rm|fl|f)\b/i.test(title)
  ) {
    return true
  }
  return false
}

// Fetch catalog products with language context and comprehensive series aggregation
export async function getProducts(options: {
  first?: number
  language?: string
  query?: string
} = {}): Promise<ShopifyProduct[]> {
  const { first = 100, language = 'EN', query: searchQuery } = options

  try {
    // If a specific query was provided by the user/search, execute a targeted query
    if (searchQuery) {
      const query = `
        ${PRODUCT_FRAGMENT}
        query getProducts($first: Int!, $language: LanguageCode, $query: String) @inContext(language: $language) {
          products(first: $first, query: $query) {
            edges {
              node {
                ...ProductFields
              }
            }
          }
        }
      `
      const data = await shopifyFetch<{
        products: { edges: { node: ShopifyProduct }[] }
      }>(query, { first, language, query: searchQuery })

      const rawItems = data.products.edges.map(e => e.node)
      // Exclude granular individual single-needle products
      const filtered = rawItems.filter(p => !isGranularCartridge(p))

      const qLower = searchQuery.toLowerCase()
      // Inject consolidated products if search matches cartridge keywords
      if (qLower.includes('premium') || qLower.includes('cartridge') || qLower.includes('needle')) {
        if (!filtered.some(p => p.handle === 'papa-premium-tattoo-cartridges')) {
          filtered.unshift(premiumMatrixProduct as unknown as ShopifyProduct)
        }
      }
      if (qLower.includes('standard') || (qLower.includes('cartridge') && !qLower.includes('premium'))) {
        if (!filtered.some(p => p.handle === 'papa-standard-tattoo-cartridges')) {
          filtered.unshift(standardMatrixProduct as unknown as ShopifyProduct)
        }
      }

      return filtered
    }

    // Default: Aggregate catalog across Papa disciplines.
    // For Papa Cartridges, ONLY the 2 consolidated master products (Premium & Standard) are included!
    const unifiedQuery = `
      ${PRODUCT_FRAGMENT}
      query getUnifiedCatalog($language: LanguageCode) @inContext(language: $language) {
        grips: products(first: 40, query: "title:grip") {
          edges { node { ...ProductFields } }
        }
        machines: products(first: 40, query: "title:pen OR title:atom OR title:power OR title:critical OR title:cheyenne") {
          edges { node { ...ProductFields } }
        }
        supplies: products(first: 30, query: "title:tray OR title:pedal OR title:cord OR title:case OR title:stencil OR title:shirt OR title:hat") {
          edges { node { ...ProductFields } }
        }
      }
    `

    const data = await shopifyFetch<{
      grips: { edges: { node: ShopifyProduct }[] }
      machines: { edges: { node: ShopifyProduct }[] }
      supplies: { edges: { node: ShopifyProduct }[] }
    }>(unifiedQuery, { language })

    const productMap = new Map<string, ShopifyProduct>()

    // EXACTLY TWO Master Products for Cartridges: Premium & Standard
    if (premiumMatrixProduct) {
      productMap.set(premiumMatrixProduct.id, premiumMatrixProduct as unknown as ShopifyProduct)
    }
    if (standardMatrixProduct) {
      productMap.set(standardMatrixProduct.id, standardMatrixProduct as unknown as ShopifyProduct)
    }

    // Add hardware, machines, and studio supplies (filtering out any old single-needle products)
    data.grips?.edges?.forEach(e => {
      if (!isGranularCartridge(e.node)) productMap.set(e.node.id, e.node)
    })
    data.machines?.edges?.forEach(e => {
      if (!isGranularCartridge(e.node)) productMap.set(e.node.id, e.node)
    })
    data.supplies?.edges?.forEach(e => {
      if (!isGranularCartridge(e.node)) productMap.set(e.node.id, e.node)
    })

    return Array.from(productMap.values())

    return Array.from(productMap.values())
  } catch (error) {
    console.error('Failed to fetch products from Shopify Storefront API:', error)
    // Return sample Papa Tattoo Supply fallback data if offline
    return FALLBACK_PRODUCTS
  }
}

// Create a new cart or add item to cart
export async function createShopifyCart(lines: { merchandiseId: string; quantity: number }[]): Promise<{
  id: string
  checkoutUrl: string
}> {
  const mutation = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string }
      userErrors: { field: string; message: string }[]
    }
  }>(mutation, { input: { lines } })

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  return data.cartCreate.cart
}

// ==========================================
// Customer Account (Shopper Auth & Profile)
// ==========================================
export interface CustomerTokenResult {
  accessToken: string
  expiresAt: string
}

export interface CustomerProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  orders?: {
    edges: {
      node: {
        id: string
        name: string
        orderNumber: number
        processedAt: string
        financialStatus: string
        fulfillmentStatus: string
        totalPrice: {
          amount: string
          currencyCode: string
        }
      }
    }[]
  }
}

export async function loginCustomer(email: string, password: string): Promise<CustomerTokenResult> {
  const mutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `
  const res = await shopifyFetch(mutation, { input: { email, password } })
  const result = res?.customerAccessTokenCreate
  if (result?.customerUserErrors && result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message)
  }
  if (!result?.customerAccessToken) {
    throw new Error('Invalid email or password.')
  }
  return result.customerAccessToken
}

export async function registerCustomer(firstName: string, lastName: string, email: string, password: string): Promise<void> {
  const mutation = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `
  const res = await shopifyFetch(mutation, {
    input: { firstName, lastName, email, password }
  })
  const result = res?.customerCreate
  if (result?.customerUserErrors && result.customerUserErrors.length > 0) {
    throw new Error(result.customerUserErrors[0].message)
  }
}

export async function getCustomerProfile(accessToken: string): Promise<CustomerProfile | null> {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        orders(first: 10) {
          edges {
            node {
              id
              name
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `
  try {
    const res = await shopifyFetch(query, { customerAccessToken: accessToken })
    return res?.customer || null
  } catch {
    return null
  }
}

export async function recoverCustomerPassword(email: string): Promise<void> {
  const mutation = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `
  const res = await shopifyFetch(mutation, { email })
  const errors = res?.customerRecover?.customerUserErrors
  if (errors && errors.length > 0) {
    throw new Error(errors[0].message)
  }
}

// Fallback high-fidelity products in case of network interruption
export const FALLBACK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'gid://shopify/Product/8949754167348',
    title: 'Papa Adjustable Click Grip - Blue',
    handle: 'papa-adjustable-click-grip-blue',
    description: 'Aircraft grade aluminum adjustable cartridge grip. Dual stainless steel ball-bearing click system ensures micro-adjustments during needle depth setting without unwanted turning.',
    tags: ['Grip', 'Aircraft Aluminum', '32mm', 'Click-System'],
    priceRange: {
      minVariantPrice: {
        amount: '69.0',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_111_papa_adjustment_grips_1__cutout.webp?v=1789132494' } },
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_126_papa_adjustment_grips_2__cutout.webp?v=1789132497' } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/48326238076980', title: '1 inch (25mm)', price: { amount: '69.0', currencyCode: 'USD' } } },
        { node: { id: 'gid://shopify/ProductVariant/48326238109748', title: '1.25 inch (32mm)', price: { amount: '79.0', currencyCode: 'USD' } } },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/8949756592180',
    title: 'Papa Adjustable Click Grip - Black',
    handle: 'papa-adjustable-click-grip-black',
    description: 'Matte obsidian anodized finish. Compatible with all major cartridge needle brands (Cheyenne, Kwadron, Bishop). Autoclavable design.',
    tags: ['Grip', 'Matte Black', 'Pro Choice', 'Autoclavable'],
    priceRange: {
      minVariantPrice: {
        amount: '69.0',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_268_papaag_1__cutout.webp?v=1789132609' } },
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_122_papaag_2__cutout.webp?v=1789132613' } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/48326261473332', title: '1 inch (25mm)', price: { amount: '69.0', currencyCode: 'USD' } } },
        { node: { id: 'gid://shopify/ProductVariant/48326261506100', title: '1.25 inch (32mm)', price: { amount: '79.0', currencyCode: 'USD' } } },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/8949756624948',
    title: 'Papa Adjustable Click Grip - Silver',
    handle: 'papa-adjustable-click-grip-silver',
    description: 'Precision machined raw titanium-silver finish. Heavy duty click stop mechanism provides definitive tactile feedback.',
    tags: ['Grip', 'Titanium Silver', 'Heavy Duty'],
    priceRange: {
      minVariantPrice: {
        amount: '69.0',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_224_papaag_7__cutout.webp?v=1789132347' } },
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_166_papaag_8__cutout.webp?v=1789132351' } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/48326261538868', title: '1 inch (25mm)', price: { amount: '69.0', currencyCode: 'USD' } } },
        { node: { id: 'gid://shopify/ProductVariant/48326261571636', title: '1.25 inch (32mm)', price: { amount: '79.0', currencyCode: 'USD' } } },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/8949756723252',
    title: 'Papa Adjustable Click Grip - Green',
    handle: 'papa-adjustable-click-grip-green',
    description: 'Vibrant anodized emerald green. Knurled grip pattern offers slip-free control even during long 8-hour sessions.',
    tags: ['Grip', 'Emerald Green', 'Ergonomic'],
    priceRange: {
      minVariantPrice: {
        amount: '69.0',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_091_papa_adjustable_cartridge_grips_10__cutout.webp?v=1789132100' } },
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_187_papa_adjustable_cartridge_grips_11__cutout.webp?v=1789132104' } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/48326261702708', title: '1 inch (25mm)', price: { amount: '69.0', currencyCode: 'USD' } } },
        { node: { id: 'gid://shopify/ProductVariant/48326261735476', title: '1.25 inch (32mm)', price: { amount: '79.0', currencyCode: 'USD' } } },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/8949756854324',
    title: 'Papa Adjustable Click Grip - Pink',
    handle: 'papa-adjustable-click-grip-pink',
    description: 'Hot pink limited edition. Precision engineered internal needle drive plunger rod included.',
    tags: ['Grip', 'Hot Pink', 'Limited Edition'],
    priceRange: {
      minVariantPrice: {
        amount: '69.0',
        currencyCode: 'USD',
      },
    },
    images: {
      edges: [
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_117_papa_adjustable_cartridge_grips_13__cutout.webp?v=1789132547' } },
        { node: { url: 'https://cdn.shopify.com/s/files/1/0780/2955/3716/files/img_269_papa_adjustable_cartridge_grips_14__cutout.webp?v=1789132551' } },
      ],
    },
    variants: {
      edges: [
        { node: { id: 'gid://shopify/ProductVariant/48326261997620', title: '1 inch (25mm)', price: { amount: '69.0', currencyCode: 'USD' } } },
        { node: { id: 'gid://shopify/ProductVariant/48326262030388', title: '1.25 inch (32mm)', price: { amount: '79.0', currencyCode: 'USD' } } },
      ],
    },
  },
]
