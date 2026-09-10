import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { LegalDocument } from '@/components/sections/LegalDocument';
import { getDictionary, isLocale } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = getDictionary(locale).meta.terms;
  return { title, description };
}

/** Términos y condiciones. Misma forma que el aviso de privacidad. */
export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <PageFrame hasColumnRules={false} locale={locale}>
      <LegalDocument locale={locale} copy={t.legal.terms} common={t.legal.common} />
    </PageFrame>
  );
}
