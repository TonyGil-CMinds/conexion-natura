'use client';

import { useCallback, useEffect, useState } from 'react';
import { PixelReveal } from '@/features/transitions/pixel-reveal';
import { RevealProvider } from '../context/reveal';
import { Loader } from './Loader';
import styles from './LoaderGate.module.css';

type Props = {
  children: React.ReactNode;
  /** Assets de la página que deben estar listos antes de revelarla. */
  preload?: readonly string[];
};

/** Marca de "ya se vio", en la sesión de la pestaña. */
const PLAYED_KEY = 'c500-loader-played';
/** Atributo en <html>, puesto por el script en línea antes del primer pintado. */
const PLAYED_ATTR = 'data-loader-played';
/**
 * Mientras está puesto, el estilo en línea del layout esconde la cabecera: vive
 * fuera de esta puerta y, sin esto, asomaba sobre el loader en los primeros
 * cuadros, antes de que se aplicaran las hojas de los módulos.
 */
const PENDING_ATTR = 'data-loader-pending';

/**
 * Fases: `loading` → `covering` → `revealing` → `done`.
 *
 * `covering` y `revealing` existen por separado porque el cambio de loader a
 * página tiene que ocurrir con la pantalla tapada. Si se desmontara el loader al
 * llegar a 100 se vería el salto por los huecos de la malla.
 */
type Phase = 'loading' | 'covering' | 'revealing' | 'done';

export function LoaderGate({ children, preload }: Props) {
  const [phase, setPhase] = useState<Phase>('loading');

  /**
   * El loader se ve una vez por pestaña. `sessionStorage` y no `localStorage`: al
   * cerrar la pestaña se olvida, que es el comportamiento pedido.
   *
   * La fase arranca siempre en `loading` para que el árbol coincida con el del
   * servidor; quien evita el parpadeo es el CSS, que oculta el loader y descubre el
   * contenido en cuanto <html> lleva el atributo. Este efecto solo pone al día el
   * estado de React.
   */
  useEffect(() => {
    if (document.documentElement.hasAttribute(PLAYED_ATTR)) {
      setPhase('done');
      // Por si el script en línea no llegó a leer el almacenamiento: la cabecera
      // no debe quedarse escondida cuando no hay loader que la tape.
      document.documentElement.removeAttribute(PENDING_ATTR);
    }
  }, []);

  const handleLoaded = useCallback(() => setPhase('covering'), []);
  const handleCovered = useCallback(() => {
    setPhase('revealing');
    // La malla ya tapa la pantalla: la cabecera puede volver sin que se vea
    // aparecer, y así está en su sitio cuando la malla se retire.
    document.documentElement.removeAttribute(PENDING_ATTR);
  }, []);
  const handleRevealed = useCallback(() => {
    setPhase('done');
    document.documentElement.setAttribute(PLAYED_ATTR, '1');
    // Puede fallar en modo privado o con el almacenamiento bloqueado; no pasa nada,
    // solo significa que el loader se volverá a ver.
    try {
      sessionStorage.setItem(PLAYED_KEY, '1');
    } catch {}
  }, []);

  const isLoaderMounted = phase === 'loading' || phase === 'covering';
  const isContentVisible = phase === 'revealing' || phase === 'done';

  return (
    <>
      <div
        className={styles.content}
        data-visible={isContentVisible || undefined}
        aria-hidden={!isContentVisible}
        inert={!isContentVisible}
      >
        <RevealProvider isVisible={isContentVisible} hasEntered={phase === 'done'}>
          {children}
        </RevealProvider>
      </div>

      {isLoaderMounted && <Loader preload={preload} onComplete={handleLoaded} />}

      {phase !== 'done' && (
        <PixelReveal
          isActive={phase !== 'loading'}
          onCovered={handleCovered}
          onComplete={handleRevealed}
        />
      )}
    </>
  );
}
