import SegmentedControl from "../../common/SegmentedControl.jsx";
import { RATING_LIMITS } from "../../../../shared/questionTypes.js";
import { range } from "../../../utils/numbers.js";

const STAR_OPTIONS = range(RATING_LIMITS.min, RATING_LIMITS.max).map((n) => ({ value: n, label: String(n) }));

export default function RatingSettings({ settings, onSettingsChange }) {
  return (
    <SegmentedControl
      label="Number of stars"
      options={STAR_OPTIONS}
      value={settings?.max ?? 5}
      onChange={(max) => onSettingsChange({ max })}
    />
  );
}