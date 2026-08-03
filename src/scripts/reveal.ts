const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const revealTargets = document.querySelectorAll('.reveal')

if (prefersReducedMotion) {
  revealTargets.forEach(el => el.classList.add('visible'))
}
else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
  )
  revealTargets.forEach(el => observer.observe(el))
}
