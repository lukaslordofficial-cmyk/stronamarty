import type { CSSProperties } from 'react'
import { type Crop, type Frame, frames } from '../frames'
import { Logo } from './Logo'
import '../work-hero.css'

const frame03 = frames.find((frame) => frame.name === '03')!
const frame04 = frames.find((frame) => frame.name === '04')!
const frame05 = frames.find((frame) => frame.name === '05')!

const MOCK_X = 2280
const MOCK_W = 2620

const CROPS = {
  ux: { x: 40, y: 780, w: 1520, h: 1760 },
  cards: { x: 40, y: 8, w: 2280, h: 2782 },
  mockTop: { x: MOCK_X, y: 196, w: MOCK_W, h: 2477 },
  mockMid: { x: MOCK_X, y: 0, w: MOCK_W, h: 2790 },
  mockBottom: { x: MOCK_X, y: 0, w: MOCK_W, h: 1914 },
} satisfies Record<string, Crop>

export const PHONES_CROP: Crop = { x: 0, y: 1914, w: 5036, h: 716 }
export const WORK_TAIL = ['06', '07', '08', '09']

export function CropShot({
  frame,
  crop,
  alt,
  className,
  eager,
  sizes = '46vw',
}: {
  frame: Frame
  crop: Crop
  alt: string
  className?: string
  eager?: boolean
  sizes?: string
}) {
  const files = frame.sizes.map((size) => [`/screens/${frame.name}-${size}.webp`, size] as const)
  const fallback = files.find(([, size]) => size === 1920) ?? files[files.length - 1]
  return (
    <div className={`work-shot ${className ?? ''}`.trim()} style={{ aspectRatio: `${crop.w} / ${crop.h}` }}>
      <img
        src={fallback?.[0]}
        srcSet={files.map(([src, size]) => `${src} ${size}w`).join(', ')}
        sizes={sizes}
        alt={alt}
        width={crop.w}
        height={crop.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={
          {
            width: `${(frame.width / crop.w) * 100}%`,
            height: `${(frame.height / crop.h) * 100}%`,
            maxWidth: 'none',
            maxHeight: 'none',
            left: `${(-crop.x / crop.w) * 100}%`,
            top: `${(-crop.y / crop.h) * 100}%`,
          } as CSSProperties
        }
      />
    </div>
  )
}

type Props = {
  ready: boolean
  onHome: () => void
}

export function WorkHero({ ready, onHome }: Props) {
  return (
    <section className="work-hero" aria-label="About and UX/UI work">
      <div className="work-hero-art" aria-hidden="true" />

      <div className="work-hero-head">
        <Logo className="work-hero-logo" play={ready} delay={0.15} onActivate={onHome} />
      </div>

      <div className="work-hero-about">
        <p className="work-hero-hello">
          Hi I’m Marta Bensalem
          <br />
          UX/UI Designer. I create experiences that are impactful and perhaps, even a bit delightful.
        </p>
        <p className="work-hero-note">
          I want to be a part of a world where humanity
          <br />
          is essential to design.
        </p>
      </div>

      <svg className="work-hero-tri" viewBox="0 0 420 520" aria-hidden="true">
        <polygon points="70,36 418,168 248,508" />
        <polygon points="28,92 392,24 310,500" />
      </svg>

      <div className="work-hero-ux">
        <CropShot frame={frame03} crop={CROPS.ux} alt={frame03.alt} eager />
      </div>

      <div className="work-hero-cards">
        <CropShot frame={frame04} crop={CROPS.cards} alt={frame04.alt} />
      </div>

      <div className="work-hero-mock">
        <CropShot frame={frame03} crop={CROPS.mockTop} alt="" className="work-shot-mock" eager />
        <CropShot frame={frame04} crop={CROPS.mockMid} alt="" className="work-shot-mock" />
        <CropShot frame={frame05} crop={CROPS.mockBottom} alt="" className="work-shot-mock" />
      </div>
    </section>
  )
}

export function WorkPhones() {
  return (
    <section className="work-phones" aria-label="Product phones">
      <CropShot frame={frame05} crop={PHONES_CROP} alt="Phones showing data usage." sizes="100vw" />
    </section>
  )
}
