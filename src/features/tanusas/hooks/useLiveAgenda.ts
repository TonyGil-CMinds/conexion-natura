'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  momentosOrdenados,
  type TanusasMomentoConFecha,
  type TanusasDayKey,
} from '@/config/tanusas-schedule';

/** Cuánto antes se avisa de que empieza algo. */
export const AVISO_MINUTOS = 5;

/** Cada cuánto se mira el reloj. */
const LATIDO_MS = 10_000;

export type EstadoDirecto =
  /** El taller todavía no ha empezado. */
  | 'antes'
  /** Hay un momento en curso. */
  | 'enCurso'
  /** Entre dos momentos: ha terminado uno y el siguiente no ha empezado. */
  | 'entre'
  /** Se acabó. */
  | 'despues';

export type Directo = {
  estado: EstadoDirecto;
  /** Lo que está pasando ahora, si hay algo. */
  actual: TanusasMomentoConFecha | null;
  /** Lo siguiente que va a pasar, si queda algo. */
  siguiente: TanusasMomentoConFecha | null;
  /** Minutos que faltan para que empiece lo siguiente. */
  faltan: number | null;
  /** Qué parte del momento en curso ha pasado ya, de 0 a 1. */
  avance: number;
  /** El día del programa que conviene enseñar abierto. */
  diaVisible: TanusasDayKey;
  /** Si estamos dentro de los días del taller. */
  enFechas: boolean;
};

export function calcular(ahora: Date, momentos: TanusasMomentoConFecha[]): Directo {
  const primero = momentos[0]!;
  const ultimo = momentos[momentos.length - 1]!;

  const actual = momentos.find((m) => ahora >= m.desde && ahora < m.hasta) ?? null;
  const siguiente = momentos.find((m) => m.desde > ahora) ?? null;

  const estado: EstadoDirecto =
    ahora < primero.desde ? 'antes' : ahora >= ultimo.hasta ? 'despues' : actual ? 'enCurso' : 'entre';

  const faltan = siguiente ? Math.max(0, Math.ceil((siguiente.desde.getTime() - ahora.getTime()) / 60_000)) : null;

  const avance = actual
    ? Math.min(1, Math.max(0, (ahora.getTime() - actual.desde.getTime()) / (actual.hasta.getTime() - actual.desde.getTime())))
    : 0;

  /**
   * Qué día se abre.
   *
   * El del momento en curso; si no hay ninguno, el del siguiente —lo que viene
   * importa más que lo que acaba de pasar—; y si ya se acabó todo, el último.
   * Antes de empezar, el primero.
   */
  const diaVisible = (actual ?? siguiente ?? ultimo).day;

  return { estado, actual, siguiente, faltan, avance, diaVisible, enFechas: estado !== 'antes' && estado !== 'despues' };
}

/**
 * Qué está pasando ahora mismo en el taller.
 *
 * Mira el reloj cada diez segundos. No es un `setInterval` de un segundo porque
 * nada de lo que se enseña cambia tan rápido: la cuenta atrás va en minutos y
 * la barra de avance se mueve despacio. Diez segundos basta para que el cambio
 * de un momento al siguiente se note al instante.
 *
 * **El primer cálculo se hace en un efecto, no al montar.** En el servidor no
 * hay «ahora» que valga —el HTML se genera una vez y se sirve a todo el mundo—,
 * así que pintar el directo en el primer render daría un desajuste de
 * hidratación y, peor, enseñaría una hora congelada a quien llegue después.
 */
export function useLiveAgenda(): Directo | null {
  const momentos = useMemo(() => momentosOrdenados(), []);
  const [directo, setDirecto] = useState<Directo | null>(null);

  useEffect(() => {
    const latir = () => setDirecto(calcular(new Date(), momentos));
    latir();
    const id = window.setInterval(latir, LATIDO_MS);

    /**
     * Al volver a la pestaña se recalcula sin esperar al siguiente latido: el
     * navegador frena los temporizadores en pestañas de fondo, así que quien
     * vuelve después de un rato se encontraría la agenda parada en el pasado.
     */
    const alVolver = () => {
      if (document.visibilityState === 'visible') latir();
    };
    document.addEventListener('visibilitychange', alVolver);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, [momentos]);

  return directo;
}

/**
 * Avisa cuando falten `AVISO_MINUTOS` para que empiece algo.
 *
 * Devuelve la clave del momento del que ya se avisó, para que quien pinte
 * pueda enseñar el aviso, y llama a `alAvisar` **una sola vez por momento**:
 * el latido ocurre cada diez segundos y sin esa memoria sonaría seis veces por
 * minuto durante los cinco minutos del aviso.
 */
export function useAvisoPrevio(directo: Directo | null, alAvisar: (m: TanusasMomentoConFecha) => void) {
  const avisados = useRef(new Set<string>());
  const callback = useRef(alAvisar);
  callback.current = alAvisar;

  useEffect(() => {
    const siguiente = directo?.siguiente;
    const faltan = directo?.faltan;
    if (!siguiente || faltan === null || faltan === undefined) return;
    if (faltan > AVISO_MINUTOS) return;
    if (avisados.current.has(siguiente.key)) return;

    avisados.current.add(siguiente.key);
    callback.current(siguiente);
  }, [directo]);
}
