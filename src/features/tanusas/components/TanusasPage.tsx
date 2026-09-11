import Image from 'next/image';
import { TANUSAS } from '@/config/tanusas';
import type { Dictionary, Locale } from '@/i18n';
import { TanusasAccordion } from './TanusasAccordion';
import { TanusasAgenda } from './TanusasAgenda';
import { TanusasExperience } from './TanusasExperience';
import { TanusasJoinCta } from './TanusasJoinCta';
import { WaterRipple } from './WaterRipple';
import styles from './Tanusas.module.css';

type Props = {
  copy: Dictionary['tanusas'];
  /** La barra propia lleva logotipo e idioma, y los dos necesitan la ruta. */
  locale: Locale;
  /** Copia de los controles de la cabecera: tema e idioma. */
  header: Dictionary['header'];
  /**
   * Copia de la pantalla de la fotografía. Viene del registro del sitio porque
   * la pantalla es la misma: el retiro reutiliza el último paso entero.
   */
  photo: Dictionary['registration']['photo'];
};

/**
 * Micropágina del retiro de Tanusas.
 *
 * Es **de servidor**: casi todo es texto largo, y solo tres piezas necesitan
 * cliente —la lámina de agua del hero, las pestañas de la agenda y el
 * formulario—. Así la invitación llega pintada en el HTML, que es lo que
 * importa cuando alguien la abre desde el correo.
 *
 * No usa `PageShell` ni los filetes de `PageFrame`: aquí no hay retícula de
 * datos que alinear, sino una columna de lectura, y las secciones se separan
 * alternando el fondo como en el documento de diseño.
 */
