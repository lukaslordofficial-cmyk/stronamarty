import mobileCrops from './mobile-crops.json'

export type Crop = { x: number; y: number; w: number; h: number; rotate?: number }

export type Frame = {
  id?: string
  name: string
  width: number
  height: number
  sizes: number[]
  alt: string
  logo?: { left: number; top: number; width: number }
  pen?: boolean
  accent?: Crop
  mobile?: Crop[]
}

const MOBILE_SIZES = [750, 1170, 1600]

export function mobileSizes(crop: Crop) {
  const width = crop.rotate ? crop.h : crop.w
  const sizes = MOBILE_SIZES.filter((size) => size < width)
  if (sizes.length < MOBILE_SIZES.length) sizes.push(Math.min(width, 1600))
  return [...new Set(sizes)]
}

const FULL = [1280, 1920, 2560, 3200]

const designed: Frame[] = [
  {
    id: 'about',
    name: '02',
    width: 5108,
    height: 2772,
    sizes: FULL,
    alt: 'Hi I’m Marta Bensalem, UX/UI Designer. I create experiences that are impactful and perhaps, even a bit delightful.',
    logo: { left: 1182, top: 151, width: 267.2 },
    accent: { x: 280, y: 0, w: 700, h: 2772 },
  },
  {
    name: '03',
    width: 5036,
    height: 2673,
    sizes: FULL,
    alt: 'Great UX is knowing what matters, what belongs together, and what deserves to stand out.',
    pen: true,
  },
  { name: '04', width: 5036, height: 2790, sizes: FULL, alt: 'Wireframes of a plugin catalog and content cards.' },
  { name: '05', width: 5036, height: 2630, sizes: FULL, alt: 'A feedback section above phones showing data usage.' },
  {
    name: '06',
    width: 5036,
    height: 2728,
    sizes: FULL,
    alt: 'Three phones showing security alerts, device status, and data categories.',
  },
  { name: '07', width: 5036, height: 2720, sizes: FULL, alt: 'A laptop on a stand, open on a product dashboard.' },
  {
    name: '08',
    width: 5036,
    height: 2624,
    sizes: FULL,
    alt: 'SheSeo welcome screens on two phones against a starry nebula.',
  },
  {
    name: '09',
    width: 1904,
    height: 1430,
    sizes: [1280, 1904],
    alt: 'Teacher App shown on two laptops over a purple gradient.',
  },
]

const crops: Record<string, Crop[]> = mobileCrops

export const frames: Frame[] = designed.map((frame) => ({ ...frame, mobile: crops[frame.name] }))
