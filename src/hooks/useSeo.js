import { useEffect } from 'react'
import { useLanguage } from './useLanguage'

export function useSeo({ title, description, canonicalPath = '/' }) {
  const { language } = useLanguage()

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language

    // Update document title
    if (title) {
      document.title = title
    }

    // Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)
    }

    // Update canonical tag
    const canonicalUrl = `https://violetsdesign.com${canonicalPath}`
    let linkCanonical = document.querySelector('link[rel="canonical"]')
    if (!linkCanonical) {
      linkCanonical = document.createElement('link')
      linkCanonical.setAttribute('rel', 'canonical')
      document.head.appendChild(linkCanonical)
    }
    linkCanonical.setAttribute('href', canonicalUrl)
  }, [title, description, canonicalPath, language])
}
