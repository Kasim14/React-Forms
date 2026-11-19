import { Settings } from "lucide-react";
import EditorCard from "./EditorCard.jsx";
import SlugEditor from "./SlugEditor.jsx";
import Textarea from "../common/Textarea.jsx";
import Toggle from "../common/Toggle.jsx";

export default function FormSettingsEditor({ form, onChange, onSaveSlug }) {
  const settings = form.settings ?? {};
  const updateSettings = (changes) => onChange({ settings: { ...settings, ...changes } });

  return (
    <EditorCard icon={Settings} eyebrow="Form" title="Settings">
      <Textarea
        label="Form description"
        rows={3}
        maxLength={1000}
        hint="Shown on the welcome screen unless you write a separate welcome description."
        value={form.description ?? ""}
        onChange={(event) => onChange({ description: event.target.value })}
      />

      <div className="border-t border-slate-100 pt-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Public link</h3>
        <SlugEditor key={form.slug} form={form} onSave={onSaveSlug} />
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Display</h3>
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <Toggle
            label="Show progress bar"
            description="A thin bar at the top shows how far through the form respondents are."
            checked={settings.showProgress !== false}
            onChange={(value) => updateSettings({ showProgress: value })}
          />
          <Toggle
            label="Show question numbers"
            description="Display 1 →, 2 →, … before each question."
            checked={settings.showQuestionNumbers !== false}
            onChange={(value) => updateSettings({ showQuestionNumbers: value })}
          />
        </div>
      </div>
    </EditorCard>
  );
}