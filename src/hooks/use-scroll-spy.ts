'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks which section id is currently in view for nav `.is-active` states.
 */
export function useScrollSpy(sectionIds: readonly string[], offset = 96) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0)
      return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target.id)
          setActiveId(visible[0].target.id)
      },
      {
        rootMargin: `-${offset}px 0px -45% 0px`,
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    )

    for (const el of elements)
      observer.observe(el)

    return () => observer.disconnect()
  }, [sectionIds, offset])

  return activeId
}
