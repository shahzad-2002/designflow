# DesignFlow

**From Client Brief to Final Approval — One Simple Workspace**

A client & design-project management workspace for freelancers, designers,
signage businesses, and creative studios. Version 1 runs entirely in the
browser (LocalStorage) — no backend, no paid APIs, no paid services.

## Status: MVP complete ✅

## What DesignFlow does

DesignFlow manages the full workflow between a design business and its
clients:

```
Client Request → Project Brief → Project → Design → Revision →
Approval → Quotation → Invoice → Tasks → Completion
```

## Features that actually work

- **Dashboard** — live stat cards (active projects, new requests, awaiting
  approval, pending revisions, pending payments, completed projects, total
  revenue), a project-status chart, upcoming deadlines, recent projects and
  clients, and pending tasks — all computed from real stored data.
- **Clients** — add, edit, delete, search. Each client has a profile page
  showing their details, total paid, pending amount, and their projects.
- **Services** — a full catalog (Branding, Social Media, Product/E-commerce,
  Signage) you can start a new project from directly.
- **Dynamic Client Brief** — selecting a service shows the relevant brief
  questions automatically (e.g. an LED Sign asks for width/height/material;
  a Logo asks for industry/style/brand description), including a real image
  upload stored as part of the project.
- **Projects** — create/edit/delete/search/filter. Creating a project
  automatically generates its default task checklist.
- **Project Workspace** — a tabbed view per project: Overview, Brief, Tasks
  (add/change status/delete), Revisions (request one — it auto-creates a
  task and moves the project to "Revision Requested"), and Approval
  (Approve Design / Request Revision buttons that really change status).
- **Quotes & Invoices** — line-item editors with auto-generated numbers and
  automatic subtotal/discount/tax/total calculation. Invoices also track
  paid amount, remaining balance, and a live payment status
  (Unpaid/Partially Paid/Paid/Overdue).
- **Tasks & Revisions** (global) — cross-project views with search, filters,
  and inline status changes.
- **Notifications** — a bell dropdown with unread count. Notifications are
  created automatically when a project is created, a revision is requested,
  a design is approved, an invoice becomes overdue, or a deadline is within
  3 days.
- **Reports** — totals, most requested service, and charts for revenue per
  month, completed projects per month, and project status distribution.
- **Settings** — business name/email (shown in the sidebar), reset to demo
  data, and clear all data.
- Realistic demo data seeds itself on first load so the app is never empty.
- Responsive layout: the sidebar collapses into a slide-out menu on mobile.
- An error boundary keeps the app from showing a blank crashed screen.

## Technologies used

- React 18 + Vite
- Tailwind CSS
- React Router (HashRouter, for GitHub Pages compatibility)
- lucide-react (icons)
- recharts (charts)
- Browser LocalStorage — no backend, no database, no paid APIs

## How data is stored

Everything is saved in the browser's LocalStorage under keys prefixed
`df_` (e.g. `df_clients`, `df_projects`). Nothing leaves the browser —
there is no server. Clearing browser data or using a different browser/
device starts fresh. `src/utils/storage.js` has the read/write helpers;
`src/utils/seed.js` seeds demo data once, the first time the app runs.

## Run it locally

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## Deploy it (GitHub Pages, automatic)

This repo includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds and deploys the app to GitHub
Pages automatically every time you push to the `main` branch — no local
build required.

**One-time setup:**
1. In your GitHub repository, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to **GitHub Actions**.
3. Push any change to `main` (or re-upload files) — the "Deploy to GitHub
   Pages" action will run automatically.
4. Once it finishes (check the **Actions** tab for a green checkmark), your
   site is live at `https://<your-username>.github.io/<repo-name>/`.

## What's functional vs. what's future work

Functional now: everything listed under "Features that actually work"
above — every button does what it says (add really adds, delete really
deletes, approve really changes status, totals really calculate).

Future improvements (not required for this MVP, kept in mind in the
architecture):
- Real backend + database (currently LocalStorage only, so data is
  per-browser and not shared between devices/team members)
- Real user authentication/login
- AI-assisted brief extraction (turning a long client message into a
  structured brief automatically) — the brief system is already structured
  so this could plug in later
- File attachments beyond a single reference image (e.g. multiple design
  version files, PDFs)
- Email/SMS notifications (current notifications are in-app only)
