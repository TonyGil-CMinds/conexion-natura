import 'dotenv/config';
import assert from 'node:assert/strict';
import { GET } from '../src/app/api/registro/export/route';
import { prisma } from '../src/lib/prisma';
async function main() {
 const saved = process.env.CEIBA_EXPORT_TOKEN;
 let calls = 0;
 const original = prisma.attendee.findMany;
 prisma.attendee.findMany = (async () => { calls++; return []; }) as typeof original;
 try {
 delete process.env.CEIBA_EXPORT_TOKEN;
 assert.equal((await GET(new Request('http://localhost/api/registro/export'))).status,503);
 process.env.CEIBA_EXPORT_TOKEN = saved;
 assert.equal((await GET(new Request('http://localhost/api/registro/export'))).status,401);
 assert.equal((await GET(new Request('http://localhost/api/registro/export',{headers:{Authorization:'Bearer wrong'}}))).status,401);
 assert.equal(calls,0);
 const response = await GET(new Request('http://localhost/api/registro/export',{headers:{Authorization:`Bearer ${saved}`}}));
 assert.equal(response.status,200);
 assert.equal(response.headers.get('cache-control'),'private, no-store');
 assert.deepEqual((await response.json()).attendees,[]);
 assert.equal(calls,1);
 console.log('PASS: missing config, missing/wrong key, no unauthorized DB queries, authenticated response, no-store.');
 } finally { process.env.CEIBA_EXPORT_TOKEN=saved; prisma.attendee.findMany=original; await prisma.$disconnect(); }
}
main().catch(()=>{ console.error('Export checks failed'); process.exitCode=1; });
