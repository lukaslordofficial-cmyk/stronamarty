import type { Frame } from '../frames'

export function FrameScreen({ id, src, alt, bg }: Frame) {
  return (
    <section id={id} className="screen frame" style={{ background: bg }}>
      <img src={src} alt={alt} decoding="async" loading="lazy" />
    </section>
  )
}
