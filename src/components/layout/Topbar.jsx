import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, Plus } from "lucide-react";
import NotificationPanel from "../ui/NotificationPanel.jsx";
import { STORAGE_KEYS, getData } from "../../utils/storage.js";
import { markAllRead, markRead, syncSystemNotifications } from "../../utils/notifications.js";

export default function Topbar({ onMenuClick, title }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getData(STORAGE_KEYS.NOTIFICATIONS, []));
  const [query, setQuery] = useState("");
  const panelRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  function refresh() {
    setNotifications(getData(STORAGE_KEYS.NOTIFICATIONS, []));
  }

  useEffect(() => {
    syncSystemNotifications();
    refresh();
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/projects?q=${encodeURIComponent(q)}` : "/projects");
    setQuery("");
  }

  return (
    <header className="h-16 border-b border-border bg-panel flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-ink2/70" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="font-display font-semibold text-lg text-ink2">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 bg-paper border border-border rounded-md px-3 py-1.5 w-64"
        >
          <Search size={15} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects… (Enter)"
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted"
          />
        </form>

        <div className="relative" ref={panelRef}>
          <button
            onClick={() => {
              refresh();
              setNotifOpen((o) => !o);
            }}
            className="relative w-9 h-9 flex items-center justify-center rounded-md border border-border text-ink2/70 hover:bg-paper"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-ochre text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <NotificationPanel
              notifications={notifications}
              onMarkAll={() => {
                markAllRead();
                refresh();
              }}
              onMarkRead={(id) => {
                markRead(id);
                refresh();
              }}
            />
          )}
        </div>

        <button
          onClick={() => navigate("/projects?new=1")}
          className="flex items-center gap-1.5 bg-ochre hover:bg-ochre-dark text-white text-sm font-medium px-3.5 py-2 rounded-md"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>
    </header>
  );
}
