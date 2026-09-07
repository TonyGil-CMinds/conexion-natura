'use client';
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, Component, FormEvent, type PointerEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { SITE } from '@/config/site';
import type { Dictionary } from '@/i18n';
import { type Attendee, useAttendance } from '../context/attendance';
import { uploadPhoto } from '../lib/upload-photo';
import Lanyard from './ReactBitsLanyard';
import styles from './Registration.module.css';

type Fields = { name: string; surname: string; email: string; organization: string; role: string; linkedin: string };
type Errors = Partial<Record<keyof Fields | 'photo', string>>;
type Crop = { zoom: number; x: number; y: number };

type Copy = Dictionary['registration'];

type LanyardBoundaryProps = { children: ReactNode; frontImage: string; label: string };

class LanyardBoundary extends Component<LanyardBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: LanyardBoundaryProps) {
    // Un frente nuevo permite reintentar el canvas sin recargar toda la ruta.
    if (previousProps.frontImage !== this.props.frontImage && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <div className={styles.lanyardFallback} style={{ backgroundImage: `url(${this.props.frontImage})` }} aria-label={this.props.label} />;
    }
    return this.props.children;
  }
}

/** El formulario arranca vacío: los datos los pone quien se registra. */
const INITIAL: Fields = {
  name: '',
  surname: '',
  email: '',
  organization: '',
  role: '',
  linkedin: '',
};

const EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'proton.me'];

function emailSuggestions(value: string) {
  const address = value.trim().toLowerCase();
  if (!address) return [];
  const [localPart, partialDomain = ''] = address.split('@');
  if (!localPart) return [];
  return EMAIL_DOMAINS
    .filter((domain) => domain.startsWith(partialDomain))
    .map((domain) => `${localPart}@${domain}`)
    .slice(0, 5);
}

