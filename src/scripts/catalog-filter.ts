const tabs = document.querySelectorAll<HTMLButtonElement>('.catalog-tab')
const cards = document.querySelectorAll<HTMLElement>('.product-card')

function applyFilter(model: string) {
  const toReveal: HTMLElement[] = []

  for (const card of cards) {
    const matches = model === 'all' || card.dataset.model === model
    if (matches) {
      card.hidden = false
      card.classList.remove('visible')
      toReveal.push(card)
    }
    else {
      card.hidden = true
    }
  }

  requestAnimationFrame(() => {
    for (const card of toReveal) card.classList.add('visible')
  })
}

for (const tab of tabs) {
  tab.addEventListener('click', () => {
    const { tab: model } = tab.dataset
    if (model === undefined)
      return

    for (const t of tabs) t.classList.toggle('active', t === tab)
    applyFilter(model)
  })
}
