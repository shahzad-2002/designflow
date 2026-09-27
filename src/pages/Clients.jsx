import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import {
  STORAGE_KEYS,
  getData,
  addData,
  updateData,
  deleteData,
  makeId,
} from "../utils/storage.js";

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  notes: "",
};

export default function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(() => getData(STORAGE_KEYS.CLIENTS, []));
  const [projects] = useState(() => getData(STORAGE_KEYS.PROJECTS, []));
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);

  const projectCountFor = (clientId) =>
    projects.filter((p) => p.clientId === clientId).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(client) {
    setEditingId(client.id);
    setForm({ ...EMPTY_FORM, ...client });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave(ev) {
    ev.preventDefault();
    if (!validate()) return;

    if (editingId) {
      const next = updateData(STORAGE_KEYS.CLIENTS, editingId, form);
      setClients(next);
    } else {
      const record = { id: makeId("client"), ...form };
      const next = addData(STORAGE_KEYS.CLIENTS, record);
      setClients(next);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    const next = deleteData(STORAGE_KEYS.CLIENTS, deleteTarget.id);
    setClients(next);
    setDeleteTarget(null);
  }

  return (
    <DashboardLayout title="Clients">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 bg-panel border border-border rounded-md px-3 py-2 w-full sm:w-72">
          <Search size={16} className="text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, company, email…"
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 bg-ochre hover:bg-ochre-dark text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          <Plus size={16} /> Add Client
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={search ? "No clients match your search" : "No clients yet"}
          description={
            search ? "Try a different name, company, or email." : "Add your first client to get started."
          }
          action={
            !search && (
              <button
                onClick={openAddModal}
                className="text-sm text-ochre font-medium hover:underline"
              >
                + Add Client
              </button>
            )
          }
        />
      ) : (
        <div className="bg-panel border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Projects</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink2">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.company}</td>
                  <td className="px-4 py-3 text-muted">{c.email}</td>
                  <td className="px-4 py-3 text-muted">{projectCountFor(c.id)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => navigate(`/clients/${c.id}`)}
                        className="p-1.5 rounded hover:bg-paper text-ink2/70"
                        aria-label="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded hover:bg-paper text-ink2/70"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
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
        title={editingId ? "Edit Client" : "Add Client"}
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <Field label="Name *" error={errors.name}>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Company">
            <input
              className="input"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </Field>
          <Field label="Email *" error={errors.email}>
            <input
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Country">
            <input
              className="input"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </Field>
          <Field label="Notes">
            <textarea
              rows={3}
              className="input resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Field>

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
              {editingId ? "Save Changes" : "Add Client"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete client?"
        message={`This will permanently remove ${deleteTarget?.name}. This does not delete their existing projects.`}
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
