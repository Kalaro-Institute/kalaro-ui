# Kalaro Institute of HMO Operations — Web Platform

The official website for **Kalaro Institute of HMO Operations**, Nigeria's premier training platform for managed healthcare professionals. Built with React, Vite, TypeScript, and Tailwind CSS.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)
8. [Routing](#routing)
9. [Component Guidelines](#component-guidelines)
10. [Styling Conventions](#styling-conventions)
11. [Adding New Pages](#adding-new-pages)
12. [Adding New Components](#adding-new-components)
13. [Working with Images](#working-with-images)
14. [Contributing](#contributing)
15. [Code Review Checklist](#code-review-checklist)
16. [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a multi-page React application that serves as the public-facing website for Kalaro Institute. It includes:

- **Home** — Hero, courses preview, stats, testimonials, blog, and careers CTA
- **Courses** — Searchable and filterable full course catalogue
- **About** — Mission, vision, values, team, and timeline
- **Community** — Forums, events, mentorship, and member spotlight
- **Careers** — Live HMO job board with search and filters
- **Live Classes** — Upcoming and recorded session listings
- **Contact** — Enquiry form and FAQ accordion
- **Sign Up / Login** — Multi-step registration and authentication forms

---

## Tech Stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Framework       | React 18                    |
| Language        | TypeScript                  |
| Build Tool      | Vite 6                      |
| Routing         | React Router v7 (Data Mode) |
| Styling         | Tailwind CSS v4             |
| Icons           | Lucide React                |
| Animation       | Motion (motion/react)       |
| Package Manager | pnpm                        |
| Node Version    | 18+                         |

---

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

### 1. Node.js (v18 or higher)

```bash
# Check your current version
node --version

# If you need to install or upgrade, use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 18
nvm use 18
```

### 2. pnpm

This project uses **pnpm** as its package manager. Do not use `npm` or `yarn` — they will create conflicting lockfiles.

```bash
# Install pnpm globally via npm
npm install -g pnpm

# Or via Homebrew on macOS
brew install pnpm

# Verify installation
pnpm --version
```

### 3. Git

```bash
git --version
# Should return git version 2.x or higher
```

---

## Getting Started

Follow these steps exactly to get the project running locally.

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-org/kalaro-institute.git
cd kalaro-institute
```

### Step 2 — Install dependencies

```bash
pnpm install
```

This will install all dependencies listed in `package.json` using the exact versions pinned in `pnpm-lock.yaml`. Do not run `npm install` — it will generate a conflicting `package-lock.json`.

### Step 3 — Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the required values. See [Environment Variables](#environment-variables) for details.

### Step 4 — Start the development server

```bash
pnpm dev
```

The app will be available at **http://localhost:5173**

Vite's HMR (Hot Module Replacement) is enabled by default — changes to source files will reflect instantly in the browser without a full page reload.

### Step 5 — Verify the setup

Open your browser and navigate to:

- `http://localhost:5173` — Home page
- `http://localhost:5173/courses` — Courses page
- `http://localhost:5173/about` — About page
- `http://localhost:5173/signup` — Sign-up form

If all pages load without errors in the browser console, your setup is complete.

---

## Project Structure

```
kalaro-institute/
├── public/                     # Static assets served at root
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── App.tsx             # Root component — mounts RouterProvider
│   │   ├── routes.tsx          # All route definitions (createBrowserRouter)
│   │   ├── components/
│   │   │   ├── Layout.tsx      # Shared navbar + footer wrapper
│   │   │   ├── MobileCarousel.tsx  # Reusable touch-swipe carousel
│   │   │   └── figma/
│   │   │       └── ImageWithFallback.tsx  # Safe image renderer
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── Courses.tsx
│   │       ├── About.tsx
│   │       ├── Community.tsx
│   │       ├── Careers.tsx
│   │       ├── LiveClasses.tsx
│   │       ├── Contact.tsx
│   │       ├── SignUp.tsx
│   │       └── Login.tsx
│   ├── imports/
│   │   ├── logo.jpeg           # Kalaro logo — import as ES module
│   │   └── image.png           # Reference design screenshot
│   ├── styles/
│   │   ├── fonts.css           # Google Fonts @import declarations
│   │   ├── theme.css           # CSS custom properties (design tokens)
│   │   └── index.css           # Tailwind directives + @theme inline mapping
│   └── main.tsx                # Vite entry point
├── .env.example                # Template for required environment variables
├── .env.local                  # Your local env vars (git-ignored)
├── index.html                  # Vite HTML entry
├── package.json
├── pnpm-lock.yaml              # Lockfile — never edit manually
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
```

### Key directories explained

| Directory               | Purpose                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `src/app/components/` | Shared UI components used across multiple pages                                     |
| `src/app/pages/`      | One file per route — each exports a default React component                        |
| `src/imports/`        | Static assets (images, logos). Always import via ES module, never use string paths. |
| `src/styles/`         | Global CSS. Edit`theme.css` for design tokens, `fonts.css` for typefaces.       |

---

## Environment Variables

Copy `.env.example` to `.env.local` and populate the values:

```env
# App
VITE_APP_NAME=Kalaro Institute
VITE_APP_URL=http://localhost:5173

# API (when backend is connected)
VITE_API_BASE_URL=https://api.kalaroinstitute.com

# Analytics (optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Rules:**

- All variables must be prefixed with `VITE_` to be accessible in the browser bundle.
- Never commit `.env.local` — it is listed in `.gitignore`.
- Never put secrets (API keys with write access, database credentials) in any `VITE_*` variable — they are exposed in the browser.

---

## Available Scripts

Run all scripts from the project root using `pnpm`:

```bash
# Start development server with HMR
pnpm dev

# Type-check without emitting files
pnpm typecheck

# Build for production (outputs to dist/)
pnpm build

# Preview the production build locally
pnpm preview

# Lint source files
pnpm lint

# Format source files
pnpm format
```

### Production build

```bash
pnpm build
# Output is written to dist/
# Serve locally to check before deploying:
pnpm preview
```

---

## Routing

Routes are defined in `src/app/routes.tsx` using React Router v7's `createBrowserRouter`.

### Route structure

```
/                   → Home
/courses            → Courses (filterable catalogue)
/about              → About
/community          → Community
/careers            → Careers & Job Board
/live-classes       → Live Classes & Recordings
/contact            → Contact & FAQ
/resources/blog     → Blog (placeholder)
/resources/webinars → Webinars (placeholder)
/resources/library  → Resource Library (placeholder)
/resources/glossary → HMO Glossary (placeholder)
/signup             → Sign-Up wizard (no Layout wrapper)
/login              → Login form (no Layout wrapper)
```

Pages under `/` use `Layout.tsx` (navbar + footer). Auth pages (`/signup`, `/login`) are registered at the root level outside `Layout` so they render full-screen with no navigation chrome.

### Adding a new route

1. Create `src/app/pages/MyPage.tsx` with a default export.
2. Import it in `src/app/routes.tsx`.
3. Add a `{ path: "my-page", Component: MyPage }` entry inside the appropriate route array.
4. If the page needs the navbar and footer, add it as a child of the Layout route. If it is a standalone full-screen page (e.g. auth), add it at the top level.

---

## Component Guidelines

### MobileCarousel

`src/app/components/MobileCarousel.tsx` — A CSS scroll-snap carousel for mobile. Used on every card grid section to give a swipeable experience on small screens.

**Usage pattern — always pair with a hidden desktop grid:**

```tsx
import { MobileCarousel } from "@/app/components/MobileCarousel";

// Mobile: carousel (hidden on sm and above)
<div className="sm:hidden -mx-4 px-4">
  <MobileCarousel cardWidth="w-[80vw]">
    {items.map((item, i) => <MyCard key={i} {...item} />)}
  </MobileCarousel>
</div>

// Desktop: regular grid (hidden below sm)
<div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item, i) => <MyCard key={i} {...item} />)}
</div>
```

**Props:**

| Prop          | Type                  | Default                 | Description                        |
| ------------- | --------------------- | ----------------------- | ---------------------------------- |
| `children`  | `React.ReactNode[]` | required                | Array of card elements             |
| `cardWidth` | `string`            | `"w-[80vw] max-w-sm"` | Tailwind width class for each card |
| `arrows`    | `boolean`           | `true`                | Show prev/next arrow buttons       |

**Notes:**

- Pass `-mx-4 px-4` on the wrapper `div` to allow cards to bleed to screen edges on mobile.
- `cardWidth` should not exceed `90vw` — leave space for the peek effect that signals swipeability.
- Cards should have `h-full flex flex-col` to maintain equal heights within the carousel.

### ImageWithFallback

`src/app/components/figma/ImageWithFallback.tsx` — Wraps `<img>` with a graceful placeholder on error. Use this for every image in the app.

```tsx
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoSrc from "@/imports/logo.jpeg"; // Always import as ES module

<ImageWithFallback
  src={logoSrc}
  alt="Kalaro Institute logo"
  className="h-14 w-auto object-contain"
/>
```

**Never** use a bare `<img>` tag or a raw path string in `src`.

---

## Styling Conventions

### Design tokens

Edit `src/styles/theme.css` to change global colours, radii, and spacing. The key brand tokens are:

```css
--primary: #1b5e20;          /* Deep forest green — buttons, active states */
--accent: #4caf50;           /* Bright green — highlights, badges */
--background: #ffffff;       /* Page background */
--foreground: #1a2332;       /* Primary text */
```

All tokens are mapped to Tailwind utilities via `@theme inline` in the same file, so `bg-primary`, `text-foreground`, `border-border` etc. are all available as Tailwind classes.

### Tailwind usage rules

- Use Tailwind utilities exclusively. Avoid inline `style={}` except for `backgroundImage` URLs and `backgroundAttachment: "fixed"` (not expressible as Tailwind utilities).
- Responsive prefix order: mobile-first. Write `text-sm md:text-base lg:text-lg`, not the reverse.
- The brand dark background is `bg-[#071a08]`. The dark green is `bg-[#1b5e20]`. Use these directly rather than one-off custom values.

### Background images

Sections that use a photographic background must follow this pattern:

```tsx
<section
  style={{
    backgroundImage: "url(https://...)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
  className="relative overflow-hidden"
>
  {/* Always add a colour overlay as the first child */}
  <div className="absolute inset-0 bg-[#1b5e20]/90" />
  {/* All content goes in a relative container */}
  <div className="relative max-w-7xl mx-auto px-6">
    ...
  </div>
</section>
```

Overlay opacity guide:

- Dark green hero sections: `bg-[#071a08]/90`
- Green CTA sections: `bg-[#1b5e20]/92`
- Light sections (text overlay on white): `bg-white/95`

### Fonts

Fonts are loaded in `src/styles/fonts.css`. The primary typeface is **Poppins**. Apply it on page root divs with `font-[Poppins,sans-serif]`.

---

## Adding New Pages

1. **Create the file:**

   ```bash
   touch src/app/pages/MyNewPage.tsx
   ```
2. **Write the component** — export a default React function:

   ```tsx
   export default function MyNewPage() {
     return (
       <div className="font-[Poppins,sans-serif]">
         {/* Page header section */}
         <section className="bg-[#071a08] py-20 ...">
           ...
         </section>
         {/* Content sections */}
       </div>
     );
   }
   ```
3. **Register the route** in `src/app/routes.tsx`:

   ```tsx
   import MyNewPage from "./pages/MyNewPage";

   // Inside the Layout children array:
   { path: "my-new-page", Component: MyNewPage },
   ```
4. **Add a nav link** if needed — edit the `NAV` array in `src/app/components/Layout.tsx`.
5. **Follow the section pattern:**

   - Every page should open with a hero/header section using the dark green background.
   - Card grids must use the `MobileCarousel` + desktop grid pair.
   - CTAs at the bottom should use a background image with a colour overlay.

---

## Adding New Components

1. Place shared components in `src/app/components/`.
2. Place page-specific sub-components as named functions within the page file itself (not in separate files) to keep co-location and reduce import noise.
3. Keep components small and single-purpose. If a component exceeds ~80 lines it is likely doing too much.

---

## Working with Images

### Local images (logo, brand assets)

All local images live in `src/imports/`. Import them as ES modules:

```tsx
import logo from "@/imports/logo.jpeg";

<ImageWithFallback src={logo} alt="Kalaro Institute" className="h-14 w-auto" />
```

**Never** reference them as `/src/imports/logo.jpeg` — Vite fingerprints and relocates assets at build time and the literal path will break in production.

### Remote images (Unsplash, CDN)

Use full absolute URLs in `backgroundImage` style props or directly in `ImageWithFallback`:

```tsx
<ImageWithFallback
  src="https://images.unsplash.com/photo-xxxx?w=800&q=80"
  alt="Description"
  className="w-full h-60 object-cover"
/>
```

Always append `?w=800&q=80` (or appropriate width) to Unsplash URLs to avoid loading full-resolution originals.

---

## Contributing

### Workflow

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```
2. **Make your changes** — keep commits small and focused.
3. **Type-check before committing:**

   ```bash
   pnpm typecheck
   ```
4. **Commit** using conventional commit format:

   ```
   feat: add testimonials carousel to community page
   fix: correct MobileCarousel dot index on fast swipe
   chore: update Poppins font weights
   ```
5. **Push and open a pull request** against `main`:

   ```bash
   git push origin feat/your-feature-name
   ```
6. Request at least one review before merging.

### Branch naming

| Prefix       | Use for                                  |
| ------------ | ---------------------------------------- |
| `feat/`    | New features or pages                    |
| `fix/`     | Bug fixes                                |
| `chore/`   | Dependency updates, config changes       |
| `content/` | Copy changes, data updates, image swaps  |
| `style/`   | Visual-only changes with no logic change |

---

## Code Review Checklist

Before submitting a PR, verify the following:

- [ ] `pnpm typecheck` passes with zero errors
- [ ] No `any` types introduced without a comment explaining why
- [ ] All images use `ImageWithFallback`, not bare `<img>`
- [ ] All local image imports use the ES module pattern (`import x from "@/imports/..."`)
- [ ] Every card grid section has both a `sm:hidden` carousel and a `hidden sm:grid` desktop grid
- [ ] No inline styles except for `backgroundImage` and `backgroundAttachment`
- [ ] New routes are registered in `routes.tsx`
- [ ] Pages that need the navbar are nested under the Layout route
- [ ] No hardcoded colours outside of Tailwind — use tokens (`bg-primary`, `text-foreground`) or the approved brand hex codes (`#071a08`, `#1b5e20`, `#4caf50`)
- [ ] Responsive: tested at 375px (mobile), 768px (tablet), and 1280px (desktop)
- [ ] No `console.log` statements left in production code

---

## Troubleshooting

### `Failed to resolve import` error on startup

**Cause:** A new page or component file is referenced in `routes.tsx` before it has been created.

**Fix:** Create the missing file first, then restart `pnpm dev`.

---

### Styles not updating after editing `theme.css`

**Fix:** Vite should hot-reload CSS automatically. If it doesn't, stop the dev server (`Ctrl+C`) and re-run `pnpm dev`.

---

### Image shows broken in production but works in dev

**Cause:** You are using a string literal path (`src="/src/imports/logo.jpeg"`) instead of an ES module import.

**Fix:**

```tsx
// Wrong
<img src="/src/imports/logo.jpeg" />

// Correct
import logo from "@/imports/logo.jpeg";
<ImageWithFallback src={logo} alt="Logo" />
```

---

### `pnpm install` fails with peer dependency errors

**Fix:** Make sure you are on Node 18+:

```bash
node --version   # should be v18.x.x or higher
nvm use 18
pnpm install
```

---

### TypeScript error: `Cannot find module '@/...'`

**Cause:** The `@/` path alias is configured in `tsconfig.app.json` and `vite.config.ts`. If you are seeing this error, one of these files may have been accidentally modified.

**Fix:** Check that both files contain:

```json
// tsconfig.app.json
"paths": { "@/*": ["./src/*"] }
```

```ts
// vite.config.ts
resolve: { alias: { "@": "/src" } }
```

---

### Carousel dots not updating on fast swipe

**Cause:** The `onScroll` handler debounces via browser paint cycles. On very fast swipes the `current` index can lag by one frame.

**Workaround:** This is a known cosmetic issue. The correct card is still displayed — only the active dot may lag briefly. A `requestAnimationFrame`-based scroll listener can eliminate this if needed in future.

---

*For any issues not covered here, open a GitHub Issue with a clear description of the problem, the steps to reproduce it, and your Node and pnpm versions.*
