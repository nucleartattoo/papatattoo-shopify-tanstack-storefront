import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

export type Locale = 'EN' | 'ES' | 'DE' | 'FR'

interface LocaleContextType {
  locale: Locale
  setLocale: (loc: Locale) => void
  currency: string
  t: (key: string) => string
}

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  EN: {
    nav_machines: 'Rotary Machines',
    nav_grips: 'Adjustable Grips',
    nav_needles: 'Needle Cartridges',
    nav_power: 'Power & Wireless',
    nav_studio: 'Studio Wholesale',
    hero_tag: 'Precision Tattoo Engineering',
    hero_title: 'Engineered for Mastery',
    hero_desc: 'Medical-grade aluminum components, zero-vibration ball-bearing mechanics, and ultra-consistent needle guidance designed exclusively for professional tattoo artists.',
    hero_cta: 'Explore Hardware',
    hero_secondary: 'Studio Bulk Program',
    specs_aircraft_aluminum: '6061-T6 Aircraft Aluminum',
    specs_precision: '0.01mm Click Precision',
    specs_worldwide: 'Global Studio Logistics',
    filter_all: 'All Gear',
    filter_grips: 'Click Grips',
    filter_machines: 'Machines',
    filter_cartridges: 'Cartridges',
    card_pro_choice: 'Pro Choice',
    card_quick_add: 'Add to Bag',
    card_select_size: 'Select Size:',
    card_in_stock: 'In Stock',
    studio_banner_title: 'Professional Studio Bulk Program',
    studio_banner_desc: 'Equip your entire studio with tiered commercial volume pricing, guaranteed priority allocation, and factory direct quality assurance.',
    studio_tier_1: '5+ Units: 10% Off',
    studio_tier_2: '10+ Units: 18% Off',
    studio_tier_3: 'Master Case: 25% Off + Express Air',
    cart_title: 'Review Bag',
    cart_empty: 'Your bag is empty',
    cart_subtotal: 'Order Subtotal',
    cart_shipping_free_reached: 'Free Studio Priority Shipping unlocked!',
    cart_shipping_away: 'Add {amount} more for Free Studio Priority Shipping',
    cart_checkout: 'Check Out',
    cart_items_count: '{count} items',
    footer_rights: 'Papa Tattoo Supply. All rights reserved.',
    footer_tagline: 'Professional tattooing machinery, precision cartridge grips, and sterile studio equipment.',
  },
  ES: {
    nav_machines: 'Máquinas Rotativas',
    nav_grips: 'Grips Ajustables',
    nav_needles: 'Cartuchos de Aguja',
    nav_power: 'Fuentes & Inalámbrico',
    nav_studio: 'Venta a Estudios',
    hero_tag: 'Ingeniería de Precisión',
    hero_title: 'Diseñado para la Maestría',
    hero_desc: 'Componentes de aluminio de grado médico, rodamientos de bolas sin vibración y control milimétrico de aguja creados para tatuadores profesionales.',
    hero_cta: 'Explorar Equipos',
    hero_secondary: 'Programa para Estudios',
    specs_aircraft_aluminum: 'Aluminio Aeroespacial 6061-T6',
    specs_precision: 'Precisión de Clic de 0.01 mm',
    specs_worldwide: 'Logística Global a Estudios',
    filter_all: 'Todos los Productos',
    filter_grips: 'Grips de Clic',
    filter_machines: 'Máquinas',
    filter_cartridges: 'Cartuchos',
    card_pro_choice: 'Elección Pro',
    card_quick_add: 'Agregar a la Bolsa',
    card_select_size: 'Seleccionar Tamaño:',
    card_in_stock: 'En Stock',
    studio_banner_title: 'Programa Mayorista para Estudios',
    studio_banner_desc: 'Equipa todo tu estudio con descuentos por volumen escalonados, asignación prioritaria y garantía de calidad directa de fábrica.',
    studio_tier_1: '5+ Unidades: 10% Descuento',
    studio_tier_2: '10+ Unidades: 18% Descuento',
    studio_tier_3: 'Caja Maestra: 25% Descuento + Envío Aéreo',
    cart_title: 'Revisar Bolsa',
    cart_empty: 'Tu bolsa está vacía',
    cart_subtotal: 'Subtotal del Pedido',
    cart_shipping_free_reached: '¡Envío Prioritario a Estudio Desbloqueado!',
    cart_shipping_away: 'Agrega {amount} más para Envío Prioritario Gratis',
    cart_checkout: 'Continuar al Pago',
    cart_items_count: '{count} artículos',
    footer_rights: 'Papa Tattoo Supply. Todos los derechos reservados.',
    footer_tagline: 'Maquinaria profesional de tatuaje, grips de precisión y equipo de estudio esterilizado.',
  },
  DE: {
    nav_machines: 'Rotary Maschinen',
    nav_grips: 'Verstellbare Grips',
    nav_needles: 'Nadelmodule',
    nav_power: 'Netzteile & Akkus',
    nav_studio: 'Studio Großhandel',
    hero_tag: 'Präzisions-Tattoo-Ingenieurwesen',
    hero_title: 'Für Meister Entwickelt',
    hero_desc: 'Medizinisches Flugzeug-Aluminium, vibrationsfreie Kugellagermechanik und konsistente Nadelführung exklusiv für professionelle Tätowierer.',
    hero_cta: 'Hardware Entdecken',
    hero_secondary: 'Studio Großkunden',
    specs_aircraft_aluminum: '6061-T6 Flugzeugaluminium',
    specs_precision: '0,01 mm Klick-Präzision',
    specs_worldwide: 'Weltweite Studiopriorität',
    filter_all: 'Alle Produkte',
    filter_grips: 'Klick-Grips',
    filter_machines: 'Maschinen',
    filter_cartridges: 'Nadelmodule',
    card_pro_choice: 'Profi-Wahl',
    card_quick_add: 'In den Warenkorb',
    card_select_size: 'Größe wählen:',
    card_in_stock: 'Auf Lager',
    studio_banner_title: 'Professionelles Studio-Programm',
    studio_banner_desc: 'Statten Sie Ihr Studio mit gestaffelten Mengenrabatten, garantierter Lieferzuteilung und werkseigener Qualitätssicherung aus.',
    studio_tier_1: 'Ab 5 Stück: 10% Rabatt',
    studio_tier_2: 'Ab 10 Stück: 18% Rabatt',
    studio_tier_3: 'Master Box: 25% Rabatt + Express-Luftfracht',
    cart_title: 'Warenkorb',
    cart_empty: 'Ihr Warenkorb ist leer',
    cart_subtotal: 'Zwischensumme',
    cart_shipping_free_reached: 'Kostenloser Expressversand freigeschaltet!',
    cart_shipping_away: 'Noch {amount} bis zum kostenlosen Versand',
    cart_checkout: 'Zur Kasse',
    cart_items_count: '{count} Artikel',
    footer_rights: 'Papa Tattoo Supply. Alle Rechte vorbehalten.',
    footer_tagline: 'Professionelle Tattoomaschinen, Präzisionsgrips und sterile Studioausrüstung.',
  },
  FR: {
    nav_machines: 'Machines Rotatives',
    nav_grips: 'Manchons Réglables',
    nav_needles: 'Cartouches Aiguilles',
    nav_power: 'Alimentations & Sans Fil',
    nav_studio: 'Tarifs Studio Pro',
    hero_tag: 'Ingénierie de Précision',
    hero_title: 'Conçu pour la Maîtrise',
    hero_desc: 'Aluminium de qualité médicale 6061, mécanique à roulement à billes sans vibration et guidage ultra-précis conçus pour tatoueurs professionnels.',
    hero_cta: 'Explorer le Matériel',
    hero_secondary: 'Programme Studio',
    specs_aircraft_aluminum: 'Aluminium Aéronautique 6061-T6',
    specs_precision: 'Précision de Clic 0,01 mm',
    specs_worldwide: 'Logistique Studio Mondiale',
    filter_all: 'Tout le Matériel',
    filter_grips: 'Manchons à Clic',
    filter_machines: 'Machines',
    filter_cartridges: 'Cartouches',
    card_pro_choice: 'Choix Pro',
    card_quick_add: 'Ajouter au Panier',
    card_select_size: 'Choisir la Taille :',
    card_in_stock: 'En Stock',
    studio_banner_title: 'Programme Grossiste pour Studios',
    studio_banner_desc: 'Équipez votre studio avec des tarifs dégressifs, une allocation prioritaire et une assurance qualité directe d\'usine.',
    studio_tier_1: '5+ Unités : 10% de Réduction',
    studio_tier_2: '10+ Unités : 18% de Réduction',
    studio_tier_3: 'Boîtier Maître : 25% + Envoi Express',
    cart_title: 'Panier',
    cart_empty: 'Votre panier est vide',
    cart_subtotal: 'Sous-total',
    cart_shipping_free_reached: 'Livraison Studio Express Gratuite débloquée !',
    cart_shipping_away: 'Ajoutez {amount} de plus pour la livraison gratuite',
    cart_checkout: 'Commander',
    cart_items_count: '{count} articles',
    footer_rights: 'Papa Tattoo Supply. Tous droits réservés.',
    footer_tagline: 'Machines de tatouage professionnelles, grips haute précision et matériel stérile.',
  },
}

