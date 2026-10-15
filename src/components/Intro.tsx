import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Shard = {
  x: number
  y: number
  z: number
  rot: number
  spin: number
  size: number
  verts: [number, number][]
}

const HOLD = 2000
const GROW = 1150

function shape(irregular: number): [number, number][] {
  const base = Math.random() * Math.PI * 2
  return [0, 1, 2].map((i) => {
    const angle = base + (i * Math.PI * 2) / 3 + (Math.random() - 0.5) * irregular
    const radius = 1 - irregular * 0.25 + Math.random() * irregular * 0.5
    return [Math.cos(angle) * radius, Math.sin(angle) * radius]
  })
}

function spawn(shard: Shard, initial: boolean) {
  const spread = Math.pow(Math.random(), 0.7)
  const angle = Math.random() * Math.PI * 2
  shard.x = Math.cos(angle) * spread * 1.6
  shard.y = Math.sin(angle) * spread * 1.6
  shard.z = initial ? 0.08 + Math.random() * 0.92 : 1
  shard.rot = Math.random() * Math.PI * 2
  shard.spin = (Math.random() - 0.5) * 1.6
  shard.size = 0.45 + Math.pow(Math.random(), 2.2) * 1.9
  shard.verts = shape(0.9)
}

function trace(ctx: CanvasRenderingContext2D, verts: [number, number][], cx: number, cy: number, r: number, rot: number) {
  const cos = Math.cos(rot)
  const sin = Math.sin(rot)
  ctx.moveTo(cx + (verts[0]![0] * cos - verts[0]![1] * sin) * r, cy + (verts[0]![0] * sin + verts[0]![1] * cos) * r)
  for (let i = 1; i < 3; i++) {
    const [vx, vy] = verts[i]!
    ctx.lineTo(cx + (vx * cos - vy * sin) * r, cy + (vx * sin + vy * cos) * r)
  }
  ctx.closePath()
}

export function Intro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    if (reduce) {
      done.current()
      return
    }
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const count = Math.round(Math.min(560, Math.max(260, (w * h) / 2600)))
    const shards: Shard[] = Array.from({ length: count }, () => {
      const shard = { x: 0, y: 0, z: 1, rot: 0, spin: 0, size: 1, verts: [] } as Shard
      spawn(shard, true)
      return shard
    })
    const hero = { verts: shape(0.18), rot: -0.35, fx: 0.4, fy: 0.42 }

    let raf = 0
    let start = 0
    let last = 0
    let finished = false

    const frame = (now: number) => {
      if (!start) {
        start = now
        last = now
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now - start

      const cx = w / 2
      const cy = h / 2
      const focal = Math.max(w, h) * 0.42
      const unit = Math.min(w, h) * 0.0042

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#fff'

      for (const shard of shards) {
        shard.z -= dt * 0.42
        shard.rot += shard.spin * dt
        const sx = cx + (shard.x / shard.z) * focal
        const sy = cy + (shard.y / shard.z) * focal
        const r = (shard.size * unit) / shard.z
        if (shard.z < 0.04 || sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) {
          spawn(shard, false)
          continue
        }
        ctx.globalAlpha = Math.min(1, (1 - shard.z) * 2.6)
        ctx.beginPath()
        trace(ctx, shard.verts, sx, sy, Math.max(r, 0.6), shard.rot)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (t > HOLD) {
        const u = Math.min(1, (t - HOLD) / GROW)
        const startR = Math.min(w, h) * 0.022
        const endR = Math.hypot(w, h) * 1.5
        const eased = Math.pow(u, 2.15)
        const r = startR * Math.pow(endR / startR, eased)
        const glide = u * u * (3 - 2 * u)
        const hx = w * hero.fx + (cx - w * hero.fx) * glide
        const hy = h * hero.fy + (cy - h * hero.fy) * glide
        ctx.beginPath()
        trace(ctx, hero.verts, hx, hy, r, hero.rot + u * 0.5)
        ctx.fill()

        if (u >= 1 && !finished) {
          finished = true
          ctx.fillRect(0, 0, w, h)
          done.current()
          return
        }
      } else {
        const r = Math.min(w, h) * 0.022
        ctx.beginPath()
        trace(ctx, hero.verts, w * hero.fx, h * hero.fy, r, hero.rot + Math.sin(t / 700) * 0.08)
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <div className="intro" aria-hidden="true">
      <canvas ref={canvasRef} className="intro-canvas" />
    </div>
  )
}
