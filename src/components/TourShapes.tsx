import { useEffect, useRef } from 'react'

type Point = [number, number]

const GROUPS: Point[][][] = [
  [
    [[1197.4, 81.3], [1723.6, 573.8], [1887, -128.1]],
    [[1188.2, 138.7], [1777.9, 553.1], [1842, -164.8]],
  ],
  [
    [[912.5, 980.5], [420.3, 1316.6], [375.5, 722.3]],
    [[905.4, 933], [465, 1334.4], [337.8, 752]],
  ],
]

const SHIFT = 5
const TILT = 1.4
const TOUCH_HOLD = 1400

const centroid = (tri: Point[]): Point => [
  (tri[0]![0] + tri[1]![0] + tri[2]![0]) / 3,
  (tri[0]![1] + tri[1]![1] + tri[2]![1]) / 3,
]

function inside([x, y]: Point, tri: Point[], pad: number) {
  const [a, b, c] = tri as [Point, Point, Point]
  const [cx, cy] = centroid(tri)
  const grow = (p: Point): Point => {
    const d = Math.hypot(p[0] - cx, p[1] - cy)
    return [p[0] + ((p[0] - cx) / d) * pad, p[1] + ((p[1] - cy) / d) * pad]
  }
  const [p, q, r] = [grow(a), grow(b), grow(c)]
  const side = (u: Point, v: Point) => (v[0] - u[0]) * (y - u[1]) - (v[1] - u[1]) * (x - u[0])
  const s1 = side(p, q)
  const s2 = side(q, r)
  const s3 = side(r, p)
  return (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0)
}

export function TourShapes() {
  const svgRef = useRef<SVGSVGElement>(null)
  const nodes = useRef<(SVGPolygonElement | null)[]>([])

  useEffect(() => {
    const svg = svgRef.current
    const section = svg?.closest('section')
    if (!svg || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tris = GROUPS.flat()
    const state = tris.map(() => ({ x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0, next: 0 }))
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

    const hovers = (group: Point[][]) => pointer !== null && group.some((tri) => inside(pointer!, tri, 28))

    function tick(now: number) {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      let moving = false
      let offset = 0
      GROUPS.forEach((group, groupIndex) => {
        const on = hovers(group) || touched[groupIndex]! > now
        group.forEach((tri, i) => {
          const s = state[offset + i]!
          if (on && now > s.next) {
            s.tx = (Math.random() * 2 - 1) * SHIFT
            s.ty = (Math.random() * 2 - 1) * SHIFT
            s.tr = (Math.random() * 2 - 1) * TILT
            s.next = now + 140 + Math.random() * 180
          } else if (!on) {
            s.tx = s.ty = s.tr = 0
          }
          const ease = 1 - Math.exp(-dt * (on ? 14 : 8))
          s.x += (s.tx - s.x) * ease
          s.y += (s.ty - s.y) * ease
          s.r += (s.tr - s.r) * ease
          if (on || Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.r) > 0.01) moving = true
          const [cx, cy] = centroid(tri)
          nodes.current[offset + i]?.setAttribute(
            'transform',
            `translate(${s.x.toFixed(2)} ${s.y.toFixed(2)}) rotate(${s.r.toFixed(3)} ${cx} ${cy})`,
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
        if (group.some((tri) => inside(point, tri, 28))) touched[index] = performance.now() + TOUCH_HOLD
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

  let index = 0
  return (
    <svg ref={svgRef} className="tour-shapes" viewBox="0 0 1920 1064" aria-hidden="true">
      {GROUPS.flat().map((tri) => {
        const i = index++
        return (
          <polygon
            key={i}
            ref={(node) => {
              nodes.current[i] = node
            }}
            points={tri.map((p) => p.join(',')).join(' ')}
          />
        )
      })}
    </svg>
  )
}
