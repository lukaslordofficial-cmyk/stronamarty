import { forwardRef } from 'react'
import { Logo } from './Logo'
import { MENU, type MenuId } from '../menu'

type Props = {
  concealNav: boolean
  onNavigate: (id: MenuId) => void
  buttonRef: (index: number, node: HTMLButtonElement | null) => void
}

export const TourScreen = forwardRef<HTMLElement, Props>(function TourScreen(
  { concealNav, onNavigate, buttonRef },
  ref,
) {
  return (
    <section ref={ref} className="screen tour" id="top">
      <svg className="deco deco-tl" viewBox="0 0 640 520" fill="none" aria-hidden="true">
        <circle cx="200" cy="60" r="240" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
        <circle cx="40" cy="160" r="260" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
      </svg>
      <svg className="deco deco-tr" viewBox="0 0 560 500" fill="none" aria-hidden="true">
        <polygon points="30,20 540,70 210,340" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
        <polygon points="110,0 560,130 180,410" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
        <polygon points="190,30 570,190 250,470" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
      </svg>
      <svg className="deco deco-bl" viewBox="0 0 500 440" fill="none" aria-hidden="true">
        <polygon points="10,30 320,70 30,400" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
        <polygon points="70,10 380,110 80,390" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
        <polygon points="0,130 250,170 20,430" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
      </svg>
      <svg className="deco deco-br" viewBox="0 0 560 380" fill="none" aria-hidden="true">
        <path d="M10 340C190 30 430 10 590 210" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
        <path d="M30 390C230 70 470 50 620 260" stroke="#171717" strokeWidth="1.35" vectorEffect="nonScalingStroke" />
      </svg>

      <Logo className="tour-logo" />

      <div className="tour-mid">
        <h1 className="tour-title">
          Take a t<span className="tour-word">ou<span className="blob" aria-hidden="true" />r</span>
        </h1>
        <nav className={concealNav ? 'tour-nav is-concealed' : 'tour-nav'} aria-label="Primary">
          {MENU.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => buttonRef(index, node)}
              type="button"
              className={item.ghost ? 'pill ghost' : 'pill'}
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
