# DesignFlow

**From Client Brief to Final Approval — One Simple Workspace**

A client & design-project management workspace for freelancers, designers,
signage businesses, and creative studios. Version 1 runs entirely in the
browser (LocalStorage) — no backend, no paid APIs.

## Status: Step 3 complete ✅

- Project scaffolded with Vite + React + Tailwind
- React Router wired up for every planned page
- Sidebar + Topbar app shell (responsive, mobile sidebar collapses)
- LocalStorage utility functions (`saveData`, `getData`, `updateData`,
  `deleteData`, `addData`, `findById`)
- Full services catalog (Branding, Social Media, Product/E-commerce, Signage)
- Realistic demo data (5 clients, 6 projects, tasks, quotes, invoices,
  revisions, notifications) that seeds itself into LocalStorage on first run
- **Clients page**: add, edit, delete, and search clients — all real,
  working, and saved to LocalStorage
- **Client Profile page**: client details, total paid / pending amounts,
  and a list of that client's projects
- Placeholder pages for Dashboard, Projects, Services, Quotes, Invoices,
  Tasks, Revisions, Reports, Settings

Next: the Projects page (create/edit/delete/search + project detail workspace).

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
