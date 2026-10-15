export type Frame = {
  id?: string
  name: string
  width: number
  height: number
  sizes: number[]
  alt: string
}

const FULL = [1280, 1920, 2560, 3200]

export const frames: Frame[] = [
  {
    id: 'about',
    name: '02',
    width: 5108,
    height: 2772,
    sizes: FULL,
    alt: 'Hi I’m Marta Bensalem, UX/UI Designer. I create experiences that are impactful and perhaps, even a bit delightful.',
  },
  {
    id: 'work',
    name: '03',
    width: 5036,
    height: 2673,
    sizes: FULL,
    alt: 'Great UX is knowing what matters, what belongs together, and what deserves to stand out.',
  },
  { name: '04', width: 4820, height: 2740, sizes: FULL, alt: 'Wireframes of a plugin catalog and content cards.' },
  { name: '05', width: 5072, height: 2796, sizes: FULL, alt: 'A feedback section above phones showing data usage.' },
  {
    name: '06',
    width: 5066,
    height: 2786,
    sizes: FULL,
    alt: 'Three phones showing security alerts, device status, and data categories.',
  },
  { name: '07', width: 5048, height: 2782, sizes: FULL, alt: 'A laptop on a stand, open on a product dashboard.' },
  {
    name: '08',
    width: 5054,
    height: 2784,
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
