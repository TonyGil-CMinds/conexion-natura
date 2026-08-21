'use client';

import { createContext, useContext, useMemo } from 'react';

type RevealState = {
  /** El contenido ya está a la vista (aunque la transición siga en marcha). */
  isVisible: boolean;
  /** La transición terminó del todo: nada tapa la pantalla. */
  hasEntered: boolean;
};

/**
 * Estado de descubrimiento de la página.
 *
 * Son dos señales y no una porque ocurren en momentos distintos:
 *
 * - `isVisible` se activa con la pantalla ya tapada por la malla de píxeles, que
 *   es cuando hay que montar el contenido sin que se vea el cambio.
 * - `hasEntered` espera a que la malla se haya retirado. Las animaciones de
 *   entrada tienen que arrancar aquí: con `isVisible` se ejecutarían detrás de la
 *   cortina y el usuario no vería ni el revuelto del titular ni el estroboscopio.
 */
const RevealContext = createContext<RevealState>({ isVisible: false, hasEntered: false });

export function RevealProvider({
  isVisible,
  hasEntered,
  children,
}: RevealState & { children: React.ReactNode }) {
  const value = useMemo(() => ({ isVisible, hasEntered }), [isVisible, hasEntered]);
  return <RevealContext.Provider value={value}>{children}</RevealContext.Provider>;
}

/** El contenido está a la vista. Para montar, no para animar. */
export function useIsRevealed(): boolean {
  return useContext(RevealContext).isVisible;
}

/** La transición acabó. Para disparar animaciones de entrada. */
export function useHasEntered(): boolean {
  return useContext(RevealContext).hasEntered;
}
