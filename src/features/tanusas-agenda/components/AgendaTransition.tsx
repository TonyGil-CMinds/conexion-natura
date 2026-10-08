'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';

export function AgendaTransition({ children, onEntered }: { children: ReactNode; onEntered?: () => void }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();

  return <motion.div inert={!present} initial={reduced ? false : { opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }}
    transition={{ duration: reduced ? 0 : present ? 0.38 : 0.16, ease: EASE_OUT_EXPO }}
    onAnimationComplete={() => { if (present) onEntered?.(); }}>
    <AnimatePresence initial={false}><div key="content">{children}</div></AnimatePresence>
  </motion.div>;
}
