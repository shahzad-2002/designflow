import { STORAGE_KEYS, getData, saveData, makeId } from "./storage.js";
import { getInvoicePaymentStatus } from "./calculations.js";

/** Adds a new notification (used right after a real event happens). */
export function addNotification(message) {
  const list = getData(STORAGE_KEYS.NOTIFICATIONS, []);
  const record = {
    id: makeId("notif"),
    message,
    date: new Date().toISOString().slice(0, 10),
    read: false,
  };
  saveData(STORAGE_KEYS.NOTIFICATIONS, [record, ...list]);
}

export function markAllRead() {
  const list = getData(STORAGE_KEYS.NOTIFICATIONS, []);
  saveData(STORAGE_KEYS.NOTIFICATIONS, list.map((n) => ({ ...n, read: true })));
}

export function markRead(id) {
  const list = getData(STORAGE_KEYS.NOTIFICATIONS, []);
  saveData(STORAGE_KEYS.NOTIFICATIONS, list.map((n) => (n.id === id ? { ...n, read: true } : n)));
}

/**
 * Scans invoices for overdue payments and projects for approaching deadlines,
 * and creates a notification for each one that doesn't already have one.
 * Safe to call every time the app loads — it never creates duplicates.
 */
export function syncSystemNotifications() {
  const invoices = getData(STORAGE_KEYS.INVOICES, []);
  const projects = getData(STORAGE_KEYS.PROJECTS, []);
  const existing = getData(STORAGE_KEYS.NOTIFICATIONS, []);
  const existingIds = new Set(existing.map((n) => n.sourceId).filter(Boolean));

  const newOnes = [];

  invoices.forEach((inv) => {
    const sourceId = `overdue_${inv.id}`;
    if (getInvoicePaymentStatus(inv) === "Overdue" && !existingIds.has(sourceId)) {
      newOnes.push({
        id: makeId("notif"),
        sourceId,
        message: `Invoice ${inv.invoiceNumber} is overdue`,
        date: new Date().toISOString().slice(0, 10),
        read: false,
      });
    }
  });

  const inThreeDays = new Date();
  inThreeDays.setDate(inThreeDays.getDate() + 3);

  projects.forEach((p) => {
    const sourceId = `deadline_${p.id}`;
    if (
      p.status !== "Completed" &&
      p.deadline &&
      new Date(p.deadline) <= inThreeDays &&
      new Date(p.deadline) >= new Date(new Date().toDateString()) &&
      !existingIds.has(sourceId)
    ) {
      newOnes.push({
        id: makeId("notif"),
        sourceId,
        message: `Deadline approaching for "${p.name}" (${p.deadline})`,
        date: new Date().toISOString().slice(0, 10),
        read: false,
      });
    }
  });

  if (newOnes.length > 0) {
    saveData(STORAGE_KEYS.NOTIFICATIONS, [...newOnes, ...existing]);
  }
}
