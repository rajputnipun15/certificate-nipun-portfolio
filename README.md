# Nipun Kumar Kushwah — Certificate Portfolio Showcase

A state-of-the-art, luxury dark-themed Certificate Portfolio website built specifically for **Nipun Kumar Kushwah** (Software Engineer, Full Stack Developer, Graphic Designer, Photographer, Creative Thinker).

This application exists solely to showcase verified professional certifications, skills mastery, and learning credentials in an editorial, high-performance web experience inspired by Apple, Vercel, Linear, Notion, Framer, and Awwwards.

---

## 🌟 Key Features

- **Dark Luxury Aesthetics**: Obsidian dark theme (`#050505` bg, `#111111` surface, `#191919` cards, `#F97316` accent), glassmorphism UI, radial glow effects, and custom magnetic cursor.
- **30 Pre-Indexed Certifications**: Pre-parsed real credentials across AI & Machine Learning, Software Engineering, Full Stack Web Development, Cyber Security, Data Analytics, and UI/UX Design.
- **Interactive PDF & Image Viewer**: High-resolution viewer with zooming, page navigation, fullscreen modal, and direct PDF downloads.
- **AI/Regex Auto-Extraction Engine**: Upload a PDF or image in the Admin Dashboard, and the client parser automatically extracts Title, Organization, Credential ID, Issue Date, Verification Links, and Skill Tags.
- **Hidden Admin Dashboard (`/admin`)**:
  - Protected access with passcode / Supabase Auth (`passcode: nipun2026`).
  - Drag & drop multi-file upload for PDFs and images.
  - Live metadata editor & real-time publish without redeploying code.
  - Reorder, feature toggle, delete, and Google Drive URL update capabilities.
- **Google Drive Vault**: Dedicated "View Complete Certificate Collection" button linking to an uncompressed cloud folder.
- **Resume Viewer**: Official curriculum vitae preview and download hub.
- **SEO & Performance**: Built with Next.js 15 App Router, Schema.org JSON-LD, automated `sitemap.xml`, `robots.txt`, and Open Graph tags.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom luxury color tokens & glass utilities
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Lenis](https://lenis.darkroom.engineering/) Smooth Scroll
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Database / Auth / Storage**: [Supabase JS Client](https://supabase.com/) & LocalStorage fallback
- **Parsing**: Client-side PDF buffer parser & pattern matching heuristics

---

## 📁 Directory Structure

```
├── app/
│   ├── layout.tsx             # Root layout, Google Fonts, JSON-LD Schema
│   ├── page.tsx               # Home landing page (Hero, Stats, Showcase, Quote)
│   ├── globals.css            # Dark luxury tokens & glassmorphism CSS
│   ├── certificates/
│   │   ├── page.tsx           # Certificate Library with search & filter pills
│   │   └── [id]/page.tsx      # Certificate Detail view & PDF previewer
│   ├── skills/
│   │   └── page.tsx           # Skills Matrix linked to verified certificates
│   ├── about/
│   │   └── page.tsx           # Editorial biography of Nipun Kumar Kushwah
│   ├── resume/
│   │   └── page.tsx           # Official Resume PDF Viewer & Downloads
│   ├── contact/
│   │   └── page.tsx           # Dark glass contact form & social links
│   ├── admin/
│   │   └── page.tsx           # Hidden Admin Console (/admin)
│   ├── sitemap.ts             # Dynamic sitemap generator
│   └── robots.ts              # Search engine index directives
├── components/
│   ├── layout/                # Navbar & Footer components
│   ├── ui/                    # CustomCursor, SmoothScroll, GlassCard, Toast
│   └── certificates/          # CertificateCard, CertificateGrid, PDFViewer
├── lib/
│   ├── types.ts               # TypeScript data interfaces
│   ├── certificates-data.ts   # 30 pre-populated certificate records & skills
│   ├── storage.ts             # Persistent LocalStorage & Supabase sync state
│   ├── pdf-parser.ts          # Auto-extraction engine for PDFs/images
│   └── supabase.ts            # Supabase client helper
└── public/
    └── certificates/          # 30 PDF and PNG certificate files
```

---

## 💻 Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Access Admin Panel**:
   Navigate to `/admin` and enter passcode `nipun2026`.

---

## ⚡ Deployment Guide (Vercel)

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.app).
3. Set Node.js version to `20.x` or latest.
4. Add environment variables from `.env.example` if using live Supabase/Cloudinary services.
5. Click **Deploy**.

---

© 2026 Nipun Kumar Kushwah. Built with precision and passion.
