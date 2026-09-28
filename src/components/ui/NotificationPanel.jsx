import { CheckCheck } from "lucide-react";

export default function NotificationPanel({ notifications, onMarkAll, onMarkRead }) {
  return (
    <div className="absolute right-0 top-11 w-80 max-w-[90vw] bg-panel border border-border rounded-lg shadow-xl z-50">
      <div className="flex items-center justify-between px-4 h-11 border-b border-border">
        <p className="font-display font-semibold text-sm text-ink2">Notifications</p>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAll}
            className="flex items-center gap-1 text-xs text-ochre hover:underline"
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted italic p-4">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-paper ${
                n.read ? "" : "bg-ochre-light/40"
              }`}
            >
              <p className={`text-sm ${n.read ? "text-muted" : "text-ink2 font-medium"}`}>
                {n.message}
              </p>
              <p className="text-[11px] text-muted mt-0.5">{n.date}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
