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
    initial: { scale: 0.8, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
    enter: { scale: 1, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
    exit: { scale: 0.5, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
  },
  fade: {
    initial: { opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
    enter: { opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
    exit: { opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
  },
  fadeInOut: {
    top: {
      initial: { y: -4, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
      enter: { y: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { y: -4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    bottom: {
      initial: { y: 4, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
      enter: { y: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { y: 4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    left: {
      initial: { x: -4, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
      enter: { x: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { x: -4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
    right: {
      initial: { x: 4, opacity: 0, transition: { duration: 0.2, ease: EASING.easeOut } },
      enter: { x: 0, opacity: 1, transition: { duration: 0.2, ease: EASING.easeOut } },
      exit: { x: 4, opacity: 0, transition: { duration: 0.15, ease: EASING.easeIn } },
    },
  },
};
