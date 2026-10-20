import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { mobileSizes, type Crop, type Frame } from '../frames'
import { Logo } from './Logo'
import { PEN_AREA, PenNib } from './PenNib'

const PHONE = '(max-width: 640px), (max-aspect-ratio: 4/5) and (max-width: 480px)'
const LOGO_RATIO = 444 / 1002

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PHONE)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

export function usePhone() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(PHONE).matches)
}

const overlaps = (crop: Crop, box: Crop) =>
  crop.x < box.x + box.w && crop.x + crop.w > box.x && crop.y < box.y + box.h && crop.y + crop.h > box.y

function accentStyle(src: string, box?: Crop, frame?: Crop): CSSProperties {
  const mask = `url(${src})`
  const place = box && frame
    ? {
        left: `${(box.x / frame.w) * 100}%`,
        top: `${(box.y / frame.h) * 100}%`,
        width: `${(box.w / frame.w) * 100}%`,
        height: `${(box.h / frame.h) * 100}%`,
      }
    : { inset: 0 }
  return { ...place, maskImage: mask, WebkitMaskImage: mask }
}

const contains = (crop: Crop, box: Crop) =>
  !crop.rotate && box.x >= crop.x && box.y >= crop.y && box.x + box.w <= crop.x + crop.w && box.y + box.h <= crop.y + crop.h

export function FrameScreen(props: Frame & { eager?: boolean; onHome?: () => void }) {
  const { id, name, width, height, mobile } = props
  const phone = usePhone()

  return (
    <section id={id} className="frame">
      {phone && mobile ? (
        mobile.map((crop, index) => <Tile key={`${name}-${index}`} frame={props} crop={crop} index={index} />)
      ) : (
        <Tile frame={props} crop={{ x: 0, y: 0, w: width, h: height }} />
      )}
    </section>
  )
}

export function Tile({
  frame,
  crop,
  index,
}: {
  frame: Frame & { eager?: boolean; onHome?: () => void }
  crop: Crop
  index?: number
}) {
  const { name, width, height, sizes, alt, logo, pen, accent, eager, onHome } = frame
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const logoBox = logo && { x: logo.left, y: logo.top, w: logo.width, h: logo.width * LOGO_RATIO }
  const showLogo = Boolean(logoBox && contains(crop, logoBox))
  const showPen = Boolean(pen && contains(crop, PEN_AREA))
  const animated = showLogo || showPen

  useEffect(() => {
    const node = ref.current
    if (!animated || !node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      if (entry.intersectionRatio >= 0.45) setInView(true)
      else if (!entry.isIntersecting) setInView(false)
    }, { threshold: [0, 0.45] })
    observer.observe(node)
    return () => observer.disconnect()
  }, [animated])

  const desktop = index === undefined
  const files = desktop
    ? sizes.map((size) => [`/screens/${name}-${size}.webp`, size] as const)
    : mobileSizes(crop).map((size) => [`/screens/m${name}-${index}-${size}.webp`, size] as const)
  const fallback = desktop ? files.find(([, size]) => size === 1920) ?? files[files.length - 1] : files[1] ?? files[0]
  const tileWidth = crop.rotate ? crop.h : crop.w
  const tileHeight = crop.rotate ? crop.w : crop.h

  return (
    <div ref={ref} className="frame-tile">
      <img
        src={fallback?.[0]}
        srcSet={files.map(([src, size]) => `${src} ${size}w`).join(', ')}
        sizes="100vw"
        width={desktop ? width : tileWidth}
        height={desktop ? height : tileHeight}
        alt={desktop || index === 0 ? alt : ''}
        loading={eager && (desktop || index === 0) ? 'eager' : 'lazy'}
        decoding="async"
      />
      {accent && desktop && (
        <div
          className="frame-accent"
          style={accentStyle(name === '02' ? '/screens/02-the-art.png' : `/screens/${name}-accent.png`, accent, crop)}
        />
      )}
      {accent && !desktop && overlaps(crop, accent) && (
        <div
          className="frame-accent"
          style={accentStyle(
            name === '02' ? `/screens/m${name}-${index}-the-art.png` : `/screens/m${name}-${index}-accent.png`,
          )}
        />
      )}
      {showLogo && logo && (
        <Logo
          className="frame-logo"
          play={inView}
          delay={0.15}
          onActivate={onHome}
          style={{
            left: `${((logo.left - crop.x) / crop.w) * 100}%`,
            top: `${((logo.top - crop.y) / crop.h) * 100}%`,
            width: `${(logo.width / crop.w) * 100}%`,
          }}
        />
      )}
      {showPen && <PenNib play={inView} delay={0.3} view={crop} />}
    </div>
  )
}
