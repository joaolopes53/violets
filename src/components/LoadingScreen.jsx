import { useState, useEffect, useRef } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen() {
  const [fadingOut, setFadingOut] = useState(false)
  const [mounted, setMounted] = useState(true)
  const pageReadyRef = useRef(typeof document === 'undefined' || document.readyState === 'complete')
  const animationCompleteRef = useRef(false)

  useEffect(() => {
    // Skip loading animation if user requested reduced motion
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setMounted(false)
      return
    }

    const tryFadeOut = () => {
      if (pageReadyRef.current && animationCompleteRef.current) {
        setFadingOut(true)
      }
    }

    const handlePageReady = () => {
      pageReadyRef.current = true
      tryFadeOut()
    }

    window.addEventListener('load', handlePageReady, { once: true })
    const loadingFallbackTimer = window.setTimeout(() => setFadingOut(true), 3000)
    tryFadeOut()

    return () => {
      window.removeEventListener('load', handlePageReady)
      window.clearTimeout(loadingFallbackTimer)
    }
  }, [])

  const handleLineAnimationEnd = () => {
    animationCompleteRef.current = true
    if (pageReadyRef.current) setFadingOut(true)
  }

  const handleFadeTransitionEnd = event => {
    if (event.target === event.currentTarget && event.propertyName === 'opacity') {
      setMounted(false)
    }
  }

  if (!mounted) return null

  return (
    <div
      className={`loading-screen${fadingOut ? ' loading-screen--fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Violets"
      onTransitionEnd={handleFadeTransitionEnd}
    >
      <div className="loading-screen__inner">
        <div className="loading-screen__title">V I O L E T S</div>
        <div className="loading-screen__track" aria-hidden="true">
          <div className="loading-screen__line" onAnimationEnd={handleLineAnimationEnd} />
        </div>
        <p className="loading-screen__sub">Madeira &bull; 2011</p>
      </div>
    </div>
  )
}
