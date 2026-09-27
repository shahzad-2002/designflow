import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  FileText,
  Receipt,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Modal from "../components/ui/Modal.jsx";
import {
  STORAGE_KEYS,
  getData,
  saveData,
  findById,
  updateData,
  makeId,
} from "../utils/storage.js";
import { getServiceById } from "../data/servicesData.js";
import { TASK_STATUSES, REVISION_STATUSES } from "../data/constants.js";
import { getBriefFieldsForService } from "../data/briefFields.js";

const TABS = ["Overview", "Brief", "Tasks", "Revisions", "Approval"];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(() => findById(STORAGE_KEYS.PROJECTS, id));
  const [client] = useState(() =>
    project ? findById(STORAGE_KEYS.CLIENTS, project.clientId) : null
  );
  const [tasks, setTasks] = useState(() =>
    getData(STORAGE_KEYS.TASKS, []).filter((t) => t.projectId === id)
  );
  const [revisions, setRevisions] = useState(() =>
    getData(STORAGE_KEYS.REVISIONS, []).filter((r) => r.projectId === id)
  );

  const [activeTab, setActiveTab] = useState("Overview");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [newRevisionComment, setNewRevisionComment] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("");

  if (!project) {
    return (
      <DashboardLayout title="Project not found">
        <EmptyState
          title="This project no longer exists"
          action={
            <Link to="/projects" className="text-sm text-ochre font-medium hover:underline">
              ← Back to Projects
            </Link>
          }
        />
      </DashboardLayout>
    );
  }

  function setProjectStatus(status) {
    const next = updateData(STORAGE_KEYS.PROJECTS, project.id, { status });
    setProject(next.find((p) => p.id === project.id));
  }

  function addTask() {
    if (!newTaskName.trim()) return;
    const allTasks = getData(STORAGE_KEYS.TASKS, []);
    const record = {
      id: makeId("task"),
      projectId: project.id,
      name: newTaskName.trim(),
      status: "To Do",
      priority: "Medium",
      dueDate: project.deadline,
    };
    const next = [...allTasks, record];
    saveData(STORAGE_KEYS.TASKS, next);
    setTasks(next.filter((t) => t.projectId === project.id));
    setNewTaskName("");
    setTaskModalOpen(false);
  }

  function changeTaskStatus(taskId, status) {
    const allTasks = getData(STORAGE_KEYS.TASKS, []);
    const next = allTasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    saveData(STORAGE_KEYS.TASKS, next);
    setTasks(next.filter((t) => t.projectId === project.id));
  }

  function deleteTask(taskId) {
    const allTasks = getData(STORAGE_KEYS.TASKS, []);
    const next = allTasks.filter((t) => t.id !== taskId);
    saveData(STORAGE_KEYS.TASKS, next);
    setTasks(next.filter((t) => t.projectId === project.id));
  }

  function addRevision() {
    if (!newRevisionComment.trim()) return;
    const allRevisions = getData(STORAGE_KEYS.REVISIONS, []);
    const projectRevisions = allRevisions.filter((r) => r.projectId === project.id);
    const record = {
      id: makeId("revision"),
      projectId: project.id,
      revisionNumber: projectRevisions.length + 1,
      comment: newRevisionComment.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
    };
    const next = [...allRevisions, record];
    saveData(STORAGE_KEYS.REVISIONS, next);
    setRevisions(next.filter((r) => r.projectId === project.id));

    // Automation: a new revision request also creates a task for it.
    const allTasks = getData(STORAGE_KEYS.TASKS, []);
    const taskRecord = {
      id: makeId("task"),
      projectId: project.id,
      name: `Revision #${record.revisionNumber}`,
      status: "To Do",
      priority: "High",
      dueDate: project.deadline,
    };
    const nextTasks = [...allTasks, taskRecord];
    saveData(STORAGE_KEYS.TASKS, nextTasks);
    setTasks(nextTasks.filter((t) => t.projectId === project.id));

    setProjectStatus("Revision Requested");
    setNewRevisionComment("");
    setRevisionModalOpen(false);
  }

  function changeRevisionStatus(revisionId, status) {
    const allRevisions = getData(STORAGE_KEYS.REVISIONS, []);
    const next = allRevisions.map((r) => (r.id === revisionId ? { ...r, status } : r));
    saveData(STORAGE_KEYS.REVISIONS, next);
    setRevisions(next.filter((r) => r.projectId === project.id));
  }

  function handleApprove() {
    setProjectStatus("Approved");
    setApprovalMessage("Design approved. Project status updated to Approved.");
  }

  function handleRequestRevision() {
    setActiveTab("Revisions");
    setRevisionModalOpen(true);
    setApprovalMessage("");
  }

  const briefFields = getBriefFieldsForService(project.serviceId);

  return (
    <DashboardLayout title="Project Workspace">
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink2 mb-4"
      >
        <ArrowLeft size={15} /> Back to Projects
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink2">{project.name}</h2>
          <p className="text-sm text-muted mt-0.5">
            {client?.name} {client?.company ? `· ${client.company}` : ""}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-ochre text-ochre"
                : "border-transparent text-muted hover:text-ink2"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard label="Client" value={client?.name || "—"} />
          <InfoCard label="Service" value={getServiceById(project.serviceId)?.name || "—"} />
          <InfoCard label="Budget" value={project.budget ? `$${project.budget}` : "—"} />
          <InfoCard label="Deadline" value={project.deadline || "—"} />
          <div className="sm:col-span-2 lg:col-span-4 bg-panel border border-border rounded-lg p-4">
            <p className="text-xs font-medium text-muted mb-1">Description</p>
            <p className="text-sm text-ink2">{project.description || "No description provided."}</p>
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap gap-3">
            <Link
              to="/quotes"
              className="flex items-center gap-2 text-sm text-ochre hover:underline"
            >
              <FileText size={15} /> Manage Quotes for this project
            </Link>
            <Link
              to="/invoices"
              className="flex items-center gap-2 text-sm text-ochre hover:underline"
            >
              <Receipt size={15} /> Manage Invoices for this project
            </Link>
          </div>
        </div>
      )}

      {/* Brief */}
      {activeTab === "Brief" && (
        <div className="bg-panel border border-border rounded-lg p-5">
          {briefFields.every((f) => !project.brief?.[f.name]) ? (
            <p className="text-sm text-muted italic">No brief details were filled in for this project.</p>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {briefFields.map((f) => {
                const value = project.brief?.[f.name];
                if (!value) return null;
                return (
                  <div key={f.name}>
                    <dt className="text-xs font-medium text-muted mb-1">{f.label}</dt>
                    {f.type === "file" ? (
                      <img src={value} alt={f.label} className="h-20 w-20 object-cover rounded-md border border-border" />
                    ) : (
                      <dd className="text-sm text-ink2">{value}</dd>
                    )}
                  </div>
                );
              })}
            </dl>
          )}
        </div>
      )}

      {/* Tasks */}
      {activeTab === "Tasks" && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setTaskModalOpen(true)}
              className="flex items-center gap-1.5 text-sm bg-ochre hover:bg-ochre-dark text-white px-3.5 py-2 rounded-md font-medium"
            >
              <Plus size={15} /> Add Task
            </button>
          </div>
          {tasks.length === 0 ? (
            <EmptyState title="No tasks yet" />
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between bg-panel border border-border rounded-lg p-3.5"
                >
                  <div>
                    <p className="text-sm font-medium text-ink2">{t.name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      Priority: {t.priority} · Due {t.dueDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={t.status}
                      onChange={(e) => changeTaskStatus(t.id, e.target.value)}
                      className="input py-1.5 text-xs w-auto"
                    >
                      {TASK_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-600"
                      aria-label="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Revisions */}
      {activeTab === "Revisions" && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setRevisionModalOpen(true)}
              className="flex items-center gap-1.5 text-sm bg-ochre hover:bg-ochre-dark text-white px-3.5 py-2 rounded-md font-medium"
            >
              <Plus size={15} /> Request Revision
            </button>
          </div>
          {revisions.length === 0 ? (
            <EmptyState title="No revisions requested yet" />
          ) : (
            <div className="space-y-2">
              {revisions.map((r) => (
                <div key={r.id} className="bg-panel border border-border rounded-lg p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-ink2">Revision #{r.revisionNumber}</p>
                    <select
                      value={r.status}
                      onChange={(e) => changeRevisionStatus(r.id, e.target.value)}
                      className="input py-1.5 text-xs w-auto"
                    >
                      {REVISION_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-ink2/80">{r.comment}</p>
                  <p className="text-xs text-muted mt-1">{r.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approval */}
      {activeTab === "Approval" && (
        <div className="bg-panel border border-border rounded-lg p-6 max-w-lg">
          <p className="text-sm text-ink2 mb-4">
            Current status: <StatusBadge status={project.status} />
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 bg-teal hover:opacity-90 text-white text-sm font-medium px-4 py-2.5 rounded-md"
            >
              <CheckCircle2 size={16} /> Approve Design
            </button>
            <button
              onClick={handleRequestRevision}
              className="flex items-center gap-2 border border-border text-ink2 text-sm font-medium px-4 py-2.5 rounded-md hover:bg-paper"
            >
              <RefreshCw size={16} /> Request Revision
            </button>
          </div>
          {approvalMessage && (
            <p className="text-sm text-teal mt-4 bg-teal-light px-3 py-2 rounded-md">
              {approvalMessage}
            </p>
          )}
        </div>
      )}

      {/* Add task modal */}
      <Modal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} title="Add Task">
        <label className="block mb-4">
          <span className="block text-xs font-medium text-muted mb-1">Task name</span>
          <input
            className="input"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="e.g. Prepare mockup"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setTaskModalOpen(false)}
            className="px-4 py-2 text-sm rounded-md border border-border text-ink2 hover:bg-paper"
          >
            Cancel
          </button>
          <button
            onClick={addTask}
            className="px-4 py-2 text-sm rounded-md bg-ochre hover:bg-ochre-dark text-white font-medium"
          >
            Add Task
          </button>
        </div>
      </Modal>

      {/* Add revision modal */}
      <Modal open={revisionModalOpen} onClose={() => setRevisionModalOpen(false)} title="Request Revision">
        <label className="block mb-4">
          <span className="block text-xs font-medium text-muted mb-1">What needs to change?</span>
          <textarea
            rows={3}
            className="input resize-none"
            value={newRevisionComment}
            onChange={(e) => setNewRevisionComment(e.target.value)}
            placeholder="e.g. Please make the logo larger."
          />
        </label>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setRevisionModalOpen(false)}
            className="px-4 py-2 text-sm rounded-md border border-border text-ink2 hover:bg-paper"
          >
            Cancel
          </button>
          <button
            onClick={addRevision}
            className="px-4 py-2 text-sm rounded-md bg-ochre hover:bg-ochre-dark text-white font-medium"
          >
            Submit Revision
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-panel border border-border rounded-lg p-4">
      <p className="text-xs font-medium text-muted mb-1">{label}</p>
      <p className="text-sm font-medium text-ink2">{value}</p>
    </div>
  );
}
