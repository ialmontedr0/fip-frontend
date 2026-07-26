import type { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

export const statCardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2, transition: { duration: 0.3, ease: 'easeOut' } },
}

export const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  hover: {
    scale: 1.015,
    y: -4,
    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const gradientShift = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: { duration: 6, repeat: Infinity, ease: 'linear' },
  },
}

export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(139,92,246,0.3)',
      '0 0 0 10px rgba(139,92,246,0)',
      '0 0 0 0 rgba(139,92,246,0)',
    ],
    transition: { duration: 2, repeat: Infinity },
  },
}

export const numberCount = (end: number, duration = 1.5) => ({
  initial: { count: 0 },
  animate: { count: end, transition: { duration, ease: 'easeOut' } },
})

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
}

export const shimmer = {
  animate: {
    x: ['-100%', '100%'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
}
