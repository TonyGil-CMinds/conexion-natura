import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { LegalDocument } from '@/components/sections/LegalDocument';
import { getDictionary, isLocale } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = getDictionary(locale).meta.privacy;
  return { title, description };
}

/**
 * Aviso de privacidad.
 *
 * Sin filetes interiores: el documento es una columna de lectura y los dos
 * verticales del centro la cruzarían por la mitad, igual que en la agenda.
 */
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <PageFrame hasColumnRules={false} locale={locale}>
      <LegalDocument locale={locale} copy={t.legal.privacy} common={t.legal.common} />
    </PageFrame>
  );
}
