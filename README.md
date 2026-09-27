# DesignFlow

**From Client Brief to Final Approval — One Simple Workspace**

A client & design-project management workspace for freelancers, designers,
signage businesses, and creative studios. Version 1 runs entirely in the
browser (LocalStorage) — no backend, no paid APIs.

## Status: Step 2 complete ✅

- Project scaffolded with Vite + React + Tailwind
- React Router wired up for every planned page
- Sidebar + Topbar app shell (responsive, mobile sidebar collapses)
- LocalStorage utility functions (`saveData`, `getData`, `updateData`,
  `deleteData`, `addData`, `findById`)
- Full services catalog (Branding, Social Media, Product/E-commerce, Signage)
- Realistic demo data (5 clients, 6 projects, tasks, quotes, invoices,
  revisions, notifications) that seeds itself into LocalStorage on first run
- Placeholder pages for Dashboard, Clients, Projects, Services, Quotes,
  Invoices, Tasks, Revisions, Reports, Settings

Next: wiring the Clients and Projects pages up to this data (CRUD screens).

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
