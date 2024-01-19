import { backIn } from "framer-motion";

export const EASING = {
  linear: "linear",

  easeIn: "easeIn",
  easeInOut: "easeInOut",
  easeOut: "easeOut",

  backIn: "backIn",
  backInOut: "backInOut",
  backOut: "backOut",

  circIn: "circIn",
  circInOut: "circInOut",
  circOut: "circOut",

  kolumbFlow: [0.175, 0.885, 0.32, 1],
  kolumbOverflow: [0.175, 0.885, 0.32, 1.275],
  kolumbOut: [0.885, 0.175, 0.5, 1],

  anticipate: (p: number) => (p > 0.99 ? 1 : (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)))),
} as const;

export const TRANSITION = {
  scale: {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: "spring", bounce: 0, duration: 0.3 } },
    exit: { scale: 0, transition: { type: "spring", bounce: 0, duration: 0.3 } },
  },
  scaleIn: {
    initial: { scale: 1.3, opacity: 0.7 },
    animate: { scale: 1, opacity: 1, transition: { type: "spring", bounce: 0, duration: 0.3 } },
    exit: { scale: 1.1, opacity: 0, transition: { duration: 0.3, ease: EASING.kolumbFlow } },
  },
  scaleInOut: {
    initial: { scale: 0.4, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { opacity: { duration: 0.3, ease: EASING.kolumbFlow }, scale: { duration: 0.3, ease: EASING.circOut } },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { opacity: { duration: 0.3, ease: EASING.kolumbFlow }, scale: { duration: 0.3, ease: EASING.circIn } },
    },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15, ease: EASING.easeIn } },
    exit: { opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
  },
  fadeInScaleY: {
    initial: { scaleY: 0, scaleX: 0.75 },
    animate: { scaleY: 1, scaleX: 1, transition: { duration: 0.25, ease: EASING.kolumbFlow } },
    exit: { scaleY: 0, scaleX: 0.75, transition: { duration: 0.25, ease: EASING.kolumbOut } },
  },
  fadeInScale: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: EASING.anticipate } },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.4, ease: EASING.anticipate } },
  },
  fadeToPosition: {
    top: {
      initial: { y: -4, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { y: -4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    right: {
      initial: { x: 4, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { x: 4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    bottom: {
      initial: { y: 4, opacity: 0 },
      animate: { y: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { y: 4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    left: {
      initial: { x: -4, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { x: -4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
  },
  appear: {
    initial: {
      opacity: 0,
      scale: 0,
      filter: "blur(10px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        opacity: { type: "spring", duration: 0.25 },
        scale: { type: "spring", duration: 0.25 },
        filter: { duration: 0.1 },
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      filter: "blur(10px)",
      transition: {
        opacity: { type: "spring", duration: 0.25 },
        scale: { type: "spring", duration: 0.25 },
        filter: { duration: 0.15 },
      },
    },
  },
  appearInSequence: {
    initial: {
      opacity: 0,
      scale: 0,
      filter: "blur(10px)",
    },
    animate: ({ index, sequenceDelay = 0.06 }: { index: number; sequenceDelay?: number }) => ({
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        opacity: { type: "spring", duration: 0.25, delay: 0.1 + index * sequenceDelay },
        scale: { type: "spring", duration: 0.25, delay: 0.1 + index * sequenceDelay },
        filter: { duration: 0.1, delay: 0.1 + index * sequenceDelay },
      },
    }),
    exit: {
      opacity: 0,
      scale: 0,
      filter: "blur(10px)",
      transition: {
        opacity: { type: "spring", duration: 0.25 },
        scale: { type: "spring", duration: 0.25 },
        filter: { duration: 0.15 },
      },
    },
  },
};
