import { useEffect, useRef, useState } from "react";
import { validateAnswer } from "../../shared/validateAnswer.js";
import { getWelcomeContent } from "../utils/formScreens.js";

// Single-pick questions move on by themselves after a short pause, like Typeform.
const AUTO_ADVANCE_TYPES = new Set(["multiple_choice", "yes_no", "rating", "opinion_scale"]);
const AUTO_ADVANCE_DELAY_MS = 450;

/**
 * All survey logic, with no UI:
 * step:      "welcome" | 0, 1, 2… (question index) | "done"
 * answers:   { questionId: rawValue }; kept when going back and forth
 * onSubmit:  async ({ submissionId, answers, durationSec }) → throws ApiError on failure
 */
export function useSurvey(form, onSubmit) {
  const questions = form.questions;
  const hasWelcome = getWelcomeContent(form).enabled;

  const [step, setStep] = useState(hasWelcome ? "welcome" : 0);
  const [direction, setDirection] = useState("forward"); // drives the slide animation
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null); // validation message for the current question
  const [submitError, setSubmitError] = useState(null); // network/server problem on submit
  const [submitting, setSubmitting] = useState(false);

  const submittingRef = useRef(false); // blocks double submits instantly (state updates are async)
  const submissionIdRef = useRef(null); // same id on retries → the server never saves twice
  const startedAtRef = useRef(0);
  const autoAdvanceRef = useRef(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
    return () => clearTimeout(autoAdvanceRef.current);
  }, []);

  const index = typeof step === "number" ? step : -1;
  const question = index >= 0 ? (questions[index] ?? null) : null;
  const isLast = index === questions.length - 1;
  const canGoBack = index > 0 || (index === 0 && hasWelcome);

  function goTo(nextStep, nextDirection) {
    clearTimeout(autoAdvanceRef.current);
    setDirection(nextDirection);
    setStep(nextStep);
    setError(null);
  }

  function start() {
    goTo(0, "forward");
  }

  function goBack() {
    if (index > 0) goTo(index - 1, "back");
    else if (index === 0 && hasWelcome) goTo("welcome", "back");
  }

  /** Store an answer for the current question (and maybe auto-advance). */
  function answer(value) {
    if (!question) return;
    const questionId = question.id;
    const fromIndex = index;

    setAnswers((current) => ({ ...current, [questionId]: value }));
    setError(null);
    setSubmitError(null);
    clearTimeout(autoAdvanceRef.current);

    if (AUTO_ADVANCE_TYPES.has(question.type) && !isLast) {
      autoAdvanceRef.current = setTimeout(() => {
        setDirection("forward");
        // Only advance if the respondent is still on the same question.
        setStep((current) => (current === fromIndex ? fromIndex + 1 : current));
      }, AUTO_ADVANCE_DELAY_MS);
    }
  }

  async function submit() {
    if (submittingRef.current) return;

    // Re-check every answer; jump to the first problem if any.
    for (let i = 0; i < questions.length; i += 1) {
      const message = validateAnswer(questions[i], answers[questions[i].id]);
      if (message) {
        goTo(i, "back");
        setError(message);
        return;
      }
    }

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    submissionIdRef.current ??= crypto.randomUUID();

    try {
      await onSubmit({
        submissionId: submissionIdRef.current,
        answers,
        durationSec: Math.round((Date.now() - startedAtRef.current) / 1000),
      });
      goTo("done", "forward"); // submittingRef stays true: nothing can be submitted again
    } catch (err) {
      submittingRef.current = false; // allow a retry (with the same submissionId)
      const firstInvalid = err.fields ? questions.findIndex((q) => err.fields[q.id]) : -1;
      if (firstInvalid !== -1) {
        goTo(firstInvalid, "back");
        setError(err.fields[questions[firstInvalid].id]);
      } else {
        setSubmitError(err.message || "We couldn't submit your response. Please check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  /** OK / Enter: validate the current question, then move on or submit. */
  async function goNext() {
    if (!question || submitting) return;
    const message = validateAnswer(question, answers[question.id]);
    if (message) {
      clearTimeout(autoAdvanceRef.current);
      setError(message);
      return;
    }
    if (!isLast) goTo(index + 1, "forward");
    else await submit();
  }

  return {
    step,
    direction,
    question,
    index,
    total: questions.length,
    isLast,
    canGoBack,
    value: question ? answers[question.id] : undefined,
    error,
    submitError,
    submitting,
    start,
    answer,
    goNext,
    goBack,
  };
}