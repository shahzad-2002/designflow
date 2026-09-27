import { Plus, Trash2 } from "lucide-react";
import { calcSubtotal, formatCurrency } from "../../utils/calculations.js";

export default function LineItemsEditor({ items, onChange }) {
  function updateItem(index, key, value) {
    const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    onChange(next);
  }

  function addItem() {
    onChange([...items, { service: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input
              className="input col-span-6"
              placeholder="Service / description"
              value={item.service}
              onChange={(e) => updateItem(i, "service", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="input col-span-2"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) => updateItem(i, "quantity", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="input col-span-3"
              placeholder="Unit price"
              value={item.unitPrice}
              onChange={(e) => updateItem(i, "unitPrice", e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="col-span-1 p-1.5 text-red-600 hover:bg-red-50 rounded flex justify-center"
              aria-label="Remove item"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-xs text-ochre font-medium mt-2 hover:underline"
      >
        <Plus size={13} /> Add line item
      </button>

      <div className="flex justify-end mt-3 text-sm">
        <span className="text-muted mr-2">Subtotal:</span>
        <span className="font-medium text-ink2">{formatCurrency(calcSubtotal(items))}</span>
      </div>
    </div>
  );
}