const SUPPORTED_LOCALES: Record<string, Locale> = {
  en: 'EN',
  es: 'ES',
  de: 'DE',
  fr: 'FR',
}

/**
 * Detect user's preferred language following big-tech (Apple/Google) standards:
 * 1. Read prioritized navigator.languages list
 * 2. Normalize language subtag (e.g. 'es-MX' -> 'es')
 * 3. Match against supported primary locales (EN, ES, DE, FR)
 * 4. Gracefully fallback to 'EN' for unsupported languages
 */
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'EN'
  }

  try {
    const candidates: string[] = []
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      candidates.push(...navigator.languages)
    }
    if (navigator.language) {
      candidates.push(navigator.language)
    }

    for (const lang of candidates) {
      if (!lang || typeof lang !== 'string') continue
      const primary = lang.trim().toLowerCase().split(/[-_]/)[0]
      if (SUPPORTED_LOCALES[primary]) {
        return SUPPORTED_LOCALES[primary]
      }
    }
  } catch {
    // Fallback on restricted browser environments
  }

  return 'EN'
}

function parseLocaleFromHref(href: string): Locale | null {
  const match = href.match(/[?&]lang=(en|es|de|fr)\b/i)
  if (!match) return null
  return match[1].toUpperCase() as Locale
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const urlLocale = parseLocaleFromHref(location.href)

  const [locale, setLocaleState] = useState<Locale>(() => urlLocale ?? 'EN')

  // Sync locale when URL ?lang= changes or restore saved/browser preference after hydration
  useEffect(() => {
    if (urlLocale) {
      setLocaleState(urlLocale)
      return
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('papa_locale') as Locale | null
        if (saved && (saved === 'EN' || saved === 'ES' || saved === 'DE' || saved === 'FR')) {
          setLocaleState(saved)
          return
        }
      } catch {}
      setLocaleState(detectBrowserLocale())
    }
  }, [urlLocale])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        document.documentElement.lang = locale.toLowerCase()
      } catch {}
    }
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('papa_locale', newLocale)
      } catch {}
    }
  }

  const currency = locale === 'EN' ? 'USD' : 'EUR'

  const t = (key: string): string => {
    return TRANSLATIONS[locale]?.[key] || TRANSLATIONS.EN[key] || key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, currency, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
