/**
 * El programa del taller de Tanusas, con horas de reloj.
 *
 * Vive aquí y no en el diccionario porque **una hora no se traduce**: lo que
 * cambia con el idioma es cómo se llama cada momento, y eso sigue en la copia.
 * Cada entrada trae una `key` que entra en el diccionario, igual que el resto
 * de la configuración del sitio.
 *
 * Las horas son **de Ecuador** y se escriben como se dicen. El desfase va
 * aparte porque Ecuador continental no tiene horario de verano: son -05:00 los
 * tres días, y así `nuevaFecha` no tiene que calcular nada por fecha.
 *
 * Esto es lo que permite que la página sepa qué está pasando ahora. Antes el
 * programa decía «Amanecer» o «Tarde», que se lee bien pero no se puede
 * comparar con un reloj.
 */

/** Ecuador continental, todo el año. */
export const DESFASE_ECUADOR = '-05:00';

export type TanusasDayKey = 'jueves' | 'viernes' | 'sabado';

export const TANUSAS_DAYS = [
  { key: 'jueves', date: '2026-10-08' },
  { key: 'viernes', date: '2026-10-09' },
  { key: 'sabado', date: '2026-10-10' },
] as const satisfies readonly { key: TanusasDayKey; date: string }[];

/**
 * Un momento del programa.
 *
 * `key` es lo que busca el diccionario. `tono` dice qué clase de momento es, y
 * solo sirve para pintarlo: los bloques de trabajo pesan más que una comida, y
 * en una lista de veinticinco filas eso es lo que deja ver la forma del día.
 */
export type TanusasMoment = {
  key: string;
  day: TanusasDayKey;
  /** Hora de Ecuador, 24h. */
  start: string;
  end: string;
  tono: 'bloque' | 'pausa' | 'traslado' | 'libre';
  /** Dónde ocurre, si el sitio importa. Se traduce en el diccionario. */
  lugar?: string;
};

export const TANUSAS_SCHEDULE = [
  // Jueves 8
  { key: 'llegada', day: 'jueves', start: '18:00', end: '19:00', tono: 'traslado' },
  { key: 'caminar', day: 'jueves', start: '19:00', end: '19:15', tono: 'traslado' },
  { key: 'cenaJueves', day: 'jueves', start: '19:15', end: '20:15', tono: 'pausa' },
  { key: 'raices', day: 'jueves', start: '20:30', end: '21:30', tono: 'bloque', lugar: 'fogata' },

  // Viernes 9
  { key: 'amanecer', day: 'viernes', start: '06:00', end: '06:50', tono: 'libre' },
  { key: 'desayunoViernes', day: 'viernes', start: '07:15', end: '08:00', tono: 'pausa' },
  { key: 'trasladoSalon', day: 'viernes', start: '08:00', end: '08:20', tono: 'traslado' },
  { key: 'bloque1', day: 'viernes', start: '08:20', end: '09:20', tono: 'bloque', lugar: 'salon' },
  { key: 'bloque2', day: 'viernes', start: '09:20', end: '10:40', tono: 'bloque', lugar: 'salon' },
  { key: 'cafe', day: 'viernes', start: '10:40', end: '11:00', tono: 'pausa' },
  { key: 'bloque3', day: 'viernes', start: '11:00', end: '12:00', tono: 'bloque', lugar: 'salon' },
  { key: 'bloque4', day: 'viernes', start: '12:00', end: '13:00', tono: 'bloque', lugar: 'salon' },
  { key: 'comida', day: 'viernes', start: '13:00', end: '14:00', tono: 'pausa' },
  { key: 'libreViernes', day: 'viernes', start: '14:00', end: '15:00', tono: 'libre' },
  { key: 'bloque5', day: 'viernes', start: '15:15', end: '17:00', tono: 'bloque', lugar: 'salon' },
  { key: 'libreTarde', day: 'viernes', start: '17:00', end: '18:00', tono: 'libre' },
  { key: 'caminata', day: 'viernes', start: '18:00', end: '19:00', tono: 'libre' },
  { key: 'cenaChef', day: 'viernes', start: '19:00', end: '22:00', tono: 'pausa' },

  // Sábado 10
  { key: 'bloque6', day: 'sabado', start: '05:30', end: '06:40', tono: 'bloque', lugar: 'playa' },
  { key: 'desayunoSabado', day: 'sabado', start: '07:30', end: '08:15', tono: 'pausa' },
  { key: 'reflexiones', day: 'sabado', start: '08:30', end: '08:50', tono: 'bloque' },
  { key: 'bloque7', day: 'sabado', start: '09:00', end: '10:30', tono: 'bloque', lugar: 'salon' },
  { key: 'bloque8', day: 'sabado', start: '10:30', end: '11:30', tono: 'bloque', lugar: 'salon' },
  { key: 'siguientes', day: 'sabado', start: '11:30', end: '11:45', tono: 'bloque' },
  { key: 'cierre', day: 'sabado', start: '11:45', end: '12:00', tono: 'bloque' },
] as const satisfies readonly TanusasMoment[];

export type TanusasMomentKey = (typeof TANUSAS_SCHEDULE)[number]['key'];

/** La fecha de un día del programa, por su clave. */
function fechaDe(day: TanusasDayKey): string {
  return TANUSAS_DAYS.find((d) => d.key === day)!.date;
}

/**
 * El instante exacto de una hora del programa.
 *
 * Se arma con el desfase escrito —`2026-10-09T08:20:00-05:00`— y no con la zona
 * de quien mira: la agenda ocurre en Ecuador, y quien la abra desde México
 * tiene que ver lo mismo que quien está en la playa.
 */
export function instante(day: TanusasDayKey, hora: string): Date {
  return new Date(`${fechaDe(day)}T${hora}:00${DESFASE_ECUADOR}`);
}

/**
 * Un momento con sus dos instantes ya resueltos.
 *
 * El tipo se escribe a mano en vez de deducirlo del array: con `as const`, a
 * las entradas que no llevan `lugar` les falta la propiedad entera, y quien
 * pinta tendría que preguntar con `in` por cada una.
 */
export type TanusasMomentoConFecha = TanusasMoment & { desde: Date; hasta: Date };

/** El programa entero como instantes, en orden. */
export function momentosOrdenados(): TanusasMomentoConFecha[] {
  return TANUSAS_SCHEDULE.map((m) => ({
    ...m,
    desde: instante(m.day, m.start),
    hasta: instante(m.day, m.end),
  })).sort((a, b) => a.desde.getTime() - b.desde.getTime());
}
