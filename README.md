# Centronea

Frontend web app for managing and publishing a car catalog. The project includes a public storefront for browsing vehicles and a protected admin panel for creating, editing, and deleting listings with image uploads to Supabase Storage.

## Overview

This project is built as a single-page application with:

- A public home page with search, filters, and featured vehicle cards
- A vehicle detail page with gallery, pricing, description, and WhatsApp contact CTA
- A login screen for administrators
- A protected admin panel to manage listings and their photos

## Tech Stack

- React 19
- Vite 6
- React Router
- Tailwind CSS
- Supabase JavaScript client
- `@dnd-kit/*` for image management interactions in the admin area
- Vercel config for SPA routing

## Main Features

- Vehicle catalog fetched from a Supabase table called `autos`
- Search and filtering by text, status, and sort order
- Detail page with image gallery and pricing in USD and/or ARS
- WhatsApp inquiry link generated from the current vehicle and page URL
- Admin CRUD flow for vehicles
- Image upload and deletion in the Supabase Storage bucket `fotos-autos`
- Session-based route protection for `/admin`

## Project Structure

```text
src/
  assets/              Static images
  components/          Reusable UI components
  components/admin/    Admin-specific components
  hooks/               Data and state hooks
  layouts/             Shared layout wrappers
  lib/                 Supabase, auth, storage, and utility logic
  pages/               Route-level pages
```

Important files:

- `src/App.jsx`: application routes
- `src/hooks/useAutos.js`: catalog CRUD logic
- `src/lib/supabaseClient.js`: Supabase initialization
- `src/lib/storage.js`: image upload/delete helpers
- `src/lib/adminAuth.js`: current admin authentication logic
- `vercel.json`: rewrite rule for SPA routing

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

## Supabase Requirements

The app expects:

- A table named `autos`
- A public storage bucket named `fotos-autos`

Based on the frontend usage, each vehicle record should include fields similar to:

- `id`
- `marca`
- `modelo`
- `anio`
- `precio`
- `precio_ars`
- `descripcion`
- `estado`
- `fotos`

`fotos` is expected to be an array of public image URLs.

## Routing

Defined routes:

- `/` public catalog
- `/auto/:id` vehicle detail page
- `/login` admin login
- `/admin` protected admin panel

Vercel is configured to rewrite all routes to `index.html`, which is required for client-side routing in production.

## Authentication Note

The current admin authentication is client-side only and uses hardcoded credentials stored in `src/lib/adminAuth.js`, with session data saved in `sessionStorage`.

This is convenient for a prototype or internal deployment, but it is not secure for a real production environment. If this project will be used publicly, the next step should be moving admin authentication to a proper backend or Supabase Auth flow.

## Deployment

This project is ready to deploy as a static frontend on Vercel.

Before deploying, make sure the hosting environment includes:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Notes for Future Maintenance

- The UI text is currently written in Spanish
- Vehicle pricing supports USD, ARS, or both, but at least one price is required
- When a vehicle is deleted, the app also attempts to remove its images from Supabase Storage
- If Supabase env vars are missing, the app surfaces a configuration error in the UI
