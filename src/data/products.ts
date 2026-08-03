import type { ImageMetadata } from 'astro'
import a01Bag from '@/assets/products/a01-bag.png'
import a01V60 from '@/assets/products/a01-v60.png'
import a02Bag from '@/assets/products/a02-bag.png'
import a02V60 from '@/assets/products/a02-v60.png'

export type ProductModel = 'a01' | 'a02'
export type ProductKey = 'a01v60' | 'a01bag' | 'a02v60' | 'a02bag'

export interface Product {
  key: ProductKey
  model: ProductModel
  image: ImageMetadata
  priceCrc: number
  weightKg: number
  waMessage: string
}

export const PRODUCTS: Product[] = [
  {
    key: 'a01v60',
    model: 'a01',
    image: a01V60,
    priceCrc: 50000,
    weightKg: 6,
    waMessage: 'Hola, quiero ordenar el Chorreador A01 con Dripper V60',
  },
  {
    key: 'a01bag',
    model: 'a01',
    image: a01Bag,
    priceCrc: 45000,
    weightKg: 6,
    waMessage: 'Hola, quiero ordenar el Chorreador A01 con Bolsa de Tela',
  },
  {
    key: 'a02v60',
    model: 'a02',
    image: a02V60,
    priceCrc: 35000,
    weightKg: 2,
    waMessage: 'Hola, quiero ordenar el Chorreador A02 con Dripper V60',
  },
  {
    key: 'a02bag',
    model: 'a02',
    image: a02Bag,
    priceCrc: 30000,
    weightKg: 2,
    waMessage: 'Hola, quiero ordenar el Chorreador A02 con Bolsa de Tela',
  },
]

export function formatCrc(amount: number): string {
  return `₡${amount.toLocaleString('en-US')}`
}
