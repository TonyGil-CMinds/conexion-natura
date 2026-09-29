import Image from 'next/image';
import { PixelMarquee } from '@/components/ui/PixelMarquee';
import { QUITO } from '@/config/quito';
import type { Dictionary } from '@/i18n';
import { Reveal } from './Reveal';
import styles from './QuitoAbout.module.css';

type Props = { copy: Dictionary['quito']['about'] };

/**
 * «Acerca de»: qué es esta etapa y por qué Quito.
 *
 * Vive **dentro** de la portada y no en una ruta propia: es un párrafo, no una
 * página, y sacarlo fuera obligaría a navegar para leer tres frases. Por eso el
 * enlace de la barra es un ancla.
 *
 * Cierra con la marquesina, que es la misma pieza del retiro: los cuadros y el
 * rótulo cambian, la mecánica no.
 */
export function QuitoAbout({ copy }: Props) {
  return (
    <section id="acerca-de" className={styles.root} aria-labelledby="quito-about-title">
      <div className={styles.inner}>
        <Reveal>
          <p className={styles.kicker}>
            {copy.kicker}
            <Image src="/tanusas/asset-divider-yellow.svg" alt="" width={40} height={30} aria-hidden />
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 id="quito-about-title" className={styles.title}>
            {copy.title}
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className={styles.body}>{copy.body}</p>
        </Reveal>
      </div>

      <div className={styles.marquee}>
        <PixelMarquee
          tiles={QUITO.marquee}
          text={copy.marquee}
          pauseLabel={copy.pauseMarquee}
          playLabel={copy.playMarquee}
        />
      </div>
    </section>
  );
}
