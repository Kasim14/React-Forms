import ChoiceAnswer from "./ChoiceAnswer.jsx";
import { YES_NO_OPTIONS } from "../../../shared/questionTypes.js";

/** Yes/No is a two-option multiple choice with Y/N keys. Value: "yes" | "no". */
export default function YesNoAnswer(props) {
  return <ChoiceAnswer {...props} multiple={false} question={{ ...props.question, options: YES_NO_OPTIONS }} keyLabels={["Y", "N"]} />;
}