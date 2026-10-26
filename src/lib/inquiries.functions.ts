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
  channel: 'email' | 'webhook' | 'shopify_crm' | 'mailto'
  recipient: string
  subject: string
  bodyText: string
  mailtoUrl: string
  referenceId?: string
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

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatInquiryHtml(subject: string, bodyText: string): string {
  const safeSubject = escapeHtml(subject)
  const safeBody = escapeHtml(bodyText).replace(/\n/g, '<br />')
  return [
    '<!doctype html>',
    '<html><body style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background:#f8f7f4; color:#14161b; padding:24px;">',
    '<div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e4e4e7; border-radius:12px; padding:24px;">',
    `<h2 style="margin:0 0 16px 0; font-size:15px; text-transform:uppercase; letter-spacing:0.04em; color:#0d5d50;">${safeSubject}</h2>`,
    `<div style="font-size:13px; line-height:1.65; color:#18181b;">${safeBody}</div>`,
    '<hr style="border:none; border-top:1px solid #e4e4e7; margin:20px 0 12px 0;" />',
    '<p style="margin:0; font-size:11px; color:#71717a;">Transmitted via papatattoo.com Storefront Dispatch</p>',
    '</div>',
    '</body></html>',
  ].join('')
}

interface CloudflareSendEmailBinding {
  send(message: {
    to: string | string[]
    from: string | { email: string; name?: string }
    replyTo?: string | { email: string; name?: string }
    subject: string
    html?: string
    text?: string
  }): Promise<{ messageId?: string }>
}

async function resolveRuntimeBindings(): Promise<{
  env: Record<string, string | undefined>
  emailBinding: CloudflareSendEmailBinding | null
}> {
  const procEnv: Record<string, string | undefined> =
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
  const merged: Record<string, string | undefined> = { ...procEnv }
  let emailBinding: CloudflareSendEmailBinding | null = null

  try {
    const cfWorkersId = 'cloudflare:workers'
    const cfMod = (await import(/* @vite-ignore */ cfWorkersId)) as {
      env?: Record<string, unknown>
    }
    if (cfMod?.env && typeof cfMod.env === 'object') {
      for (const [k, v] of Object.entries(cfMod.env)) {
        if (typeof v === 'string' && v.trim()) {
          merged[k] = v
        }
      }
      const maybeEmail = cfMod.env.EMAIL as CloudflareSendEmailBinding | undefined
      if (maybeEmail && typeof maybeEmail.send === 'function') {
        emailBinding = maybeEmail
      }
    }
  } catch {
    // Running outside Cloudflare workerd runtime
  }

  return { env: merged, emailBinding }
}

function splitContactName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: 'Studio', lastName: 'Inquiry' }
  if (parts.length === 1) return { firstName: parts[0], lastName: 'Studio' }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

