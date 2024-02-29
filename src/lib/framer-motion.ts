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
  scaleInOut: {
    initial: { scale: 1.075, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: EASING.easeInOut, y: { type: "spring", bounce: 0, duration: 0.6 } },
    },
    exit: {
      scale: 1.075,
      opacity: 0,
      transition: { duration: 0.3, ease: EASING.easeInOut },
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
      filter: "blur(8px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.25,
        ease: EASING.kolumbFlow,
        filter: { duration: 0.1 },
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      filter: "blur(8px)",
      transition: {
        duration: 0.25,
        ease: EASING.kolumbFlow,
        filter: { duration: 0.1 },
      },
    },
  },
  appearInSequence: {
    initial: {
      opacity: 0,
      scale: 0,
      filter: "blur(8px)",
    },
    animate: ({ index, initialDelay = 0.1, sequenceDelay = 0.06 }: { index: number; initialDelay?: number; sequenceDelay?: number }) => ({
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.25,
        ease: EASING.kolumbFlow,
        delay: initialDelay + index * sequenceDelay,
        filter: { duration: 0.1 },
      },
    }),
    exit: {
      opacity: 0,
      scale: 0,
      filter: "blur(8px)",
      transition: { duration: 0.25, ease: EASING.kolumbFlow, filter: { duration: 0.1 } },
    },
  },
};
