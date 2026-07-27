import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description?: string
  ogImage?: string
  noIndex?: boolean
}

const SITE_NAME = 'FIP - Financial Intelligence Platform'
const DEFAULT_DESCRIPTION =
  'Financial Intelligence Platform - Gestion financiera personal inteligente'
const DEFAULT_OG_IMAGE = 'https://app.midominio.com/og-image'

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}