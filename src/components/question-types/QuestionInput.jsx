import TextAnswer from "./TextAnswer.jsx";
import ChoiceAnswer from "./ChoiceAnswer.jsx";
import DropdownAnswer from "./DropdownAnswer.jsx";
import YesNoAnswer from "./YesNoAnswer.jsx";
import RatingAnswer from "./RatingAnswer.jsx";
import OpinionScaleAnswer from "./OpinionScaleAnswer.jsx";
import DateAnswer from "./DateAnswer.jsx";

const ANSWER_COMPONENTS = {
  short_text: TextAnswer,
  long_text: TextAnswer,
  email: TextAnswer,
  phone: TextAnswer,
  number: TextAnswer,
  multiple_choice: ChoiceAnswer,
  checkbox: ChoiceAnswer,
  dropdown: DropdownAnswer,
  yes_no: YesNoAnswer,
  rating: RatingAnswer,
  opinion_scale: OpinionScaleAnswer,
  date: DateAnswer,
};

/** Renders the right answer input for any question type. */
export default function QuestionInput(props) {
  const Answer = ANSWER_COMPONENTS[props.question.type];
  if (!Answer) {
    return <p className="text-sm text-red-600">This question type isn't supported.</p>;
  }
  return <Answer {...props} multiple={props.question.type === "checkbox"} />;
}