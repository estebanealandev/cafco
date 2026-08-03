const mobileMenu = document.getElementById('mobileMenu')

document.querySelector('[data-mobile-menu-open]')?.addEventListener('click', () => {
  mobileMenu?.classList.add('active')
})

document.querySelector('[data-mobile-menu-close]')?.addEventListener('click', () => {
  mobileMenu?.classList.remove('active')
})
