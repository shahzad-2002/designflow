import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import { STORAGE_KEYS, getData, saveData } from "../utils/storage.js";
import { seedDemoDataIfNeeded } from "../utils/seed.js";

export default function Settings() {
  const [settings, setSettings] = useState(() =>
    getData(STORAGE_KEYS.SETTINGS, { businessName: "", businessEmail: "" })
  );
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(null); // "reset" | "clear"

  function handleSave(e) {
    e.preventDefault();
    saveData(STORAGE_KEYS.SETTINGS, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function resetDemo() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("df_") && k !== STORAGE_KEYS.SETTINGS)
      .forEach((k) => localStorage.removeItem(k));
    seedDemoDataIfNeeded();
    window.location.reload();
  }

  function clearAll() {
    [
      STORAGE_KEYS.CLIENTS, STORAGE_KEYS.PROJECTS, STORAGE_KEYS.TASKS,
      STORAGE_KEYS.QUOTES, STORAGE_KEYS.INVOICES, STORAGE_KEYS.REVISIONS,
      STORAGE_KEYS.NOTIFICATIONS,
    ].forEach((k) => saveData(k, []));
    saveData(STORAGE_KEYS.SEEDED, true);
    window.location.reload();
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-xl space-y-6">
        <form onSubmit={handleSave} className="bg-panel border border-border rounded-lg p-5 space-y-3.5">
          <h2 className="font-display font-semibold text-ink2">Business Profile</h2>
          <label className="block">
            <span className="block text-xs font-medium text-muted mb-1">Business Name</span>
            <input
              className="input"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-muted mb-1">Business Email</span>
            <input
              className="input"
              value={settings.businessEmail}
              onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
            />
          </label>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm rounded-md bg-ochre hover:bg-ochre-dark text-white font-medium">
              Save
            </button>
            {saved && <span className="text-sm text-teal">Saved.</span>}
          </div>
        </form>

        <div className="bg-panel border border-border rounded-lg p-5">
          <h2 className="font-display font-semibold text-ink2 mb-1">Data</h2>
          <p className="text-sm text-muted mb-4">
            All data lives in this browser only. These actions cannot be undone.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setConfirm("reset")}
              className="px-4 py-2 text-sm rounded-md border border-border text-ink2 hover:bg-paper"
            >
              Reset to demo data
            </button>
            <button
              onClick={() => setConfirm("clear")}
              className="px-4 py-2 text-sm rounded-md border border-red-200 text-red-600 hover:bg-red-50"
            >
              Clear all data
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "reset"}
        title="Reset to demo data?"
        message="This replaces everything you have added with the original demo data."
        confirmLabel="Reset"
        onConfirm={resetDemo}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === "clear"}
        title="Clear all data?"
        message="This permanently deletes every client, project, quote, invoice, task and revision."
        confirmLabel="Clear everything"
        onConfirm={clearAll}
        onCancel={() => setConfirm(null)}
      />
    </DashboardLayout>
  );
}
