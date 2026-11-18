import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Loader2, MousePointerClick } from "lucide-react";
import Button from "../components/common/Button.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import BuilderHeader from "../components/form-builder/BuilderHeader.jsx";
import QuestionList from "../components/form-builder/QuestionList.jsx";
import QuestionEditor from "../components/form-builder/QuestionEditor.jsx";
import AddQuestionModal from "../components/form-builder/AddQuestionModal.jsx";
import PreviewPanel from "../components/form-builder/PreviewPanel.jsx";
import { useFormBuilder } from "../hooks/useFormBuilder.js";
import { useToast } from "../hooks/useToast.js";
import { setFormStatus } from "../services/formService.js";
import { copyToClipboard } from "../utils/clipboard.js";
import { getPublicFormUrl } from "../utils/formUrl.js";
import { FORM_STATUS } from "../../shared/formDefaults.js";
import { getPublishIssues } from "../../shared/validateForm.js";

/**
 * key={id}: opening a different form gives a completely fresh builder,
 * so nothing from the previous form can leak into the next one.
 */
export default function FormBuilderPage() {
  const { id } = useParams();
  return <FormBuilder key={id} formId={id} />;
}

function FormBuilder({ formId }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { form, loading, loadError, selectedId, selectedQuestion, saveStatus, actions } = useFormBuilder(formId);

  const [addOpen, setAddOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [publishing, setPublishing] = useState(false);

  /* ---------- Loading / error screens ---------- */

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <EmptyState
            icon={AlertTriangle}
            title={loadError.status === 404 ? "Form not found" : "Couldn't open this form"}
            description={loadError.message}
            action={<Button to="/" variant="secondary" icon={ArrowLeft}>Back to forms</Button>}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50" role="status">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" aria-hidden="true" />
        <span className="sr-only">Loading form…</span>
      </div>
    );
  }

  /* ---------- Handlers ---------- */

  const selectedIndex = form.questions.findIndex((q) => q.id === selectedId);

  /** Save pending changes first, then run `next` (leave, preview…). */
  async function saveThen(next) {
    try {
      await actions.flush();
      next();
    } catch {
      toast.error("Couldn't save your latest changes. Please try again.");
    }
  }

  function handleAddQuestion(type) {
    const question = actions.addQuestion(type);
    setJustAddedId(question.id);
    setAddOpen(false);
  }

  function handleDeleteRequest(question) {
    // Empty questions are deleted straight away; anything with content asks first.
    if (!question.title.trim()) actions.deleteQuestion(question.id);
    else setQuestionToDelete(question);
  }

  function confirmDeleteQuestion() {
    actions.deleteQuestion(questionToDelete.id);
    setQuestionToDelete(null);
  }

  async function handleCopyLink() {
    const url = getPublicFormUrl(form.slug);
    if (await copyToClipboard(url)) toast.success("Public link copied to clipboard.");
    else toast.error(`Couldn't copy automatically. Link: ${url}`);
  }

  async function handleTogglePublish() {
    const isPublished = form.status === FORM_STATUS.PUBLISHED;

    // Check the form is ready BEFORE contacting the server, and jump to the problem question.
    if (!isPublished) {
      const issues = getPublishIssues(form);
      if (issues.length > 0) {
        toast.error(issues[0].message);
        if (issues[0].questionId) actions.selectQuestion(issues[0].questionId);
        return;
      }
    }

    setPublishing(true);
    try {
      await actions.flush(); // publish exactly what's on screen
      const nextStatus = isPublished ? FORM_STATUS.DRAFT : FORM_STATUS.PUBLISHED;
      const updated = await setFormStatus(form.id, nextStatus);
      actions.applyServerChanges({ status: updated.status, updatedAt: updated.updatedAt });
      toast.success(
        isPublished
          ? "Form unpublished. It no longer accepts responses."
          : "Your form is live! Use “Copy link” to share it."
      );
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setPublishing(false);
    }
  }

  /* ---------- Layout ---------- */

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <BuilderHeader
        form={form}
        saveStatus={saveStatus}
        publishing={publishing}
        onBack={() => saveThen(() => navigate("/"))}
        onTitleChange={(title) => actions.updateForm({ title })}
        onRetrySave={actions.retrySave}
        onPreview={() => saveThen(() => navigate(`/forms/${form.id}/preview`))}
        onCopyLink={handleCopyLink}
        onTogglePublish={handleTogglePublish}
      />

      <div className="grid flex-1 grid-cols-1 items-start gap-4 p-4 lg:grid-cols-[300px_minmax(0,1fr)_360px]">
        <QuestionList
          questions={form.questions}
          selectedId={selectedId}
          onSelect={actions.selectQuestion}
          onAdd={() => setAddOpen(true)}
          onMove={actions.moveQuestion}
          onDuplicate={actions.duplicateQuestion}
          onDelete={handleDeleteRequest}
        />

        {selectedQuestion ? (
          <QuestionEditor
            key={selectedQuestion.id}
            question={selectedQuestion}
            index={selectedIndex}
            autoFocusTitle={selectedQuestion.id === justAddedId}
            onChange={(changes) => actions.updateQuestion(selectedQuestion.id, changes)}
          />
        ) : (
          <EmptyState
            icon={MousePointerClick}
            title={form.questions.length ? "Select a question" : "Add your first question"}
            description={
              form.questions.length
                ? "Choose a question from the list to edit it."
                : "Use the “Add” button to choose a question type."
            }
          />
        )}

        <PreviewPanel form={form} question={selectedQuestion} index={selectedIndex} />
      </div>

      <AddQuestionModal open={addOpen} onClose={() => setAddOpen(false)} onSelect={handleAddQuestion} />

      <ConfirmDialog
        open={Boolean(questionToDelete)}
        title="Delete this question?"
        description={questionToDelete ? `“${questionToDelete.title}” will be removed from this form.` : ""}
        confirmLabel="Delete question"
        onConfirm={confirmDeleteQuestion}
        onCancel={() => setQuestionToDelete(null)}
      />
    </div>
  );
}