import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'

const STROKES = [
  'M545 215C543 192 525 180 505 180C488 180 474 186 462 200C430 235 395 275 372 310C362 330 362 360 368 375C378 385 400 378 425 362C455 342 480 318 505 295C518 280 528 262 535 245L505 300C500 320 498 345 502 356C510 360 525 356 540 345C580 315 620 260 645 222C660 195 672 160 680 135C668 160 656 190 650 215C670 224 705 222 735 208C725 240 698 295 682 340C676 360 686 370 710 364C740 352 765 320 785 298',
  'M955 90C935 120 915 150 903 170C880 205 848 255 830 295C814 332 806 365 818 378C840 383 880 360 950 298',
  'M848 192L962 192',
]

const DURATION = 0.95
const PEN_LIFT = 0.04

type Props = {
  className?: string
  play: boolean
  delay?: number
  style?: CSSProperties
}

export function Logo({ className = '', play, delay = 0, style }: Props) {
  const reduce = useReducedMotion()
  const id = useId().replace(/:/g, '')
  const [done, setDone] = useState(false)
  const [round, setRound] = useState(0)
  const start = round ? 0 : delay
  const [timing, setTiming] = useState<{ duration: number; delay: number }[] | null>(null)
  const paths = useRef<(SVGPathElement | null)[]>([])

  useLayoutEffect(() => {
    if (timing) return
    const lengths = paths.current.map((path) => path?.getTotalLength() ?? 0)
    const total = lengths.reduce((sum, length) => sum + length, 0)
    if (!total) return
    const drawing = DURATION - PEN_LIFT * (lengths.length - 1)
    let start = 0
    setTiming(
      lengths.map((length) => {
        const duration = (drawing * length) / total
        const entry = { duration, delay: start }
        start += duration + PEN_LIFT
        return entry
      }),
    )
  })

  useEffect(() => {
    if (!play) {
      setDone(false)
      return
    }
    const timer = window.setTimeout(() => setDone(true), (start + DURATION) * 1000 + 60)
    return () => window.clearTimeout(timer)
  }, [play, start, round])

  const written = done || reduce

  const rewrite = () => {
    if (!play || reduce || !done) return
    setDone(false)
    setRound((value) => value + 1)
  }

  return (
    <span
      className={`logo ${play ? 'is-writing' : ''} ${className}`.trim()}
      role="img"
      aria-label="Mart"
      style={style}
      onPointerEnter={rewrite}
    >
      <svg viewBox="0 0 1002 444" aria-hidden="true">
        <defs>
          <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="1002" height="444" style={{ maskType: 'alpha' }}>
            <image href="/logo-m.png" width="1002" height="444" />
          </mask>
          {!written && (
            <mask key={round} id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="1002" height="444">
              {STROKES.map((d, index) => (
                <path
                  key={d}
                  ref={(node) => {
                    paths.current[index] = node
                  }}
                  className="logo-pen"
                  d={d}
                  pathLength={1}
                  style={
                    timing?.[index]
                      ? {
                          animationDuration: `${timing[index].duration}s`,
                          animationDelay: `${start + timing[index].delay}s`,
                        }
                      : undefined
                  }
                />
              ))}
            </mask>
          )}
        </defs>
        <rect className="logo-m" width="1002" height="444" mask={`url(#${id}-m)`} />
        <image href="/logo-art.png" width="1002" height="444" mask={written ? undefined : `url(#${id})`} />
      </svg>
    </span>
  )
}
