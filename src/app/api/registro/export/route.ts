import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const headers = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };
const digest = (value: string) => createHash('sha256').update(value).digest();

/** Read-only export. This key never grants registration or approval access. */
export async function GET(request: Request) {
  const secret = process.env.CEIBA_EXPORT_TOKEN;
  if (!secret) {
    return NextResponse.json({ error: 'Export not configured.' }, { status: 503, headers });
  }
  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token || !timingSafeEqual(digest(token), digest(secret))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401, headers });
  }

  try {
    const attendees = await prisma.attendee.findMany({
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: {
        id: true, name: true, surname: true, email: true,
        organization: true, role: true, linkedin: true,
        status: true, events: true, bringsGuest: true, invitedById: true,
        createdAt: true, updatedAt: true, confirmationSentAt: true,
      },
    });
    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      total: attendees.length,
      attendees,
    }, { headers });
  } catch {
    console.error('[api/registro/export] Export failed.');
    return NextResponse.json({ error: 'Export unavailable.' }, { status: 500, headers });
  }
}
