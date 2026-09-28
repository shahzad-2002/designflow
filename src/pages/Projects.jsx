import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import DynamicBriefForm from "../components/projects/DynamicBriefForm.jsx";
import {
  STORAGE_KEYS,
  getData,
  addData,
  updateData,
  deleteData,
  makeId,
} from "../utils/storage.js";
import { addNotification } from "../utils/notifications.js";
import { SERVICE_CATEGORIES, getServiceById } from "../data/servicesData.js";
import { PROJECT_STATUSES, DEFAULT_PROJECT_TASKS } from "../data/constants.js";

const EMPTY_FORM = {
  name: "",
  clientId: "",
  serviceId: "",
  description: "",
  budget: "",
  deadline: "",
  status: "New",
  brief: {},
};

export default function Projects() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState(() => getData(STORAGE_KEYS.PROJECTS, []));
  const [clients] = useState(() => getData(STORAGE_KEYS.CLIENTS, []));

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const clientName = (id) => clients.find((c) => c.id === id)?.name || "Unknown Client";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        clientName(p.clientId).toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter, clients]);

  useEffect(() => {
    if (searchParams.get("new")) {
      openAddModal();
      const svc = searchParams.get("service");
      if (svc) setForm((f) => ({ ...f, serviceId: svc, brief: {} }));
      setSearchParams({});
    }
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(project) {
    setEditingId(project.id);
    setForm({ ...EMPTY_FORM, ...project, brief: project.brief || {} });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Project name is required";
    if (!form.clientId) e.clientId = "Select a client";
    if (!form.serviceId) e.serviceId = "Select a service";
    if (!form.deadline) e.deadline = "Deadline is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave(ev) {
    ev.preventDefault();
    if (!validate()) return;

    if (editingId) {
      const next = updateData(STORAGE_KEYS.PROJECTS, editingId, form);
      setProjects(next);
    } else {
      const record = { id: makeId("proj"), ...form };
      const next = addData(STORAGE_KEYS.PROJECTS, record);
      setProjects(next);
      addNotification(`New project created: ${record.name}`);

      // Automation: creating a new project auto-creates its default task checklist.
      const existingTasks = getData(STORAGE_KEYS.TASKS, []);
      const newTasks = DEFAULT_PROJECT_TASKS.map((taskName) => ({
        id: makeId("task"),
        projectId: record.id,
        name: taskName,
        status: "To Do",
        priority: "Medium",
        dueDate: form.deadline,
      }));
      saveTasks([...existingTasks, ...newTasks]);
    }
    setModalOpen(false);
  }

  function saveTasks(tasks) {
    getData(STORAGE_KEYS.TASKS, []); // ensure key exists
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  function handleDelete() {
    const next = deleteData(STORAGE_KEYS.PROJECTS, deleteTarget.id);
    setProjects(next);
    setDeleteTarget(null);
  }

  return (
    <DashboardLayout title="Projects">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-panel border border-border rounded-md px-3 py-2 w-full sm:w-64">
            <Search size={16} className="text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search project or client…"
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted"
            />
          </div>
          <select
            className="input sm:w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 bg-ochre hover:bg-ochre-dark text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={projects.length === 0 ? "No projects yet" : "No projects match your filters"}
          description={projects.length === 0 ? "Create your first project to get started." : undefined}
          action={
            projects.length === 0 && (
              <button onClick={openAddModal} className="text-sm text-ochre font-medium hover:underline">
                + New Project
              </button>
            )
          }
        />
      ) : (
        <div className="bg-panel border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Deadline</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink2">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{clientName(p.clientId)}</td>
                  <td className="px-4 py-3 text-muted">{getServiceById(p.serviceId)?.name}</td>
                  <td className="px-4 py-3 text-muted">{p.deadline}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => navigate(`/projects/${p.id}`)}
                        className="p-1.5 rounded hover:bg-paper text-ink2/70"
                        aria-label="Open"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded hover:bg-paper text-ink2/70"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Project" : "New Project"}
        wide
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <Field label="Project Name *" error={errors.name}>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Client *" error={errors.clientId}>
              <select
                className="input"
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              >
                <option value="">Select client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `— ${c.company}` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Service *" error={errors.serviceId}>
              <select
                className="input"
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value, brief: {} })}
              >
                <option value="">Select service…</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <optgroup key={cat.category} label={cat.category}>
                    {cat.services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={2}
              className="input resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Field label="Budget ($)">
              <input
                type="number"
                className="input"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />
            </Field>
            <Field label="Deadline *" error={errors.deadline}>
              <input
                type="date"
                className="input"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          {form.serviceId && (
            <div className="pt-3 border-t border-border">
              <p className="text-sm font-display font-semibold text-ink2 mb-3">
                Client Brief — {getServiceById(form.serviceId)?.name}
              </p>
              <DynamicBriefForm
                serviceId={form.serviceId}
                brief={form.brief}
                onChange={(brief) => setForm({ ...form, brief })}
              />
            </div>
          )}

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
              {editingId ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project?"
        message={`This will permanently remove "${deleteTarget?.name}" and cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted mb-1">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}
