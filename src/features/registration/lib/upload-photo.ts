/**
 * Sube el retrato a R2 desde el navegador.
 *
 * Dos pasos: el servidor firma y el navegador escribe. El archivo no pasa por el
 * servidor, así que su tamaño no choca con el límite de cuerpo de las funciones.
 *
 * Vive aparte del componente porque no toca la interfaz: solo mueve bytes.
 */

type SignedUpload = { uploadUrl: string; key: string; url: string };

export async function uploadPhoto(file: Blob): Promise<string> {
  const signed = await fetch('/api/uploads/photo', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });

  if (!signed.ok) {
    const { error } = (await signed.json().catch(() => ({}))) as { error?: string };
    throw new Error(error ?? 'No se pudo preparar la subida de la imagen.');
  }

  const { uploadUrl, url } = (await signed.json()) as SignedUpload;

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    // El tipo tiene que coincidir con el de la firma: si no, R2 la rechaza.
    headers: { 'content-type': file.type },
    body: file,
  });

  if (!put.ok) {
    throw new Error('No se pudo subir la imagen. Revisa tu conexión e inténtalo de nuevo.');
  }

  return url;
}
