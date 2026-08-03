function getNavOffset(): number {
  const nav = document.getElementById('mainNav')
  return (nav?.offsetHeight ?? 60) + 20
}

document.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof Element))
    return

  const link = target.closest('a[href^="#"]')
  if (!(link instanceof HTMLAnchorElement))
    return

  const hash = link.getAttribute('href')
  if (hash === null)
    return

  event.preventDefault()
  document.getElementById('mobileMenu')?.classList.remove('active')

  if (hash === '#')
    return

  const destination = document.querySelector(hash)
  if (!destination)
    return

  const top = destination.getBoundingClientRect().top + window.scrollY - getNavOffset()
  window.scrollTo({ top, behavior: 'smooth' })
})
