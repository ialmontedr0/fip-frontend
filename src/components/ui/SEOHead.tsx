import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description?: string
}

const APP_NAME = 'FIP - Financial Intelligence Platform'

function SEOHead({ title, description }: SEOHeadProps) {
  const fullTitle = `${title} | ${APP_NAME}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  )
}

export default SEOHead
