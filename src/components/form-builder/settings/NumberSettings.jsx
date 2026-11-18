import Input from "../../common/Input.jsx";
import { toNumberOrNull } from "../../../utils/numbers.js";

export default function NumberSettings({ settings, onSettingsChange }) {
  const min = settings?.min ?? null;
  const max = settings?.max ?? null;
  const rangeError = min !== null && max !== null && min > max ? "Minimum can't be larger than maximum." : undefined;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="number"
          label="Minimum"
          value={min ?? ""}
          placeholder="No minimum"
          onChange={(event) => onSettingsChange({ min: toNumberOrNull(event.target.value) })}
          error={rangeError}
        />
        <Input
          type="number"
          label="Maximum"
          value={max ?? ""}
          placeholder="No maximum"
          onChange={(event) => onSettingsChange({ max: toNumberOrNull(event.target.value) })}
        />
      </div>
      <p className="mt-2 text-sm text-slate-500">Leave a field empty for no limit.</p>
    </div>
  );
}