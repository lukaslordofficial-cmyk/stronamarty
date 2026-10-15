import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FrameScreen } from './components/FrameScreen'
import { Intro } from './components/Intro'
import { Menu, type Stitch } from './components/Menu'
import { TourScreen } from './components/TourScreen'
import { frames } from './frames'
import { MENU, type MenuId } from './menu'

export default function App() {
  const reduce = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [docked, setDocked] = useState(false)
  const [open, setOpen] = useState(false)
  const [stitches, setStitches] = useState<Stitch[] | null>(null)
  const tourRef = useRef<HTMLElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const dockedRef = useRef(false)

  const finishIntro = useCallback(() => setReady(true), [])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-intro', !ready)
    document.body.classList.toggle('is-ready', ready)
  }, [ready])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
  }, [open])

  useEffect(() => {
    if (!ready) return
    const section = tourRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 1
        const onTop = window.scrollY < 8

        if (onTop || ratio > 0.88) {
          if (!dockedRef.current) return
          dockedRef.current = false
          setDocked(false)
          setOpen(false)
          setStitches(null)
          return
        }

        if (dockedRef.current || ratio >= 0.7) return

        const lines = burgerRef.current ? [...burgerRef.current.querySelectorAll('span')] : []
        const next = buttonRefs.current.flatMap((node, index) => {
          const line = lines[index]?.getBoundingClientRect()
          if (!node || !line || line.width === 0) return []
          const rect = node.getBoundingClientRect()
          if (rect.width < 8) return []
          const targetX = line.left + line.width / 2
          const targetY = line.top + line.height / 2
          const item = MENU[index]
          if (!item) return []
          return [
            {
              label: item.label,
              ghost: item.ghost,
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              dx: targetX - (rect.left + rect.width / 2),
              dy: targetY - (rect.top + rect.height / 2),
              lineWidth: line.width,
              lineHeight: line.height,
            },
          ]
        })

        dockedRef.current = true
        setDocked(true)
        setStitches(!reduce && next.length === MENU.length ? next : null)
      },
      { threshold: [0, 0.45, 0.7, 0.88, 1] },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [ready, reduce])

  const buttonRef = useCallback((index: number, node: HTMLButtonElement | null) => {
    buttonRefs.current[index] = node
  }, [])

  const go = useCallback((id: MenuId) => {
    setOpen(false)
    const item = MENU.find((entry) => entry.id === id)
    if (!item?.target) return
    document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const closeMenu = useCallback(() => setOpen(false), [])
  const clearStitches = useCallback(() => setStitches(null), [])

  return (
    <>
      {!ready && <Intro onDone={finishIntro} />}
      <main>
        <TourScreen ref={tourRef} ready={ready} concealNav={docked} onNavigate={go} buttonRef={buttonRef} />
        {frames.map((frame, index) => (
          <FrameScreen key={frame.name} {...frame} eager={index === 0} />
        ))}
      </main>
      {ready && (
        <Menu
          burgerRef={burgerRef}
          docked={docked}
          open={open}
          stitches={stitches}
          onToggle={() => setOpen((value) => !value)}
          onClose={closeMenu}
          onNavigate={go}
          onStitchDone={clearStitches}
        />
      )}
    </>
  )
}
