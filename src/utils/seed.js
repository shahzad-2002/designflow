import { STORAGE_KEYS, getData, saveData } from "./storage.js";
import {
  demoClients,
  demoProjects,
  demoTasks,
  demoQuotes,
  demoInvoices,
  demoRevisions,
  demoNotifications,
} from "../data/demoData.js";

/**
 * Runs once per browser. If the app has never been seeded before, it fills
 * LocalStorage with realistic demo data so the dashboard isn't empty.
 * Safe to call on every app load — it does nothing after the first run,
 * and never overwrites data the user has since added, edited, or deleted.
 */
export function seedDemoDataIfNeeded() {
  const alreadySeeded = getData(STORAGE_KEYS.SEEDED, false);
  if (alreadySeeded) return;

  saveData(STORAGE_KEYS.CLIENTS, demoClients);
  saveData(STORAGE_KEYS.PROJECTS, demoProjects);
  saveData(STORAGE_KEYS.TASKS, demoTasks);
  saveData(STORAGE_KEYS.QUOTES, demoQuotes);
  saveData(STORAGE_KEYS.INVOICES, demoInvoices);
  saveData(STORAGE_KEYS.REVISIONS, demoRevisions);
  saveData(STORAGE_KEYS.NOTIFICATIONS, demoNotifications);

  saveData(STORAGE_KEYS.SEEDED, true);
}
