import { useEffect, useId, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'

const STROKES = [
  {
    d: 'M552 200C520 160 450 175 418 235C385 295 368 352 395 377C420 398 470 348 505 290C530 250 548 215 552 200C540 245 505 330 498 362C494 386 520 386 548 356',
    duration: 0.7,
    delay: 0,
  },
  {
    d: 'M548 356C578 318 612 252 640 215C656 198 684 212 690 240C705 214 742 198 786 198L788 292',
    duration: 0.45,
    delay: 0.66,
  },
  {
    d: 'M968 78C925 150 868 250 838 322C820 365 842 398 885 362C915 335 945 302 962 286',
    duration: 0.45,
    delay: 1.08,
  },
  { d: 'M838 190L978 190', duration: 0.24, delay: 1.5 },
]

const TOTAL = 1.8

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

  useEffect(() => {
    if (!play) {
      setDone(false)
      return
    }
    const timer = window.setTimeout(() => setDone(true), (delay + TOTAL) * 1000 + 80)
    return () => window.clearTimeout(timer)
  }, [play, delay])

  const written = done || reduce

  return (
    <span className={`logo ${play ? 'is-writing' : ''} ${className}`.trim()} role="img" aria-label="Mart" style={style}>
      <svg viewBox="0 0 1002 444" aria-hidden="true">
        {!written && (
          <defs>
            <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="1002" height="444">
              <g className="logo-pen">
                {STROKES.map((stroke) => (
                  <path
                    key={stroke.d}
                    d={stroke.d}
                    pathLength={1}
                    style={{
                      animationDuration: `${stroke.duration}s`,
                      animationDelay: `${delay + stroke.delay}s`,
                    }}
                  />
                ))}
              </g>
            </mask>
          </defs>
        )}
        <image href="/logo-m.png" width="1002" height="444" />
        <image href="/logo-art.png" width="1002" height="444" mask={written ? undefined : `url(#${id})`} />
      </svg>
    </span>
  )
}
