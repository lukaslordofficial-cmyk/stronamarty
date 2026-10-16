import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { frames } from '../frames'
import { Tile } from './FrameScreen'
import '../work-mobile.css'

const hero = frames.find((frame) => frame.name === '03')
const teacher = frames.find((frame) => frame.name === '09')

const CATEGORIES = ['Management', 'App installers', 'Security', 'Data integrations', 'Software']
const HELP = ['Mart Support', 'Learning Hub', 'Training & Certifications', 'Marta Blog', 'Mart Account', 'Mart Nation', 'Marketplace', 'Become a Partner', 'Find a Partner']
const SOLUTIONS = [
  'The Martplatform',
  'Zero-touch deployment',
  'Mobile Device Management (MDM)',
  'Application management',
  'Inventory management',
  'Self Service',
  'Identity and access management',
  'Endpoint protection',
  'Threat prevention and remediation',
  'Content filtering and safe internet',
]
const LEGAL = ['Copyright', 'Privacy Policy', 'Terms of Use', 'Trust', 'Modern Slavery Act Statement']

type PanProps = {
  name: string
  width: number
  height: number
  sizes: number[]
  scale: number
  stops: number[]
  alt: string
  tone: string
}

const PANS = {
  phones: {
    name: 'phones',
    width: 3720,
    height: 2795,
    sizes: [1000, 1600, 2400, 3200],
    scale: 2.2,
    stops: [0.29, 0.51, 0.72],
    alt: 'Three phones showing security alerts, device status, and data usage.',
    tone: '#050307',
  },
  laptop: {
    name: 'laptop',
    width: 3940,
    height: 2297,
    sizes: [1000, 1600, 2400, 3200],
    scale: 2.4,
    stops: [0.26, 0.5, 0.74],
    alt: 'A laptop on a stand, open on a device management dashboard.',
    tone: '#8a8a8a',
  },
  sheseo: {
    name: 'sheseo',
    width: 2369,
    height: 2540,
    sizes: [1000, 1600, 2369],
    scale: 1.7,
    stops: [0.37, 0.7],
    alt: 'SheSeo welcome screens on two phones against a starry nebula.',
    tone: '#05060b',
  },
  teacher: {
    name: 'teacher',
    width: 1904,
    height: 1058,
    sizes: [1000, 1600, 1904],
    scale: 2.25,
    stops: [0.2, 0.82],
    alt: 'Teacher App lesson templates shown on two laptops.',
    tone: '#a56fc6',
  },
}

function Pan({ name, width, height, sizes, scale, stops, alt, tone }: PanProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const offset = (stop: number) => {
    const node = ref.current
    return node ? stop * node.scrollWidth - node.clientWidth / 2 : 0
  }

  useEffect(() => {
    const node = ref.current
    if (!node) return
    node.scrollLeft = offset(stops[0] ?? 0)
    const onScroll = () => {
      const center = (node.scrollLeft + node.clientWidth / 2) / node.scrollWidth
      let best = 0
      let bestDist = Infinity
      stops.forEach((stop, index) => {
        const dist = Math.abs(stop - center)
        if (dist < bestDist) {
          best = index
          bestDist = dist
        }
      })
      setActive(best)
    }
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => node.removeEventListener('scroll', onScroll)
  }, [stops])

  return (
    <section className="wm-pan" style={{ background: tone }}>
      <div ref={ref} className="wm-pan-scroll">
        <div className="wm-pan-track" style={{ width: `${scale * 100}%` }}>
          <img
            src={`/work-m/${name}-${sizes[1] ?? sizes[0]}.webp`}
            srcSet={sizes.map((size) => `/work-m/${name}-${size}.webp ${size}w`).join(', ')}
            sizes={`${scale * 100}vw`}
            width={width}
            height={height}
            alt={alt}
            loading="lazy"
            decoding="async"
          />
          {stops.map((stop) => (
            <span key={stop} className="wm-pan-stop" style={{ left: `${stop * 100}%` }} />
          ))}
        </div>
      </div>
      <div className="wm-pan-dots">
        {stops.map((stop, index) => (
          <button
            key={stop}
            type="button"
            aria-label={`Show part ${index + 1} of ${stops.length}`}
            aria-current={index === active}
            onClick={() => ref.current?.scrollTo({ left: offset(stop), behavior: reduce ? 'auto' : 'smooth' })}
          />
        ))}
      </div>
    </section>
  )
}

function Card() {
  return (
    <div className="wm-card">
      <i className="wm-card-icon" />
      <i className="wm-card-bar" />
      <span className="wm-meta">#metadata</span>
      <div className="wm-card-foot">
        <span>Learn more</span>
        <span className="wm-get">Get it</span>
      </div>
    </div>
  )
}

function Cards() {
  return (
    <div className="wm-cards">
      <Card />
      <Card />
      <Card />
    </div>
  )
}

function Search({ label, shortcut, outlined }: { label: string; shortcut?: boolean; outlined?: boolean }) {
  return (
    <div className={`wm-search${outlined ? ' is-outlined' : ''}`}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="7" cy="7" r="4.6" />
        <path d="m10.4 10.4 3.4 3.4" />
      </svg>
      <span>{label}</span>
      {shortcut && <kbd>⌘ K</kbd>}
    </div>
  )
}

function Filter() {
  return (
    <span className="wm-filter">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2 4h12M4.5 8h7M7 12h2" />
      </svg>
      <b>Filter:</b> None applied
    </span>
  )
}

