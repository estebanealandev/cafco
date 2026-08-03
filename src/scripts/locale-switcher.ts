document.querySelectorAll<HTMLSelectElement>('[data-locale-switcher]').forEach((select) => {
  select.addEventListener('change', () => {
    window.location.href = select.value + window.location.hash
  })
})
