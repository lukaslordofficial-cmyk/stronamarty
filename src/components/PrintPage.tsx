import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { MenuId } from '../menu'
import '../print.css'

type Props = {
  onNavigate: (id: MenuId) => void
}

type Variant = 'color' | 'letters' | 'stamp'

const COLORS = {
  pink: '#ec4484',
  lime: '#dcfc6c',
  plum: '#3c1424',
  bubblegum: '#ffa6dc',
  sky: '#8fd6ff',
  vanilla: '#fff4d6',
}

const PALETTE = [
  { name: 'Candy Pink', hex: COLORS.pink, ink: '#fff' },
  { name: 'Sour Lime', hex: COLORS.lime, ink: COLORS.plum },
  { name: 'Cocoa Plum', hex: COLORS.plum, ink: '#fff' },
  { name: 'Bubblegum', hex: COLORS.bubblegum, ink: COLORS.plum },
  { name: 'Sky Drop', hex: COLORS.sky, ink: COLORS.plum },
  { name: 'Vanilla', hex: COLORS.vanilla, ink: COLORS.plum },
]

const SWEETS = [
  { src: '/print/sq-bear.webp', alt: 'An orange gummy bear on yellow.' },
  { src: '/print/sq-marshmallow.webp', alt: 'A pink and white marshmallow twist on pink.' },
  { src: '/print/sq-berry.webp', alt: 'A sugared blue raspberry gummy on blue.' },
  { src: '/print/sq-worm.webp', alt: 'A sour lime gummy worm on green.' },
  { src: '/print/sq-strawberry.webp', alt: 'A sugared strawberry jelly on red.' },
  { src: '/print/sq-meringue.webp', alt: 'A meringue kiss on cream.' },
]

function spiral(cx: number, cy: number, from: number, to: number, turns: number) {
  const steps = 72
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    const angle = t * turns * Math.PI * 2
    const radius = from + (to - from) * t
    return `${(cx + Math.cos(angle) * radius).toFixed(1)} ${(cy + Math.sin(angle) * radius).toFixed(1)}`
  })
  return `M${points.join('L')}`
}

const ICONS = {
  lollipop: (
    <>
      <rect x="46" y="58" width="8" height="38" rx="4" />
      <circle cx="50" cy="38" r="30" />
      <path className="cg-icon-line" d={spiral(50, 38, 2, 22, 2.25)} />
    </>
  ),
  wrapper: (
    <>
      <ellipse cx="50" cy="50" rx="25" ry="19" />
      <path className="cg-icon-round" d="M28 50 8 33 12 50 8 67Z" />
      <path className="cg-icon-round" d="M72 50 92 33 88 50 92 67Z" />
    </>
  ),
  gumdrop: <path d="M25 88q-6 0-6-7C19 40 31 14 50 14s31 26 31 67q0 7-6 7Z" />,
  heart: (
    <path d="M50 88C23 69 9 53 9 35 9 21 20 12 32 12c8 0 14 5 18 12 4-7 10-12 18-12 12 0 23 9 23 23 0 18-14 34-41 53Z" />
  ),
  star: (
    <path
      className="cg-icon-round"
      d="M50 12 61 37 88 39 67 57 74 84 50 69 26 84 33 57 12 39 39 37Z"
    />
  ),
  drop: <path d="M50 8s32 38 32 58c0 18-14 28-32 28S18 84 18 66C18 46 50 8 50 8Z" />,
  flower: (
    <path d="M50 20a14 14 0 0 1 26 8 14 14 0 0 1 2 26 14 14 0 0 1-14 22 14 14 0 0 1-28 0 14 14 0 0 1-14-22 14 14 0 0 1 2-26 14 14 0 0 1 26-8Z" />
  ),
  blob: <path d="M52 10c22 0 38 14 38 36 0 24-18 44-42 44C26 90 10 74 10 52 10 28 30 10 52 10Z" />,
}

type IconName = keyof typeof ICONS

