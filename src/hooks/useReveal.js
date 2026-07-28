import { useEffect, useRef, useState } from 'react'

/**
 * Hook to detect when an element is in the viewport using IntersectionObserver
 * @param {Object} options IntersectionObserver options + custom parameters
 * @param {boolean} options.once Whether to trigger only once (default: true)
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const { once = true, threshold = 0.1, rootMargin = '0px 0px -80px 0px' } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true)
        if (once) {
          observer.unobserve(el)
        }
      } else if (!once) {
        setRevealed(false)
      }
    }, {
      threshold,
      rootMargin,
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold, rootMargin])

  return [ref, revealed]
}
