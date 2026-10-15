import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function Intro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()
  const done = useRef(onDone)
  const finished = useRef(false)
  const [grow, setGrow] = useState(false)
  const [scale, setScale] = useState(24)

  done.current = onDone

  function finish() {
    if (finished.current) return
    finished.current = true
    done.current()
  }

  useEffect(() => {
    if (reduce) {
      finish()
      return
    }
    const id = window.setTimeout(() => {
      setScale(Math.hypot(window.innerWidth, window.innerHeight) / 12)
      setGrow(true)
    }, 2000)
    return () => window.clearTimeout(id)
  }, [reduce])

  useEffect(() => {
    if (!grow) return
    const id = window.setTimeout(finish, 1200)
    return () => window.clearTimeout(id)
  }, [grow])

  if (reduce) return null

  return (
    <div className="intro" aria-hidden="true">
      <img className="intro-gif" src="/poczatek.gif" alt="" />
      {grow && (
        <motion.svg
          className="grow-tri"
          viewBox="0 0 100 100"
          initial={{ scale: 1, rotate: -14 }}
          animate={{ scale, rotate: -14 }}
          transition={{ duration: 1.05, ease: [0.45, 0.02, 0.85, 0.35] }}
          onAnimationComplete={finish}
        >
          <polygon points="50,4 97,92 3,92" fill="#ffffff" />
        </motion.svg>
      )}
    </div>
  )
}
