'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { saveJoinDraft } from '../lib/join-draft';
import styles from './JoinScreen.module.css';

type Props = {
  copy: Dictionary['registration']['join'];
  /**
   * Se llama con el correo ya guardado en el navegador, cuando la animación de
   * guardado termina. Es la costura por donde entra la siguiente etapa —elegir
   * evento y acompañante—: mientras no exista, la pantalla se queda contraída.
   */
  onSaved?: (email: string) => void;
};

/** Iconos que sustituyen a las «o» del titular, en orden de aparición. */
const O_ICONS = [
  { tone: 'green', src: '/icons/icon-greeen-letter-o.svg' },
  { tone: 'pink', src: '/icons/icon-pink-letter-o.svg' },
] as const;

/**
 * Lo que dura el guardado en pantalla (ms).
 *
 * No es el tiempo que cuesta escribir en `localStorage` —eso es inmediato— sino
 * el de la animación: la caja se contrae y el botón pasa a cargador, y por
 * debajo el correo ya quedó guardado.
 */
const SAVE_MS = 1800;

/**
 * Ancho de la caja contraída: el del botón más el relleno de la caja, medido en
 * el momento de enviar.
 *
 * Se calcula y no se fija en un número porque así el botón queda **centrado por
 * geometría**: sin hueco de sobra, el campo —que es `flex: 1`— llega a cero y no
 * hay nada que empuje al botón a un lado. Con un ancho fijo mayor, el campo se
 * quedaba con la diferencia y el botón se iba a la derecha, con el `gap` de 16px
 * asomando a su izquierda. Y el botón cambia de tamaño por debajo de 900px, así
 * que un número fijo solo habría estado centrado en un ancho de pantalla.
 */
function savedWidth(form: HTMLFormElement | null): number {
  const button = form?.querySelector('button');
  if (!form || !button) return 132;
  const style = getComputedStyle(form);
  const inner = [style.paddingLeft, style.paddingRight].reduce((sum, v) => sum + parseFloat(v), 0);
  // Los bordes también cuentan: la caja es `border-box`, así que sin sumarlos el
  // ancho se quedaba 2px corto y el botón salía recortado y descentrado.
  const borders =
    style.boxSizing === 'border-box'
      ? [style.borderLeftWidth, style.borderRightWidth].reduce((sum, v) => sum + parseFloat(v), 0)
      : 0;
  return button.getBoundingClientRect().width + inner + borders;
}

/**
 * Lo mínimo para no dejar pasar un correo sin arroba ni dominio. La validación
 * de verdad la hace el servidor cuando se envíe el registro completo.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Primera pantalla del registro: titular grande y captura del correo.
 *
 * El titular va en Cubao, la tipografía de display del sitio, y los **iconos
 * sustituyen a las letras «o»** en el orden en que aparecen. La sustitución se
 * hace por carácter y no por posición fija para que la traducción no tenga que
 * mantener las «o» en el mismo sitio: en inglés caen donde caigan.
 *
 * Al enviar, la caja se contrae y el botón se convierte en cargador. Esa pausa
 * no espera a la red: el correo se guarda en el navegador y nada sale hacia el
 * servidor todavía, porque el registro no está completo hasta elegir el evento.
 */
