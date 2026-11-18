import { Copy, Eye, EyeOff, Globe, Inbox, Link2, Pencil, Trash2 } from "lucide-react";
import DropdownMenu from "../common/DropdownMenu.jsx";
import { FORM_STATUS } from "../../../shared/formDefaults.js";

export default function FormActionsMenu({ form, handlers }) {
  const isPublished = form.status === FORM_STATUS.PUBLISHED;

  const items = [
    { label: "Edit", icon: Pencil, onClick: () => handlers.onEdit(form) },
    { label: "Preview", icon: Eye, onClick: () => handlers.onPreview(form) },
    { label: "View responses", icon: Inbox, onClick: () => handlers.onViewResponses(form) },
    { type: "separator" },
    {
      label: isPublished ? "Unpublish" : "Publish",
      icon: isPublished ? EyeOff : Globe,
      onClick: () => handlers.onToggleStatus(form),
    },
    {
      label: "Copy public link",
      icon: Link2,
      onClick: () => handlers.onCopyLink(form),
      disabled: !isPublished,
      hint: isPublished ? undefined : "Publish the form first",
    },
    { label: "Duplicate", icon: Copy, onClick: () => handlers.onDuplicate(form) },
    { type: "separator" },
    { label: "Delete", icon: Trash2, danger: true, onClick: () => handlers.onDelete(form) },
  ];

  return <DropdownMenu label={`Actions for ${form.title}`} items={items} />;
}