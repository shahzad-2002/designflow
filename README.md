# DesignFlow

**From Client Brief to Final Approval — One Simple Workspace**

A client & design-project management workspace for freelancers, designers,
signage businesses, and creative studios. Version 1 runs entirely in the
browser (LocalStorage) — no backend, no paid APIs.

## Status: Step 5 complete ✅

- Project scaffolded with Vite + React + Tailwind
- React Router wired up for every planned page
- Sidebar + Topbar app shell (responsive, mobile sidebar collapses)
- LocalStorage utility functions (`saveData`, `getData`, `updateData`,
  `deleteData`, `addData`, `findById`)
- Full services catalog (Branding, Social Media, Product/E-commerce, Signage)
- Realistic demo data that seeds itself into LocalStorage on first run
- **Clients page**: add, edit, delete, and search clients
- **Client Profile page**: details, total paid/pending, their projects
- **Dynamic Client Brief**: service-specific brief questions + real image upload
- **Projects page**: create/edit/delete/search/filter, auto-creates default tasks
- **Project Detail workspace**: Overview, Brief, Tasks, Revisions, Approval
- **Dashboard**: live stat cards (Active Projects, New Requests, Awaiting
  Approval, Pending Revisions, Pending Payments, Completed Projects, Total
  Revenue) computed from real data, a project-status bar chart, upcoming
  deadlines, recent projects/clients, and pending tasks — nothing here is
  hard-coded
- Placeholder pages for Services, Quotes, Invoices, Tasks, Revisions,
  Reports, Settings

Next: the global Tasks and Revisions pages (cross-project views), then Quotes
and Invoices with automatic total calculations.

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
