import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import { INITIAL_USER_PROFILE } from '@/lib/certificates-data';
import { Analytics } from '@vercel/analytics/next';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${INITIAL_USER_PROFILE.name} — Certificate Portfolio & Learning Journey`,
  description: `${INITIAL_USER_PROFILE.name} — Software Engineer, Full Stack Developer, Graphic Designer, Photographer & Creative Thinker. Curated showcase of 30+ verified professional certifications.`,
  keywords: [
    'Nipun Kumar Kushwah',
    'Certificate Portfolio',
    'Software Engineer',
    'Full Stack Developer',
    'Coursera Certifications',
    'DeepLearning.AI',
    'IBM Certifications',
    'Udemy Credentials',
    'AI Engineering',
    'React',
    'Next.js',
    'Node.js',
    'Python'
  ],
  authors: [{ name: INITIAL_USER_PROFILE.name }],
  openGraph: {
    title: `${INITIAL_USER_PROFILE.name} — Certificate Portfolio`,
    description: INITIAL_USER_PROFILE.bio,
    url: 'https://nipun-certificates.vercel.app',
    siteName: 'Nipun Kumar Kushwah Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${INITIAL_USER_PROFILE.name} — Certificate Portfolio`,
    description: INITIAL_USER_PROFILE.bio,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: INITIAL_USER_PROFILE.name,
    jobTitle: INITIAL_USER_PROFILE.title,
    email: INITIAL_USER_PROFILE.email,
    sameAs: [
      INITIAL_USER_PROFILE.github,
      INITIAL_USER_PROFILE.linkedin,
      INITIAL_USER_PROFILE.instagram,
    ],
    knowsAbout: [
      'Software Engineering',
      'Artificial Intelligence',
      'Full Stack Web Development',
      'Cyber Security',
      'Graphic Design',
      'Photography'
    ]
  };

  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-white antialiased min-h-screen flex flex-col font-sans">
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <main className="flex-1 pt-24">{children}</main>
          <Footer />
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
