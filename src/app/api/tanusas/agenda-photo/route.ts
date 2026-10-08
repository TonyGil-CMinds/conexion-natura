import { NextResponse } from 'next/server';
import { AGENDA_PHOTO_SCENES, type AgendaPhotoScene } from '@/config/tanusas-photos';

export async function GET(request: Request) {
  const scene = new URL(request.url).searchParams.get('scene') ?? 'coast';
  if (!Object.hasOwn(AGENDA_PHOTO_SCENES, scene)) return NextResponse.json({ error: 'Invalid scene' }, { status: 400 });
  const fallback = () => NextResponse.json({ photo: null }, { headers: { 'Cache-Control': 'no-store' } });
  const key = process.env.PEXELS_API_KEY;
  if (!key) return fallback();

  try {
    const params = new URLSearchParams({ query: AGENDA_PHOTO_SCENES[scene as AgendaPhotoScene].query, orientation: 'landscape', per_page: '1' });
    const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: { Authorization: key }, next: { revalidate: 86400 }, signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return fallback();
    const data = await response.json();
    const photo = data?.photos?.[0];
    if (typeof photo?.src?.landscape !== 'string' || typeof photo?.url !== 'string' || typeof photo?.photographer !== 'string') return fallback();
    const src = new URL(photo.src.landscape);
    const url = new URL(photo.url);
    if (src.protocol !== 'https:' || src.hostname !== 'images.pexels.com' || url.protocol !== 'https:' || url.hostname !== 'www.pexels.com') return fallback();
    return NextResponse.json({ photo: { src: src.href, photographer: photo.photographer, url: url.href } }, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400' },
    });
  } catch {
    return fallback();
  }
}