async function syncInquiryToShopifyAdmin(params: {
  data: StorefrontInquiryInput
  subject: string
  bodyText: string
  submittedAt: string
  env: Record<string, string | undefined>
}): Promise<{ synced: boolean; customerId?: string }> {
  const { data, subject, bodyText, submittedAt, env } = params
  const adminToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim()
  if (!adminToken) {
    return { synced: false }
  }

  const storeDomain =
    cleanSingleLine(env.SHOPIFY_STORE_DOMAIN || env.VITE_SHOPIFY_STORE_DOMAIN, 120) ||
    'ftff5p-yr.myshopify.com'
  const apiVersion =
    cleanSingleLine(env.SHOPIFY_API_VERSION || env.VITE_SHOPIFY_STOREFRONT_API_VERSION, 32) ||
    '2025-01'
  const baseUrl = `https://${storeDomain}/admin/api/${apiVersion}`
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': adminToken,
  }

  try {
    const searchUrl = `${baseUrl}/customers/search.json?query=${encodeURIComponent(`email:${data.email}`)}`
    const searchRes = await fetch(searchUrl, { method: 'GET', headers })
    let existingCustomer: {
      id: number | string
      tags?: string
      note?: string | null
      first_name?: string
      last_name?: string
    } | null = null

    if (searchRes.ok) {
      const searchJson = (await searchRes.json()) as {
        customers?: Array<{
          id: number | string
          email?: string
          tags?: string
          note?: string | null
          first_name?: string
          last_name?: string
        }>
      }
      existingCustomer =
        searchJson.customers?.find(
          c => (c.email || '').trim().toLowerCase() === data.email.toLowerCase()
        ) ??
        searchJson.customers?.[0] ??
        null
    }

    const newTags = new Set<string>(
      (existingCustomer?.tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    )
    newTags.add('storefront-inquiry')

    if (data.kind === 'contact') {
      newTags.add('support-ticket')
      newTags.add(`topic:${data.topic}`)
    } else if (data.kind === 'distributor') {
      newTags.add('distributor-applicant')
      newTags.add('wholesale-inquiry')
    } else if (data.kind === 'newsletter') {
      newTags.add('newsletter-dispatch')
    }

    const noteEntry = `[${submittedAt}] ${subject}\n${bodyText}`
    const existingNote = (existingCustomer?.note || '').trim()
    const combinedNote = existingNote
      ? `${existingNote}\n\n---\n${noteEntry}`.slice(-4500)
      : noteEntry.slice(0, 4500)

    const rawName =
      data.kind === 'contact'
        ? data.name
        : data.kind === 'distributor'
          ? data.contactName
          : ''
    const { firstName, lastName } = rawName
      ? splitContactName(rawName)
      : {
          firstName: existingCustomer?.first_name || 'Studio',
          lastName: existingCustomer?.last_name || 'Subscriber',
        }

    let customerId: string | undefined

    if (existingCustomer?.id) {
      const updatePayload: Record<string, unknown> = {
        id: existingCustomer.id,
        tags: Array.from(newTags).join(', '),
        note: combinedNote,
      }
      if (!existingCustomer.first_name && firstName) {
        updatePayload.first_name = firstName
      }
      if (!existingCustomer.last_name && lastName) {
        updatePayload.last_name = lastName
      }
      if (data.kind === 'newsletter') {
        updatePayload.email_marketing_consent = {
          state: 'subscribed',
          opt_in_level: 'single_opt_in',
          consent_updated_at: submittedAt,
        }
      }

      const updateRes = await fetch(`${baseUrl}/customers/${existingCustomer.id}.json`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ customer: updatePayload }),
      })
      if (updateRes.ok) {
        customerId = String(existingCustomer.id)
      }
    } else {
      const createPayload: Record<string, unknown> = {
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        verified_email: true,
        send_email_invite: false,
        tags: Array.from(newTags).join(', '),
        note: combinedNote,
        metafields: [
          {
            namespace: 'papatattoo_inquiries',
            key: `latest_${data.kind}`,
            type: 'json',
            value: JSON.stringify({
              submittedAt,
              subject,
              inquiry: data,
            }),
          },
        ],
      }

      if (data.kind === 'newsletter') {
        createPayload.email_marketing_consent = {
          state: 'subscribed',
          opt_in_level: 'single_opt_in',
          consent_updated_at: submittedAt,
        }
      }

      const createRes = await fetch(`${baseUrl}/customers.json`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ customer: createPayload }),
      })
      if (createRes.ok) {
        const createJson = (await createRes.json()) as { customer?: { id?: number | string } }
        if (createJson.customer?.id) {
          customerId = String(createJson.customer.id)
        }
      }
    }

    if (customerId && existingCustomer?.id) {
      await fetch(`${baseUrl}/customers/${customerId}/metafields.json`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          metafield: {
            namespace: 'papatattoo_inquiries',
            key: `latest_${data.kind}`,
            type: 'json',
            value: JSON.stringify({
              submittedAt,
              subject,
              inquiry: data,
            }),
          },
        }),
      }).catch(() => null)
    }

    return { synced: Boolean(customerId), customerId }
  } catch (err) {
    console.error('Shopify Admin inquiry sync error:', err)
    return { synced: false }
  }
}

