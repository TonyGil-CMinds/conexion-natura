/**
 * Compartir un enlace: la hoja del sistema si la hay, y si no, al portapapeles.
 *
 * Es el hermano de `shareBadge`, que comparte una imagen. Se separan porque lo
 * que se comparte cambia lo que hay que hacer: una imagen es un archivo y
 * necesita `canShare`, y un enlace no.
 *
 * **Cancelar no es fallar.** La hoja de compartir lanza al cerrarla, y tratar
 * eso como un error llevaba a copiar al portapapeles algo que la persona acababa
 * de decidir no compartir. Por eso se distingue y quien llama no dice nada.
 */
export type ShareLinkResult =
  /** Salió por la hoja del sistema. */
  | 'shared'
  /** Sin hoja de compartir: el enlace quedó en el portapapeles. */
  | 'copied'
  /** La persona cerró la hoja. No hay nada que contar. */
  | 'cancelled'
  /** Ni hoja ni portapapeles. */
  | 'failed';

export async function shareLink(
  url: string,
  copy: { title: string; text: string },
): Promise<ShareLinkResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: copy.title, text: copy.text, url });
      return 'shared';
    } catch (error) {
      /**
       * `AbortError` es cerrar la hoja; cualquier otra cosa es que no se pudo, y
       * entonces todavía queda el portapapeles.
       */
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
