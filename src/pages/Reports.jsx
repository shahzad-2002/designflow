import { useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { STORAGE_KEYS, getData } from "../utils/storage.js";
import { calcTotal, formatCurrency } from "../utils/calculations.js";
import { getServiceById } from "../data/servicesData.js";
import { PROJECT_STATUSES } from "../data/constants.js";

const PIE_COLORS = ["#94A3B8", "#3B82F6", "#F59E0B", "#F97316", "#2F6F6B", "#16A34A"];

function monthKey(dateStr) {
  return dateStr ? dateStr.slice(0, 7) : null;
}

export default function Reports() {
  const projects = getData(STORAGE_KEYS.PROJECTS, []);
  const invoices = getData(STORAGE_KEYS.INVOICES, []);

  const data = useMemo(() => {
    const completed = projects.filter((p) => p.status === "Completed").length;
    const active = projects.filter((p) =>
      ["In Progress", "Under Review", "Revision Requested"].includes(p.status)
    ).length;

    let revenue = 0;
    let pending = 0;
    const revenueByMonth = {};
    invoices.forEach((inv) => {
      const total = calcTotal(inv.items, inv.discount, inv.tax);
      const paid = Number(inv.paidAmount) || 0;
      revenue += paid;
      pending += Math.max(0, total - paid);
      const m = monthKey(inv.invoiceDate);
      if (m) revenueByMonth[m] = (revenueByMonth[m] || 0) + paid;
    });

    const completedByMonth = {};
    projects
      .filter((p) => p.status === "Completed")
      .forEach((p) => {
        const m = monthKey(p.deadline);
        if (m) completedByMonth[m] = (completedByMonth[m] || 0) + 1;
      });

    const serviceCounts = {};
    projects.forEach((p) => {
      serviceCounts[p.serviceId] = (serviceCounts[p.serviceId] || 0) + 1;
    });
    const top = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];

    const toSeries = (obj, key) =>
      Object.keys(obj).sort().map((m) => ({ month: m, [key]: obj[m] }));

    return {
      total: projects.length,
      completed,
      active,
      revenue,
      pending,
      topService: top ? `${getServiceById(top[0])?.name || top[0]} (${top[1]})` : "—",
      revenueSeries: toSeries(revenueByMonth, "revenue"),
      completedSeries: toSeries(completedByMonth, "completed"),
      statusSeries: PROJECT_STATUSES.map((s) => ({
        name: s,
        value: projects.filter((p) => p.status === s).length,
      })).filter((d) => d.value > 0),
    };
  }, [projects, invoices]);

  return (
    <DashboardLayout title="Reports">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Stat label="Total Projects" value={data.total} />
        <Stat label="Completed Projects" value={data.completed} />
        <Stat label="Active Projects" value={data.active} />
        <Stat label="Total Revenue" value={formatCurrency(data.revenue)} />
        <Stat label="Pending Payments" value={formatCurrency(data.pending)} />
        <Stat label="Most Requested Service" value={data.topService} small />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Revenue per Month (by invoice date)">
          {data.revenueSeries.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E1D6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#B8742A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Completed Projects per Month (by deadline)">
          {data.completedSeries.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.completedSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E1D6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#2F6F6B" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Project Status Distribution">
          {data.statusSeries.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.statusSeries} dataKey="value" nameKey="name" outerRadius={80} label>
                  {data.statusSeries.map((d) => (
                    <Cell key={d.name} fill={PIE_COLORS[PROJECT_STATUSES.indexOf(d.name)]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}

function Stat({ label, value, small }) {
  return (
    <div className="bg-panel border border-border rounded-lg p-4 border-t-2 border-t-ochre">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className={`font-display font-semibold text-ink2 ${small ? "text-base" : "text-2xl"}`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <h3 className="font-display font-semibold text-ink2 mb-4 text-sm">{title}</h3>
      <div className="h-60">{children}</div>
    </div>
  );
}

function Empty() {
  return <p className="text-sm text-muted italic">Not enough data yet.</p>;
}