export const submitStorefrontInquiry = createServerFn({ method: 'POST' })
  .validator(validateInquiryInput)
  .handler(async ({ data }): Promise<StorefrontInquiryResult> => {
    const { env: serverEnv, emailBinding } = await resolveRuntimeBindings()
    const submittedAt = new Date().toISOString()

    const recipient =
      cleanSingleLine(serverEnv.INQUIRY_RECIPIENT_EMAIL, 254) || 'papatattoosupply@gmail.com'
    const { subject, bodyText } = formatInquiryMessage(data)
    const bodyHtml = formatInquiryHtml(subject, bodyText)
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`

    // 1. Always persist lead / ticket to Shopify Admin CRM when SHOPIFY_ADMIN_ACCESS_TOKEN is configured
    const shopifySync = await syncInquiryToShopifyAdmin({
      data,
      subject,
      bodyText,
      submittedAt,
      env: serverEnv,
    })

    // 2. Native Cloudflare Email Service binding (when EMAIL send_email binding & EMAIL_FROM_ADDRESS are configured)
    const cfFromEmail = cleanSingleLine(serverEnv.EMAIL_FROM_ADDRESS, 254)
    if (emailBinding && cfFromEmail) {
      try {
        const emailResult = await emailBinding.send({
          to: recipient,
          from: { email: cfFromEmail, name: 'Papa Tattoo Dispatch' },
          replyTo: data.email,
          subject,
          html: bodyHtml,
          text: bodyText,
        })
        return {
          delivered: true,
          channel: 'email',
          recipient,
          subject,
          bodyText,
          mailtoUrl,
          referenceId: emailResult?.messageId || shopifySync.customerId,
        }
      } catch (err) {
        console.error('Cloudflare Email Service send failed:', err)
      }
    }

    // 3. Resend Transactional Email API (when RESEND_API_KEY is configured)
    const resendApiKey = serverEnv.RESEND_API_KEY?.trim()
    if (resendApiKey) {
      const fromAddress =
        cleanSingleLine(serverEnv.RESEND_FROM_EMAIL, 254) ||
        'Papa Tattoo Storefront <onboarding@resend.dev>'
      try {
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
            html: bodyHtml,
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
            referenceId: shopifySync.customerId,
          }
        }
      } catch (err) {
        console.error('Resend API delivery error:', err)
      }
    }

    // 4. Outbound Webhook (Slack / Discord / Zapier / n8n / Custom endpoint)
    const webhookUrl = serverEnv.INQUIRY_WEBHOOK_URL?.trim()
    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submittedAt,
            subject,
            bodyText,
            inquiry: data,
            shopifyCustomerId: shopifySync.customerId ?? null,
            text: `${subject}\n\n${bodyText}`,
            content: `**${subject}**\n\`\`\`\n${bodyText}\n\`\`\``,
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
            referenceId: shopifySync.customerId,
          }
        }
      } catch (err) {
        console.error('Webhook inquiry delivery error:', err)
      }
    }

    // 5. Shopify Admin CRM server-side delivery confirmation
    if (shopifySync.synced) {
      console.info(
        JSON.stringify({
          event: 'storefront_inquiry_shopify_crm_delivered',
          kind: data.kind,
          customerId: shopifySync.customerId,
          timestamp: submittedAt,
        })
      )
      return {
        delivered: true,
        channel: 'shopify_crm',
        recipient,
        subject,
        bodyText,
        mailtoUrl,
        referenceId: shopifySync.customerId,
      }
    }

    console.info(
      JSON.stringify({
        event: 'storefront_inquiry_mailto_fallback',
        kind: data.kind,
        timestamp: submittedAt,
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