export function JoinScreen({ copy, onSaved }: Props) {
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  /**
   * Ancho de la caja, en píxeles y no en porcentaje: entre `100%` y `148px` no
   * hay nada que interpolar, así que al enviar se fija primero el ancho que ya
   * tiene y desde ese número se anima al contraído.
   */
  const [width, setWidth] = useState<number | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (isSaving) return;

    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value)) {
      setError(copy.invalid);
      return;
    }

    setError(null);
    setEmail(value);
    saveJoinDraft({ email: value });

    const objetivo = savedWidth(formRef.current);
    setWidth(formRef.current?.getBoundingClientRect().width ?? objetivo);
    // En el cuadro siguiente, para que el primer valor quede aplicado y la
    // animación tenga de dónde salir.
    requestAnimationFrame(() => {
      setIsSaving(true);
      setWidth(objetivo);
    });

    window.setTimeout(() => onSaved?.(value), SAVE_MS);
  }

  return (
    <section className={styles.root}>
      <Headline
        line1={copy.headlineLine1}
        line2={copy.headlineLine2}
        accent={copy.headlineAccent}
      />

      <motion.form
        ref={formRef}
        className={styles.box}
        data-saving={isSaving || undefined}
        onSubmit={submit}
        /**
         * Sin la validación del navegador: con `type="email"` se niega a enviar y
         * saca su propio globo, así que el aviso del diseño —el pie en rojo—
         * nunca llegaba a aparecer. La comprobación la hace el componente.
         */
        noValidate
        animate={width === null ? undefined : { width }}
        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
      >
        <label className={styles.field} data-hidden={isSaving || undefined}>
          <span className={styles.srOnly}>{copy.emailLabel}</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            placeholder={copy.emailLabel}
            autoComplete="email"
            inputMode="email"
            disabled={isSaving}
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.submit} disabled={isSaving}>
          <span className={styles.srOnly}>{isSaving ? copy.saving : copy.submit}</span>
          {isSaving ? (
            <span className={styles.loader} aria-hidden>
              {Array.from({ length: 9 }, (_, index) => (
                <span key={index} style={{ ['--cell' as string]: index }} />
              ))}
            </span>
          ) : (
            <span className={styles.icon} aria-hidden />
          )}
        </button>
      </motion.form>

      {/* El pie cambia de texto, así que entra y sale: por eso AnimatePresence. */}
      <div className={styles.noteLayer}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={error ?? (isSaving ? 'saving' : 'note')}
            className={styles.note}
            data-error={error ? true : undefined}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
            role={error ? 'alert' : 'status'}
          >
            {error ?? (isSaving ? copy.saving : copy.note)}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}

type HeadlineProps = { line1: string; line2: string; accent: string };

/**
 * Titular en dos líneas, con las «o» sustituidas por iconos.
 *
 * El `aria-label` lleva el texto plano y los iconos van decorativos: leídos uno
 * a uno, con la palabra partida en trozos, un lector de pantalla daría basura.
 */
function Headline({ line1, line2, accent }: HeadlineProps) {
  // Contador compartido por las dos líneas: los iconos se reparten en orden.
  let used = 0;
  const takeIcon = () => (used < O_ICONS.length ? O_ICONS[used++] : null);

  /** Parte un tramo de texto en trozos, poniendo un icono en cada «o». */
  const withIcons = (text: string, keyBase: string): ReactNode[] => {
    const nodes: ReactNode[] = [];
    let buffer = '';

    [...text].forEach((char, index) => {
      const icon = char.toLowerCase() === 'o' ? takeIcon() : null;
      if (!icon) {
        buffer += char;
        return;
      }
      if (buffer) {
        nodes.push(buffer);
        buffer = '';
      }
      nodes.push(
        <Image
          key={`${keyBase}-${index}`}
          src={icon.src}
          alt=""
          width={62}
          height={62}
          className={styles.oIcon}
          data-tone={icon.tone}
          aria-hidden
        />,
      );
    });

    if (buffer) nodes.push(buffer);
    return nodes;
  };

  // La segunda línea lleva un tramo en lima. Si la traducción no contiene ese
  // tramo tal cual, la línea sale entera sin resalte en vez de romperse.
  const [before, after] = line2.split(accent);
  const hasAccent = after !== undefined;

  return (
    <h1 className={styles.headline} aria-label={`${line1} ${line2}`}>
      <span className={styles.line}>{withIcons(line1, 'l1')}</span>
      <span className={styles.line}>
        {hasAccent ? (
          <>
            {withIcons(before ?? '', 'l2a')}
            <span className={styles.accent}>{withIcons(accent, 'l2b')}</span>
            {withIcons(after, 'l2c')}
          </>
        ) : (
          withIcons(line2, 'l2')
        )}
      </span>
    </h1>
  );
}
