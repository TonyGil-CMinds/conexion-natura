import type { Metadata } from 'next';
import { PageFrame } from '@/components/layout/PageFrame';
import { Registration } from '@/features/registration';
import { SITE } from '@/config/site';

export const metadata: Metadata = { title: `Registro — ${SITE.name}`, description: 'Confirma tu asistencia a Conexión500.' };

export default function RegistrationPage() {
  return <PageFrame hasColumnRules={false} hideFooter><Registration /></PageFrame>;
}
