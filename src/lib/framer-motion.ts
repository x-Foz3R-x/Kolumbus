import { TargetAndTransition } from "framer-motion";

export type Variants = Record<string, { enter: TargetAndTransition; exit: TargetAndTransition; initial: TargetAndTransition }>;

export const EASING = {
  ease: [0.36, 0.66, 0.4, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: [0.155, 1.105, 0.295, 1.12],
  springOut: [0.57, -0.15, 0.62, 0.07],
  softSpring: [0.16, 1.11, 0.3, 1.02],

  kolumbFlow: [0.175, 0.885, 0.32, 1],
  kolumbOut: [0.885, 0.175, 0.5, 1],
} as const;

export const TRANSITION = {
  scaleSpring: {
    initial: {
      scale: 0.6,
      opacity: 0,
      transition: {
        type: "easeOut",
        duration: 0.2,
      },
    },
    enter: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 0.3,
      },
    },
    exit: {
      scale: 0.6,
      opacity: 0,
      transition: {
        type: "easeOut",
        duration: 0.2,
      },
    },
  },
  scale: {
    initial: { scale: 0.95 },
    enter: { scale: 1 },
    exit: { scale: 0.95 },
  },
  scaleFadeIn: {
    initial: {
      scale: 0.95,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: EASING.easeOut,
      },
    },
    enter: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: EASING.easeIn,
      },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: EASING.easeOut,
      },
    },
  },
  scaleInOut: {
    initial: {
      scale: 1.03,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: EASING.ease,
      },
    },
    enter: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: EASING.ease,
      },
    },
    exit: {
      scale: 1.03,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: EASING.ease,
      },
    },
  },
  fade: {
    initial: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: EASING.ease,
      },
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: EASING.ease,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: EASING.ease,
      },
    },
  },
};
