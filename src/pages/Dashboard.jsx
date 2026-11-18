import { FileText, Plus } from "lucide-react";
import PageHeader from "../components/common/PageHeader.jsx";
import Button from "../components/common/Button.jsx";
import EmptyState from "../components/common/EmptyState.jsx";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Forms"
        description="Create, publish and manage your Reelo forms."
        actions={
          <Button to="/forms/new" icon={Plus}>
            New form
          </Button>
        }
      />

      <EmptyState
        icon={FileText}
        title="No forms yet"
        description="Create your first form to start collecting responses. All your forms will appear here."
        action={
          <Button to="/forms/new" icon={Plus}>
            Create your first form
          </Button>
        }
      />
    </div>
  );
}