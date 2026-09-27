/** Sum of quantity * unitPrice across a list of line items. */
export function calcSubtotal(items = []) {
  return items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);
}

/** Final total after a flat discount and flat tax amount are applied. */
export function calcTotal(items = [], discount = 0, tax = 0) {
  const subtotal = calcSubtotal(items);
  return Math.max(0, subtotal - (Number(discount) || 0) + (Number(tax) || 0));
}

/** Derives an invoice's payment status from its total, paid amount, and due date. */
export function getInvoicePaymentStatus(invoice) {
  const total = calcTotal(invoice.items, invoice.discount, invoice.tax);
  const paid = Number(invoice.paidAmount) || 0;

  if (paid >= total && total > 0) return "Paid";
  if (paid > 0 && paid < total) {
    if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) return "Overdue";
    return "Partially Paid";
  }
  if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) return "Overdue";
  return "Unpaid";
}

export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