function normalizeLinkedIn(value: string) {
  const clean = value.trim().replace(/\s+/g, '');
  if (!clean) return '';
  if (/^https?:\/\//i.test(clean)) return clean;
  if (/^www\.linkedin\.com\//i.test(clean) || /^linkedin\.com\//i.test(clean)) return `https://${clean}`;
  if (/^(in|company)\//i.test(clean)) return `https://www.linkedin.com/${clean}`;
  return `https://www.linkedin.com/in/${clean}`;
}

function normalizeText(value: string) {
  return value.trim().replace(/\s{2,}/g, ' ');
}

/** En iCalendar la coma y el punto y coma separan valores: hay que escaparlos. */
function escapeICS(value: string) {
  return value.replace(/([,;\\])/g, '\\$1');
}

/**
 * Archivo `.ics` en vez de un enlace a un calendario concreto: lo abren Google,
 * Apple y Outlook por igual, y no manda al usuario fuera del sitio.
 */
function eventCalendarFile(copy: Copy, subtitle: readonly string[]) {
  const { name, event } = SITE;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Conexion500//registro//ES',
    'BEGIN:VEVENT',
    // El identificador no cambia aunque cambie la marca: es lo que reconoce el
    // calendario de quien ya añadió el evento, y otro crearía un duplicado.
    'UID:conexion500-2026-10-05@conexion500',
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${event.calendar.startUtc}`,
    `DTEND:${event.calendar.endUtc}`,
    `SUMMARY:${escapeICS(`${name} — ${subtitle.join(' ')}`)}`,
    `LOCATION:${escapeICS(`${event.venue.name}, ${event.place}`)}`,
    `DESCRIPTION:${escapeICS(`${event.scheduleLabel} (${copy.scheduleNote}).`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  // CRLF por especificación: algunos clientes de escritorio rechazan el archivo
  // si las líneas acaban solo en salto de línea.
  return new Blob([`${lines.join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' });
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    /**
     * Las imágenes de R2 vienen de otro origen. Sin `crossOrigin` el lienzo
     * queda «contaminado» al dibujarlas y `toDataURL()` lanza un error de
     * seguridad, así que se caerían descargar y compartir. Requiere que el
     * bucket permita `GET` en su regla CORS.
     */
    if (/^https?:/i.test(source)) image.crossOrigin = 'anonymous';
    image.src = source;
  });
}

/** Zona del retrato dentro del arte de la credencial, en puntos de diseño. */
const PORTRAIT = { x: 108, y: 174, width: 214, height: 270 };

/**
 * Encaja el retrato en la zona verde: `cover` con el zoom y el desplazamiento
 * elegidos. La misma cuenta sirve para pintar la credencial y para recortar el
 * archivo que se sube, y por eso vive aparte.
 */
function portraitPlacement(portrait: HTMLImageElement, crop: Crop, scaleFactor = 1) {
  const width = PORTRAIT.width * scaleFactor;
  const height = PORTRAIT.height * scaleFactor;
  const scale = Math.max(width / portrait.width, height / portrait.height) * crop.zoom;
  const drawWidth = portrait.width * scale;
  const drawHeight = portrait.height * scale;
  return {
    width,
    height,
    drawWidth,
    drawHeight,
    x: (width - drawWidth) / 2 + crop.x * scaleFactor,
    y: (height - drawHeight) / 2 + crop.y * scaleFactor,
  };
}

/**
 * Deja el recorte **cocido** en el archivo que se sube.
 *
 * El encuadre se elige en el navegador y no se guarda en ninguna columna, así
 * que si se subiera la imagen entera, al recargar la credencial se dibujaría con
 * el encuadre por defecto y la tarjeta cambiaría de aspecto sola. Recortando
 * antes de subir, la imagen guardada **es** lo que se ve, y además pesa menos.
 */
async function renderPortrait(source: string, crop: Crop, prepareError: string): Promise<Blob> {
  const scaleFactor = 3;
  const portrait = await loadImage(source);
  const place = portraitPlacement(portrait, crop, scaleFactor);
  const canvas = document.createElement('canvas');
  canvas.width = place.width;
  canvas.height = place.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error(prepareError);
  context.drawImage(portrait, place.x, place.y, place.drawWidth, place.drawHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error(prepareError))),
      'image/png',
    );
  });
}

async function createBadge(fields: Fields, photo: string | null, crop: Crop, copy: Copy) {
  const scaleFactor = 3;
  const canvas = document.createElement('canvas');
  canvas.width = 430 * scaleFactor;
  canvas.height = 600 * scaleFactor;
  const context = canvas.getContext('2d');
  if (!context) return '/img/card-front.png';
  context.scale(scaleFactor, scaleFactor);
  // El arte de la credencial. Trae el logotipo y la retícula de píxeles; el
  // código solo añade el retrato y los datos.
  const template = await loadImage('/img/card-front.png');
  context.drawImage(template, 0, 0, 430, 600);

  if (photo) {
    // El retrato solo puede vivir dentro del hueco central: no debe invadir los
    // escalones verdes que enmarcan la foto en el arte de la credencial.
    const portrait = await loadImage(photo);
    const place = portraitPlacement(portrait, crop);
    context.save();
    context.beginPath();
    context.rect(PORTRAIT.x, PORTRAIT.y, PORTRAIT.width, PORTRAIT.height);
    context.clip();
    context.drawImage(portrait, PORTRAIT.x + place.x, PORTRAIT.y + place.y, place.drawWidth, place.drawHeight);
    context.restore();
  }

  context.fillStyle = '#151d17';
  context.fillRect(32, 482, 310, 62);
  context.fillStyle = '#f7ffd2';
  context.font = '600 15px ui-monospace, monospace';
  context.fillText(`${fields.name || copy.badgeName} ${fields.surname || copy.badgeSurname}`.toUpperCase(), 32, 508);
  context.fillStyle = '#f7ffd2';
  context.font = '10px ui-monospace, monospace';
  const icon = await loadImage('/icons/icon-logo.svg');
  context.drawImage(icon, 32, 520, 13, 13);
  context.fillText((fields.organization || copy.badgeOrganization).toUpperCase(), 55, 532);
  return canvas.toDataURL('image/png');
}

type Props = {
  /** Idioma de la ruta: viaja al servidor para que el correo enlace a su versión. */
  locale: string;
  copy: Copy;
  /** El subtítulo del hero entra en el resumen del `.ics`. */
  subtitle: readonly string[];
};

export function Registration({ locale, copy, subtitle }: Props) {
  const [fields, setFields] = useState<Fields>(INITIAL);
  /** URL local para pintar la credencial mientras se rellena el formulario. */
  const [photo, setPhoto] = useState<string | null>(null);
  /** URL en R2, una vez subida. Se reutiliza si no se cambia la imagen. */
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ zoom: 1, x: 0, y: 0 });
  const [isCropEditorOpen, setIsCropEditorOpen] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; cropX: number; cropY: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [frontImage, setFrontImage] = useState('/img/card-front.png');
  const [isBadgeUpdating, setIsBadgeUpdating] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState(false);
  /** Qué se está haciendo ahora mismo: subir la imagen o guardar los datos. */
  const [savingStep, setSavingStep] = useState<string | null>(null);
  /** Fallo del envío que no pertenece a ningún campo (red, servidor). */
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  /** Solo cuenta ya confirmado: es el paso atrás desde el resumen al formulario. */
  const [isEditing, setIsEditing] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof Fields | null>(null);
  const { attendee, confirm } = useAttendance();

  useEffect(() => {
    let active = true;
    // Regenerar la textura implica recomponer el atlas del modelo 3D. Esperamos
    // un instante tras el último cambio para que la tarjeta no parpadee mientras
    // se escribe en un campo.
    setIsBadgeUpdating(true);
    const timeout = window.setTimeout(() => {
      createBadge(fields, photo, crop, copy)
        .then((image) => {
          if (!active) return;
          setFrontImage(image);
          window.setTimeout(() => active && setIsBadgeUpdating(false), 240);
        })
        .catch(() => {
          if (!active) return;
          setFrontImage('/img/card-front.png');
          setIsBadgeUpdating(false);
        });
    }, 1200);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [fields, photo, crop, copy]);

  // Quien vuelve con la asistencia ya confirmada entra directo al resumen, y con
  // los datos que guardó: el formulario arranca con ellos por si los edita.
  useEffect(() => {
    if (!attendee) return;
    setIsConfirmed(true);
    // Se copian los campos uno a uno: el perfil trae además `id` y `photoUrl`,
    // que no son campos del formulario.
    setFields({
      name: attendee.name,
      surname: attendee.surname,
      email: attendee.email,
      organization: attendee.organization,
      role: attendee.role,
      linkedin: attendee.linkedin ?? '',
    });
    // La imagen ya está en R2: se dibuja desde allí y no hay que volver a
    // subirla. Viene con el recorte cocido, así que el encuadre por defecto la
    // reproduce tal cual.
    setPhotoUrl(attendee.photoUrl);
    setPhoto(attendee.photoUrl);
    setCrop({ zoom: 1, x: 0, y: 0 });
  }, [attendee]);

  /**
   * El resumen es el estado de reposo de quien ya confirmó; el formulario vuelve
   * solo si pide editar. Así la pantalla no pide revisar lo que ya está resuelto.
   */
  const isSummary = isConfirmed && !isEditing;

  // Al volver desde el resumen ya no se verifica nada: se edita.
  const title = isConfirmed ? copy.titleEdit : copy.titleVerify;

  function update(field: keyof Fields) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = field === 'email' ? event.target.value.replace(/\s/g, '').toLowerCase() : event.target.value;
      setFields((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  function normalizeField(field: keyof Fields) {
    setFields((current) => {
      const value = current[field];
      if (field === 'email') return { ...current, email: value.trim().toLowerCase() };
      if (field === 'linkedin') return { ...current, linkedin: normalizeLinkedIn(value) };
      return { ...current, [field]: normalizeText(value) };
    });
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({ ...current, photo: copy.errors.photoType }));
      return;
    }
    setErrors((current) => ({ ...current, photo: undefined }));
    setIsRemovingBackground(true);
    // Una imagen nueva invalida la que hubiera subida: hay que volver a subirla.
    setPhotoUrl(null);
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const result = await removeBackground(file);
      accept(result);
    } catch {
      // Si el modelo no puede cargarse (p. ej., sin conexión), aún permitimos
      // usar la imagen local para no bloquear el registro.
      accept(file);
    } finally {
      setIsRemovingBackground(false);
    }

    function accept(image: Blob) {
      setPhoto(URL.createObjectURL(image));
      setCrop({ zoom: 1, x: 0, y: 0 });
      setIsCropEditorOpen(true);
    }
  }

  function validate() {
    const next: Errors = {};
    (['name', 'surname', 'email', 'organization', 'role'] as const).forEach((field) => {
      if (!fields[field].trim()) next[field] = copy.errors.required;
    });
    if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) next.email = copy.errors.email;
    // La foto solo se exige al confirmar por primera vez. Al volver a editar no
    // está en memoria —no se guarda en el navegador—, y pedirla otra vez
    // bloquearía una corrección de rol tras la que nadie sube una foto.
    if (!photo && !photoUrl && !isConfirmed) next.photo = copy.errors.photo;
    return next;
  }

  /**
   * Guarda el registro: sube la imagen si hace falta y manda los datos.
   *
   * La imagen va primero porque su URL forma parte del registro. Si la subida
   * falla no se envía nada: es mejor repetir el paso que dejar una fila sin
   * retrato que nadie va a volver a completar.
   */
  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length) return;

    setIsSaving(true);
    try {
      let uploaded = photoUrl;
      if (photo && !uploaded) {
        setSavingStep(copy.submitUploading);
        // Se sube el recorte, no el original: así la imagen guardada es la que
        // se ve en la credencial aunque el encuadre no viaje a la base.
        uploaded = await uploadPhoto(await renderPortrait(photo, crop, copy.errors.photoPrepare));
        setPhotoUrl(uploaded);
      }

      setSavingStep(copy.submitSaving);
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: normalizeText(fields.name),
          surname: normalizeText(fields.surname),
          email: fields.email.trim().toLowerCase(),
          organization: normalizeText(fields.organization),
          role: normalizeText(fields.role),
          linkedin: normalizeLinkedIn(fields.linkedin),
          photoUrl: uploaded,
          locale,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        attendee?: Attendee;
        error?: string;
        fields?: Partial<Record<string, string>>;
      };

      if (!response.ok || !payload.attendee) {
        // El servidor puede marcar campos concretos: se pintan donde están.
        if (payload.fields) {
          const known = new Set<keyof Errors>(['name', 'surname', 'email', 'organization', 'role', 'linkedin', 'photo']);
          setErrors(Object.fromEntries(
            Object.entries(payload.fields).filter(([field]) => known.has(field as keyof Errors)),
          ) as Errors);
        }
        setSubmitError(payload.error ?? copy.errors.save);
        return;
      }

      setIsConfirmed(true);
      // Guardar devuelve al resumen: es la vista de reposo del perfil.
      setIsEditing(false);
      // El resto del sitio se entera por aquí: cabecera, hero y pie leen el
      // mismo estado. La fuente de verdad es la respuesta del servidor.
      confirm(payload.attendee);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : copy.errors.save);
    } finally {
      setIsSaving(false);
      setSavingStep(null);
    }
  }

  function addToCalendar() {
    const url = URL.createObjectURL(eventCalendarFile(copy, subtitle));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'conexion500.ics';
    link.click();
    // El objeto se libera tras el clic: si se revoca antes, la descarga se cae.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function download() {
    const link = document.createElement('a');
    link.href = frontImage;
    link.download = `credencial-${fields.name || 'conexion500'}.png`;
    link.click();
  }

  async function share() {
    const blob = await (await fetch(frontImage)).blob();
    const file = new File([blob], 'mi-credencial-conexion500.png', { type: 'image/png' });
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      await navigator.share({ title: copy.shareTitle, text: copy.shareText, files: [file] });
    } else {
      await navigator.clipboard?.writeText(window.location.href);
    }
  }

  function startCropDrag(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragStart({ x: event.clientX, y: event.clientY, cropX: crop.x, cropY: crop.y });
  }

  function moveCrop(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart) return;
    setCrop((current) => ({
      ...current,
      x: Math.max(-70, Math.min(70, dragStart.cropX + (event.clientX - dragStart.x) * .76)),
      y: Math.max(-90, Math.min(90, dragStart.cropY + (event.clientY - dragStart.y) * .76)),
    }));
  }

  return (
    <section className={styles.root}>
      {isSummary ? (
        <div className={`${styles.form} ${styles.summary}`}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>{copy.eyebrowConfirmed}</p>
            <h1>{copy.greeting} {fields.name}</h1>
          </header>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>{copy.yourInformation}</h2>
            {/* Los rótulos van ocultos: el dato se reconoce solo y el diseño pide
                una lista limpia, pero sin ellos un lector de pantalla leería una
                ristra de valores sueltos. */}
            <dl className={styles.data}>
              {([
                [copy.fields.email, fields.email],
                [copy.fields.organization, fields.organization],
                [copy.fields.role, fields.role],
              ] as const).map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              {fields.linkedin && (
                <div>
                  <dt>LinkedIn</dt>
                  <dd><a href={fields.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></dd>
                </div>
              )}
            </dl>
            <button className={styles.edit} type="button" onClick={() => setIsEditing(true)}>
              {copy.edit}
            </button>
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockTitle}>{copy.eventInformation}</h2>
            <div className={styles.data}>
              <p className={styles.eventDate}>{copy.dateLongLabel}</p>
              <p className={styles.eventTime}>
                {SITE.event.scheduleLabel} <span>({copy.scheduleNote})</span>
              </p>
              <a className={styles.eventVenue} href={SITE.event.venue.mapsUrl} target="_blank" rel="noreferrer">
                {SITE.event.venue.name}
              </a>
            </div>
          </section>

          <button className={styles.calendar} type="button" onClick={addToCalendar}>
            {copy.addToCalendar}
          </button>
        </div>
      ) : (
      <form className={styles.form} onSubmit={submit} noValidate>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{isConfirmed ? copy.eyebrowConfirmed : copy.eyebrowOpen}</p>
          <h1>{title}</h1>
          <div className={styles.photoActions}>
            <button
              className={styles.photoUpload}
              data-error={errors.photo || undefined}
              type="button"
              disabled={isRemovingBackground}
              onClick={() => fileInputRef.current?.click()}
            >
              <span>{isRemovingBackground ? copy.photoRemoving : photo ? copy.photoChange : copy.photoUpload}</span>
              {isRemovingBackground && (
                <span className={styles.pixelLoader} aria-hidden>
                  {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
                </span>
              )}
            </button>
            {photo && (
              <button className={styles.cropTrigger} type="button" onClick={() => setIsCropEditorOpen(true)} aria-label={copy.cropAdjust}>
                <span className={styles.cropIcon} aria-hidden />
              </button>
            )}
          </div>
          <input ref={fileInputRef} className={styles.photoInput} type="file" accept="image/*" onChange={handlePhoto} />
          {errors.photo && <p className={styles.error}>{errors.photo}</p>}
        </header>

        <fieldset className={styles.fields} disabled={isRemovingBackground} aria-busy={isRemovingBackground}>
          {([
            ['name', copy.fields.name], ['surname', copy.fields.surname], ['email', copy.fields.email],
            ['organization', copy.fields.organization], ['role', copy.fields.role], ['linkedin', copy.fields.linkedin],
          ] as const).map(([field, label]) => (
            <label className={styles.field} data-error={errors[field] || undefined} data-suggestions={field === 'email' && focusedField === 'email' && emailSuggestions(fields.email).length ? '' : undefined} key={field}>
              <span>{label}</span>
              <input
                value={fields[field]}
                onChange={update(field)}
                onFocus={() => setFocusedField(field)}
                onBlur={() => { normalizeField(field); window.setTimeout(() => setFocusedField(null), 120); }}
                aria-invalid={Boolean(errors[field])}
                aria-autocomplete={field === 'email' ? 'list' : undefined}
              />
              {field === 'email' && focusedField === 'email' && emailSuggestions(fields.email).length > 0 && (
                <span className={styles.emailSuggestions} role="listbox" aria-label={copy.emailSuggestions}>
                  {emailSuggestions(fields.email).map((suggestion) => (
                    <button key={suggestion} type="button" role="option" aria-selected={false} onMouseDown={(event) => event.preventDefault()} onClick={() => { setFields((current) => ({ ...current, email: suggestion })); setFocusedField(null); }}>
                      {suggestion}
                    </button>
                  ))}
                </span>
              )}
              {errors[field] && <em role="alert">{errors[field]}</em>}
            </label>
          ))}
        </fieldset>

        <button className={styles.submit} type="submit" disabled={isSaving || isRemovingBackground}>
          {isSaving && <span className={styles.spinner} aria-hidden />}
          {isSaving ? savingStep ?? copy.submitSaving : isConfirmed ? copy.save : copy.submit}
        </button>
        {submitError && <p className={styles.submitError} role="alert">{submitError}</p>}
        {isConfirmed && (
          <button className={styles.cancel} type="button" onClick={() => setIsEditing(false)}>
            {copy.cancel}
          </button>
        )}
      </form>
      )}

      <aside className={styles.preview} data-updating={isBadgeUpdating || undefined}>
        <LanyardBoundary frontImage={frontImage} label={copy.badgePreview}>
          <Lanyard
            position={[0, 0, 15]}
            gravity={[0, -40, 0]}
            fov={17}
            verticalOffset={1.25}
            frontImage={frontImage}
            backImage="/img/card-back.png"
            imageFit="cover"
            lanyardImage="/lanyard/lanyard.png"
            lanyardWidth={1}
          />
        </LanyardBoundary>
        {isConfirmed && (
          <div className={styles.actions}>
            <button type="button" onClick={download}>{copy.download}</button>
            <button type="button" onClick={share} aria-label={copy.share}>↗</button>
          </div>
        )}
      </aside>

      {isCropEditorOpen && photo && (
        <div className={styles.cropModal} role="dialog" aria-modal="true" aria-label={copy.cropTitle}>
          <div className={styles.cropDialog}>
            <div className={styles.cropHeading}>
              <div><p>{copy.cropTitle}</p><span>{copy.cropHint}</span></div>
              <button type="button" onClick={() => setIsCropEditorOpen(false)} aria-label={copy.cropClose}>×</button>
            </div>
            <div
              className={styles.cropViewport}
              onPointerDown={startCropDrag}
              onPointerMove={moveCrop}
              onPointerUp={() => setDragStart(null)}
              onPointerCancel={() => setDragStart(null)}
            >
              <img
                src={photo}
                alt="Vista previa del recorte"
                style={{ transform: `translate(calc(-50% + ${crop.x}px), calc(-50% + ${crop.y}px)) scale(${crop.zoom})` }}
                draggable={false}
              />
              <span className={styles.cropFrame} aria-hidden />
            </div>
            <div className={styles.cropControls}>
              <label>{copy.cropZoom}<input type="range" min="0.8" max="2.8" step="0.05" value={crop.zoom} onChange={(event) => setCrop((current) => ({ ...current, zoom: Number(event.target.value) }))} /></label>
              <label>{copy.cropHorizontal}<input type="range" min="-70" max="70" value={crop.x} onChange={(event) => setCrop((current) => ({ ...current, x: Number(event.target.value) }))} /></label>
              <label>{copy.cropVertical}<input type="range" min="-90" max="90" value={crop.y} onChange={(event) => setCrop((current) => ({ ...current, y: Number(event.target.value) }))} /></label>
            </div>
            <button className={styles.cropConfirm} type="button" onClick={() => setIsCropEditorOpen(false)}>{copy.cropConfirm}</button>
          </div>
        </div>
      )}
    </section>
  );
}
