import { useState, useEffect } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen() {
  const [fadingOut, setFadingOut] = useState(false)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    // Skip loading animation if user requested reduced motion
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setMounted(false)
      return
    }

    // Trigger subtle fade-out after the 1px golden line finishes (~1.15s)
    const fadeTimer = setTimeout(() => {
      setFadingOut(true)
    }, 1150)

    // Unmount completely from DOM after fade-out transition finishes (~1.75s)
    const removeTimer = setTimeout(() => {
      setMounted(false)
    }, 1750)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      className={`loading-screen${fadingOut ? ' loading-screen--fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Violets"
    >
      <div className="loading-screen__inner">
        <div className="loading-screen__title">V I O L E T S</div>
        <div className="loading-screen__track" aria-hidden="true">
          <div className="loading-screen__line" />
        </div>
        <p className="loading-screen__sub">Madeira &bull; 2011</p>
      </div>
    </div>
  )
}