function Spot({ flip }: { flip?: boolean }) {
  return (
    <div className={`wm-spot${flip ? ' is-flip' : ''}`}>
      <i className="wm-spot-img" />
      <div className="wm-spot-copy">
        <i className="wm-line is-tag" />
        <i className="wm-line is-thick" />
        <i className="wm-line is-thick" />
        <i className="wm-line is-thick is-short" />
        <i className="wm-line" />
        <i className="wm-line" />
        <i className="wm-line" />
        <i className="wm-line is-button" />
      </div>
    </div>
  )
}

function Homepage() {
  return (
    <div className="wm-panel wm-browser" role="img" aria-label="Wireframe of the marketplace homepage on a phone.">
      <div className="wm-chrome">
        <span className="wm-lights">
          <i />
          <i />
          <i />
        </span>
        <span className="wm-url">
          <svg viewBox="0 0 10 12" aria-hidden="true">
            <rect x="1" y="5" width="8" height="6.5" rx="1.2" />
            <path d="M3 5V3.6a2 2 0 0 1 4 0V5" />
          </svg>
          www.jamf.com/concepts
        </span>
      </div>

      <header className="wm-nav">
        <b>Logo</b>
        <span className="wm-btn">Go to marketplace →</span>
        <span className="wm-burger">
          <i />
          <i />
        </span>
      </header>

      <div className="wm-splash">
        <strong>Splash / Header</strong>
        <small>large typography and imagery</small>
      </div>

      <div className="wm-section">
        <div className="wm-section-head">
          <div>
            <h3>Featured</h3>
            <p className="wm-sub">Handpicked integrations to supercharge your workflow</p>
          </div>
          <span>View all →</span>
        </div>
        <Cards />
        <span className="wm-btn is-center">Browse</span>
      </div>

      <div className="wm-grey">
        <span className="wm-label">Featured</span>
        <Spot />
        <Spot flip />
        <span className="wm-btn is-center">View all</span>
      </div>

      <div className="wm-dark">
        <div className="wm-spot is-dark">
          <i className="wm-spot-img" />
        </div>
        <span className="wm-dots">
          <i />
          <i className="is-on" />
          <i />
          <i />
        </span>
        <h3>We want your feedback</h3>
        <p>
          We would love to hear from you about your experience using the Jamf Marketplace. Please share any feedback with
          us via email, or file an issue if you encounter any issues. You can also join the conversation on Mac Admins
          Slack.
        </p>
        <p>When in doubt, if you have any questions please send us an email any time!</p>
        <div className="wm-actions">
          <span className="wm-btn is-dark">Send an email</span>
          <span className="wm-btn is-dark">File a ticket</span>
        </div>
      </div>

      <footer className="wm-foot">
        <h4>Help &amp; Support</h4>
        <ul className="wm-links is-two">
          {HELP.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h4>Solutions</h4>
        <ul className="wm-links">
          {SOLUTIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="wm-legal">
          {LEGAL.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="wm-social" aria-hidden="true">
          <span>𝕏</span>
          <span>in</span>
          <svg viewBox="0 0 16 16">
            <rect x="1.5" y="3.5" width="13" height="9" rx="2.6" />
            <path className="is-cut" d="m6.6 5.8 3.6 2.2-3.6 2.2Z" />
          </svg>
          <svg viewBox="0 0 16 16" className="is-line">
            <rect x="2.5" y="2.5" width="11" height="11" rx="3.2" />
            <circle cx="8" cy="8" r="2.6" />
          </svg>
          <span>f</span>
        </div>
      </footer>
    </div>
  )
}

function Catalogs() {
  return (
    <>
      <div className="wm-panel wm-cat" role="img" aria-label="Wireframe of the plugin catalog with categories and filters.">
        <Search label="Search the catalog" shortcut outlined />
        <div className="wm-row">
          <span className="wm-select">Device type: All</span>
          <span className="wm-select">View as: List</span>
        </div>
        <h4>Categories</h4>
        <div className="wm-tabs">
          <b>All (348)</b>
          <span>Featured</span>
          {CATEGORIES.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <Cards />
        <p className="wm-request">
          <b>Request a plugin ↗</b>
          Can’t find what you’re looking for? Submit an idea
        </p>
      </div>

      <div className="wm-panel wm-cat" role="img" aria-label="Wireframe of the catalog with category chips.">
        <div className="wm-row">
          <Search label="Search" outlined />
          <Filter />
        </div>
        <div className="wm-chips">
          <span className="is-on">All plugins</span>
          {CATEGORIES.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="wm-count">Viewing 348 plugins</p>
        <Cards />
      </div>

      <div className="wm-panel wm-cat" role="img" aria-label="Wireframe of the solutions search.">
        <div className="wm-row">
          <Search label="Search for solutions" />
          <Filter />
        </div>
        <Cards />
      </div>
    </>
  )
}

export function WorkMobile() {
  return (
    <div className="page wm">
      {hero ? (
        <section id="work" className="frame">
          {hero.mobile?.[0] ? (
            <Tile frame={{ ...hero, eager: true }} crop={hero.mobile[0]} index={0} />
          ) : null}
        </section>
      ) : null}

      <div className="wm-wire">
        <Homepage />
        <Catalogs />
      </div>

      <img
        className="wm-squiggle"
        src="/work-m/squiggle-1200.webp"
        srcSet="/work-m/squiggle-800.webp 800w, /work-m/squiggle-1200.webp 1200w, /work-m/squiggle-1650.webp 1650w"
        sizes="100vw"
        width={1650}
        height={380}
        alt=""
        loading="lazy"
      />

      <Pan {...PANS.phones} />
      <Pan {...PANS.laptop} />
      <Pan {...PANS.sheseo} />

      {teacher?.mobile?.[0] ? (
        <section className="frame">
          <Tile frame={teacher} crop={teacher.mobile[0]} index={0} />
        </section>
      ) : null}
      <Pan {...PANS.teacher} />
    </div>
  )
}
