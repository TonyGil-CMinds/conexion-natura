'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import Lanyard from './ReactBitsLanyard';
import styles from './Registration.module.css';

type Fields = { name: string; surname: string; email: string; organization: string; role: string; linkedin: string };
type Errors = Partial<Record<keyof Fields | 'photo', string>>;

const INITIAL: Fields = {
  name: 'Kathrin',
  surname: 'Mendoza',
  email: 'kathrin.mendoza@example.com',
  organization: 'Pachamama',
  role: 'Líder de comunidades Ashuar',
  linkedin: '',
};

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

async function createBadge(fields: Fields, photo: string | null) {
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
    const target = { x: 119, y: 193, width: 190, height: 235 };
    const scale = Math.min(target.width / portrait.width, target.height / portrait.height);
    const width = portrait.width * scale;
    const height = portrait.height * scale;
    context.save();
    context.beginPath();
    context.rect(target.x, target.y, target.width, target.height);
    context.clip();
    context.drawImage(portrait, target.x + (target.width - width) / 2, target.y + target.height - height, width, height);
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

async function createLanyardTexture() {
  const image = await loadImage('/img/lanyardImage.svg');
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return '/img/lanyardImage.svg';
  // Se rasteriza a PNG y se recorta el centro del arte: el SVG original incluye
  // un círculo completo, que MeshLine aplastaba como un óvalo en la cinta.
  context.fillStyle = '#141b16';
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < canvas.width; x += 128) {
    context.drawImage(image, 73, 83, 168, 146, x, 0, 128, 128);
  }
  return canvas.toDataURL('image/png');
}

export function Registration() {
  const [fields, setFields] = useState<Fields>(INITIAL);
  const [photo, setPhoto] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState('/img/front_placeholder.png');
  const [lanyardTexture, setLanyardTexture] = useState('/img/lanyard.png');
  const [errors, setErrors] = useState<Errors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);

  useEffect(() => {
    let active = true;
    createBadge(fields, photo).then((image) => active && setFrontImage(image)).catch(() => active && setFrontImage('/img/front_placeholder.png'));
    return () => { active = false; };
  }, [fields, photo]);

  useEffect(() => {
    createLanyardTexture().then(setLanyardTexture).catch(() => setLanyardTexture('/img/lanyard.png'));
  }, []);

  const title = useMemo(() => isConfirmed ? 'Tu perfil está listo' : 'Verifica tu información', [isConfirmed]);

  function update(field: keyof Fields) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setFields((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
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
    } catch {
      // Si el modelo no puede cargarse (p. ej., sin conexión), aún permitimos
      // usar la imagen local para no bloquear el registro.
      setPhoto(URL.createObjectURL(file));
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

  return (
    <section className={styles.root}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{isConfirmed ? 'Eres uno de los 100 invitados' : 'Quedan: 5 lugares'}</p>
          <h1>{title}</h1>
          <label className={styles.photoUpload} data-error={errors.photo || undefined}>
            <span>{isRemovingBackground ? 'Quitando fondo…' : photo ? 'Cambiar fotografía' : 'Sube tu fotografía'}</span>
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>
          {errors.photo && <p className={styles.error}>{errors.photo}</p>}
        </header>

        <div className={styles.fields}>
          {([
            ['name', 'Nombre'], ['surname', 'Apellido'], ['email', 'Correo'], ['organization', 'Organización'], ['role', 'Rol'], ['linkedin', 'LinkedIn (opcional)'],
          ] as const).map(([field, label]) => (
            <label className={styles.field} data-error={errors[field] || undefined} key={field}>
              <span>{label}</span>
              <input value={fields[field]} onChange={update(field)} aria-invalid={Boolean(errors[field])} />
              {errors[field] && <em role="alert">{errors[field]}</em>}
            </label>
          ))}
        </div>

        <button className={styles.submit} type="submit" disabled={isSaving}>
          {isSaving && <span className={styles.spinner} aria-hidden />}
          {isSaving ? 'Guardando' : isConfirmed ? 'Editar perfil' : 'Confirmar asistencia'}
        </button>
        <a className={styles.invite} href="#invitacion">〰 ¿No recibiste invitación?</a>
      </form>

      <aside className={styles.preview}>
        <Lanyard
          position={[0, 0, 15]}
          gravity={[0, -40, 0]}
          fov={17}
          frontImage={frontImage}
          backImage="/img/back.png"
          imageFit="cover"
          lanyardImage={lanyardTexture}
          lanyardWidth={1.35}
        />
        {isConfirmed && (
          <div className={styles.actions}>
            <button type="button" onClick={download}>Descargar</button>
            <button type="button" onClick={share} aria-label="Compartir credencial">↗</button>
          </div>
        )}
      </aside>
    </section>
  );
}
