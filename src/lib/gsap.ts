import { gsap } from 'gsap';

/**
 * Punto único de entrada a GSAP.
 * Registrar plugins y defaults aquí evita repetirlo en cada componente.
 */
gsap.defaults({ ease: 'power2.out', duration: 0.6 });

export { gsap };
