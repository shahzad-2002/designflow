import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { SERVICE_CATEGORIES } from "../data/servicesData.js";
import { STORAGE_KEYS, getData } from "../utils/storage.js";

export default function Services() {
  const navigate = useNavigate();
  const projects = getData(STORAGE_KEYS.PROJECTS, []);
  const countFor = (id) => projects.filter((p) => p.serviceId === id).length;

  return (
    <DashboardLayout title="Services">
      <p className="text-sm text-muted mb-6 max-w-xl">
        Pick a service to start a new project. The client brief questions adjust to the service you choose.
      </p>

      <div className="space-y-8">
        {SERVICE_CATEGORIES.map((cat) => (
          <section key={cat.category}>
            <h2 className="font-display font-semibold text-ink2 mb-3">{cat.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.services.map((s) => {
                const n = countFor(s.id);
                return (
                  <div
                    key={s.id}
                    className="bg-panel border border-border rounded-lg p-4 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink2">{s.name}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {n} {n === 1 ? "project" : "projects"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/projects?new=1&service=${s.id}`)}
                      className="flex items-center gap-1 text-xs font-medium text-ochre border border-ochre/40 hover:bg-ochre-light px-2.5 py-1.5 rounded-md whitespace-nowrap"
                    >
                      <Plus size={13} /> Start project
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </DashboardLayout>
  );
}
