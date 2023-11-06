export const EASING = {
  ease: [0.36, 0.66, 0.4, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],

  kolumbFlow: [0.175, 0.885, 0.32, 1],
  kolumbOut: [0.885, 0.175, 0.5, 1],
} as const;

export const TRANSITION = {
  scale: {
    initial: { scale: 0, transition: { type: "spring", bounce: 0, duration: 0.3 } },
    animate: { scale: 1, transition: { type: "spring", bounce: 0, duration: 0.3 } },
    exit: { scale: 0, transition: { type: "spring", bounce: 0, duration: 0.3 } },
  },
  fadeInScaleY: {
    initial: { scaleY: 0, scaleX: 0.75, transition: { duration: 0.25, ease: EASING.kolumbFlow } },
    animate: { scaleY: 1, scaleX: 1, transition: { duration: 0.25, ease: EASING.kolumbFlow } },
    exit: { scaleY: 0, scaleX: 0.75, transition: { duration: 0.25, ease: EASING.kolumbOut } },
  },
  fadeInScale: {
    initial: { scale: 0.7, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
    exit: { scale: 0.5, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
  },
  fade: {
    initial: { opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
    animate: { opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
    exit: { opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
  },
  fadeInOut: {
    top: {
      initial: { y: -4, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
      animate: { y: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { y: -4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    bottom: {
      initial: { y: 4, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
      animate: { y: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { y: 4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    left: {
      initial: { x: -4, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
      animate: { x: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { x: -4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    right: {
      initial: { x: 4, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
      animate: { x: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { x: 4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
  },
  appearInSequence: {
    initial: ({ index, sequenceDelay = 0.06 }: { index: number; sequenceDelay?: number }) => ({
      opacity: 0,
      scale: 0,
      filter: "blur(10px)",
      transition: {
        opacity: { type: "spring", duration: 0.25, delay: 0.1 + index * sequenceDelay },
        scale: { type: "spring", duration: 0.25, delay: 0.1 + index * sequenceDelay },
        filter: { duration: 0.1, delay: 0.1 + index * sequenceDelay },
      },
    }),
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
