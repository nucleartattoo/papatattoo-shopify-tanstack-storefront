import React from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { ThemeProvider } from './context/ThemeContext'
import { LocaleProvider } from './context/LocaleContext'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
