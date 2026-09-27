# DesignFlow

**From Client Brief to Final Approval — One Simple Workspace**

A client & design-project management workspace for freelancers, designers,
signage businesses, and creative studios. Version 1 runs entirely in the
browser (LocalStorage) — no backend, no paid APIs.

## Status: Step 4 complete ✅

- Project scaffolded with Vite + React + Tailwind
- React Router wired up for every planned page
- Sidebar + Topbar app shell (responsive, mobile sidebar collapses)
- LocalStorage utility functions (`saveData`, `getData`, `updateData`,
  `deleteData`, `addData`, `findById`)
- Full services catalog (Branding, Social Media, Product/E-commerce, Signage)
- Realistic demo data (5 clients, 6 projects, tasks, quotes, invoices,
  revisions, notifications) that seeds itself into LocalStorage on first run
- **Clients page**: add, edit, delete, and search clients
- **Client Profile page**: details, total paid/pending, their projects
- **Dynamic Client Brief**: selecting a service shows the right brief
  questions automatically (signage, logo, branding, social media, product)
  — including a real working image upload stored in LocalStorage
- **Projects page**: create/edit/delete/search/filter projects. Creating a
  project automatically generates its default task checklist
- **Project Detail workspace**: Overview, Brief, Tasks (add/change
  status/delete), Revisions (request/track, auto-creates a task and moves
  the project to "Revision Requested"), and Approval (Approve Design /
  Request Revision buttons that actually change project status)
- Placeholder pages for Dashboard, Services, Quotes, Invoices, Tasks,
  Revisions, Reports, Settings

Next: the global Dashboard with live stats, and the global Tasks/Revisions
pages that show items across all projects.

## Run it locally

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
# 1. unzip the project, then inside the folder:
npm install

# 2. start the dev server
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## Tech stack

- React + Vite
- Tailwind CSS
- React Router
- lucide-react (icons)
- recharts (charts, used later in Reports)
- Browser LocalStorage (no backend)
