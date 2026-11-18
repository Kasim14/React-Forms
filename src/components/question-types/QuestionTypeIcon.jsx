import {
  AlignLeft,
  AtSign,
  Calendar,
  CircleDot,
  CircleHelp,
  Gauge,
  Hash,
  Phone,
  SquareCheck,
  SquareChevronDown,
  Star,
  ThumbsUp,
  Type,
} from "lucide-react";

// Icons are kept separate from shared/questionTypes.js because the backend must not import React.
const ICONS = {
  short_text: Type,
  long_text: AlignLeft,
  email: AtSign,
  phone: Phone,
  number: Hash,
  multiple_choice: CircleDot,
  checkbox: SquareCheck,
  dropdown: SquareChevronDown,
  yes_no: ThumbsUp,
  rating: Star,
  opinion_scale: Gauge,
  date: Calendar,
};

export default function QuestionTypeIcon({ type, className = "h-4 w-4" }) {
  const Icon = ICONS[type] ?? CircleHelp;
  return <Icon className={className} aria-hidden="true" />;
}