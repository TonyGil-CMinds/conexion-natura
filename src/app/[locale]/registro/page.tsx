import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { Registration } from '@/features/registration';
import { getDictionary, isLocale } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = getDictionary(locale).meta.registration;
  return { title, description };
}

export default async function RegistrationPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <PageFrame hasColumnRules={false} hideFooter locale={locale}>
      <Registration copy={t.registration} subtitle={t.hero.subtitle} />
    </PageFrame>
  );
}
