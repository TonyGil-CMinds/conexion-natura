import Image from 'next/image';
import Link from 'next/link';
import { ECUADOR } from '@/config/ecuador';
import type { Dictionary, Locale } from '@/i18n';
import shell from '@/features/registration/components/StepShell.module.css';
import styles from './EcuadorClosedScreen.module.css';

type Props = {
  copy: Dictionary['ecuador']['closed'];
  locale: Locale;
};

/**
 * Aviso de que el registro de empresas ya no admite gente.
 *
 * Es un **componente de servidor**: sin formulario no hay estado que llevar al
 * navegador, y así la ruta cerrada no arrastra el flujo entero —que es de
 * cliente— solo para enseñar un párrafo.
 *
 * Por eso también la entrada va en CSS y no en Framer Motion: la dispara la
 * carga de la página, y la regla de la casa es que eso se anima en CSS. En
 * JavaScript habría que apagar el bloque en un efecto, después del primer
 * pintado, y se vería un cuadro con el aviso ya puesto antes de que arranque.
 *
 * Reutiliza el armazón de los pasos para que quien llegue desde un enlace viejo
 * reconozca la pantalla en la que iba a entrar, en vez de aterrizar en algo que
 * parece otro sitio.
 */
export function EcuadorClosedScreen({ copy, locale }: Props) {
  return (
    <section className={`${shell.root} ${styles.root}`}>
      <div className={shell.intro}>
        <div className={shell.heading}>
          <h1 className={shell.headline}>
            <span>{copy.headlineLine1}</span>
            <span>{copy.headlineLine2}</span>
          </h1>
          <p>{copy.body}</p>
        </div>

        <Image
          src={ECUADOR.marquee.participation}
          alt=""
          width={150}
          height={150}
          className={shell.marquee}
          aria-hidden
        />
      </div>

      <div className={shell.panel}>
        <p className={styles.note}>{copy.note}</p>

        <div className={styles.actions}>
          {/* A la agenda y no a la portada: es lo único que sigue sirviendo a
              quien venía a registrarse. */}
          <Link href={`/${locale}/agenda`} className={styles.link}>
            {copy.agenda}
          </Link>
          <a href={`mailto:${ECUADOR.contactEmail}`} className={styles.quiet}>
            {copy.contact}
          </a>
        </div>
      </div>
    </section>
  );
}
