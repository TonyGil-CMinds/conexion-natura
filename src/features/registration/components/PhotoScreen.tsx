'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { DETAILS_MARQUEE, PHOTO_MARQUEE } from '../config/event-options';
import {
  CROP_LIMITS,
  CROP_RESET,
  removePhotoBackground,
  renderPortrait,
  type Crop,
} from '../lib/portrait';
import styles from './PhotoScreen.module.css';

type Props = {
  copy: Dictionary['registration']['photo'];
  /**
   * Confirma el registro con el retrato ya recortado, si hay alguno. Llega como
   * `Blob` y no como el archivo elegido: lo que se sube es el recorte.
   */
  onConfirm?: (photo: Blob | null) => Promise<void> | void;
  onBack?: () => void;
};

/**
 * Entrada y salida, las mismas que los pasos anteriores: en cascada al entrar y
 * en la inversa al salir.
 */
const PANEL = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09 } },
  gone: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
} as const;

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
  gone: { opacity: 0, y: 16, transition: { duration: 0.24, ease: EASE_OUT_EXPO } },
} as const;

/**
 * Tope de tamaño de la imagen (bytes).
 *
 * El archivo no pasa por el servidor —se sube firmado a R2— así que el límite no
 * es técnico sino de cortesía: por encima de esto la subida se hace larga en una
 * conexión de móvil, y una foto de credencial no necesita más.
 */
const MAX_BYTES = 8 * 1024 * 1024;

/** El desplazamiento del ratón pesa menos que el del recorte: 214 pt en 280 px. */
const DRAG_RATIO = 0.76;

/**
 * Último paso: la fotografía de la credencial y la confirmación.
 *
 * La imagen es **opcional**. La credencial tiene su propio marcador cuando falta,
 * y bloquear aquí la confirmación por una foto dejaría fuera a quien se registra
 * desde un ordenador donde no tiene ninguna a mano.
 *
 * Al elegirla se le **quita el fondo** y se abre el editor de encuadre: la
 * ventana del retrato en la credencial es vertical y estrecha, así que sin
 * encuadrar casi ninguna foto cae donde debe.
 *
 * La subida a R2 no ocurre al elegir el archivo sino al confirmar: quien cambia
 * de imagen tres veces no deja tres archivos huérfanos en el bucket.
 */
