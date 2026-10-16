type Props = {
  /** Cuántas celdas caben a lo ancho. Tiene que ser 4n + 1 (ver abajo). */
  columns: number;
  className?: string;
};

/**
 * La banda de píxeles del hero: dos zigzags que se cruzan y dibujan una cadena
 * de rombos.
 *
 * Va en código y no como archivo porque el número de columnas cambia con el
 * ancho —33 en escritorio, 17 en móvil, como en el diseño— y la celda tiene que
 * salir cuadrada en los dos. El `viewBox` mide una unidad por celda, así que el
 * SVG escala con el ancho y el alto lo sigue.
 *
 * Las columnas van de cuatro en cuatro más una para que la cadena empiece y
 * acabe en el mismo vértice: queda simétrica sobre el centro de la pantalla.
 *
 * Un solo trazado y no un `rect` por celda: es un adorno, y así son dos nodos.
 */
export function PixelChain({ columns, className }: Props) {
  let path = '';
  for (let column = 0; column < columns; column++) {
    // Vértices arriba y abajo, cruce en medio y los flancos entre los dos.
    const phase = column % 4;
    const rows = phase === 0 ? [0, 4] : phase === 2 ? [2] : [1, 3];
    for (const row of rows) path += `M${column} ${row}h1v1h-1z`;
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${columns} 5`}
      shapeRendering="crispEdges"
      aria-hidden
      focusable="false"
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
}
