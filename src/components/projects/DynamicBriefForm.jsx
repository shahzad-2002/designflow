import { getBriefFieldsForService } from "../../data/briefFields.js";

export default function DynamicBriefForm({ serviceId, brief, onChange }) {
  const fields = getBriefFieldsForService(serviceId);

  function setField(name, value) {
    onChange({ ...brief, [name]: value });
  }

  function handleFile(name, fileList) {
    const file = fileList?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField(name, reader.result);
    reader.readAsDataURL(file);
  }

  if (!serviceId) {
    return (
      <p className="text-sm text-muted italic">
        Select a service above to show the relevant brief questions.
      </p>
    );
  }

  return (
    <div className="space-y-3.5">
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="block text-xs font-medium text-muted mb-1">{field.label}</span>

          {field.type === "text" && (
            <input
              className="input"
              value={brief[field.name] || ""}
              onChange={(e) => setField(field.name, e.target.value)}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              rows={3}
              className="input resize-none"
              value={brief[field.name] || ""}
              onChange={(e) => setField(field.name, e.target.value)}
            />
          )}

          {field.type === "select" && (
            <select
              className="input"
              value={brief[field.name] || ""}
              onChange={(e) => setField(field.name, e.target.value)}
            >
              <option value="">Select…</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {field.type === "file" && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(field.name, e.target.files)}
                className="text-sm text-muted"
              />
              {brief[field.name] && (
                <img
                  src={brief[field.name]}
                  alt="Reference"
                  className="mt-2 h-20 w-20 object-cover rounded-md border border-border"
                />
              )}
            </div>
          )}
        </label>
      ))}
    </div>
  );
}
