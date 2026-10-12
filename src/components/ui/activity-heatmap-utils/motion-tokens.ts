export const motionTokens = {
  ease: { enter: [0.16, 1, 0.3, 1] as const, standard: [0.22, 1, 0.36, 1] as const },
  spring: { snappy: { type: "spring" as const, stiffness: 450, damping: 35 }, morph: { type: "spring" as const, stiffness: 350, damping: 30 } },
  blur: { subtle: 2, soft: 4 },
  duration: { fast: 0.16 }
};
