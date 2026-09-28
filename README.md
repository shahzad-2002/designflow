# DesignFlow

**From Client Brief to Final Approval — One Simple Workspace**

A client & design-project management workspace for freelancers, designers,
signage businesses, and creative studios. Version 1 runs entirely in the
browser (LocalStorage) — no backend, no paid APIs.

## Status: Step 8 complete ✅

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
- **Dashboard**: live stat cards, project-status chart, deadlines, recent
  activity — all computed from real data
- **Quotes page**: create/edit/delete quotes with a line-item editor,
  auto-generated quote numbers, and automatic subtotal/discount/tax/total
  calculation
- **Invoices page**: create/edit/delete invoices with the same line-item
  editor, auto-generated invoice numbers, and automatic total/paid/remaining
  calculation with a live payment-status badge (Unpaid/Partially Paid/Paid/Overdue)
- **Tasks page**: all tasks across every project, with search, status
  filter, inline status change, delete, and add-task
- **Revisions page**: all revisions across every project with filters and
  inline status change
- **Notifications**: bell dropdown with unread count and mark-as-read.
  Created automatically when a project is created, a revision is requested,
  a design is approved, an invoice becomes overdue, or a deadline is within
  3 days
- Topbar "New Project" button and search box now work (open the new-project
  form / search projects)
- **Services page**: all services by category with project counts and a
  "Start project" button that opens the new-project form with that service
  already selected
- **Reports page**: totals, most requested service, and charts for revenue
  per month, completed projects per month, and status distribution
- **Settings page**: business name/email (shown in the sidebar), reset to demo
  data, and clear all data

Next: automation rules review, polish, testing, and deployment.

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
