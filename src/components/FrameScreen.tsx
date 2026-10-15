import type { Frame } from '../frames'

export function FrameScreen({ id, name, width, height, sizes, alt, eager }: Frame & { eager?: boolean }) {
  const fallback = sizes.includes(1920) ? 1920 : sizes[sizes.length - 1]
  return (
    <section id={id} className="frame">
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
    </section>
  )
}
