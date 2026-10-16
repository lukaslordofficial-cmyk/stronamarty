import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Page } from '../menu'
import '../page-intro.css'

const COPY: Record<Page, { label: string; title: string; body: string; tone: string }> = {
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
  about: {
    label: 'About me',
    title: 'Nice to meet you',
    body: 'A short note on who I am, how I work, and the kind of problems I like to sit with.',
    tone: 'about',
  },
}

type Props = {
  page: Page
}

export function PageIntro({ page }: Props) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'in' | 'out' | 'done'>(reduce ? 'done' : 'in')
  const copy = COPY[page]

  useEffect(() => {
    if (reduce) return
    document.documentElement.classList.add('gate-open')
    const hold = window.setTimeout(() => setPhase('out'), 3200)
    return () => {
      window.clearTimeout(hold)
      document.documentElement.classList.remove('gate-open')
    }
  }, [reduce])

  useEffect(() => {
    if (phase !== 'out') return
    const done = window.setTimeout(() => {
      document.documentElement.classList.remove('gate-open')
      setPhase('done')
    }, 520)
    return () => window.clearTimeout(done)
  }, [phase])

  if (phase === 'done' || !copy) return null

  return (
    <button
      type="button"
      className={`gate is-${copy.tone} is-${phase}`}
      aria-label={`${copy.label}. ${copy.body} Continue.`}
      onClick={() => setPhase('out')}
    >
      <span className="gate-window" aria-hidden="true">
        <span className="gate-bar">
          <i />
          <i />
          <i />
          <span>{copy.label}</span>
        </span>
        <span className="gate-body">
          <span className="gate-kicker">{copy.label}</span>
          <span className="gate-title">{copy.title}</span>
          <span className="gate-copy">{copy.body}</span>
        </span>
      </span>
      <span className="gate-hint">Click to continue</span>
    </button>
  )
}
