import OptionsEditor from "./OptionsEditor.jsx";
import TextSettings from "./TextSettings.jsx";
import NumberSettings from "./NumberSettings.jsx";
import RatingSettings from "./RatingSettings.jsx";
import OpinionScaleSettings from "./OpinionScaleSettings.jsx";
import { QUESTION_TYPES } from "../../../../shared/questionTypes.js";

/** Picks the right settings editor for the question's type (or nothing, e.g. for Email / Date). */
export default function QuestionSettings({ question, onChange }) {
  // Merge a few settings into the existing ones: setSettings({ max: 7 })
  const setSettings = (changes) => onChange({ settings: { ...question.settings, ...changes } });

  let content;
  switch (question.type) {
    case "multiple_choice":
    case "checkbox":
    case "dropdown":
      content = <OptionsEditor options={question.options} onChange={(options) => onChange({ options })} />;
      break;
    case "short_text":
    case "long_text":
      content = <TextSettings question={question} onSettingsChange={setSettings} />;
      break;
    case "number":
      content = <NumberSettings settings={question.settings} onSettingsChange={setSettings} />;
      break;
    case "rating":
      content = <RatingSettings settings={question.settings} onSettingsChange={setSettings} />;
      break;
    case "opinion_scale":
      content = <OpinionScaleSettings settings={question.settings} onSettingsChange={setSettings} />;
      break;
    default:
      return null;
  }

  return (
    <div className="border-t border-slate-100 pt-5">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">
        {QUESTION_TYPES[question.type].hasOptions ? "Answer options" : "Answer settings"}
      </h3>
      {content}
    </div>
  );
}