import { CircleCheck } from "lucide-react";
import { getThankYouContent } from "../../utils/formScreens.js";

export default function ThankYouScreen({ form }) {
  const { title, description } = getThankYouContent(form);

  return (
    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <CircleCheck className="h-7 w-7" aria-hidden="true" />
      </div>
      <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="mt-3 whitespace-pre-line text-base text-slate-500">{description}</p>}
    </div>
  );
}