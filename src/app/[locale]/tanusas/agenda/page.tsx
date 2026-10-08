import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AgendaApp } from '@/features/tanusas-agenda';
import { getDictionary, isLocale } from '@/i18n';
import { OG_IMAGES, socialMeta } from '@/config/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const { title, description } = t.tanusas.agendaApp;
  return {
    title: `${title} · Tanusas`, description,
    alternates: { canonical: `/${locale}/tanusas/agenda`, languages: { es: '/es/tanusas/agenda', en: '/en/tanusas/agenda' } },
    ...socialMeta({ title: `${title} · Tanusas 2026`, description, locale, siteName: t.meta.siteName, image: OG_IMAGES.tanusas }),
  };
}

export default async function TanusasAgendaRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  return <AgendaApp locale={locale} copy={t.tanusas.agendaApp} agenda={t.tanusas.agenda} header={t.header} />;
}
