import { readFileSync } from 'node:fs';
import { findInviteeMatch, nameSimilarity, orgSimilarity } from '../src/features/registration/lib/invitee-match';

function filas(csv: string): string[][] {
  const out: string[][] = [];
  let fila: string[] = [], campo = '', dentro = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i]!;
    if (dentro) {
      if (c === '"' && csv[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') dentro = false;
      else campo += c;
    } else if (c === '"') dentro = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n') { fila.push(campo); out.push(fila); fila = []; campo = ''; }
    else if (c !== '\r') campo += c;
  }
  if (campo || fila.length) { fila.push(campo); out.push(fila); }
  return out.filter((f) => f.some((x) => x.trim()));
}

const [, ...datos] = filas(readFileSync(process.argv[2]!, 'utf8'));
const lista = datos.map((f, i) => ({
  id: 'i' + i,
  email: (f[4] || '').trim().toLowerCase(),
  fullName: `${(f[0] || '').trim()} ${(f[1] || '').trim()}`.trim(),
  organization: (f[3] || '').trim(),
}));
console.log('lista: ' + lista.length + ' personas\n');

const casos: [string, { email: string; name: string; surname: string; organization: string }, string][] = [
  ['mismo nombre y org, correo personal',
    { email: 'eli.bravo@gmail.com', name: 'Elizabeth', surname: 'Bravo', organization: 'Acción Ecológica' }, 'Elizabeth Bravo'],
  ['nombre partido distinto (el caso del CSV)',
    { email: 'juan@otro.com', name: 'Juan Andrés', surname: 'Delgado', organization: 'FIAS' }, 'Juan Andrés Delgado'],
  ['sigla en vez del nombre largo',
    { email: 'jose@gmail.com', name: 'José Antonio', surname: 'Hidalgo', organization: 'AEBE' }, 'José Antonio Hidalgo'],
  ['sin tildes ni mayúsculas',
    { email: 'x@y.com', name: 'yaku', surname: 'perez guartambel', organization: 'movimiento pachakutik' }, 'Yaku Pérez Guartambel'],
  ['con una errata',
    { email: 'x@y.com', name: 'Tarsisio', surname: 'Granizo', organization: 'WWF Ecuador' }, 'Tarsicio Granizo'],
  ['MISMO NOMBRE, OTRA organización → no debe reconocer',
    { email: 'x@y.com', name: 'Elizabeth', surname: 'Bravo', organization: 'Banco Pichincha' }, null as any],
  ['desconocido total → no debe reconocer',
    { email: 'x@y.com', name: 'Pedro', surname: 'Martínez', organization: 'Acme S.A.' }, null as any],
  ['solo el apellido → no debe reconocer',
    { email: 'x@y.com', name: '', surname: 'Gualinga', organization: 'Pueblo Kichwa de Sarayaku' }, null as any],
  ['dos Gualinga en la lista: debe elegir la correcta',
    { email: 'x@y.com', name: 'Patricia', surname: 'Gualinga', organization: 'Pueblo Kichwa de Sarayaku' }, 'Patricia Gualinga'],
  ['dos de Acción Ecológica: la otra',
    { email: 'x@y.com', name: 'Ivonne', surname: 'Ramos', organization: 'Acción Ecológica' }, 'Ivonne Ramos'],
];

let fallos = 0;
for (const [titulo, candidato, esperado] of casos) {
  const m = findInviteeMatch(candidato, lista);
  const obtenido = m ? m.invitee.fullName : null;
  const bien = obtenido === esperado;
  if (!bien) fallos++;
  console.log((bien ? '  ok   ' : '  FALLA') + ' ' + titulo);
  console.log('         esperado: ' + (esperado ?? '(ninguno)') + '  |  obtenido: ' + (obtenido ?? '(ninguno)') +
    (m ? '  [nombre ' + m.nameScore.toFixed(2) + ', org ' + m.orgScore.toFixed(2) + ']' : ''));
}

// Y lo más importante: cada persona de la lista debe reconocerse a sí misma.
let propios = 0;
for (const p of lista) {
  const partes = p.fullName.split(' ');
  const m = findInviteeMatch(
    { email: 'nuevo@example.com', name: partes[0]!, surname: partes.slice(1).join(' '), organization: p.organization },
    lista,
  );
  if (m?.invitee.id === p.id) propios++;
  else console.log('  no se reconoce a sí mismo: ' + p.fullName + ' (' + p.organization + ') -> ' + (m?.invitee.fullName ?? 'nadie'));
}
console.log('\nse reconocen a sí mismos: ' + propios + '/' + lista.length);
console.log(fallos ? '\n' + fallos + ' casos fallan' : '\ntodos los casos pasan');
