import { useEffect, useRef } from 'react'

type Point = [number, number]
type Triangle = { kind: 'tri'; points: Point[] }
type Ellipse = { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number; angle: number }
type Shape = Triangle | Ellipse

const tri = (...points: Point[]): Triangle => ({ kind: 'tri', points })
const ellipse = (cx: number, cy: number, rx: number, ry: number, angle: number): Ellipse => ({
  kind: 'ellipse',
  cx,
  cy,
  rx,
  ry,
  angle,
})

const GROUPS: Shape[][] = [
  [tri([1197.4, 81.3], [1723.6, 573.8], [1887, -128.1]), tri([1188.2, 138.7], [1777.9, 553.1], [1842, -164.8])],
  [tri([912.5, 980.5], [420.3, 1316.6], [375.5, 722.3]), tri([905.4, 933], [465, 1334.4], [337.8, 752])],
  [ellipse(552.9, -14.2, 359.2, 265.5, -31.1), ellipse(536.7, 37.5, 315.2, 254.1, 18.5)],
  [ellipse(-107.9, 730.3, 299.2, 231.4, -69.59), ellipse(-171.6, 721.6, 347.2, 258.4, 72.45)],
  [ellipse(1551.4, 1178.5, 373.4, 272.1, -57.03), ellipse(1560, 1177.2, 344.2, 323.4, 4)],
]

const SHAKE = 2.2
const TILT = 0.3
const TOUCH_HOLD = 1400
const PAD = 28

const pivot = (shape: Shape): Point =>
  shape.kind === 'ellipse'
    ? [shape.cx, shape.cy]
    : [
        (shape.points[0]![0] + shape.points[1]![0] + shape.points[2]![0]) / 3,
        (shape.points[0]![1] + shape.points[1]![1] + shape.points[2]![1]) / 3,
      ]

function inside([x, y]: Point, shape: Shape) {
  if (shape.kind === 'ellipse') {
    const t = (shape.angle * Math.PI) / 180
    const dx = x - shape.cx
    const dy = y - shape.cy
    const lx = dx * Math.cos(t) + dy * Math.sin(t)
    const ly = -dx * Math.sin(t) + dy * Math.cos(t)
    return (lx / (shape.rx + PAD)) ** 2 + (ly / (shape.ry + PAD)) ** 2 <= 1
  }
  const [cx, cy] = pivot(shape)
  const grow = (p: Point): Point => {
    const d = Math.hypot(p[0] - cx, p[1] - cy)
    return [p[0] + ((p[0] - cx) / d) * PAD, p[1] + ((p[1] - cy) / d) * PAD]
  }
  const [p, q, r] = shape.points.map(grow) as [Point, Point, Point]
  const side = (u: Point, v: Point) => (v[0] - u[0]) * (y - u[1]) - (v[1] - u[1]) * (x - u[0])
  const s1 = side(p, q)
  const s2 = side(q, r)
  const s3 = side(r, p)
  return (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0)
}

export function TourShapes() {
  const svgRef = useRef<SVGSVGElement>(null)
  const nodes = useRef<(SVGGraphicsElement | null)[]>([])

  useEffect(() => {
    const svg = svgRef.current
    const section = svg?.closest('section')
    if (!svg || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const shapes = GROUPS.flat()
    const state = shapes.map(() => ({ x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0, next: 0 }))
    const touched = GROUPS.map(() => 0)
    let pointer: Point | null = null
    let raf = 0
    let last = 0
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const toStage = (event: PointerEvent): Point | null => {
      const matrix = svg.getScreenCTM()
      if (!matrix) return null
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
      return [point.x, point.y]
    }

    const hovers = (group: Shape[]) => pointer !== null && group.some((shape) => inside(pointer!, shape))

    function tick(now: number) {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      let moving = false
      let offset = 0
      GROUPS.forEach((group, groupIndex) => {
        const on = hovers(group) || touched[groupIndex]! > now
        group.forEach((shape, i) => {
          const s = state[offset + i]!
          if (on && now > s.next) {
            const sign = (value: number) => (value > 0 ? -1 : 1)
            s.tx = sign(s.tx) * (0.4 + Math.random() * 0.6) * SHAKE
            s.ty = (Math.random() * 2 - 1) * SHAKE
            s.tr = sign(s.tr) * (0.3 + Math.random() * 0.7) * TILT
            s.next = now + 28 + Math.random() * 30
          } else if (!on) {
            s.tx = s.ty = s.tr = 0
          }
          const ease = 1 - Math.exp(-dt * (on ? 55 : 18))
          s.x += (s.tx - s.x) * ease
          s.y += (s.ty - s.y) * ease
          s.r += (s.tr - s.r) * ease
          if (on || Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.r) > 0.01) moving = true
          const [cx, cy] = pivot(shape)
          const base = shape.kind === 'ellipse' ? ` rotate(${shape.angle} ${cx} ${cy})` : ''
          nodes.current[offset + i]?.setAttribute(
            'transform',
            `translate(${s.x.toFixed(2)} ${s.y.toFixed(2)}) rotate(${s.r.toFixed(3)} ${cx} ${cy})${base}`,
          )
        })
        offset += group.length
      })
      raf = moving ? requestAnimationFrame(tick) : 0
      if (!moving) last = 0
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer = toStage(event)
      wake()
    }
    const onLeave = () => {
      pointer = null
    }
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return
      const point = toStage(event)
      if (!point) return
      GROUPS.forEach((group, index) => {
        if (group.some((shape) => inside(point, shape))) touched[index] = performance.now() + TOUCH_HOLD
      })
      wake()
    }
    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    section.addEventListener('pointerdown', onDown)
    return () => {
      cancelAnimationFrame(raf)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('pointerdown', onDown)
    }
  }, [])

  const register = (i: number) => (node: SVGGraphicsElement | null) => {
    nodes.current[i] = node
  }
  return (
    <svg ref={svgRef} className="tour-shapes" viewBox="0 0 1920 1064" aria-hidden="true">
      {GROUPS.flat().map((shape, i) =>
        shape.kind === 'ellipse' ? (
          <ellipse
            key={i}
            ref={register(i)}
            cx={shape.cx}
            cy={shape.cy}
            rx={shape.rx}
            ry={shape.ry}
            transform={`rotate(${shape.angle} ${shape.cx} ${shape.cy})`}
          />
        ) : (
          <polygon key={i} ref={register(i)} points={shape.points.map((p) => p.join(',')).join(' ')} />
        ),
      )}
    </svg>
  )
}
