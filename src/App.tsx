import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { FrameScreen, usePhone } from './components/FrameScreen'
import { Intro } from './components/Intro'
import { Menu, type Stitch } from './components/Menu'
import { PrintPage } from './components/PrintPage'
import { TourScreen } from './components/TourScreen'
import { WorkMobile } from './components/WorkMobile'
import { frames } from './frames'
import { MENU, type MenuId, type Page } from './menu'

type View = 'tour' | Page

const PAGES: Record<Exclude<Page, 'print'>, string[]> = {
  about: ['02'],
  work: ['03', '04', '05', '06', '07', '08', '09'],
}

function viewFromHash(): View {
  const hash = window.location.hash.replace('#', '')
  return hash === 'work' || hash === 'about' || hash === 'print' ? hash : 'tour'
}

export default function App() {
  const reduce = useReducedMotion()
  const phone = usePhone()
  const [ready, setReady] = useState(false)
  const [loop, setLoop] = useState(0)
  const [view, setView] = useState<View>(viewFromHash)
  const [open, setOpen] = useState(false)
  const [stitches, setStitches] = useState<Stitch[] | null>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const finishIntro = useCallback(() => setReady(true), [])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    const onPop = () => {
      setOpen(false)
      setStitches(null)
      setView(viewFromHash())
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.classList.toggle('is-tour', view === 'tour')
  }, [view])

  useEffect(() => {
    document.body.classList.toggle('is-ready', ready)
  }, [ready])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
  }, [open])

  const sew = useCallback((): Stitch[] | null => {
    const lines = burgerRef.current ? [...burgerRef.current.querySelectorAll('span')] : []
    const next = buttonRefs.current.flatMap((node, index) => {
      const line = lines[index]?.getBoundingClientRect()
      const item = MENU[index]
      if (!node || !line || line.width === 0 || !item) return []
      const rect = node.getBoundingClientRect()
      if (rect.width < 8) return []
      return [
        {
          label: item.label,
          ghost: true,
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          dx: line.left + line.width / 2 - (rect.left + rect.width / 2),
          dy: line.top + line.height / 2 - (rect.top + rect.height / 2),
          lineWidth: line.width,
          lineHeight: line.height,
        },
      ]
    })
    return !reduce && next.length === MENU.length ? next : null
  }, [reduce])

  const buttonRef = useCallback((index: number, node: HTMLButtonElement | null) => {
    buttonRefs.current[index] = node
  }, [])

  const go = useCallback(
    (id: MenuId) => {
      setOpen(false)
      const target = MENU.find((entry) => entry.id === id)?.target
      if (!target) return
      if (view === 'tour') setStitches(sew())
      if (target !== view) {
        history.pushState(null, '', `#${target}`)
        setView(target)
      }
    },
    [sew, view],
  )

  const goHome = useCallback(() => {
    setOpen(false)
    setStitches(null)
    if (view !== 'tour') {
      history.pushState(null, '', `${window.location.pathname}${window.location.search}`)
      setView('tour')
    }
    setReady(false)
    setLoop((value) => value + 1)
  }, [view])

  const closeMenu = useCallback(() => setOpen(false), [])
  const clearStitches = useCallback(() => setStitches(null), [])
  const about = frames.filter((frame) => PAGES.about.includes(frame.name))
  const page = view === 'tour' || view === 'print' ? null : frames.filter((frame) => PAGES[view].includes(frame.name))
  const intro = (key: string) => (
    <div key={key} className="page page-board">
      <div className="board-art-safe" aria-hidden="true" />
      {about.map((frame, index) => (
        <FrameScreen key={frame.name} {...frame} eager={index === 0} onHome={goHome} />
      ))}
    </div>
  )

  return (
    <>
      {!ready && <Intro key={loop} onDone={finishIntro} />}
      <main>
        {view === 'print' ? (
          <>
            {intro('print-intro')}
            <PrintPage key={view} onNavigate={go} />
          </>
        ) : view === 'work' && phone ? (
          <>
            {intro('work-intro')}
            <WorkMobile />
          </>
        ) : view === 'about' ? (
          <div key={view} className="page page-board">
            <div className="board-art-safe" aria-hidden="true" />
            {page?.map((frame, index) => (
              <FrameScreen key={frame.name} {...frame} eager={index === 0} onHome={goHome} />
            ))}
          </div>
        ) : view === 'work' ? (
          <>
            {intro('work-intro')}
            <div key={view} className="page">
              {page?.map((frame, index) => (
                <FrameScreen key={frame.name} {...frame} eager={index === 0} />
              ))}
            </div>
          </>
        ) : (
          <TourScreen
            key={loop}
            ready={ready}
            concealNav={false}
            onNavigate={go}
            onHome={goHome}
            buttonRef={buttonRef}
          />
        )}
      </main>
      {ready && (
        <Menu
          burgerRef={burgerRef}
          docked={view !== 'tour'}
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
