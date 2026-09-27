import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { STORAGE_KEYS, getData } from "../utils/storage.js";
import { calcTotal, formatCurrency } from "../utils/calculations.js";
import { getServiceById } from "../data/servicesData.js";
import { PROJECT_STATUSES } from "../data/constants.js";

export default function Dashboard() {
  const projects = getData(STORAGE_KEYS.PROJECTS, []);
  const clients = getData(STORAGE_KEYS.CLIENTS, []);
  const tasks = getData(STORAGE_KEYS.TASKS, []);
  const invoices = getData(STORAGE_KEYS.INVOICES, []);
  const revisions = getData(STORAGE_KEYS.REVISIONS, []);

  const stats = useMemo(() => {
    const activeProjects = projects.filter((p) =>
      ["In Progress", "Under Review", "Revision Requested"].includes(p.status)
    ).length;
    const newRequests = projects.filter((p) => p.status === "New").length;
    const awaitingApproval = projects.filter((p) => p.status === "Under Review").length;
    const pendingRevisions = revisions.filter((r) => r.status !== "Resolved").length;
    const completedProjects = projects.filter((p) => p.status === "Completed").length;

    let totalRevenue = 0;
    let pendingPayments = 0;
    invoices.forEach((inv) => {
      const total = calcTotal(inv.items, inv.discount, inv.tax);
      const paid = Number(inv.paidAmount) || 0;
      totalRevenue += paid;
      pendingPayments += Math.max(0, total - paid);
    });

    return {
      activeProjects,
      newRequests,
      awaitingApproval,
      pendingRevisions,
      completedProjects,
      totalRevenue,
      pendingPayments,
    };
  }, [projects, invoices, revisions]);

  const statusChartData = useMemo(
    () =>
      PROJECT_STATUSES.map((status) => ({
        status,
        count: projects.filter((p) => p.status === status).length,
      })),
    [projects]
  );

  const recentProjects = [...projects].slice(-5).reverse();
  const recentClients = [...clients].slice(-5).reverse();

  const upcomingDeadlines = [...projects]
    .filter((p) => p.status !== "Completed" && p.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const pendingTasks = tasks.filter((t) => t.status !== "Completed").slice(0, 6);

  const clientName = (id) => clients.find((c) => c.id === id)?.name || "Unknown";

  return (
    <DashboardLayout title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Projects" value={stats.activeProjects} accent="ochre" />
        <StatCard label="New Requests" value={stats.newRequests} accent="teal" />
        <StatCard label="Awaiting Approval" value={stats.awaitingApproval} accent="ochre" />
        <StatCard label="Pending Revisions" value={stats.pendingRevisions} accent="teal" />
        <StatCard
          label="Pending Payments"
          value={formatCurrency(stats.pendingPayments)}
          accent="ochre"
        />
        <StatCard label="Completed Projects" value={stats.completedProjects} accent="teal" />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          accent="ochre"
          span
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Status distribution chart */}
        <div className="lg:col-span-2 bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">
            Project Status Distribution
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E1D6" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#B8742A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">
            Upcoming Deadlines
          </h3>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-muted italic">Nothing due soon.</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="flex items-center justify-between text-sm hover:text-ochre"
                >
                  <span className="text-ink2 truncate pr-2">{p.name}</span>
                  <span className="text-muted whitespace-nowrap">{p.deadline}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent projects */}
        <div className="bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Recent Projects</h3>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-muted italic">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-ink2 truncate">{p.name}</p>
                    <p className="text-xs text-muted truncate">
                      {clientName(p.clientId)} · {getServiceById(p.serviceId)?.name}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent clients */}
        <div className="bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Recent Clients</h3>
          {recentClients.length === 0 ? (
            <p className="text-sm text-muted italic">No clients yet.</p>
          ) : (
            <div className="space-y-3">
              {recentClients.map((c) => (
                <Link key={c.id} to={`/clients/${c.id}`} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-ochre-light text-ochre-dark flex items-center justify-center text-xs font-display font-semibold flex-shrink-0">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-ink2 truncate">{c.name}</p>
                    <p className="text-xs text-muted truncate">{c.company}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pending tasks */}
        <div className="bg-panel border border-border rounded-lg p-5">
          <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">Pending Tasks</h3>
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-muted italic">Nothing pending — nice work!</p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-ink2 truncate">{t.name}</span>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, accent = "ochre", span = false }) {
  return (
    <div
      className={`bg-panel border border-border rounded-lg p-4 border-t-2 ${
        accent === "ochre" ? "border-t-ochre" : "border-t-teal"
      } ${span ? "col-span-2 lg:col-span-1" : ""}`}
    >
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="font-display text-2xl font-semibold text-ink2">{value}</p>
    </div>
  );
}
