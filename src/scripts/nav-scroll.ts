const nav = document.getElementById('mainNav')

function updateScrolledState() {
  nav?.classList.toggle('scrolled', window.scrollY > 10)
}

updateScrolledState()
window.addEventListener('scroll', updateScrolledState, { passive: true })
