'use client'

import { useEffect } from 'react'

/** One-shot IntersectionObserver for `.reveal` elements. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    )

    for (const el of document.querySelectorAll('.reveal:not(.visible)'))
      obs.observe(el)

    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional re-run on deps
  }, deps)
}
