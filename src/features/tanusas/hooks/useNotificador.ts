'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const RECUERDO = 'tanusas-avisos';

/**
 * El sonido de aviso, sintetizado en el momento.
 *
 * Dos notas cortas, como las de una sala de reunión. Se generan con un
 * oscilador en vez de servir un archivo porque pesan cero, no hay que esperar a
 * descargarlas y no se pueden quedar a medias con mala cobertura —que en una
 * playa de Manta es lo normal—.
 */
function tono(ctx: AudioContext, frecuencia: number, empieza: number, dura: number) {
  const osc = ctx.createOscillator();
  const vol = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frecuencia;

  // Entrada y salida suaves: un tono que arranca y corta en seco chasquea.
  vol.gain.setValueAtTime(0, empieza);
  vol.gain.linearRampToValueAtTime(0.18, empieza + 0.02);
  vol.gain.exponentialRampToValueAtTime(0.0001, empieza + dura);

  osc.connect(vol).connect(ctx.destination);
  osc.start(empieza);
  osc.stop(empieza + dura + 0.02);
}

/**
 * Los avisos del taller: un sonido y, si se da permiso, una notificación.
 *
 * **Nada de esto puede encenderse solo.** El navegador exige que el audio
 * arranque de un gesto de la persona —si no, lo bloquea— y las notificaciones
 * piden permiso explícito. Por eso hay un interruptor: al pulsarlo se crea el
 * `AudioContext` y se pide el permiso, los dos dentro del mismo gesto.
 *
 * La elección se recuerda, pero el `AudioContext` no sobrevive a una recarga,
 * así que al volver con los avisos encendidos se vuelve a crear al primer toque
 * en la página. Mientras tanto la notificación sí funciona, que no depende de
 * ningún gesto una vez concedido el permiso.
 */
export function useNotificador() {
  const [activos, setActivos] = useState(false);
  const [permiso, setPermiso] = useState<NotificationPermission | 'nosoportado'>('default');
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      setActivos(window.localStorage.getItem(RECUERDO) === 'si');
    } catch {
      // Navegación privada o almacenamiento bloqueado: se queda apagado.
    }
    setPermiso(typeof Notification === 'undefined' ? 'nosoportado' : Notification.permission);
  }, []);

  /** Crea o despierta el audio. Tiene que correr dentro de un gesto. */
  const despertarAudio = useCallback(async () => {
    try {
      audio.current ??= new AudioContext();
      if (audio.current.state === 'suspended') await audio.current.resume();
      return true;
    } catch {
      return false;
    }
  }, []);

  const alternar = useCallback(async () => {
    const siguiente = !activos;
    setActivos(siguiente);
    try {
      window.localStorage.setItem(RECUERDO, siguiente ? 'si' : 'no');
    } catch {
      // Sin almacenamiento, la elección dura lo que la pestaña.
    }

    if (!siguiente) return;

    await despertarAudio();
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      setPermiso(await Notification.requestPermission());
    }
  }, [activos, despertarAudio]);

  /** Suena y, si hay permiso, avisa también fuera de la pestaña. */
  const avisar = useCallback(
    (titulo: string, cuerpo: string) => {
      if (!activos) return;

      const ctx = audio.current;
      if (ctx && ctx.state === 'running') {
        const t = ctx.currentTime;
        tono(ctx, 880, t, 0.16);
        tono(ctx, 1320, t + 0.18, 0.22);
      }

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification(titulo, { body: cuerpo, tag: 'tanusas-agenda', icon: '/favicon.ico' });
        } catch {
          // Algunos navegadores solo la permiten desde un service worker.
        }
      }
    },
    [activos],
  );

  return { activos, permiso, alternar, avisar, despertarAudio };
}
