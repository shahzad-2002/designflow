import { Menu, Search, Bell, Plus } from "lucide-react";

export default function Topbar({ onMenuClick, title }) {
  return (
    <header className="h-16 border-b border-border bg-panel flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-ink2/70"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display font-semibold text-lg text-ink2">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-paper border border-border rounded-md px-3 py-1.5 w-64">
          <Search size={15} className="text-muted" />
          <input
            placeholder="Search clients, projects…"
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted"
          />
        </div>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-md border border-border text-ink2/70 hover:bg-paper">
          <Bell size={17} />
          <span className="absolute -top-1 -right-1 bg-ochre text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <button className="flex items-center gap-1.5 bg-ochre hover:bg-ochre-dark text-white text-sm font-medium px-3.5 py-2 rounded-md">
          <Plus size={16} />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>
    </header>
  );
}
