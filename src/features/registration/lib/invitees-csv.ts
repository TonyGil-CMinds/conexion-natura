/**
 * Lectura del CSV de la lista de preregistro.
 *
 * Vive aquí y no dentro del script para poder comprobarla sin tocar la base: lo
 * que convierte un archivo del equipo en filas es justo donde se cuelan los
 * errores silenciosos —una columna cambiada de sitio, un salto de línea dentro
 * de un campo— y eso hay que poder mirarlo aparte.
 */

/** Una fila de la lista, ya limpia. */
export type InviteeRow = {
  email: string;
  fullName: string;
  role: string;
  organization: string;
  sector: string;
  topic: string;
};

/**
 * Parte un CSV respetando comillas y saltos de línea dentro de un campo.
 *
 * Hace falta de verdad: en la lista que llegó, el cargo de una persona es
 * `"Secretario Técnico\n\n"` —con el salto dentro de las comillas—, y partir por
 * líneas habría desplazado esa fila entera una columna.
 */
export function parseCsv(csv: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = '';
  let entrecomillado = false;

  for (let i = 0; i < csv.length; i++) {
    const c = csv[i]!;
    if (entrecomillado) {
      // Dos comillas seguidas dentro de un campo son una comilla literal.
      if (c === '"' && csv[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') entrecomillado = false;
      else campo += c;
      continue;
    }
    if (c === '"') entrecomillado = true;
    else if (c === ',') {
      fila.push(campo);
      campo = '';
    } else if (c === '\n') {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = '';
    } else if (c !== '\r') campo += c;
  }
  if (campo || fila.length) {
    fila.push(campo);
    filas.push(fila);
  }

  // Las líneas en blanco del final de archivo no son filas.
  return filas.filter((f) => f.some((valor) => valor.trim()));
}

/**
 * Las columnas que se buscan, cada una con los nombres que ha tenido.
 *
 * Son varios porque el archivo lo exporta una hoja del equipo y cada tanda
 * viene con otros rótulos: una traía «Apellido» aparte y «Organization» en
 * inglés, la siguiente el nombre entero en una sola columna y «Rol»,
 * «Organización» y «Correo». Reconocerlos aquí evita retocar el CSV a mano cada
 * vez, que es donde se cuelan los errores que no se ven hasta el evento.
 *
 * Solo el nombre y el correo son obligatorios: sin uno de los dos la fila no
 * identifica a nadie. Lo demás enriquece pero puede faltar.
 */
const COLUMNAS = {
  Nombre: { alias: ['nombre', 'nombres', 'nombre completo'], required: true },
  Apellido: { alias: ['apellido', 'apellidos'], required: false },
  Cargo: { alias: ['cargo', 'rol', 'puesto'], required: false },
  Organization: { alias: ['organization', 'organizacion', 'organismo', 'institucion'], required: false },
  Email: { alias: ['email', 'correo', 'correo electronico', 'e-mail'], required: true },
  Sector: { alias: ['sector'], required: false },
  Tema: { alias: ['tema'], required: false },
} as const;

type Columna = keyof typeof COLUMNAS;

/** Sin tildes, sin mayúsculas y sin espacios de sobra: los rótulos vienen sucios. */
function rotulo(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type CsvResult = {
  rows: InviteeRow[];
  /** Filas que no se pudieron usar, con el motivo y el número de línea. */
  skipped: { line: number; reason: string; raw: string }[];
};

/**
 * Convierte el CSV en filas de la lista.
 *
 * **El nombre no se parte en dos.** En el archivo de origen la columna
 * «Apellido» trae a veces dos palabras —«Andrés Delgado»— así que el corte no
 * es de fiar; se juntan las dos columnas y lo que se guarda es el nombre
 * completo, que es además lo que se compara al reconocer a alguien.
 *
 * Lo que no sirva no se inventa: se devuelve aparte, con su línea, para que
 * quien importa lo vea en vez de descubrirlo el día del evento.
 */
export function readInvitees(csv: string): CsvResult {
  const filas = parseCsv(csv);
  if (!filas.length) return { rows: [], skipped: [] };

  const cabecera = filas[0]!.map(rotulo);

  /** −1 cuando la columna no está, que para las opcionales es válido. */
  const indices = Object.fromEntries(
    (Object.keys(COLUMNAS) as Columna[]).map((clave) => [
      clave,
      cabecera.findIndex((c) => (COLUMNAS[clave].alias as readonly string[]).includes(c)),
    ]),
  ) as Record<Columna, number>;

  const faltan = (Object.keys(COLUMNAS) as Columna[]).filter(
    (c) => COLUMNAS[c].required && indices[c] < 0,
  );
  if (faltan.length) {
    throw new Error(
      `El CSV no tiene las columnas esperadas: falta ${faltan.join(', ')}. ` +
        `Se encontró: ${filas[0]!.map((c) => c.trim()).join(', ')}.`,
    );
  }
  const indice = (nombre: Columna) => indices[nombre];

  const rows: InviteeRow[] = [];
  const skipped: CsvResult['skipped'] = [];
  const vistos = new Set<string>();

  filas.slice(1).forEach((fila, i) => {
    const linea = i + 2;
    /** Una columna ausente vale cadena vacía, no `undefined`: se concatena. */
    const campo = (nombre: Columna) => {
      const i = indice(nombre);
      return i < 0 ? '' : (fila[i] ?? '').replace(/\s+/g, ' ').trim();
    };

    const email = campo('Email').toLowerCase();
    const fullName = `${campo('Nombre')} ${campo('Apellido')}`.replace(/\s+/g, ' ').trim();

    if (!EMAIL.test(email)) {
      skipped.push({ line: linea, reason: 'correo vacío o mal formado', raw: fila.join(',') });
      return;
    }
    if (!fullName) {
      skipped.push({ line: linea, reason: 'sin nombre', raw: fila.join(',') });
      return;
    }
    if (vistos.has(email)) {
      skipped.push({ line: linea, reason: `correo repetido (${email})`, raw: fila.join(',') });
      return;
    }
    vistos.add(email);

    rows.push({
      email,
      fullName,
      role: campo('Cargo'),
      organization: campo('Organization'),
      sector: campo('Sector'),
      topic: campo('Tema'),
    });
  });

  return { rows, skipped };
}
