import type { NextConfig } from 'next';
import { GALLERY } from './src/features/gallery/config/gallery';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.pexels.com', pathname: '/photos/**' }] },

  /**
   * Las fotos de la galería, servidas desde este dominio aunque vivan en R2.
   *
   * El visor las sube a WebGL, y una textura de otro origen exige CORS de
   * lectura, que el bucket no tiene: su regla solo abre el PUT de los retratos,
   * y cambiarla pide un token de administración. Por el mismo dominio no hay
   * nada que pedir. Solo pasan por aquí las previews y las miniaturas; las
   * descargas van directas al bucket.
   *
   * Sin `R2_PUBLIC_BASE_URL` —en local, donde las claves no existen— no hay
   * reenvío, y la galería lee las fotos de `public/img`.
   */
  async rewrites() {
    const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, '');
    return {
      beforeFiles: base
        ? [{ source: `${GALLERY.proxyPath}/:path*`, destination: `${base}/${GALLERY.prefix}/:path*` }]
        : [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