export function TanusasPage({ copy, locale, header, photo }: Props) {
  return (
    <TanusasExperience locale={locale} copy={copy} header={header} photoCopy={photo}>
      {/*
        El hero ocupa el viewport entero y la barra va por encima. El rótulo cruza
        de canto a canto de la retícula, y el texto se alinea a los mismos cantos:
        es esa alineación la que sostiene el bloque.
      */}
      <header className={styles.hero} data-tanusas-hero>
        <div className={styles.heroMedia}>
          <WaterRipple src={TANUSAS.media.hero.src} />
          <div className={styles.heroVeil} aria-hidden />
        </div>

        <div className={styles.heroBody}>
          <div className={styles.heroTitleGroup}>
            {/* Fecha y sede salen de `facts`, que es donde viven los datos. */}
            <p className={styles.heroDateline}>
              {copy.hero.facts[0].value} <span aria-hidden>|</span> {copy.hero.facts[1].value}
            </p>

            <h1 className={styles.heroTitle}>
              <Image
                className={styles.heroWordmark}
                src={TANUSAS.media.wordmark.src}
                alt={copy.hero.wordmarkAlt}
                width={TANUSAS.media.wordmark.width}
                height={TANUSAS.media.wordmark.height}
                /* Es el primer elemento de la página: no debe llegar tarde. */
                priority
              />
            </h1>
          </div>

          <p className={styles.heroLede}>{copy.hero.headline}</p>

          <div className={styles.heroFoot}>
            <div className={styles.heroActions}>
              <TanusasJoinCta copy={copy.hero} autoOpen />
              <p className={styles.heroNote}>{copy.hero.personal}</p>
            </div>

            <div className={styles.heroPartners}>
              {TANUSAS.media.partners.map((partner) => (
                <div key={partner.key} className={styles.heroPartner} data-partner={partner.key}>
                  <span className={styles.note}>{copy.hero.partners[partner.key]}</span>
                  <Image
                    className={styles.heroPartnerLogo}
                    src={partner.src}
                    alt=""
                    width={partner.width}
                    height={partner.height}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>


      {/* 01 · La invitación */}
      <section id="invitacion" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>
              <b>{copy.invitation.number}</b>
              {copy.invitation.kicker}
            </p>
            <h2 className={styles.title}>{copy.invitation.title}</h2>
          </div>

          <div className={styles.prose}>
            {copy.invitation.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.quote}>
            <span className={styles.quoteLabel}>{copy.invitation.questionLabel}</span>
            <p className={styles.quoteText}>{copy.invitation.question}</p>
          </div>
        </div>
      </section>

      {/* 02 · El concepto */}
      <section id="concepto" className={styles.section} data-tone="deep">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>
              <b>{copy.concept.number}</b>
              {copy.concept.kicker}
            </p>
            <h2 className={styles.title}>{copy.concept.title}</h2>
          </div>

          <div className={styles.prose}>
            {copy.concept.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.cards}>
            {copy.concept.facts.map((fact) => (
              <div key={fact.label} className={styles.card}>
                <h3 className={styles.cardTitle}>{fact.label}</h3>
                <p className={styles.cardBody}>{fact.value}</p>
              </div>
            ))}
          </div>

          <div className={styles.sectionHead}>
            <h3 className={styles.title}>{copy.concept.dimensionsTitle}</h3>
            <p className={styles.cardBody}>{copy.concept.dimensionsNote}</p>
          </div>

          <TanusasAccordion items={copy.concept.dimensions} label={copy.concept.dimensionsTitle} />
        </div>
      </section>

      {/* 03 · La arquitectura */}
      <section id="arquitectura" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>
              <b>{copy.architecture.number}</b>
              {copy.architecture.kicker}
            </p>
            <h2 className={styles.title}>{copy.architecture.title}</h2>
          </div>

          <div className={styles.prose}>
            {copy.architecture.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h3 className={styles.title}>{copy.architecture.principlesTitle}</h3>
          <div className={styles.cards}>
            {copy.architecture.principles.map((principle) => (
              <div key={principle.title} className={styles.card}>
                <h4 className={styles.cardTitle}>{principle.title}</h4>
                <p className={styles.cardBody}>{principle.body}</p>
              </div>
            ))}
          </div>

          <h3 className={styles.title}>{copy.architecture.functionsTitle}</h3>
          <TanusasAccordion
            items={copy.architecture.functions}
            label={copy.architecture.functionsTitle}
          />

          <h3 className={styles.title}>{copy.architecture.portfolioTitle}</h3>
          <TanusasAccordion
            items={copy.architecture.portfolio}
            label={copy.architecture.portfolioTitle}
          />

          <div className={styles.quote}>
            <span className={styles.quoteLabel}>{copy.architecture.thesisTitle}</span>
            {copy.architecture.thesis.map((paragraph) => (
              <p key={paragraph} className={styles.quoteText}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · Qué buscamos */}
      <section className={styles.section} data-tone="deep">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>
              <b>{copy.goals.number}</b>
              {copy.goals.kicker}
            </p>
            <h2 className={styles.title}>{copy.goals.title}</h2>
          </div>

          <div className={styles.prose}>
            <p>{copy.goals.intro}</p>
          </div>

          <div className={styles.cards}>
            {copy.goals.outcomes.map((outcome) => (
              <div key={outcome.number} className={styles.card}>
                <span className={styles.cardNumber}>{outcome.number}</span>
                <h3 className={styles.cardTitle}>{outcome.title}</h3>
                <p className={styles.cardBody}>{outcome.body}</p>
              </div>
            ))}
          </div>

          <div className={styles.media}>
            <Image
              src={TANUSAS.media.table.src}
              alt=""
              width={TANUSAS.media.table.width}
              height={TANUSAS.media.table.height}
            />
          </div>

          <h3 className={styles.title}>{copy.goals.planesTitle}</h3>
          <div className={styles.cards}>
            {copy.goals.planes.map((plane) => (
              <div key={plane.title} className={styles.card}>
                <h4 className={styles.cardTitle}>{plane.title}</h4>
                <p className={styles.cardBody}>{plane.body}</p>
              </div>
            ))}
          </div>

          <p className={styles.note}>{copy.goals.format}</p>
        </div>
      </section>

      {/* 05 · El lugar */}
      <section id="lugar" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>
              <b>{copy.place.number}</b>
              {copy.place.kicker}
            </p>
            <h2 className={styles.title}>{copy.place.title}</h2>
          </div>

          <div className={styles.media}>
            <Image
              src={TANUSAS.media.village.src}
              alt=""
              width={TANUSAS.media.village.width}
              height={TANUSAS.media.village.height}
              /* Es la imagen grande de la sección, arriba del pliegue en móvil. */
              priority
            />
          </div>

          <div className={styles.split}>
            <div className={styles.prose}>
              {copy.place.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{copy.place.closing}</p>
            </div>

            <div>
              <h3 className={styles.kicker}>{copy.place.locationTitle}</h3>
              <dl className={styles.rows}>
                {copy.place.location.map((row) => (
                  <div key={row.label} className={styles.row}>
                    <dt className={styles.rowLabel}>{row.label}</dt>
                    <dd className={styles.rowValue}>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <p className={styles.note}>
                <a href={TANUSAS.venue.mapsUrl} target="_blank" rel="noreferrer">
                  {TANUSAS.venue.name} · {TANUSAS.venue.place}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 06 · Agenda */}
      <section id="agenda" className={styles.section} data-tone="deep">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>
              <b>{copy.agenda.number}</b>
              {copy.agenda.kicker}
            </p>
            <h2 className={styles.title}>{copy.agenda.title}</h2>
          </div>

          <TanusasAgenda copy={copy.agenda} />

          <p className={styles.note}>{copy.agenda.note}</p>
        </div>
      </section>

      {/* 07 · Lo práctico */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <p className={styles.kicker}>
              <b>{copy.practical.number}</b>
              {copy.practical.kicker}
            </p>
            <h2 className={styles.title}>{copy.practical.title}</h2>
          </div>

          <div className={styles.cards}>
            {copy.practical.items.map((item) => (
              <div key={item.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardBody}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre */}
      <footer className={styles.closing}>
        <p className={styles.closingQuote}>{copy.closing.quote}</p>
        <p className={styles.closingInvite}>{copy.closing.invite}</p>

        <TanusasJoinCta copy={copy.hero} />

        <div className={styles.closingFoot}>
          <p>{copy.closing.partners}</p>
          <div className={styles.closingCredit}>
            <span>{copy.closing.credit}</span>
            <a href={TANUSAS.siteUrl} target="_blank" rel="noreferrer">
              naturatech.org
            </a>
          </div>
        </div>
      </footer>
    </TanusasExperience>
  );
}
