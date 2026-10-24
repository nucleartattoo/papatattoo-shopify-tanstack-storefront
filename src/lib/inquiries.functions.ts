import { createServerFn } from '@tanstack/react-start'

export type ContactInquiryPayload = {
  kind: 'contact'
  name: string
  email: string
  topic: string
  orderNumber?: string
  message: string
}

export type DistributorInquiryPayload = {
  kind: 'distributor'
  companyName: string
  contactName: string
  email: string
  phone: string
  website?: string
  country: string
  businessType: string
  monthlyVolume: string
  message?: string
}

export type NewsletterInquiryPayload = {
  kind: 'newsletter'
  email: string
}

export type StorefrontInquiryInput =
  | ContactInquiryPayload
  | DistributorInquiryPayload
  | NewsletterInquiryPayload

export interface StorefrontInquiryResult {
  delivered: boolean
  channel: 'email' | 'webhook' | 'mailto'
  recipient: string
  subject: string
  bodyText: string
  mailtoUrl: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanSingleLine(value: unknown, maxLength = 200): string {
  if (typeof value !== 'string') return ''
  let out = ''
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    if (code <= 0x1f || code === 0x7f) {
      out += ' '
    } else {
      out += value[i]
    }
  }
  return out.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

function cleanMultiLine(value: unknown, maxLength = 4000): string {
  if (typeof value !== 'string') return ''
  const normalized = value.replace(/\r\n/g, '\n')
  let out = ''
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i)
    if ((code >= 0x20 && code !== 0x7f) || code === 0x09 || code === 0x0a) {
      out += normalized[i]
    }
  }
  return out.trim().slice(0, maxLength)
}

function validateEmail(raw: unknown): string {
  const email = cleanSingleLine(raw, 254)
  if (!email || !EMAIL_RE.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  return email
}

function validateInquiryInput(raw: unknown): StorefrontInquiryInput {
  if (!raw || typeof raw !== 'object' || !('kind' in raw)) {
    throw new Error('Invalid inquiry payload.')
  }

  const record = raw as Record<string, unknown>
  const kind = record.kind

  if (kind === 'contact') {
    const name = cleanSingleLine(record.name, 120)
    const email = validateEmail(record.email)
    const topic = cleanSingleLine(record.topic, 60) || 'general'
    const orderNumber = cleanSingleLine(record.orderNumber, 60)
    const message = cleanMultiLine(record.message, 4000)

    if (!name) throw new Error('Your name is required.')
    if (!message) throw new Error('Please enter your message.')

    return { kind: 'contact', name, email, topic, orderNumber, message }
  }

  if (kind === 'distributor') {
    const companyName = cleanSingleLine(record.companyName, 160)
    const contactName = cleanSingleLine(record.contactName, 120)
    const email = validateEmail(record.email)
    const phone = cleanSingleLine(record.phone, 60)
    const website = cleanSingleLine(record.website, 240)
    const country = cleanSingleLine(record.country, 120)
    const businessType = cleanSingleLine(record.businessType, 120) || 'Retail & Online Store'
    const monthlyVolume = cleanSingleLine(record.monthlyVolume, 120) || '2,000 - 5,000 boxes/mo'
    const message = cleanMultiLine(record.message, 4000)

    if (!companyName) throw new Error('Company / supply store name is required.')
    if (!contactName) throw new Error('Contact person name is required.')
    if (!phone) throw new Error('Phone / WhatsApp contact is required.')
    if (!country) throw new Error('Country / target territory is required.')

    return {
      kind: 'distributor',
      companyName,
      contactName,
      email,
      phone,
      website,
      country,
      businessType,
      monthlyVolume,
      message,
    }
  }

  if (kind === 'newsletter') {
    const email = validateEmail(record.email)
    return { kind: 'newsletter', email }
  }

  throw new Error('Unsupported inquiry type.')
}

const CONTACT_TOPIC_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  order: 'Order Status & Shipping',
  warranty: 'Machine Service & Warranty',
  wholesale: 'Studio & Wholesale',
}

function formatInquiryMessage(data: StorefrontInquiryInput): { subject: string; bodyText: string } {
  if (data.kind === 'contact') {
    const topicLabel = CONTACT_TOPIC_LABELS[data.topic] || data.topic
    const orderSuffix = data.orderNumber ? ` (${data.orderNumber})` : ''
    const subject = `[Papa Tattoo Support · ${topicLabel}] ${data.name}${orderSuffix}`
    const bodyLines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Topic: ${topicLabel}`,
      data.orderNumber ? `Order Number: ${data.orderNumber}` : null,
      '',
      'Message:',
      data.message,
    ].filter((line): line is string => line !== null)

    return { subject, bodyText: bodyLines.join('\n') }
  }

  if (data.kind === 'distributor') {
    const subject = `[Distributor Application · ${data.country}] ${data.companyName}`
    const bodyLines = [
      'PAPA TATTOO SUPPLY — WHOLESALE PARTNERSHIP APPLICATION',
      '------------------------------------------------------',
      `Company / Store: ${data.companyName}`,
      `Contact Person: ${data.contactName}`,
      `Business Email: ${data.email}`,
      `Phone / WhatsApp: ${data.phone}`,
      `Country / Territory: ${data.country}`,
      `Website / Social: ${data.website || 'N/A'}`,
      `Business Model: ${data.businessType}`,
      `Est. Monthly Volume: ${data.monthlyVolume}`,
      '',
      'Territory & Channel Notes:',
      data.message || 'N/A',
    ]

    return { subject, bodyText: bodyLines.join('\n') }
  }

  return {
    subject: `[Technical Dispatch Subscription] ${data.email}`,
    bodyText: [
      'Please add my studio email to the Papa Tattoo Supply Technical Dispatch release list.',
      '',
      `Subscriber Email: ${data.email}`,
    ].join('\n'),
  }
}

export const submitStorefrontInquiry = createServerFn({ method: 'POST' })
  .validator(validateInquiryInput)
  .handler(async ({ data }): Promise<StorefrontInquiryResult> => {
    const serverEnv: Record<string, string | undefined> =
      (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}

    const recipient = cleanSingleLine(serverEnv.INQUIRY_RECIPIENT_EMAIL, 254) || 'papatattoosupply@gmail.com'
    const { subject, bodyText } = formatInquiryMessage(data)
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`

    const resendApiKey = serverEnv.RESEND_API_KEY?.trim()
    if (resendApiKey) {
      const fromAddress =
        cleanSingleLine(serverEnv.RESEND_FROM_EMAIL, 254) || 'Papa Tattoo Storefront <onboarding@resend.dev>'
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipient],
          reply_to: data.email,
          subject,
          text: bodyText,
        }),
      })

      if (response.ok) {
        return {
          delivered: true,
          channel: 'email',
          recipient,
          subject,
          bodyText,
          mailtoUrl,
        }
      }
    }

    const webhookUrl = serverEnv.INQUIRY_WEBHOOK_URL?.trim()
    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submittedAt: new Date().toISOString(),
          subject,
          bodyText,
          inquiry: data,
        }),
      })

      if (response.ok) {
        return {
          delivered: true,
          channel: 'webhook',
          recipient,
          subject,
          bodyText,
          mailtoUrl,
        }
      }
    }

    console.info(
      JSON.stringify({
        event: 'storefront_inquiry_mailto_fallback',
        kind: data.kind,
        timestamp: new Date().toISOString(),
      })
    )

    return {
      delivered: false,
      channel: 'mailto',
      recipient,
      subject,
      bodyText,
      mailtoUrl,
    }
  })
