import { MetadataRoute } from 'next';
import { INITIAL_CERTIFICATES } from '@/lib/certificates-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nipun-certificates.vercel.app';

  const routes = ['', '/certificates', '/skills', '/about', '/resume', '/contact'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  const certRoutes = INITIAL_CERTIFICATES.map((cert) => ({
    url: `${baseUrl}/certificates/${cert.id}`,
    lastModified: new Date(cert.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...certRoutes];
}
