import { useEffect, useRef, type RefObject } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MENU, type MenuId } from '../menu'
import { Logo } from './Logo'

export type Stitch = {
  label: string
  ghost: boolean
  left: number
  top: number
  width: number
  height: number
  dx: number
  dy: number
  lineWidth: number
  lineHeight: number
}

type Props = {
  burgerRef: RefObject<HTMLButtonElement | null>
  docked: boolean
  open: boolean
  stitches: Stitch[] | null
  onToggle: () => void
  onClose: () => void
  onNavigate: (id: MenuId) => void
  onHome: () => void
  onStitchDone: () => void
}

export function Menu({
  burgerRef,
  docked,
  open,
  stitches,
  onToggle,
  onClose,
  onNavigate,
  onHome,
  onStitchDone,
}: Props) {
  const reduce = useReducedMotion()
  const firstRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    firstRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const burgerClass = ['burger', docked ? 'is-on' : '', open ? 'is-open' : '', stitches ? 'is-sewing' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <Logo
        className={`home-logo ${docked ? 'is-on' : ''}`}
        play={docked}
        instant
        onActivate={onHome}
      />
      <button
        ref={burgerRef}
        type="button"
        className={burgerClass}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-hidden={docked ? undefined : true}
        tabIndex={docked ? 0 : -1}
        onClick={onToggle}
      >
        <span />
        <span />
        <span />
      </button>

      {stitches?.map((stitch, index) => (
        <motion.div
          key={stitch.label}
          className={stitch.ghost ? 'stitch ghost' : 'stitch'}
          style={{ left: stitch.left, top: stitch.top, width: stitch.width, height: stitch.height }}
          initial={{ x: 0, y: 0, scaleX: 1, scaleY: 1, backgroundColor: stitch.ghost ? '#ffffff' : '#303030' }}
          animate={{
            x: stitch.dx,
            y: stitch.dy,
            scaleX: stitch.lineWidth / stitch.width,
            scaleY: stitch.lineHeight / Math.max(stitch.height, 1),
            backgroundColor: '#111111',
          }}
          transition={{
            duration: reduce ? 0.01 : 0.72,
            ease: [0.7, 0, 0.25, 1],
            delay: reduce ? 0 : index * 0.05,
          }}
          onAnimationComplete={index === stitches.length - 1 ? onStitchDone : undefined}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.16, delay: index * 0.04 }}
          >
            {stitch.label}
          </motion.span>
        </motion.div>
      ))}

      <AnimatePresence>
        {open && (
          <motion.div
            className="overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            id="site-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
          >
            <div className="menu-stack" onClick={(event) => event.stopPropagation()}>
              {MENU.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 72, scale: 0.84 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: 56, scale: 0.8 }}
                  transition={
                    reduce
                      ? { duration: 0.15 }
                      : { type: 'spring', stiffness: 340, damping: 26, delay: index * 0.06 }
                  }
                >
                  <motion.div
                    animate={reduce ? undefined : { y: [0, -8, 0] }}
                    transition={
                      reduce
                        ? undefined
                        : {
                            duration: 3.3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.45 + index * 0.18,
                          }
                    }
                  >
                    <button
                      ref={index === 0 ? firstRef : undefined}
                      type="button"
                      className={item.ghost ? 'pill menu-pill ghost' : 'pill menu-pill'}
                      onClick={() => onNavigate(item.id)}
                    >
                      {item.label}
                    </button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
