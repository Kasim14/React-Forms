import { CircleCheck } from "lucide-react";
import EditorCard from "./EditorCard.jsx";
import Input from "../common/Input.jsx";
import Textarea from "../common/Textarea.jsx";

export default function ThankYouScreenEditor({ form, onChange }) {
  const thankYou = form.thankYouScreen ?? {};
  const update = (changes) => onChange({ thankYouScreen: { ...thankYou, ...changes } });

  return (
    <EditorCard icon={CircleCheck} eyebrow="End" title="Thank-you screen">
      <Input
        label="Title"
        placeholder="Thank you!"
        maxLength={150}
        value={thankYou.title ?? ""}
        onChange={(event) => update({ title: event.target.value })}
      />
      <Textarea
        label="Message"
        rows={3}
        maxLength={1000}
        placeholder="e.g. Our team will be in touch within 2 working days."
        value={thankYou.description ?? ""}
        onChange={(event) => update({ description: event.target.value })}
      />
    </EditorCard>
  );
}