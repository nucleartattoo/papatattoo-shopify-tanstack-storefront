import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartLineItem, ShopifyProduct, ShopifyVariant } from '../types/shopify'
import { createShopifyCart } from '../lib/shopify'

interface CartContextType {
  items: CartLineItem[]
  isOpen: boolean
  isCheckingOut: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (product: ShopifyProduct, variant: ShopifyVariant, quantity?: number) => void
  removeFromCart: (merchandiseId: string) => void
  updateQuantity: (merchandiseId: string, quantity: number) => void
  clearCart: () => void
  totalAmount: number
  totalQuantity: number
  checkout: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartLineItem[]>(() => {
    try {
      const saved = localStorage.getItem('papa_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('papa_cart', JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [items])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const addToCart = (product: ShopifyProduct, variant: ShopifyVariant, quantity = 1) => {
    setItems(prevItems => {
      const existing = prevItems.find(i => i.merchandiseId === variant.id)
      const priceNum = parseFloat(variant.price.amount) || parseFloat(product.priceRange.minVariantPrice.amount) || 0
      const imgUrl = product.images.edges[0]?.node?.url || ''

      if (existing) {
        return prevItems.map(item =>
          item.merchandiseId === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [
        ...prevItems,
        {
          id: `${product.id}-${variant.id}`,
          merchandiseId: variant.id,
          productId: product.id,
          title: product.title,
          variantTitle: variant.title,
          price: priceNum,
          currencyCode: variant.price.currencyCode || 'USD',
          quantity,
          image: imgUrl,
        },
      ]
    })
    setIsOpen(true)
  }

  const removeFromCart = (merchandiseId: string) => {
    setItems(prev => prev.filter(item => item.merchandiseId !== merchandiseId))
  }

  const updateQuantity = (merchandiseId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(merchandiseId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.merchandiseId === merchandiseId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  const checkout = async () => {
    if (items.length === 0) return

    try {
      setIsCheckingOut(true)
      const lines = items.map(item => ({
        merchandiseId: item.merchandiseId,
        quantity: item.quantity,
      }))

      const cart = await createShopifyCart(lines)
      if (cart && cart.checkoutUrl) {
        // Redirect directly to Shopify Hosted Checkout
        window.location.href = cart.checkoutUrl
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Unable to connect to Shopify checkout. Please ensure variants are valid.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isCheckingOut,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalQuantity,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
