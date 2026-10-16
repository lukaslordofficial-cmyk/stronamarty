import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import '../page-intro.css'

const COPY = {
  print: {
    label: 'Print',
    title: 'Work that lives on paper',
    body: 'Here you can find examples of work I’ve completed — identities, packaging, and the things that leave the screen.',
    tone: 'print',
  },
  work: {
    label: 'UX / UI',
    title: 'Digital work, up close',
    body: 'Here you can find examples of work I’ve completed — product interfaces, flows, and the bits in between.',
    tone: 'work',
  },
} as const

type GatePage = keyof typeof COPY

type Props = {
  page: GatePage
}

export function PageIntro({ page }: Props) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'in' | 'out' | 'done'>('in')
  const copy = COPY[page]

  useEffect(() => {
    document.documentElement.classList.add('gate-open')
    return () => document.documentElement.classList.remove('gate-open')
  }, [])

  useEffect(() => {
    if (phase !== 'out') return
    const done = window.setTimeout(() => {
      document.documentElement.classList.remove('gate-open')
      setPhase('done')
    }, reduce ? 0 : 520)
    return () => window.clearTimeout(done)
  }, [phase, reduce])

  if (phase === 'done' || !copy) return null

  return (
    <div className={`gate is-${copy.tone} is-${phase}`} role="dialog" aria-labelledby="gate-title" aria-modal="true">
      <div className="gate-window">
        <div className="gate-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{copy.label}</span>
        </div>
        <div className="gate-body">
          <p className="gate-kicker">{copy.label}</p>
          <h2 id="gate-title" className="gate-title">
            {copy.title}
          </h2>
          <p className="gate-copy">{copy.body}</p>
          <button type="button" className="gate-check" onClick={() => setPhase('out')}>
            Check
          </button>
        </div>
      </div>
    </div>
  )
}
