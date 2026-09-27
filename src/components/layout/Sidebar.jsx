import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Palette,
  FileText,
  Receipt,
  ListChecks,
  RefreshCw,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/services", label: "Services", icon: Palette },
  { to: "/quotes", label: "Quotes", icon: FileText },
  { to: "/invoices", label: "Invoices", icon: Receipt },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/revisions", label: "Revisions", icon: RefreshCw },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 lg:z-0 top-0 left-0 h-full w-64 bg-ink text-white flex flex-col
        transition-transform duration-200 lg:translate-x-0 lg:static
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-ink-dashed/40">
          <div>
            <p className="font-display font-700 text-lg leading-none">
              Design<span className="text-ochre">Flow</span>
            </p>
            <p className="text-[11px] text-white/40 mt-1">
              brief to approval, one place
            </p>
          </div>
          <button className="lg:hidden text-white/60" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-ochre text-white font-medium"
                    : "text-white/70 hover:bg-ink-light hover:text-white"
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-ink-dashed/40 text-[11px] text-white/35">
          v0.1 — local data only
        </div>
      </aside>
    </>
  );
}
