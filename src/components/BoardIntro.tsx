import { Logo } from './Logo'
import '../board.css'

type Props = {
  ready?: boolean
  onHome: () => void
}

export function BoardIntro({ ready = true, onHome }: Props) {
  return (
    <section className="board" aria-label="Introduction">
      <div className="board-art" aria-hidden="true" />
      <div className="board-main">
        <Logo className="board-logo" play={ready} delay={0.15} onActivate={onHome} />
        <div className="board-copy">
          <p className="board-lead">
            Hi I’m Marta Bensalem
            <br />
            UX/UI Designer. I create experiences that are impactful and perhaps, even a bit delightful.
          </p>
          <p className="board-note">
            I want to be a part of a world where humanity
            <br />
            is essential to design.
          </p>
        </div>
      </div>
      <svg className="board-tri" viewBox="0 0 420 520" aria-hidden="true">
        <polygon points="70,36 418,168 248,508" />
        <polygon points="28,92 392,24 310,500" />
      </svg>
    </section>
  )
}
