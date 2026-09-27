const STATUS_STYLES = {
  // project statuses
  New: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-50 text-blue-700",
  "Under Review": "bg-amber-50 text-amber-700",
  "Revision Requested": "bg-orange-50 text-orange-700",
  Approved: "bg-teal-light text-teal",
  Completed: "bg-green-50 text-green-700",

  // quote statuses
  Draft: "bg-slate-100 text-slate-700",
  Sent: "bg-blue-50 text-blue-700",
  Accepted: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",

  // invoice / payment statuses
  Unpaid: "bg-red-50 text-red-700",
  "Partially Paid": "bg-amber-50 text-amber-700",
  Paid: "bg-green-50 text-green-700",
  Overdue: "bg-red-100 text-red-800",

  // task / revision statuses
  "To Do": "bg-slate-100 text-slate-700",
  Pending: "bg-amber-50 text-amber-700",
  Resolved: "bg-green-50 text-green-700",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${style}`}
    >
      {status}
    </span>
  );
}