function Icon({ name, color, className = '', style }: { name: IconName; color: string; className?: string; style?: CSSProperties }) {
  return (
    <svg className={`cg-icon ${className}`.trim()} viewBox="0 0 100 100" style={{ color, ...style }} aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

function Mark({ variant, color, label }: { variant: Variant; color?: string; label?: string }) {
  if (variant === 'color')
    return <img className="cg-mark" src="/print/logo.png" alt={label ?? ''} width={1600} height={1082} loading="lazy" />
  return (
    <span
      className="cg-mark cg-mark-mask"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ color, '--mask': `url(/print/logo-${variant}.png)` } as CSSProperties}
    />
  )
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function Photo({ src, alt, width, height, children }: { src: string; alt: string; width: number; height: number; children?: ReactNode }) {
  return (
    <figure className="cg-photo">
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      {children}
    </figure>
  )
}

export function PrintPage({ onNavigate }: Props) {
  return (
    <article className="page cg">
      <header className="cg-col cg-head">
        <h1 className="cg-title">
          <span>Candy Garden</span>
        </h1>
      </header>

      <Reveal className="cg-mid cg-summary">
        <p className="cg-label">Summary</p>
        <p>
          Candy Garden is a neighbourhood sweet shop with a pick-and-mix wall, a lollipop bar and a lot of
          sugar-coated nostalgia. The owners wanted a print identity that feels like the first bite of a sour worm —
          bold enough for a shopfront, friendly enough for a five-year-old, and grown-up enough for a gift box.
        </p>
      </Reveal>

      <Reveal className="cg-wide cg-block" >
        <div className="cg-block-inner" style={{ background: COLORS.pink }}>
          <Mark variant="color" label="Candy Garden logo in full colour" />
          <Mark variant="letters" color={COLORS.vanilla} label="Candy Garden logo in vanilla" />
        </div>
      </Reveal>
      <Reveal className="cg-wide cg-block">
        <div className="cg-block-inner" style={{ background: COLORS.lime }}>
          <Mark variant="stamp" color={COLORS.plum} label="Candy Garden stamp logo in plum" />
          <Mark variant="letters" color={COLORS.plum} label="Candy Garden logo in plum" />
        </div>
      </Reveal>
      <Reveal className="cg-wide cg-block">
        <div className="cg-block-inner" style={{ background: COLORS.vanilla }}>
          <Mark variant="color" label="Candy Garden logo on vanilla" />
          <Mark variant="stamp" color={COLORS.pink} label="Candy Garden stamp logo in pink" />
        </div>
      </Reveal>

      <Reveal className="cg-col cg-text">
        <p>
          The wordmark already had the energy of a candy wrapper: a juicy script, a splash of syrup and a lollipop
          swirl tucked into the last letter. Rather than redraw it, I built a system around it — a full-colour badge
          for hero moments, a single-colour version for stickers and stamps, and a cut-out stamp that can be printed
          in one ink on paper bags, ribbons and receipts.
        </p>
        <p>
          Every version works on the six brand colours, so the shop can mix and match like a bag of pick-and-mix
          without ever losing its voice.
        </p>
      </Reveal>

      <div className="cg-wide cg-grid-2">
        <Reveal>
          <Photo src="/print/hero-pink.webp" alt="A child's hand reaching for a rainbow lollipop on a pink set." width={1024} height={1024}>
            <span className="cg-photo-mark">
              <Mark variant="letters" color={COLORS.vanilla} />
            </span>
          </Photo>
        </Reveal>
        <Reveal delay={0.08}>
          <Photo src="/print/hero-lime.webp" alt="A child's hand picking a pink gummy ring on a lime set." width={1024} height={1024}>
            <span className="cg-photo-mark">
              <Mark variant="letters" color={COLORS.plum} />
            </span>
          </Photo>
        </Reveal>
      </div>

      <Reveal className="cg-col cg-text">
        <h2>
          <span aria-hidden="true">🍬</span> A garden of sweets
        </h2>
        <p>
          A garden is a place you wander through, pick from and come back to. That idea shaped everything in the
          shop: arched niches like garden gates, a curved plum counter, and a wall of clear bins where the sweets
          themselves do the decorating. The identity steps back and lets the colour of the candy lead — soft pink
          walls, sour-lime accents and deep cocoa plum to keep it from tipping into a toy shop.
        </p>
      </Reveal>

      <div className="cg-mid cg-grid-2">
        <Reveal>
          <Photo src="/print/girl.webp" alt="A girl scooping gummy bears into a paper bag." width={864} height={1152} />
        </Reveal>
        <Reveal delay={0.08}>
          <Photo src="/print/shop.webp" alt="The pink shop interior with arched niches and a wall of candy bins." width={864} height={1152} />
        </Reveal>
      </div>
      <Reveal className="cg-mid">
        <Photo src="/print/table.webp" alt="Candy jars, macarons and a striped bag of jelly beans on a table." width={1152} height={864} />
      </Reveal>

      <Reveal className="cg-mid cg-palette" >
        {PALETTE.map((swatch) => (
          <div key={swatch.name} className="cg-swatch" style={{ background: swatch.hex, color: swatch.ink }}>
            <span className="cg-swatch-name">{swatch.name}</span>
            <span className="cg-swatch-hex">{swatch.hex.toUpperCase()}</span>
          </div>
        ))}
      </Reveal>

      <Reveal className="cg-mid">
        <Photo src="/print/bag.webp" alt="A cream Candy Garden paper bag against a sunlit pink wall." width={1152} height={864} />
      </Reveal>

      <Reveal className="cg-wide cg-block">
        <div className="cg-block-inner cg-icons" style={{ background: COLORS.plum }}>
          <Icon name="lollipop" color={COLORS.lime} />
          <Icon name="wrapper" color={COLORS.bubblegum} />
          <Icon name="gumdrop" color={COLORS.vanilla} />
          <Icon name="heart" color={COLORS.pink} />
          <Icon name="star" color={COLORS.lime} />
          <Icon name="drop" color={COLORS.vanilla} />
        </div>
      </Reveal>
      <p className="cg-col cg-caption">A set of sweet-shaped icons for price tags, stickers and the loyalty card.</p>

      <Reveal className="cg-col cg-text">
        <h2>
          <span aria-hidden="true">🍭</span> Built for sweet tooths
        </h2>
        <p>
          The packaging range — paper bags, candy cups, gift boxes and a stamp card — borrows the same shapes and
          pushes them into a louder, more playful direction. Bright, squishy and a little bit silly, but still clearly
          part of the same family. I also gave the shop a mascot, because every sweet shop deserves one.
        </p>
      </Reveal>

      <Reveal className="cg-col cg-cluster" >
        <Icon name="blob" color={COLORS.sky} className="cg-bob" style={{ '--i': 0 } as CSSProperties} />
        <Icon name="heart" color="#ff4d4d" className="cg-bob" style={{ '--i': 1 } as CSSProperties} />
        <Icon name="flower" color="#9be38f" className="cg-bob" style={{ '--i': 2 } as CSSProperties} />
        <Icon name="gumdrop" color="#ffc21a" className="cg-bob" style={{ '--i': 3 } as CSSProperties} />
        <Icon name="blob" color={COLORS.bubblegum} className="cg-bob" style={{ '--i': 4 } as CSSProperties} />
      </Reveal>

      <Reveal className="cg-mid">
        <Photo src="/print/cups.webp" alt="Three candy cups with Candy Garden stickers in pink, lime and yellow." width={1152} height={864} />
      </Reveal>

      <Reveal className="cg-mid cg-grid-3">
        {SWEETS.map((sweet) => (
          <Photo key={sweet.src} src={sweet.src} alt={sweet.alt} width={1024} height={1024} />
        ))}
      </Reveal>

      <Reveal className="cg-col cg-mascot">
        <img src="/print/mascot.webp" alt="Gummo, a fuzzy pink gumdrop mascot with big eyes." width={1024} height={1024} loading="lazy" />
        <p className="cg-caption">
          Meet <strong>Gummo</strong> — a sugar-dusted gumdrop who lives on the counter and on every stamp card.
        </p>
      </Reveal>

      <Reveal className="cg-wide cg-block">
        <div className="cg-block-inner cg-block-tall" style={{ background: COLORS.sky }}>
          <span className="cg-badge">
            <Mark variant="color" label="Candy Garden logo" />
          </span>
        </div>
      </Reveal>

      <p className="cg-col cg-caption">If you're in town, grab a paper bag and fill it with whatever makes you smile.</p>

      <Reveal className="cg-mid cg-credits">
        <p className="cg-label">Behind the work</p>
        <div className="cg-credits-grid">
          <dl>
            <dt>Role</dt>
            <dd>Brand identity &amp; print</dd>
            <dt>Date</dt>
            <dd>2026</dd>
          </dl>
          <dl>
            <dt>Deliverables</dt>
            <dd>Logo system, packaging, signage</dd>
            <dt>Imagery</dt>
            <dd>Concept photography</dd>
          </dl>
          <dl>
            <dt>Hardest part…</dt>
            <dd>
              Keeping it sweet without making it sticky. The challenge was letting the candy be loud while the
              identity stays calm enough to carry it — fun and fresh, never childish or tacky.
            </dd>
          </dl>
        </div>
      </Reveal>

      <nav className="cg-col cg-next" aria-label="Next project">
        <span>Next project</span>
        <button type="button" onClick={() => onNavigate('uxui')}>
          UX/UI case studies
        </button>
      </nav>
    </article>
  )
}
