import { ArrowLeft, Inbox } from "lucide-react";
import { useParams } from "react-router-dom";
import PageHeader from "../components/common/PageHeader.jsx";
import Button from "../components/common/Button.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

export default function FormResponses() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Button to="/" variant="ghost" size="sm" icon={ArrowLeft} className="-ml-3">
        All forms
      </Button>

      <PageHeader title="Responses" description={`Submissions for form ${id}.`} />

      <EmptyState
        icon={Inbox}
        title="No responses yet"
        description="Once people submit this form, their answers will appear here."
      />
    </div>
  );
}