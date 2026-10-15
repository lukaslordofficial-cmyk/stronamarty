import { useEffect, useRef, useState } from 'react'
import type { Frame } from '../frames'
import { Logo } from './Logo'
import { PenNib } from './PenNib'

export function FrameScreen({ id, name, width, height, sizes, alt, logo, pen, eager }: Frame & { eager?: boolean }) {
  const fallback = sizes.includes(1920) ? 1920 : sizes[sizes.length - 1]
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const animated = Boolean(logo || pen)

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

  return (
    <section ref={ref} id={id} className="frame">
      <img
        src={`/screens/${name}-${fallback}.webp`}
        srcSet={sizes.map((size) => `/screens/${name}-${size}.webp ${size}w`).join(', ')}
        sizes="100vw"
        width={width}
        height={height}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      {logo && (
        <Logo
          className="frame-logo"
          play={inView}
          delay={0.15}
          style={{
            left: `${(logo.left / width) * 100}%`,
            top: `${(logo.top / height) * 100}%`,
            width: `${(logo.width / width) * 100}%`,
          }}
        />
      )}
      {pen && <PenNib play={inView} delay={0.3} />}
    </section>
  )
}