export function PhotoScreen({ copy, onConfirm, onBack }: Props) {
  /** URL local de la imagen ya sin fondo. Es la fuente del editor y del recorte. */
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>(CROP_RESET);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  /** Arrastre en curso dentro del editor. */
  const dragRef = useRef<{ x: number; y: number; cropX: number; cropY: number } | null>(null);
  /** El editor se cuelga del `body`, y eso solo puede hacerse ya en el cliente. */
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  async function choose(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(copy.notImage);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(copy.tooBig);
      return;
    }

    setError(null);
    setIsRemoving(true);
    try {
      const cutout = await removePhotoBackground(file);
      // La vista previa sale del archivo en memoria: no hace falta subir nada
      // para que se vea. Se revoca la anterior para no dejar objetos colgando.
      setPreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(cutout);
      });
      setCrop(CROP_RESET);
      // El editor se abre solo: encuadrar es parte de elegir la foto, no un
      // ajuste opcional que haya que descubrir en un botón.
      setIsEditorOpen(true);
    } finally {
      setIsRemoving(false);
    }
  }

  async function confirm() {
    if (isSending || isRemoving) return;
    setError(null);
    setIsSending(true);
    try {
      // El recorte se cuece aquí: lo que se sube es lo que se ha visto.
      const portrait = preview ? await renderPortrait(preview, crop) : null;
      await onConfirm?.(portrait);
    } catch {
      setError(copy.failed);
    } finally {
      setIsSending(false);
    }
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, cropX: crop.x, cropY: crop.y };
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const start = dragRef.current;
    if (!start) return;
    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));
    setCrop((current) => ({
      ...current,
      x: clamp(
        start.cropX + (event.clientX - start.x) * DRAG_RATIO,
        CROP_LIMITS.x.min,
        CROP_LIMITS.x.max,
      ),
      y: clamp(
        start.cropY + (event.clientY - start.y) * DRAG_RATIO,
        CROP_LIMITS.y.min,
        CROP_LIMITS.y.max,
      ),
    }));
  }

  /** El mismo encuadre, en pantalla: la vista previa y el editor lo comparten. */
  const framing = {
    transform: `translate(calc(-50% + ${crop.x}px), calc(-50% + ${crop.y}px)) scale(${crop.zoom})`,
  };

  const isBusy = isSending || isRemoving;

  return (
    <motion.section
      className={styles.root}
      initial="hidden"
      animate="shown"
      exit="gone"
      variants={PANEL}
    >
      <motion.div className={styles.intro} variants={ITEM}>
        <div className={styles.heading}>
          {onBack && (
            <button type="button" className={styles.back} onClick={onBack}>
              <span className={styles.backIcon} aria-hidden />
              {copy.back}
            </button>
          )}

          <h1 className={styles.headline}>
            <span>{copy.headlineLine1}</span>
            <span>{copy.headlineLine2}</span>
          </h1>
        </div>

        {/* Sigue la moneda: la cara del paso anterior gira y entra esta. */}
        <motion.div
          className={styles.coin}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          exit={{ rotateY: 360 }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
        >
          <Image
            src={DETAILS_MARQUEE.src}
            alt=""
            width={200}
            height={200}
            className={`${styles.face} ${styles.faceFront}`}
            aria-hidden
          />
          <Image
            src={PHOTO_MARQUEE.src}
            alt=""
            width={200}
            height={200}
            className={`${styles.face} ${styles.faceBack}`}
            aria-hidden
          />
        </motion.div>
        <span className={styles.srOnly}>{copy.marquee}</span>
      </motion.div>

      <motion.div className={styles.panel} variants={PANEL}>
        <motion.p className={styles.step} variants={ITEM}>
          {copy.step}
        </motion.p>

        <motion.p className={styles.copy} variants={ITEM}>
          {copy.intro}
        </motion.p>

        {/**
         * La etiqueta **es** el control: envuelve al campo de archivo, que va
         * oculto a la vista pero presente, así que el clic y el teclado los
         * gobierna el navegador y no hay que reinventar el diálogo de archivos.
         */}
        <motion.label
          className={styles.drop}
          data-filled={preview ? true : undefined}
          variants={ITEM}
        >
          <input
            type="file"
            accept="image/*"
            className={styles.srOnly}
            onChange={(event) => choose(event.target.files?.[0])}
            disabled={isBusy}
          />

          <AnimatePresence mode="wait" initial={false}>
            {isRemoving ? (
              <motion.span
                key="removing"
                className={styles.dropLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
              >
                {copy.removing}
                <span className={styles.loader} aria-hidden>
                  {Array.from({ length: 9 }, (_, index) => (
                    <span key={index} style={{ ['--cell' as string]: index }} />
                  ))}
                </span>
              </motion.span>
            ) : preview ? (
              <motion.span
                key="preview"
                className={styles.previewRow}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
              >
                {/* La vista previa enseña **la ventana de la credencial**, con el
                    encuadre puesto: si mostrara la foto entera, el recorte solo
                    se vería al descargar la tarjeta. */}
                <span className={styles.previewFrame}>
                  {/* Sin `next/image`: la fuente es un blob del navegador, que
                      el optimizador no puede procesar. */}
                  <img src={preview} alt="" style={framing} draggable={false} />
                </span>
                <span className={styles.dropLabel}>{copy.change}</span>
              </motion.span>
            ) : (
              <motion.span
                key="empty"
                className={styles.dropLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
              >
                {copy.upload}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.label>

        {/* Volver al editor. Va fuera de la etiqueta del archivo: dentro, un clic
            abriría el diálogo de archivos en vez del encuadre. */}
        <AnimatePresence initial={false}>
          {preview && !isRemoving && (
            <motion.button
              type="button"
              className={styles.adjust}
              onClick={() => setIsEditorOpen(true)}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
            >
              <span className={styles.adjustIcon} aria-hidden />
              {copy.adjust}
            </motion.button>
          )}
        </AnimatePresence>

        <motion.div className={styles.actions} variants={ITEM}>
          <button
            type="button"
            className={styles.submit}
            onClick={confirm}
            disabled={isBusy}
            data-sending={isSending || undefined}
          >
            {isSending ? copy.sending : copy.submit}
            {isSending && (
              <span className={styles.loader} aria-hidden>
                {Array.from({ length: 9 }, (_, index) => (
                  <span key={index} style={{ ['--cell' as string]: index }} />
                ))}
              </span>
            )}
          </button>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                className={styles.error}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/**
       * Editor de encuadre. La ventana tiene la proporción de la del arte
       * (214×270), así que lo que se ve aquí es lo que acaba en la tarjeta.
       *
       * Va colgado del `body`: la pantalla crea contexto de apilamiento —tiene
       * `position` y `z-index` propios—, así que aquí dentro ningún `z-index`
       * supera a la cabecera y el diálogo salía por debajo de ella.
       */}
      {isMounted && createPortal(
      <AnimatePresence>
        {isEditorOpen && preview && (
          <motion.div
            className={styles.editor}
            role="dialog"
            aria-modal="true"
            aria-label={copy.cropTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              className={styles.dialog}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.36, ease: EASE_OUT_EXPO }}
            >
              <div className={styles.dialogHeading}>
                <div>
                  <p>{copy.cropTitle}</p>
                  <span>{copy.cropHint}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  aria-label={copy.cropClose}
                >
                  <span className={styles.closeIcon} aria-hidden />
                </button>
              </div>

              <div
                className={styles.viewport}
                onPointerDown={startDrag}
                onPointerMove={drag}
                onPointerUp={() => (dragRef.current = null)}
                onPointerCancel={() => (dragRef.current = null)}
              >
                <img src={preview} alt="" style={framing} draggable={false} />
                <span className={styles.viewportFrame} aria-hidden />
              </div>

              <div className={styles.controls}>
                <label>
                  {copy.cropZoom}
                  <input
                    type="range"
                    min={CROP_LIMITS.zoom.min}
                    max={CROP_LIMITS.zoom.max}
                    step={CROP_LIMITS.zoom.step}
                    value={crop.zoom}
                    onChange={(event) =>
                      setCrop((current) => ({ ...current, zoom: Number(event.target.value) }))
                    }
                  />
                </label>
                <label>
                  {copy.cropHorizontal}
                  <input
                    type="range"
                    min={CROP_LIMITS.x.min}
                    max={CROP_LIMITS.x.max}
                    value={crop.x}
                    onChange={(event) =>
                      setCrop((current) => ({ ...current, x: Number(event.target.value) }))
                    }
                  />
                </label>
                <label>
                  {copy.cropVertical}
                  <input
                    type="range"
                    min={CROP_LIMITS.y.min}
                    max={CROP_LIMITS.y.max}
                    value={crop.y}
                    onChange={(event) =>
                      setCrop((current) => ({ ...current, y: Number(event.target.value) }))
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                className={styles.cropConfirm}
                onClick={() => setIsEditorOpen(false)}
              >
                {copy.cropConfirm}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </motion.section>
  );
}
