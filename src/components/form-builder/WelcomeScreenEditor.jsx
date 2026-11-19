import { DoorOpen } from "lucide-react";
import EditorCard from "./EditorCard.jsx";
import Input from "../common/Input.jsx";
import Textarea from "../common/Textarea.jsx";
import Toggle from "../common/Toggle.jsx";

export default function WelcomeScreenEditor({ form, onChange }) {
  const welcome = form.welcomeScreen ?? {};
  const enabled = welcome.enabled !== false;
  const update = (changes) => onChange({ welcomeScreen: { ...welcome, ...changes } });

  return (
    <EditorCard icon={DoorOpen} eyebrow="Start" title="Welcome screen">
      <div className="rounded-lg border border-slate-200 p-4">
        <Toggle
          label="Show welcome screen"
          description="When off, respondents go straight to the first question."
          checked={enabled}
          onChange={(value) => update({ enabled: value })}
        />
      </div>

      {enabled && (
        <>
          <Input
            label="Title"
            placeholder={form.title || "Untitled form"}
            hint="Leave empty to use the form title."
            maxLength={150}
            value={welcome.title ?? ""}
            onChange={(event) => update({ title: event.target.value })}
          />
          <Textarea
            label="Description"
            rows={3}
            maxLength={1000}
            placeholder="e.g. This takes about 2 minutes. Your answers help us build better tools for restaurants."
            hint="Leave empty to use the form description (in Form settings)."
            value={welcome.description ?? ""}
            onChange={(event) => update({ description: event.target.value })}
          />
          <Input
            label="Button text"
            placeholder="Start"
            maxLength={30}
            value={welcome.buttonText ?? ""}
            onChange={(event) => update({ buttonText: event.target.value })}
            className="max-w-xs"
          />
        </>
      )}
    </EditorCard>
  );
}