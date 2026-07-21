export const WA_NUMBER = '50661073836'
export const WA_BASE = `https://wa.me/${WA_NUMBER}`
export const IG_URL = 'https://www.instagram.com/cafco.cr/'
export const CONTACT_EMAIL = 'cafco.cr@gmail.com'
export const CONTACT_PHONE = '+506 6107 3836'
export const CONTACT_PHONE_TEL = '+50661073836'

export const LOGO_LIGHT
  = 'https://pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev/cafcologoligth.svg'
export const LOGO_DARK = '/brand/cafco-logo-dark.png'

export const productImages = {
  a01v60:
    'https://static.wixstatic.com/media/dd3e2a_35ad97e5df714f438a45a3239e82f1c9~mv2.png/v1/fill/w_800,h_982,al_c,q_90,enc_avif,quality_auto/A01_2.png',
  a01bag:
    'https://static.wixstatic.com/media/dd3e2a_d236366fc471471291dfed27c2b1251e~mv2.png/v1/fill/w_800,h_980,al_c,q_90,enc_avif,quality_auto/dd3e2a_d236366fc471471291dfed27c2b1251e~mv2.png',
  a02v60:
    'https://static.wixstatic.com/media/dd3e2a_d1ff40fb42a44f33a31a8825045370cd~mv2.png/v1/fill/w_800,h_988,al_c,q_90,enc_avif,quality_auto/A02_2.png',
  a02bag:
    'https://static.wixstatic.com/media/dd3e2a_19b1e63281cc465eb45a36a942d964ad~mv2.png/v1/fill/w_800,h_988,al_c,q_90,enc_avif,quality_auto/A02_4.png',
  audienceImg:
    'https://pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev/cafcodos%20models.webp',
  storyImg:
    'https://static.wixstatic.com/media/dd3e2a_beddd3b6f29c49e1ae3df2a09c1e7a59~mv2.png/v1/fill/w_800,h_982,al_c,q_90,enc_avif,quality_auto/DETALLE%20DE%20TEXTURA%202.png',
  hero: 'https://pub-920fda90d8d340c599bf7793a05eb9fb.r2.dev/hero-1.webp',
} as const

export type ProductKey = 'a01v60' | 'a01bag' | 'a02v60' | 'a02bag'
export type TabKey = 'all' | 'a01' | 'a02'

export interface ProductDef {
  key: ProductKey
  model: 'a01' | 'a02'
  img: string
  waText: string
}

export const allProducts: ProductDef[] = [
  {
    key: 'a01v60',
    model: 'a01',
    img: productImages.a01v60,
    waText:
      'Hola%2C%20quiero%20ordenar%20el%20Chorreador%20A01%20con%20Dripper%20V60',
  },
  {
    key: 'a01bag',
    model: 'a01',
    img: productImages.a01bag,
    waText:
      'Hola%2C%20quiero%20ordenar%20el%20Chorreador%20A01%20con%20Bolsa%20de%20Tela',
  },
  {
    key: 'a02v60',
    model: 'a02',
    img: productImages.a02v60,
    waText:
      'Hola%2C%20quiero%20ordenar%20el%20Chorreador%20A02%20con%20Dripper%20V60',
  },
  {
    key: 'a02bag',
    model: 'a02',
    img: productImages.a02bag,
    waText:
      'Hola%2C%20quiero%20ordenar%20el%20Chorreador%20A02%20con%20Bolsa%20de%20Tela',
  },
]

export const NAV_SECTIONS = [
  { id: 'modelos', href: '#modelos', labelKey: 'nav.models' as const },
  { id: 'materiales', href: '#materiales', labelKey: 'nav.materials' as const },
  { id: 'preparacion', href: '#preparacion', labelKey: 'nav.preparation' as const },
  { id: 'nosotros', href: '#nosotros', labelKey: 'nav.about' as const },
] as const
