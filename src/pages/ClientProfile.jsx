import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Globe, FolderKanban } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { STORAGE_KEYS, getData, findById } from "../utils/storage.js";
import { calcTotal, formatCurrency } from "../utils/calculations.js";
import { getServiceById } from "../data/servicesData.js";

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client] = useState(() => findById(STORAGE_KEYS.CLIENTS, id));
  const [projects] = useState(() =>
    getData(STORAGE_KEYS.PROJECTS, []).filter((p) => p.clientId === id)
  );
  const [invoices] = useState(() =>
    getData(STORAGE_KEYS.INVOICES, []).filter((i) => i.clientId === id)
  );

  if (!client) {
    return (
      <DashboardLayout title="Client not found">
        <EmptyState
          title="This client no longer exists"
          description="They may have been deleted."
          action={
            <Link to="/clients" className="text-sm text-ochre font-medium hover:underline">
              ← Back to Clients
            </Link>
          }
        />
      </DashboardLayout>
    );
  }

  const totalPaid = invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  const totalPending = invoices.reduce((sum, inv) => {
    const total = calcTotal(inv.items, inv.discount, inv.tax);
    const remaining = total - (Number(inv.paidAmount) || 0);
    return sum + Math.max(0, remaining);
  }, 0);

  return (
    <DashboardLayout title="Client Profile">
      <button
        onClick={() => navigate("/clients")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink2 mb-4"
      >
        <ArrowLeft size={15} /> Back to Clients
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: client info */}
        <div className="bg-panel border border-border rounded-lg p-5 lg:col-span-1 h-fit">
          <div className="w-12 h-12 rounded-full bg-ochre-light text-ochre-dark flex items-center justify-center font-display font-semibold text-lg mb-3">
            {client.name?.[0]?.toUpperCase() || "?"}
          </div>
          <h2 className="font-display font-semibold text-lg text-ink2">{client.name}</h2>
          <p className="text-sm text-muted mb-4">{client.company}</p>

          <div className="space-y-2.5 text-sm">
            {client.email && (
              <div className="flex items-center gap-2 text-ink2/80">
                <Mail size={15} className="text-muted" /> {client.email}
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-ink2/80">
                <Phone size={15} className="text-muted" /> {client.phone}
              </div>
            )}
            {client.country && (
              <div className="flex items-center gap-2 text-ink2/80">
                <Globe size={15} className="text-muted" /> {client.country}
              </div>
            )}
          </div>

          {client.notes && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted mb-1">Notes</p>
              <p className="text-sm text-ink2/80">{client.notes}</p>
            </div>
          )}
        </div>

        {/* Right: financial summary + projects */}
        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-panel border border-border rounded-lg p-4 border-t-2 border-t-teal">
              <p className="text-xs text-muted mb-1">Total Paid</p>
              <p className="font-display text-xl font-semibold text-ink2">
                {formatCurrency(totalPaid)}
              </p>
            </div>
            <div className="bg-panel border border-border rounded-lg p-4 border-t-2 border-t-ochre">
              <p className="text-xs text-muted mb-1">Pending Amount</p>
              <p className="font-display text-xl font-semibold text-ink2">
                {formatCurrency(totalPending)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-ink2 mb-3 flex items-center gap-2">
              <FolderKanban size={17} /> Projects ({projects.length})
            </h3>

            {projects.length === 0 ? (
              <EmptyState title="No projects yet for this client" />
            ) : (
              <div className="space-y-2">
                {projects.map((p) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="flex items-center justify-between bg-panel border border-border rounded-lg p-4 hover:border-ochre transition-colors"
                  >
                    <div>
                      <p className="font-medium text-ink2 text-sm">{p.name}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {getServiceById(p.serviceId)?.name || "Service"} · Deadline{" "}
                        {p.deadline}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
