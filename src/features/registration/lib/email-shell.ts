/**
 * Lo que comparten los correos cuyo HTML vive en el repositorio.
 *
 * Son la misma campaña: el mismo hero, el mismo pie, la misma paleta. Está
 * aquí y no copiado en cada uno para que cambiar el logotipo del pie sea un
 * sitio y no tres, y para que ninguno se quede con una versión vieja.
 *
 * **Los colores están muestreados de los propios archivos**, no copiados a ojo
 * de una maqueta: el cuerpo del correo tiene que continuar el hero sin junta
 * visible, y para eso el fondo tiene que ser exactamente el mismo.
 */

/** De dónde cuelgan las imágenes. Las del hero siguen donde las dejó el diseño. */
export const IMG = {
  heroEs: 'https://mcusercontent.com/73a5afa0f163735b559a0e740/images/6941e5d8-f063-de49-763e-c61a3b834a76.png',
  heroEn: 'https://mcusercontent.com/73a5afa0f163735b559a0e740/images/777bca92-190b-55ab-aa46-339a59264efa.png',
  divider: 'https://mcusercontent.com/73a5afa0f163735b559a0e740/images/95218239-eb88-8cd5-afda-04d6005a04fc.png',
  footer: 'https://mcusercontent.com/73a5afa0f163735b559a0e740/images/e880242d-1f40-e147-81b3-cd5f698ea08e.png',
} as const;

export const COLOR = {
  fondo: '#151d17',
  crema: '#f9ffe1',
  lima: '#d0ff00',
  tinta: '#151d17',
} as const;

/**
 * Arial y no la tipografía del sitio: en un correo no se pueden cargar fuentes
 * remotas con garantías, así que lo que no sea una imagen va con una que esté
 * en todas las máquinas.
 */
export const FUENTE = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

export type EmailLocale = 'es' | 'en';

/**
 * Escapa lo que viene de fuera. El nombre lo escribió una persona en un
 * formulario: un `&` suelto rompe el HTML y un `<` abre la puerta a algo peor.
 */
export function esc(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
