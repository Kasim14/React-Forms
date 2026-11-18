import Input from "../../common/Input.jsx";
import { QUESTION_TYPES } from "../../../../shared/questionTypes.js";
import { toNumberOrNull } from "../../../utils/numbers.js";

export default function TextSettings({ question, onSettingsChange }) {
  const limit = QUESTION_TYPES[question.type].maxLengthLimit;
  const value = question.settings?.maxLength ?? null;
  const invalid = value !== null && (!Number.isInteger(value) || value < 1 || value > limit);

  return (
    <Input
      type="number"
      label="Maximum characters"
      min={1}
      max={limit}
      step={1}
      value={value ?? ""}
      placeholder={String(limit)}
      onChange={(event) => onSettingsChange({ maxLength: toNumberOrNull(event.target.value) })}
      hint={`Leave empty to allow up to ${limit} characters.`}
      error={invalid ? `Enter a whole number between 1 and ${limit}.` : undefined}
      className="max-w-xs"
    />
  );
}