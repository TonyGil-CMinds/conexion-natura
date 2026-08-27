'use client';
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, Component, FormEvent, type PointerEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Lanyard from './ReactBitsLanyard';
import styles from './Registration.module.css';

type Fields = { name: string; surname: string; email: string; organization: string; role: string; linkedin: string };
type Errors = Partial<Record<keyof Fields | 'photo', string>>;
type Crop = { zoom: number; x: number; y: number };

type LanyardBoundaryProps = { children: ReactNode; frontImage: string };

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
      return <div className={styles.lanyardFallback} style={{ backgroundImage: `url(${this.props.frontImage})` }} aria-label="Vista previa de credencial" />;
    }
    return this.props.children;
  }
}

const INITIAL: Fields = {
  name: 'Kathrin',
  surname: 'Mendoza',
  email: 'kathrin.mendoza@example.com',
  organization: 'Pachamama',
  role: 'Líder de comunidades Ashuar',
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

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

async function createBadge(fields: Fields, photo: string | null, crop: Crop) {
  const scaleFactor = 3;
  const canvas = document.createElement('canvas');
  canvas.width = 430 * scaleFactor;
  canvas.height = 600 * scaleFactor;
  const context = canvas.getContext('2d');
  if (!context) return '/img/front_placeholder.png';
  context.scale(scaleFactor, scaleFactor);
  const template = await loadImage('/img/front_placeholder-3x.png');
  context.drawImage(template, 0, 0, 430, 600);

  if (photo) {
    const portrait = await loadImage(photo);
    // El retrato solo puede vivir dentro del hueco central: no debe invadir los
    // escalones verdes que enmarcan la foto en el arte de la credencial.
    const target = { x: 108, y: 174, width: 214, height: 270 };
    // `cover` llena casi toda la zona verde aunque la foto original tenga mucho
    // espacio vacío alrededor de la persona.
    const scale = Math.max(target.width / portrait.width, target.height / portrait.height) * crop.zoom;
    const width = portrait.width * scale;
    const height = portrait.height * scale;
    context.save();
    context.beginPath();
    context.rect(target.x, target.y, target.width, target.height);
    context.clip();
    context.drawImage(portrait, target.x + (target.width - width) / 2 + crop.x, target.y + (target.height - height) / 2 + crop.y, width, height);
    context.restore();
  }

  context.fillStyle = '#151d17';
  context.fillRect(32, 482, 310, 62);
  context.fillStyle = '#f7ffd2';
  context.font = '600 15px ui-monospace, monospace';
  context.fillText(`${fields.name || 'TU NOMBRE'} ${fields.surname || 'APELLIDO'}`.toUpperCase(), 32, 508);
  context.fillStyle = '#f7ffd2';
  context.font = '10px ui-monospace, monospace';
  const icon = await loadImage('/icons/icon-logo.svg');
  context.drawImage(icon, 32, 520, 13, 13);
  context.fillText((fields.organization || 'TU ORGANIZACIÓN').toUpperCase(), 55, 532);
  return canvas.toDataURL('image/png');
}

export function Registration() {
  const [fields, setFields] = useState<Fields>(INITIAL);
  const [photo, setPhoto] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({ zoom: 1, x: 0, y: 0 });
  const [isCropEditorOpen, setIsCropEditorOpen] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; cropX: number; cropY: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [frontImage, setFrontImage] = useState('/img/front_placeholder.png');
  const [isBadgeUpdating, setIsBadgeUpdating] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [focusedField, setFocusedField] = useState<keyof Fields | null>(null);

  useEffect(() => {
    let active = true;
    // Regenerar la textura implica recomponer el atlas del modelo 3D. Esperamos
    // un instante tras el último cambio para que la tarjeta no parpadee mientras
    // se escribe en un campo.
    setIsBadgeUpdating(true);
    const timeout = window.setTimeout(() => {
      createBadge(fields, photo, crop)
        .then((image) => {
          if (!active) return;
          setFrontImage(image);
          window.setTimeout(() => active && setIsBadgeUpdating(false), 240);
        })
        .catch(() => {
          if (!active) return;
          setFrontImage('/img/front_placeholder.png');
          setIsBadgeUpdating(false);
        });
    }, 1200);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [fields, photo, crop]);

  const title = useMemo(() => isConfirmed ? 'Tu perfil está listo' : 'Verifica tu información', [isConfirmed]);

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
      setErrors((current) => ({ ...current, photo: 'Elige un archivo de imagen.' }));
      return;
    }
    setErrors((current) => ({ ...current, photo: undefined }));
    setIsRemovingBackground(true);
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const result = await removeBackground(file);
      setPhoto(URL.createObjectURL(result));
      setCrop({ zoom: 1, x: 0, y: 0 });
      setIsCropEditorOpen(true);
    } catch {
      // Si el modelo no puede cargarse (p. ej., sin conexión), aún permitimos
      // usar la imagen local para no bloquear el registro.
      setPhoto(URL.createObjectURL(file));
      setCrop({ zoom: 1, x: 0, y: 0 });
      setIsCropEditorOpen(true);
    } finally {
      setIsRemovingBackground(false);
    }
  }

  function validate() {
    const next: Errors = {};
    (['name', 'surname', 'email', 'organization', 'role'] as const).forEach((field) => {
      if (!fields[field].trim()) next[field] = 'Este dato es obligatorio.';
    });
    if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) next.email = 'Escribe un correo válido.';
    if (!photo) next.photo = 'Sube una fotografía para generar tu credencial.';
    return next;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setIsSaving(true);
    window.setTimeout(() => {
      setIsSaving(false);
      setIsConfirmed(true);
    }, 850);
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
      await navigator.share({ title: 'Mi credencial Conexión500', text: 'Nos vemos en Quito, Ecuador.', files: [file] });
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
      <form className={styles.form} onSubmit={submit} noValidate>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{isConfirmed ? 'Eres uno de los 100 invitados' : 'Quedan: 5 lugares'}</p>
          <h1>{title}</h1>
          <div className={styles.photoActions}>
            <button
              className={styles.photoUpload}
              data-error={errors.photo || undefined}
              type="button"
              disabled={isRemovingBackground}
              onClick={() => fileInputRef.current?.click()}
            >
              <span>{isRemovingBackground ? 'Quitando fondo…' : photo ? 'Cambiar imagen' : 'Cargar una imagen'}</span>
              {isRemovingBackground && (
                <span className={styles.pixelLoader} aria-hidden>
                  {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
                </span>
              )}
            </button>
            {photo && (
              <button className={styles.cropTrigger} type="button" onClick={() => setIsCropEditorOpen(true)} aria-label="Ajustar encuadre de la fotografía">
                <span className={styles.cropIcon} aria-hidden />
              </button>
            )}
          </div>
          <input ref={fileInputRef} className={styles.photoInput} type="file" accept="image/*" onChange={handlePhoto} />
          {errors.photo && <p className={styles.error}>{errors.photo}</p>}
        </header>

        <fieldset className={styles.fields} disabled={isRemovingBackground} aria-busy={isRemovingBackground}>
          {([
            ['name', 'Nombre'], ['surname', 'Apellido'], ['email', 'Correo'], ['organization', 'Organización'], ['role', 'Rol'], ['linkedin', 'LinkedIn (opcional)'],
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
                <span className={styles.emailSuggestions} role="listbox" aria-label="Sugerencias de correo">
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
          {isSaving ? 'Guardando' : isConfirmed ? 'Editar perfil' : 'Confirmar asistencia'}
        </button>
        <a className={styles.invite} href="#invitacion">¿No recibiste invitación?</a>
      </form>

      <aside className={styles.preview} data-updating={isBadgeUpdating || undefined}>
        <LanyardBoundary frontImage={frontImage}>
          <Lanyard
            position={[0, 0, 15]}
            gravity={[0, -40, 0]}
            fov={17}
            verticalOffset={1.25}
            frontImage={frontImage}
            backImage="/img/back.png"
            imageFit="cover"
            lanyardImage="/lanyard/lanyard.png"
            lanyardWidth={1}
          />
        </LanyardBoundary>
        {isConfirmed && (
          <div className={styles.actions}>
            <button type="button" onClick={download}>Descargar</button>
            <button type="button" onClick={share} aria-label="Compartir credencial">↗</button>
          </div>
        )}
      </aside>

      {isCropEditorOpen && photo && (
        <div className={styles.cropModal} role="dialog" aria-modal="true" aria-label="Ajustar fotografía">
          <div className={styles.cropDialog}>
            <div className={styles.cropHeading}>
              <div><p>Ajusta tu fotografía</p><span>Arrastra para encuadrar la imagen</span></div>
              <button type="button" onClick={() => setIsCropEditorOpen(false)} aria-label="Cerrar editor">×</button>
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
              <label>Zoom<input type="range" min="0.8" max="2.8" step="0.05" value={crop.zoom} onChange={(event) => setCrop((current) => ({ ...current, zoom: Number(event.target.value) }))} /></label>
              <label>Horizontal<input type="range" min="-70" max="70" value={crop.x} onChange={(event) => setCrop((current) => ({ ...current, x: Number(event.target.value) }))} /></label>
              <label>Vertical<input type="range" min="-90" max="90" value={crop.y} onChange={(event) => setCrop((current) => ({ ...current, y: Number(event.target.value) }))} /></label>
            </div>
            <button className={styles.cropConfirm} type="button" onClick={() => setIsCropEditorOpen(false)}>Usar este encuadre</button>
          </div>
        </div>
      )}
    </section>
  );
}
