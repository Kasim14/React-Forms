import { Link, useParams } from "react-router-dom";
import { Eye } from "lucide-react";

export default function FormPreview() {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center justify-between gap-3 bg-brand-950 px-4 py-2 text-sm text-white">
        <span className="flex items-center gap-2">
          <Eye className="h-4 w-4" aria-hidden="true" />
          Preview mode: responses are not saved
        </span>
        <Link to={`/forms/${id}/edit`} className="font-medium text-brand-300 hover:text-brand-200">
          Back to editor
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 text-center text-slate-500">
        The survey preview will render here in Phase 4.
      </div>
    </div>
  );
}