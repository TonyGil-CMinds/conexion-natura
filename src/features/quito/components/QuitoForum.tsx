import Image from 'next/image';
import Link from 'next/link';
import { QUITO } from '@/config/quito';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { PixelCurtain } from './PixelCurtain';
import { Reveal } from './Reveal';
import styles from './QuitoForum.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['quito']['forum'];
};

/**
 * «Después del GET Forum»: el texto a la izquierda y las tres imágenes cayendo
 * en escalera a la derecha.
 *
 * Cada imagen entra con su cortina de píxeles, que se abre al bajar y se cierra
 * al subir. Las semillas van fijadas y distintas entre sí: con la misma, las
 * tres se deshacían con el mismo dibujo y se leía como un error.
 */
export function QuitoForum({ locale, copy }: Props) {
  return (
    <section className={styles.root} aria-labelledby="quito-forum-title">
      <div className={styles.text}>
        <Reveal>
          <p className={styles.kicker}>{copy.kicker}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 id="quito-forum-title" className={styles.title}>
            {copy.title}
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className={styles.body}>{copy.body}</p>
        </Reveal>

        <Reveal delay={0.24}>
          <Link href={localePath(locale, `${QUITO.root}/agenda`)} className={styles.cta}>
            {copy.ctaLabel}
          </Link>
        </Reveal>
      </div>

      <ul className={styles.media}>
        {QUITO.forum.map((item, index) => (
          <li key={item.key} className={styles.item} data-side={item.side}>
            <figure className={styles.figure}>
              <PixelCurtain seed={917 + index * 331}>
                <Image
                  src={item.src}
                  alt=""
                  width={item.width}
                  height={item.height}
                  className={styles.image}
                />
              </PixelCurtain>
              <figcaption className={styles.caption}>
                {copy.captions[item.key as keyof typeof copy.captions]}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
