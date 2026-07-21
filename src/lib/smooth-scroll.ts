export function smoothScrollTo(
  selector: string,
  e?: { preventDefault: () => void },
) {
  e?.preventDefault()
  const target = document.querySelector(selector)
  if (!target)
    return

  const nav = document.getElementById('mainNav')
  const offset = (nav?.offsetHeight ?? 68) + 20
  const top = target.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}
