import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Plus } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Modal from "../components/ui/Modal.jsx";
import { STORAGE_KEYS, getData, saveData, makeId } from "../utils/storage.js";
import { TASK_STATUSES, TASK_PRIORITIES } from "../data/constants.js";

export default function Tasks() {
  const [tasks, setTasks] = useState(() => getData(STORAGE_KEYS.TASKS, []));
  const [projects] = useState(() => getData(STORAGE_KEYS.PROJECTS, []));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ projectId: "", name: "", priority: "Medium", dueDate: "" });

  const projectName = (id) => projects.find((p) => p.id === id)?.name || "Unknown Project";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || projectName(t.projectId).toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter, projects]);

  function changeStatus(id, status) {
    const next = tasks.map((t) => (t.id === id ? { ...t, status } : t));
    saveData(STORAGE_KEYS.TASKS, next);
    setTasks(next);
  }

  function deleteTask(id) {
    const next = tasks.filter((t) => t.id !== id);
    saveData(STORAGE_KEYS.TASKS, next);
    setTasks(next);
  }

  function addTask(ev) {
    ev.preventDefault();
    if (!form.projectId || !form.name.trim()) return;
    const record = { id: makeId("task"), status: "To Do", ...form };
    const next = [...tasks, record];
    saveData(STORAGE_KEYS.TASKS, next);
    setTasks(next);
    setForm({ projectId: "", name: "", priority: "Medium", dueDate: "" });
    setModalOpen(false);
  }

  return (
    <DashboardLayout title="Tasks">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-panel border border-border rounded-md px-3 py-2 w-full sm:w-64">
            <Search size={16} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task or project…"
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted"
            />
          </div>
          <select className="input sm:w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-1.5 bg-ochre hover:bg-ochre-dark text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={tasks.length === 0 ? "No tasks yet" : "No tasks match your filters"} />
      ) : (
        <div className="bg-panel border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Due Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink2">{t.name}</td>
                  <td className="px-4 py-3">
                    <Link to={`/projects/${t.projectId}`} className="text-ochre hover:underline">
                      {projectName(t.projectId)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{t.priority}</td>
                  <td className="px-4 py-3 text-muted">{t.dueDate}</td>
                  <td className="px-4 py-3">
                    <select
                      value={t.status}
                      onChange={(e) => changeStatus(t.id, e.target.value)}
                      className="input py-1.5 text-xs w-auto"
                    >
                      {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-600"
                      aria-label="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Task">
        <form onSubmit={addTask} className="space-y-3.5">
          <label className="block">
            <span className="block text-xs font-medium text-muted mb-1">Project *</span>
            <select
              className="input"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-muted mb-1">Task name *</span>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            <label className="block">
              <span className="block text-xs font-medium text-muted mb-1">Priority</span>
              <select
                className="input"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-muted mb-1">Due Date</span>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm rounded-md border border-border text-ink2 hover:bg-paper"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-md bg-ochre hover:bg-ochre-dark text-white font-medium"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
