import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { STORAGE_KEYS, getData, saveData } from "../utils/storage.js";
import { REVISION_STATUSES } from "../data/constants.js";

export default function Revisions() {
  const [revisions, setRevisions] = useState(() => getData(STORAGE_KEYS.REVISIONS, []));
  const [projects] = useState(() => getData(STORAGE_KEYS.PROJECTS, []));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const projectName = (id) => projects.find((p) => p.id === id)?.name || "Unknown Project";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return revisions.filter((r) => {
      const matchesSearch =
        !q || r.comment.toLowerCase().includes(q) || projectName(r.projectId).toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [revisions, search, statusFilter, projects]);

  function changeStatus(id, status) {
    const next = revisions.map((r) => (r.id === id ? { ...r, status } : r));
    saveData(STORAGE_KEYS.REVISIONS, next);
    setRevisions(next);
  }

  return (
    <DashboardLayout title="Revisions">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 bg-panel border border-border rounded-md px-3 py-2 w-full sm:w-64">
          <Search size={16} className="text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comment or project…"
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted"
          />
        </div>
        <select className="input sm:w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          {REVISION_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={revisions.length === 0 ? "No revisions yet" : "No revisions match your filters"} />
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="bg-panel border border-border rounded-lg p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <Link to={`/projects/${r.projectId}`} className="text-sm font-medium text-ochre hover:underline">
                  {projectName(r.projectId)} — Revision #{r.revisionNumber}
                </Link>
                <select
                  value={r.status}
                  onChange={(e) => changeStatus(r.id, e.target.value)}
                  className="input py-1.5 text-xs w-auto"
                >
                  {REVISION_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <p className="text-sm text-ink2/80">{r.comment}</p>
              <p className="text-xs text-muted mt-1">{r.date}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
