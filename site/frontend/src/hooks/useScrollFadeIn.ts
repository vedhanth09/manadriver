import { useEffect, useRef } from "react"

/**
 * Hook that adds a fade-in animation when elements enter the viewport.
 * Uses IntersectionObserver for performance.
 *
 * Usage:
 *   const ref = useScrollFadeIn()
 *   <div ref={ref} className="fade-in">...</div>
 *
 * Requires .fade-in and .fade-in-visible classes from App.css
 */
export function useScrollFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible")
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
