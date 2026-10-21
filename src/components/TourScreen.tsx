import { forwardRef } from 'react'
import { MENU, type MenuId } from '../menu'
import { Logo } from './Logo'
import { TourShapes } from './TourShapes'

type Props = {
  ready: boolean
  concealNav: boolean
  onNavigate: (id: MenuId) => void
  onHome: () => void
  buttonRef: (index: number, node: HTMLButtonElement | null) => void
}

export const TourScreen = forwardRef<HTMLElement, Props>(function TourScreen(
  { ready, concealNav, onNavigate, onHome, buttonRef },
  ref,
) {
  return (
    <section ref={ref} className="tour" id="top">
      <div className="tour-stage tour-cover" aria-hidden="true">
        <img className="tour-bg" src="/tour-bg.webp" alt="" width={1920} height={1064} decoding="async" />
        <TourShapes />
      </div>

      <div className="tour-stage tour-content">
        <Logo className="tour-logo" play={ready} delay={0.45} onActivate={onHome} />

        <h1 className="tour-title">
          <svg className="tour-blob" viewBox="0 0 373 355" aria-hidden="true">
            <path d="M128 1C232-6 373 84 373 182c0 104-104 173-196 173C81 355 0 279 0 172 0 70 38 7 128 1Z" />
          </svg>
          <span className="tour-title-text">Take a tour.</span>
        </h1>

        <nav className={concealNav ? 'tour-nav is-concealed' : 'tour-nav'} aria-label="Primary">
          {MENU.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => buttonRef(index, node)}
              type="button"
              className={`pill pill-${item.id} ghost`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </section>
  )
})
