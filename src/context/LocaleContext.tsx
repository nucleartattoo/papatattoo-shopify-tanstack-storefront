import React, { createContext, useContext, useState, useEffect } from 'react'

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
    hero_tag: 'PRECISION TATTOO ENGINEERING',
    hero_title: 'ENGINEERED FOR MASTERY',
    hero_desc: 'Medical-grade aluminum components, zero-vibration ball-bearing mechanics, and ultra-consistent needle guidance designed exclusively for professional tattoo artists.',
    hero_cta: 'EXPLORE APPARATUS',
    hero_secondary: 'STUDIO BULK PROGRAM',
    specs_aircraft_aluminum: '6061-T6 Aircraft Aluminum',
    specs_precision: '0.01mm Click Precision',
    specs_worldwide: 'Global Studio Logistics',
    filter_all: 'All Gear',
    filter_grips: 'Click Grips',
    filter_machines: 'Machines',
    filter_cartridges: 'Cartridges',
    card_pro_choice: 'PRO CHOICE',
    card_quick_add: 'ADD TO ORDER',
    card_select_size: 'Select Size:',
    card_in_stock: 'In Stock',
    studio_banner_title: 'PROFESSIONAL STUDIO BULK PROGRAM',
    studio_banner_desc: 'Equip your entire studio with tiered commercial volume pricing, guaranteed priority allocation, and factory direct quality assurance.',
    studio_tier_1: '5+ Units: 10% Off',
    studio_tier_2: '10+ Units: 18% Off',
    studio_tier_3: 'Master Case: 25% Off + Express Air',
    cart_title: 'CURRENT ORDER',
    cart_empty: 'Your gear bag is empty',
    cart_subtotal: 'Order Subtotal',
    cart_shipping_free_reached: 'Free Studio Priority Shipping unlocked!',
    cart_shipping_away: 'Add {amount} more for Free Studio Priority Shipping',
    cart_checkout: 'PROCEED TO SECURE CHECKOUT',
    cart_items_count: '{count} items',
    footer_rights: 'PAPA TATTOO SUPPLY. ALL RIGHTS RESERVED.',
    footer_tagline: 'Professional tattooing machinery, precision cartridge grips, and sterile studio equipment.',
  },
  ES: {
    nav_machines: 'Máquinas Rotativas',
    nav_grips: 'Grips Ajustables',
    nav_needles: 'Cartuchos de Aguja',
    nav_power: 'Fuentes & Inalámbrico',
    nav_studio: 'Venta a Estudios',
    hero_tag: 'INGENIERÍA DE PRECISIÓN PARA TATUAJE',
    hero_title: 'DISEÑADO PARA LA MAESTRÍA',
    hero_desc: 'Componentes de aluminio de grado médico, rodamientos de bolas sin vibración y control milimétrico de aguja creados para tatuadores profesionales.',
    hero_cta: 'EXPLORAR EQUIPO',
    hero_secondary: 'PROGRAMA PARA ESTUDIOS',
    specs_aircraft_aluminum: 'Aluminio Aeroespacial 6061-T6',
    specs_precision: 'Precisión de Clic de 0.01 mm',
    specs_worldwide: 'Logística Global a Estudios',
    filter_all: 'Todos los Productos',
    filter_grips: 'Grips de Clic',
    filter_machines: 'Máquinas',
    filter_cartridges: 'Cartuchos',
    card_pro_choice: 'ELECCIÓN PRO',
    card_quick_add: 'AGREGAR AL PEDIDO',
    card_select_size: 'Seleccionar Tamaño:',
    card_in_stock: 'En Stock',
    studio_banner_title: 'PROGRAMA MAYORISTA PARA ESTUDIOS',
    studio_banner_desc: 'Equipa todo tu estudio con descuentos por volumen escalonados, asignación prioritaria y garantía de calidad directa de fábrica.',
    studio_tier_1: '5+ Unidades: 10% Descuento',
    studio_tier_2: '10+ Unidades: 18% Descuento',
    studio_tier_3: 'Caja Maestra: 25% Descuento + Envío Aéreo',
    cart_title: 'PEDIDO ACTUAL',
    cart_empty: 'Tu bolsa de equipo está vacía',
    cart_subtotal: 'Subtotal del Pedido',
    cart_shipping_free_reached: '¡Envío Prioritario a Estudio Desbloqueado!',
    cart_shipping_away: 'Agrega {amount} más para Envío Prioritario Gratis',
    cart_checkout: 'CONTINUAR AL PAGO SEGURO',
    cart_items_count: '{count} artículos',
    footer_rights: 'PAPA TATTOO SUPPLY. TODOS LOS DERECHOS RESERVADOS.',
    footer_tagline: 'Maquinaria profesional de tatuaje, grips de precisión y equipo de estudio esterilizado.',
  },
  DE: {
    nav_machines: 'Rotary Maschinen',
    nav_grips: 'Verstellbare Grips',
    nav_needles: 'Nadelmodule',
    nav_power: 'Netzteile & Akkus',
    nav_studio: 'Studio Großhandel',
    hero_tag: 'PRÄZISIONS-TATTOO-INGENIEURWESEN',
    hero_title: 'FÜR MEISTER ENTWICKELT',
    hero_desc: 'Medizinisches Flugzeug-Aluminium, vibrationsfreie Kugellagermechanik und konsistente Nadelführung exklusiv für professionelle Tätowierer.',
    hero_cta: 'EQUIPMENT ENTDECKEN',
    hero_secondary: 'STUDIO GROSSKUNDEN',
    specs_aircraft_aluminum: '6061-T6 Flugzeugaluminium',
    specs_precision: '0,01 mm Klick-Präzision',
    specs_worldwide: 'Weltweite Studiopriorität',
    filter_all: 'Alle Produkte',
    filter_grips: 'Klick-Grips',
    filter_machines: 'Maschinen',
    filter_cartridges: 'Nadelmodule',
    card_pro_choice: 'PROFI WAHL',
    card_quick_add: 'IN DEN WARENKORB',
    card_select_size: 'Größe wählen:',
    card_in_stock: 'Auf Lager',
    studio_banner_title: 'PROFESSIONELLES STUDIO-PROGRAMM',
    studio_banner_desc: 'Statten Sie Ihr Studio mit gestaffelten Mengenrabatten, garantierter Lieferzuteilung und werkseigener Qualitätssicherung aus.',
    studio_tier_1: 'Ab 5 Stück: 10% Rabatt',
    studio_tier_2: 'Ab 10 Stück: 18% Rabatt',
    studio_tier_3: 'Master Box: 25% Rabatt + Express-Luftfracht',
    cart_title: 'AKTUELLE BESTELLUNG',
    cart_empty: 'Ihr Warenkorb ist leer',
    cart_subtotal: 'Zwischensumme',
    cart_shipping_free_reached: 'Kostenloser Expressversand freigeschaltet!',
    cart_shipping_away: 'Noch {amount} bis zum kostenlosen Versand',
    cart_checkout: 'ZUR SICHEREN KASSE',
    cart_items_count: '{count} Artikel',
    footer_rights: 'PAPA TATTOO SUPPLY. ALLE RECHTE VORBEHALTEN.',
    footer_tagline: 'Professionelle Tattoomaschinen, Präzisionsgrips und sterile Studioausrüstung.',
  },
  FR: {
    nav_machines: 'Machines Rotatives',
    nav_grips: 'Manchons Réglables',
    nav_needles: 'Cartouches Aiguilles',
    nav_power: 'Alimentations & Sans Fil',
    nav_studio: 'Tarifs Studio Pro',
    hero_tag: 'INGÉNIERIE DE PRÉCISION DU TATOUAGE',
    hero_title: 'CONÇU POUR LA MAÎTRISE',
    hero_desc: 'Aluminium de qualité médicale 6061, mécanique à roulement à billes sans vibration et guidage ultra-précis conçus pour tatoueurs professionnels.',
    hero_cta: 'DÉCOUVRIR LE MATÉRIEL',
    hero_secondary: 'PROGRAMME STUDIO',
    specs_aircraft_aluminum: 'Aluminium Aéronautique 6061-T6',
    specs_precision: 'Précision de Clic 0,01 mm',
    specs_worldwide: 'Logistique Studio Mondiale',
    filter_all: 'Tout le Matériel',
    filter_grips: 'Manchons à Clic',
    filter_machines: 'Machines',
    filter_cartridges: 'Cartouches',
    card_pro_choice: 'CHOIX PRO',
    card_quick_add: 'AJOUTER À LA COMMANDE',
    card_select_size: 'Choisir la Taille :',
    card_in_stock: 'En Stock',
    studio_banner_title: 'PROGRAMME GROSSISTE POUR STUDIOS',
    studio_banner_desc: 'Équipez votre studio avec des tarifs dégressifs, une allocation prioritaire et une assurance qualité directe d\'usine.',
    studio_tier_1: '5+ Unités : 10% de Réduction',
    studio_tier_2: '10+ Unités : 18% de Réduction',
    studio_tier_3: 'Boîtier Maître : 25% + Envoi Express',
    cart_title: 'COMMANDE EN COURS',
    cart_empty: 'Votre panier est vide',
    cart_subtotal: 'Sous-total',
    cart_shipping_free_reached: 'Livraison Studio Express Gratuite débloquée !',
    cart_shipping_away: 'Ajoutez {amount} de plus pour la livraison gratuite',
    cart_checkout: 'PASSER À LA CAISSE SÉCURISÉE',
    cart_items_count: '{count} articles',
    footer_rights: 'PAPA TATTOO SUPPLY. TOUS DROITS RÉSERVÉS.',
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

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('papa_locale') as Locale | null
        if (saved && (saved === 'EN' || saved === 'ES' || saved === 'DE' || saved === 'FR')) {
          return saved
        }
      } catch {}
      return detectBrowserLocale()
    }
    return 'EN'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('papa_locale', locale)
      } catch {}
    }
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
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
