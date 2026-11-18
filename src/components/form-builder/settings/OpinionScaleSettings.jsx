import Input from "../../common/Input.jsx";
import SegmentedControl from "../../common/SegmentedControl.jsx";
import { OPINION_SCALE_LIMITS } from "../../../../shared/questionTypes.js";
import { range } from "../../../utils/numbers.js";

const START_OPTIONS = OPINION_SCALE_LIMITS.startValues.map((n) => ({ value: n, label: String(n) }));
const END_OPTIONS = range(OPINION_SCALE_LIMITS.endMin, OPINION_SCALE_LIMITS.endMax).map((n) => ({
  value: n,
  label: String(n),
}));

export default function OpinionScaleSettings({ settings, onSettingsChange }) {
  const { min = 0, max = 10, minLabel = "", maxLabel = "" } = settings ?? {};

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-6">
        <SegmentedControl label="Start at" options={START_OPTIONS} value={min} onChange={(value) => onSettingsChange({ min: value })} />
        <SegmentedControl label="End at" options={END_OPTIONS} value={max} onChange={(value) => onSettingsChange({ max: value })} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={`Label under ${min}`}
          placeholder="e.g. Not likely"
          maxLength={40}
          value={minLabel}
          onChange={(event) => onSettingsChange({ minLabel: event.target.value })}
        />
        <Input
          label={`Label under ${max}`}
          placeholder="e.g. Very likely"
          maxLength={40}
          value={maxLabel}
          onChange={(event) => onSettingsChange({ maxLabel: event.target.value })}
        />
      </div>
    </div>
  );
}