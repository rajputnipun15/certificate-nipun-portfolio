# Production Deployment & Setup Guide

This document explains how to set up Supabase, Cloudinary, and deploy Nipun Kumar Kushwah's Certificate Portfolio to Vercel.

---

## 1. Supabase Setup Guide

1. Log in to [Supabase](https://supabase.com) and create a new project named `nipun-certificate-portfolio`.
2. Go to **Project Settings -> API** and copy:
   - `Project URL`
   - `anon / public API Key`
3. Add these credentials to `.env.local` or Vercel Environment Variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Create a SQL Table named `certificates` in Supabase SQL Editor if you wish to persist uploads in PostgreSQL database:
   ```sql
   create table certificates (
     id text primary key,
     title text not null,
     organization text,
     course_name text,
     issue_date text,
     credential_id text,
     verification_link text,
     category text,
     skills text[],
     description text,
     featured boolean default false,
     file_url text,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```

---

## 2. Cloudinary Setup Guide (Optional)

1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. Go to **Dashboard -> Product Environment Settings -> Upload presets**.
3. Create an unsigned upload preset named `nipun_certs`.
4. Copy your `Cloud Name` and add to Vercel environment variables:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_PRESET=nipun_certs
   ```

---

## 3. Vercel Deployment

1. Initialize git in your local directory (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Nipun Certificate Portfolio"
   ```
2. Push your repository to GitHub or GitLab.
3. Go to [Vercel Dashboard](https://vercel.com/new), select your repo, and click **Deploy**.
4. Vercel will automatically build the Next.js 15 application. Your site will be live within 60 seconds!
