import { useEffect, useRef } from 'react'

/**
 * WaveDivider — multiple interesting SVG wave shapes for section transitions.
 *
 * variant:
 *   'wave'      — classic smooth sine wave (default)
 *   'peaks'     — sharp mountain peaks — playful for kids
 *   'bumps'     — soft bubbly bumps
 *   'zigzag'    — zigzag edge — energetic
 *   'scallop'   — half-circle scallop/cloud — very child-friendly
 *   'splash'    — irregular organic splash
 *
 * color    — fill color for the wave shape (the section below)
 * flip     — vertically flip (for bottom-of-section use)
 * animate  — gently oscillates the wave path
 * height   — 'sm' | 'md' | 'lg' (default 'md')
 */

const PATHS = {
  wave:
    'M0,48 C180,96 360,0 540,48 C720,96 900,0 1080,48 C1260,96 1380,24 1440,48 L1440,100 L0,100 Z',

  peaks:
    'M0,80 L120,20 L240,70 L360,10 L480,65 L600,15 L720,60 L840,8 L960,55 L1080,18 L1200,62 L1320,22 L1440,50 L1440,100 L0,100 Z',

  bumps:
    'M0,70 Q90,30 180,70 Q270,110 360,70 Q450,30 540,70 Q630,110 720,70 Q810,30 900,70 Q990,110 1080,70 Q1170,30 1260,70 Q1350,110 1440,70 L1440,100 L0,100 Z',

  zigzag:
    'M0,60 L60,20 L120,60 L180,20 L240,60 L300,20 L360,60 L420,20 L480,60 L540,20 L600,60 L660,20 L720,60 L780,20 L840,60 L900,20 L960,60 L1020,20 L1080,60 L1140,20 L1200,60 L1260,20 L1320,60 L1380,20 L1440,60 L1440,100 L0,100 Z',

  scallop:
    'M0,80 C40,40 80,80 120,80 C160,80 200,40 240,80 C280,80 320,40 360,80 C400,80 440,40 480,80 C520,80 560,40 600,80 C640,80 680,40 720,80 C760,80 800,40 840,80 C880,80 920,40 960,80 C1000,80 1040,40 1080,80 C1120,80 1160,40 1200,80 C1240,80 1280,40 1320,80 C1360,80 1400,40 1440,80 L1440,100 L0,100 Z',

  splash:
    'M0,60 C60,80 100,30 180,55 C260,80 320,20 420,50 C520,80 580,25 700,55 C820,85 900,15 1020,48 C1140,80 1260,20 1360,50 C1400,62 1430,45 1440,52 L1440,100 L0,100 Z',
}

// Alternate paths for animation (subtle morph)
const PATHS_ALT = {
  wave:
    'M0,55 C180,10 360,96 540,55 C720,10 900,96 1080,55 C1260,10 1380,72 1440,55 L1440,100 L0,100 Z',

  peaks:
    'M0,70 L120,15 L240,75 L360,8 L480,72 L600,12 L720,68 L840,5 L960,60 L1080,14 L1200,68 L1320,18 L1440,55 L1440,100 L0,100 Z',

  bumps:
    'M0,65 Q90,105 180,65 Q270,25 360,65 Q450,105 540,65 Q630,25 720,65 Q810,105 900,65 Q990,25 1080,65 Q1170,105 1260,65 Q1350,25 1440,65 L1440,100 L0,100 Z',

  zigzag:
    'M0,40 L60,80 L120,40 L180,80 L240,40 L300,80 L360,40 L420,80 L480,40 L540,80 L600,40 L660,80 L720,40 L780,80 L840,40 L900,80 L960,40 L1020,80 L1080,40 L1140,80 L1200,40 L1260,80 L1320,40 L1380,80 L1440,40 L1440,100 L0,100 Z',

  scallop:
    'M0,70 C40,30 80,70 120,70 C160,70 200,30 240,70 C280,70 320,30 360,70 C400,70 440,30 480,70 C520,70 560,30 600,70 C640,70 680,30 720,70 C760,70 800,30 840,70 C880,70 920,30 960,70 C1000,70 1040,30 1080,70 C1120,70 1160,30 1200,70 C1240,70 1280,30 1320,70 C1360,70 1400,30 1440,70 L1440,100 L0,100 Z',

  splash:
    'M0,50 C60,30 100,80 180,45 C260,10 320,80 420,40 C520,0 580,75 700,45 C820,15 900,75 1020,38 C1140,0 1260,70 1360,40 C1400,22 1430,55 1440,42 L1440,100 L0,100 Z',
}

const HEIGHT_CLASSES = {
  sm: 'h-10 md:h-14',
  md: 'h-16 md:h-24',
  lg: 'h-24 md:h-36',
}

export default function WaveDivider({
  color = '#ffffff',
  flip = false,
  variant = 'wave',
  animate = false,
  height = 'md',
  className = '',
}) {
  const pathRef = useRef(null)
  const rafRef = useRef(null)
  const progressRef = useRef(0)
  const dirRef = useRef(1)

  useEffect(() => {
    if (!animate || !pathRef.current) return

    const from = PATHS[variant] || PATHS.wave
    const to = PATHS_ALT[variant] || PATHS_ALT.wave

    // Simple lerp morph between two SVG paths using CSS animation
    // We just swap d attribute on a slow interval for a gentle drift
    let toggle = false
    const interval = setInterval(() => {
      if (!pathRef.current) return
      toggle = !toggle
      pathRef.current.style.transition = 'd 3s ease-in-out'
      pathRef.current.setAttribute('d', toggle ? to : from)
    }, 3500)

    return () => clearInterval(interval)
  }, [animate, variant])

  const d = PATHS[variant] || PATHS.wave

  return (
    <div
      className={`w-full overflow-hidden leading-none ${flip ? 'scale-y-[-1]' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={`w-full ${HEIGHT_CLASSES[height] || HEIGHT_CLASSES.md} block`}
      >
        <path
          ref={pathRef}
          d={d}
          fill={color}
          style={animate ? { transition: 'd 3.5s ease-in-out' } : undefined}
        />
      </svg>
    </div>
  )
}
