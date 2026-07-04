import { useState, useEffect } from 'react'
import { LanguageContext } from './LanguageContext'
import { translations } from '../data/translations'

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'pt' || saved === 'en') return saved
    
    // Browser language check
    const browserLang = navigator.language || ''
    if (browserLang.toLowerCase().startsWith('en')) {
      return 'en'
    }
    return 'pt'
  })

  useEffect(() => {
    localStorage.setItem('lang', language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (lang) => {
    if (lang === 'pt' || lang === 'en') {
      setLanguageState(lang)
    }
  }

  // Nested translation lookup helper (e.g. t('home.services.cozinhasTitle'))
  const t = (key) => {
    const keys = key.split('.')
    let current = translations[language]

    for (const k of keys) {
      if (current && current[k] !== undefined) {
        current = current[k]
      } else {
        // Fallback to Portuguese if translation missing in English
        let fallback = translations['pt']
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk]
          } else {
            return key
          }
        }
        return fallback
      }
    }

    return current
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
