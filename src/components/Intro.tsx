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

type Mote = {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  size: number
  phase: number
  twinkle: number
  tint: boolean
}

const TEMPO = 0.7
const HOLD = 2000 / TEMPO
const GROW = 1150 / TEMPO

function glow(rgb: string) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, `rgba(${rgb},1)`)
  gradient.addColorStop(0.14, `rgba(${rgb},0.95)`)
  gradient.addColorStop(0.4, `rgba(${rgb},0.3)`)
  gradient.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return canvas
}

function ambient(mote: Mote, w: number, h: number, initial: boolean) {
  mote.x = Math.random() * w
  mote.y = initial ? Math.random() * h : h * (0.3 + Math.random() * 0.75)
  mote.vx = (Math.random() - 0.5) * 14 * TEMPO
  mote.vy = -(6 + Math.random() * 18) * TEMPO
  mote.age = initial ? Math.random() * 4 : 0
  mote.life = (3.2 + Math.random() * 3.4) / TEMPO
  mote.size = 0.6 + Math.pow(Math.random(), 2) * 2
  mote.phase = Math.random() * Math.PI * 2
  mote.twinkle = (1.5 + Math.random() * 4) * TEMPO
  mote.tint = Math.random() < 0.22
}

function shed(x: number, y: number, radius: number): Mote {
  const angle = Math.random() * Math.PI * 2
  const speed = (30 + Math.random() * 110) * TEMPO
  const offset = radius * (1 + Math.random() * 7)
  return {
    x: x + Math.cos(angle) * offset,
    y: y + Math.sin(angle) * offset,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 10 * TEMPO,
    age: 0,
    life: (1.4 + Math.random() * 1.8) / TEMPO,
    size: 0.5 + Math.pow(Math.random(), 1.6) * 1.8,
    phase: Math.random() * Math.PI * 2,
    twinkle: (4 + Math.random() * 6) * TEMPO,
    tint: Math.random() < 0.3,
  }
}

function shape(irregular: number): [number, number][] {
  const base = Math.random() * Math.PI * 2
  return [0, 1, 2].map((i) => {
    const angle = base + (i * Math.PI * 2) / 3 + (Math.random() - 0.5) * irregular
    const radius = 1 - irregular * 0.25 + Math.random() * irregular * 0.5
    return [Math.cos(angle) * radius, Math.sin(angle) * radius]
  })
}

function spawn(shard: Shard, initial: boolean, spanX: number, spanY: number) {
  shard.z = initial ? 0.12 + Math.random() * 0.88 : 0.75 + Math.random() * 0.25
  shard.x = (Math.random() * 2 - 1) * spanX * 1.08 * shard.z
  shard.y = (Math.random() * 2 - 1) * spanY * 1.08 * shard.z
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
    if (!canvas || !ctx) {
      done.current()
      return
    }

    const hold = (event: Event) => event.preventDefault()
    window.addEventListener('wheel', hold, { passive: false })
    window.addEventListener('touchmove', hold, { passive: false })

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

    const focalOf = () => Math.max(w, h) * 0.42
    const respawn = (shard: Shard, initial: boolean) => spawn(shard, initial, w / 2 / focalOf(), h / 2 / focalOf())
    const count = Math.round(Math.min(560, Math.max(260, (w * h) / 2600)))
    const shards: Shard[] = Array.from({ length: count }, () => {
      const shard = { x: 0, y: 0, z: 1, rot: 0, spin: 0, size: 1, verts: [] } as Shard
      respawn(shard, true)
      return shard
    })
    const hero = { verts: shape(0.18), rot: -0.35, fx: 0.4, fy: 0.42 }
    const white = glow('255,255,255')
    const lime = glow('236,250,180')
    const motes: Mote[] = Array.from({ length: Math.round(Math.min(340, Math.max(130, (w * h) / 4000))) }, () => {
      const mote = {} as Mote
      ambient(mote, w, h, true)
      return mote
    })
    const sparks: Mote[] = []
    let shedding = 0

    const drawMote = (mote: Mote, fade: number) => {
      const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(mote.phase + mote.age * mote.twinkle))
      const alpha = fade * twinkle
      if (alpha <= 0.01) return
      const d = mote.size * 10
      ctx.globalAlpha = alpha
      ctx.drawImage(mote.tint ? lime : white, mote.x - d / 2, mote.y - d / 2, d, d)
    }

    const dust = (dt: number, heroX: number, heroY: number, heroR: number, emit: boolean) => {
      ctx.globalCompositeOperation = 'lighter'
      for (const mote of motes) {
        mote.age += dt
        mote.x += (mote.vx + Math.sin(mote.phase + mote.age * 0.9) * 6 * TEMPO) * dt
        mote.y += mote.vy * dt
        if (mote.age > mote.life || mote.y < -20) {
          ambient(mote, w, h, false)
          continue
        }
        const p = mote.age / mote.life
        drawMote(mote, Math.min(1, p * 5, (1 - p) * 3))
      }

      if (emit) {
        shedding += dt * 34 * TEMPO
        while (shedding >= 1 && sparks.length < 200) {
          sparks.push(shed(heroX, heroY, heroR))
          shedding -= 1
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i]!
        spark.age += dt
        if (spark.age > spark.life) {
          sparks.splice(i, 1)
          continue
        }
        spark.vx *= 1 - dt * 0.8
        spark.vy = spark.vy * (1 - dt * 0.8) - 4 * TEMPO * dt
        spark.x += spark.vx * dt
        spark.y += spark.vy * dt
        const p = spark.age / spark.life
        drawMote(spark, Math.min(1, p * 8) * (1 - p) * (1 - p))
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
    }

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
      const focal = focalOf()
      const unit = Math.min(w, h) * 0.0042

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#fff'

      for (const shard of shards) {
        shard.z -= dt * 0.42 * TEMPO
        shard.rot += shard.spin * dt * TEMPO
        const sx = cx + (shard.x / shard.z) * focal
        const sy = cy + (shard.y / shard.z) * focal
        const r = (shard.size * unit) / shard.z
        if (shard.z < 0.04 || sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) {
          respawn(shard, false)
          continue
        }
        ctx.globalAlpha = Math.min(1, (1 - shard.z) * 2.6)
        ctx.beginPath()
        trace(ctx, shard.verts, sx, sy, Math.max(r, 0.6), shard.rot)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      const heroR = Math.min(w, h) * 0.022
      if (t > HOLD) {
        const u = Math.min(1, (t - HOLD) / GROW)
        const endR = Math.hypot(w, h) * 1.5
        const eased = Math.pow(u, 2.15)
        const r = heroR * Math.pow(endR / heroR, eased)
        const glide = u * u * (3 - 2 * u)
        const hx = w * hero.fx + (cx - w * hero.fx) * glide
        const hy = h * hero.fy + (cy - h * hero.fy) * glide
        dust(dt, hx, hy, Math.min(r, heroR * 6), u < 0.55)
        ctx.fillStyle = '#fff'
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
        dust(dt, w * hero.fx, h * hero.fy, heroR, true)
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        trace(ctx, hero.verts, w * hero.fx, h * hero.fy, heroR, hero.rot + Math.sin((t * TEMPO) / 700) * 0.08)
        ctx.fill()
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', hold)
      window.removeEventListener('touchmove', hold)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <div className="intro" aria-hidden="true">
      <canvas ref={canvasRef} className="intro-canvas" />
    </div>
  )
}
