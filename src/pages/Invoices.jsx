import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import Modal from "../components/ui/Modal.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import LineItemsEditor from "../components/finance/LineItemsEditor.jsx";
import {
  STORAGE_KEYS,
  getData,
  addData,
  updateData,
  deleteData,
  makeId,
} from "../utils/storage.js";
import { calcTotal, getInvoicePaymentStatus, formatCurrency } from "../utils/calculations.js";

function nextInvoiceNumber(invoices) {
  const nums = invoices
    .map((i) => parseInt((i.invoiceNumber || "").replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  const max = nums.length ? Math.max(...nums) : 2000;
  return `INV-${max + 1}`;
}

const emptyForm = (invoices) => ({
  invoiceNumber: nextInvoiceNumber(invoices),
  clientId: "",
  projectId: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  items: [{ service: "", quantity: 1, unitPrice: 0 }],
  discount: 0,
  tax: 0,
  paidAmount: 0,
});

export default function Invoices() {
  const [invoices, setInvoices] = useState(() => getData(STORAGE_KEYS.INVOICES, []));
  const [clients] = useState(() => getData(STORAGE_KEYS.CLIENTS, []));
  const [projects] = useState(() => getData(STORAGE_KEYS.PROJECTS, []));

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyForm([]));
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const clientName = (id) => clients.find((c) => c.id === id)?.name || "—";
  const projectName = (id) => projects.find((p) => p.id === id)?.name || "—";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        clientName(inv.clientId).toLowerCase().includes(q)
    );
  }, [invoices, search, clients]);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm(invoices));
    setErrors({});
    setModalOpen(true);
  }

  function openEditModal(invoice) {
    setEditingId(invoice.id);
    setForm({ ...invoice });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e = {};
    if (!form.clientId) e.clientId = "Select a client";
    if (!form.dueDate) e.dueDate = "Due date is required";
    if (!form.items.length || form.items.every((i) => !i.service))
      e.items = "Add at least one line item";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave(ev) {
    ev.preventDefault();
    if (!validate()) return;

    if (editingId) {
      const next = updateData(STORAGE_KEYS.INVOICES, editingId, form);
      setInvoices(next);
    } else {
      const record = { id: makeId("invoice"), ...form };
      const next = addData(STORAGE_KEYS.INVOICES, record);
      setInvoices(next);
    }
    setModalOpen(false);
  }

  function handleDelete() {
    const next = deleteData(STORAGE_KEYS.INVOICES, deleteTarget.id);
    setInvoices(next);
    setDeleteTarget(null);
  }

  const total = calcTotal(form.items, form.discount, form.tax);
  const remaining = Math.max(0, total - (Number(form.paidAmount) || 0));

  return (
    <DashboardLayout title="Invoices">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 bg-panel border border-border rounded-md px-3 py-2 w-full sm:w-72">
          <Search size={16} className="text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice # or client…"
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 bg-ochre hover:bg-ochre-dark text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={invoices.length === 0 ? "No invoices yet" : "No invoices match your search"}
          action={
            invoices.length === 0 && (
              <button onClick={openAddModal} className="text-sm text-ochre font-medium hover:underline">
                + New Invoice
              </button>
            )
          }
        />
      ) : (
        <div className="bg-panel border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead>
              <tr className="text-left text-muted border-b border-border">
                <th className="px-4 py-3 font-medium">Invoice #</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Paid</th>
                <th className="px-4 py-3 font-medium">Remaining</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const t = calcTotal(inv.items, inv.discount, inv.tax);
                const r = Math.max(0, t - (Number(inv.paidAmount) || 0));
                return (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-paper/60">
                    <td className="px-4 py-3 font-medium text-ink2">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-muted">{clientName(inv.clientId)}</td>
                    <td className="px-4 py-3 text-ink2 font-medium">{formatCurrency(t)}</td>
                    <td className="px-4 py-3 text-muted">{formatCurrency(inv.paidAmount)}</td>
                    <td className="px-4 py-3 text-muted">{formatCurrency(r)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={getInvoicePaymentStatus(inv)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(inv)}
                          className="p-1.5 rounded hover:bg-paper text-ink2/70"
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(inv)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Invoice" : "New Invoice"} wide>
        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Invoice Number">
              <input className="input" value={form.invoiceNumber} readOnly />
            </Field>
            <Field label="Client *" error={errors.clientId}>
              <select
                className="input"
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value, projectId: "" })}
              >
                <option value="">Select client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Project (optional)">
            <select
              className="input"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Not linked to a project</option>
              {projects
                .filter((p) => !form.clientId || p.clientId === form.clientId)
                .map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
          </Field>

          <Field label="Line Items *" error={errors.items}>
            <LineItemsEditor items={form.items} onChange={(items) => setForm({ ...form, items })} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Invoice Date">
              <input
                type="date"
                className="input"
                value={form.invoiceDate}
                onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
              />
            </Field>
            <Field label="Due Date *" error={errors.dueDate}>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Field label="Discount ($)">
              <input
                type="number"
                className="input"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />
            </Field>
            <Field label="Tax ($)">
              <input
                type="number"
                className="input"
                value={form.tax}
                onChange={(e) => setForm({ ...form, tax: e.target.value })}
              />
            </Field>
            <Field label="Paid Amount ($)">
              <input
                type="number"
                className="input"
                value={form.paidAmount}
                onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
              />
            </Field>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-border">
            <div className="text-sm text-muted space-x-4">
              <span>Total: <span className="text-ink2 font-semibold">{formatCurrency(total)}</span></span>
              <span>Remaining: <span className="text-ink2 font-semibold">{formatCurrency(remaining)}</span></span>
            </div>
            <div className="flex gap-2">
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
                {editingId ? "Save Changes" : "Create Invoice"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete invoice?"
        message={`This will permanently remove ${deleteTarget?.invoiceNumber}.`}
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
