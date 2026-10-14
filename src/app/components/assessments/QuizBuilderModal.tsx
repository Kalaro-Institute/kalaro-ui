import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  ToggleLeft,
  Award,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────

interface Choice {
  id?: number;
  text: string;
  is_correct: boolean;
  order: number;
}

interface Question {
  id?: number;
  text: string;
  type: "mcq" | "short_answer";
  order: number;
  points: number;
  choices: Choice[];
}

interface Quiz {
  id: number;
  title: string;
  time_limit_seconds: number;
  pass_percent: number;
  max_attempts: number;
  questions: Question[];
}

interface Props {
  lessonId: number;
  lessonTitle: string;
  onClose: () => void;
}

// ─── Choice row ───────────────────────────────────────────────

function ChoiceRow({
  choice,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  choice: Choice;
  index: number;
  total: number;
  onChange: (updated: Choice) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-2 p-2.5 rounded-lg border transition-colors ${
        choice.is_correct
          ? "border-[#1b5e20]/30 bg-[#e8f5e9]"
          : "border-gray-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => onChange({ ...choice, is_correct: !choice.is_correct })}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          choice.is_correct
            ? "border-[#1b5e20] bg-[#1b5e20]"
            : "border-gray-300"
        }`}
        aria-label="Mark as correct"
      >
        {choice.is_correct && <CheckCircle className="w-3 h-3 text-white" />}
      </button>
      <input
        type="text"
        placeholder={`Choice ${index + 1}`}
        value={choice.text}
        onChange={(e) => onChange({ ...choice, text: e.target.value })}
        className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
      />
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors text-gray-400"
          aria-label="Move up"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors text-gray-400"
          aria-label="Move down"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={total <= 2}
          className="p-1 rounded hover:bg-red-50 disabled:opacity-30 transition-colors text-gray-400 hover:text-red-500"
          aria-label="Remove choice"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Question card ────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  question: Question;
  index: number;
  total: number;
  onChange: (updated: Question) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const addChoice = () => {
    onChange({
      ...question,
      choices: [
        ...question.choices,
        {
          text: "",
          is_correct: false,
          order: question.choices.length + 1,
        },
      ],
    });
  };

  const updateChoice = (i: number, updated: Choice) => {
    const next = [...question.choices];
    // For MCQ, only one choice can be correct
    if (updated.is_correct && question.type === "mcq") {
      next.forEach((c, j) => {
        next[j] = { ...c, is_correct: j === i };
      });
      next[i] = updated;
    } else {
      next[i] = updated;
    }
    onChange({ ...question, choices: next });
  };

  const removeChoice = (i: number) => {
    onChange({
      ...question,
      choices: question.choices
        .filter((_, j) => j !== i)
        .map((c, j) => ({ ...c, order: j + 1 })),
    });
  };

  const moveChoice = (i: number, direction: "up" | "down") => {
    const next = [...question.choices];
    const swapIndex = direction === "up" ? i - 1 : i + 1;
    [next[i], next[swapIndex]] = [next[swapIndex], next[i]];
    onChange({
      ...question,
      choices: next.map((c, j) => ({ ...c, order: j + 1 })),
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Question header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide shrink-0">
          Q{index + 1}
        </span>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          {/* Type toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...question,
                  type: "mcq",
                  choices:
                    question.choices.length >= 2
                      ? question.choices
                      : [
                          { text: "", is_correct: true, order: 1 },
                          { text: "", is_correct: false, order: 2 },
                        ],
                })
              }
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                question.type === "mcq"
                  ? "bg-[#1b5e20] text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              MCQ
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({ ...question, type: "short_answer", choices: [] })
              }
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                question.type === "short_answer"
                  ? "bg-[#1b5e20] text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Short answer
            </button>
          </div>
          {/* Points */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1">
            <Award className="w-3 h-3 text-gray-400" />
            <input
              type="number"
              min={1}
              value={question.points}
              onChange={(e) =>
                onChange({
                  ...question,
                  points: Math.max(1, Number(e.target.value)),
                })
              }
              className="w-8 text-xs font-semibold text-center outline-none text-gray-700"
              aria-label="Points"
            />
            <span className="text-[11px] text-gray-400">pt</span>
          </div>
          {/* Reorder */}
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors text-gray-400"
            aria-label="Move question up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors text-gray-400"
            aria-label="Move question down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={total <= 1}
            className="p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-30 transition-colors text-gray-400 hover:text-red-500"
            aria-label="Remove question"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Question text */}
        <textarea
          rows={2}
          placeholder="Enter your question..."
          value={question.text}
          onChange={(e) => onChange({ ...question, text: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors resize-none"
        />

        {/* MCQ choices */}
        {question.type === "mcq" && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
              Choices — click the circle to mark the correct answer
            </p>
            {question.choices.map((choice, i) => (
              <ChoiceRow
                key={i}
                choice={choice}
                index={i}
                total={question.choices.length}
                onChange={(updated) => updateChoice(i, updated)}
                onRemove={() => removeChoice(i)}
                onMoveUp={() => moveChoice(i, "up")}
                onMoveDown={() => moveChoice(i, "down")}
              />
            ))}
            {question.choices.length < 6 && (
              <button
                type="button"
                onClick={addChoice}
                className="flex items-center gap-1.5 text-xs text-[#1b5e20] font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add choice
              </button>
            )}
            {!question.choices.some((c) => c.is_correct) && (
              <p className="text-[11px] text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Mark one choice as correct
              </p>
            )}
          </div>
        )}

        {/* Short answer hint */}
        {question.type === "short_answer" && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5">
            <p className="text-xs text-amber-700">
              Students will type a written response. You will grade this
              manually from the grading queue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────

function newQuestion(order: number): Question {
  return {
    text: "",
    type: "mcq",
    order,
    points: 1,
    choices: [
      { text: "", is_correct: true, order: 1 },
      { text: "", is_correct: false, order: 2 },
    ],
  };
}

export function QuizBuilderModal({ lessonId, lessonTitle, onClose }: Props) {
  const [existingQuiz, setExistingQuiz] = useState<Quiz | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);

  // Settings
  const [title, setTitle] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("");
  const [passPercent, setPassPercent] = useState("70");
  const [maxAttempts, setMaxAttempts] = useState("3");

  // Questions
  const [questions, setQuestions] = useState<Question[]>([newQuestion(1)]);

  // Submission state
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingQuestions, setIsSavingQuestions] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [quizId, setQuizId] = useState<number | null>(null);
  const [step, setStep] = useState<"settings" | "questions">("settings");

  // Load existing quiz if one exists
  useEffect(() => {
    apiRequest<Quiz>(`/assessments/lessons/${lessonId}/quiz`)
      .then((quiz) => {
        setExistingQuiz(quiz);
        setTitle(quiz.title);
        setTimeLimitMinutes(
          quiz.time_limit_seconds ? String(quiz.time_limit_seconds / 60) : "",
        );
        setPassPercent(String(quiz.pass_percent));
        setMaxAttempts(String(quiz.max_attempts));
        setQuestions(
          quiz.questions.length > 0 ? quiz.questions : [newQuestion(1)],
        );
        setQuizId(quiz.id);
        setSettingsSaved(true);
        setStep("questions");
      })
      .catch(() => {
        // No quiz yet — start fresh
      })
      .finally(() => setIsLoadingQuiz(false));
  }, [lessonId]);

  const handleSaveSettings = async () => {
    if (!title.trim()) {
      toast.error("Please enter a quiz title.");
      return;
    }

    setIsSavingSettings(true);
    try {
      const payload = {
        title: title.trim(),
        time_limit_seconds: timeLimitMinutes
          ? Number(timeLimitMinutes) * 60
          : 0,
        pass_percent: Number(passPercent),
        max_attempts: Number(maxAttempts),
        questions: [],
      };

      const quiz = await apiRequest<Quiz>(
        `/assessments/lessons/${lessonId}/quiz`,
        { method: "POST", body: payload },
      );

      setQuizId(quiz.id);
      setSettingsSaved(true);
      setStep("questions");
      toast.success("Quiz created. Now add your questions.");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to save quiz settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (!quizId) return;

    // Validate
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        toast.error(`Question ${i + 1} has no text.`);
        return;
      }
      if (q.type === "mcq") {
        if (q.choices.some((c) => !c.text.trim())) {
          toast.error(`All choices in question ${i + 1} must have text.`);
          return;
        }
        if (!q.choices.some((c) => c.is_correct)) {
          toast.error(`Question ${i + 1} must have a correct answer marked.`);
          return;
        }
      }
    }

    setIsSavingQuestions(true);
    try {
      // Post each question sequentially
      for (const question of questions) {
        await apiRequest(`/assessments/quizzes/${quizId}/questions`, {
          method: "POST",
          body: {
            text: question.text.trim(),
            type: question.type,
            order: question.order,
            points: question.points,
            choices:
              question.type === "mcq"
                ? question.choices.map((c) => ({
                    text: c.text.trim(),
                    is_correct: c.is_correct,
                    order: c.order,
                  }))
                : [],
          },
        });
      }

      toast.success("Quiz saved successfully.");
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to save questions.");
    } finally {
      setIsSavingQuestions(false);
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, newQuestion(prev.length + 1)]);
  };

  const updateQuestion = (index: number, updated: Question) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? updated : q)));
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, order: i + 1 })),
    );
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    setQuestions((prev) => {
      const next = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next.map((q, i) => ({ ...q, order: i + 1 }));
    });
  };

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden font-[Poppins,sans-serif]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#1a2332]">
              {existingQuiz ? "Edit quiz" : "Create quiz"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">
              {lessonTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoadingQuiz ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <>
            {/* Step tabs */}
            <div className="flex items-center gap-1 px-6 pt-4 shrink-0">
              <button
                onClick={() => setStep("settings")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  step === "settings"
                    ? "bg-[#1b5e20] text-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ToggleLeft className="w-3.5 h-3.5" />
                Quiz settings
              </button>
              <button
                onClick={() => {
                  if (settingsSaved) setStep("questions");
                }}
                disabled={!settingsSaved}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  step === "questions"
                    ? "bg-[#1b5e20] text-white"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Questions
                {settingsSaved && (
                  <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {questions.length}
                  </span>
                )}
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Settings step */}
              {step === "settings" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Quiz title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Module 1 Knowledge Check"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Time limit (minutes)
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="number"
                          min={0}
                          placeholder="No limit"
                          value={timeLimitMinutes}
                          onChange={(e) => setTimeLimitMinutes(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Leave empty for no limit
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Pass mark (%)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={passPercent}
                        onChange={(e) => setPassPercent(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Max attempts
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={maxAttempts}
                        onChange={(e) => setMaxAttempts(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings || !title.trim()}
                    className="w-full bg-[#1b5e20] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSavingSettings ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save and add questions"
                    )}
                  </button>
                </div>
              )}

              {/* Questions step */}
              {step === "questions" && (
                <div className="space-y-4">
                  {/* Summary bar */}
                  <div className="flex items-center justify-between bg-[#f7faf7] border border-gray-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {questions.length} question
                        {questions.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        {totalPoints} point{totalPoints !== 1 ? "s" : ""} total
                      </span>
                      <span>Pass at {passPercent}%</span>
                      {timeLimitMinutes && (
                        <span>{timeLimitMinutes} min limit</span>
                      )}
                    </div>
                    <button
                      onClick={() => setStep("settings")}
                      className="text-xs text-[#1b5e20] font-semibold hover:underline"
                    >
                      Edit settings
                    </button>
                  </div>

                  {/* Questions */}
                  {questions.map((question, i) => (
                    <QuestionCard
                      key={i}
                      question={question}
                      index={i}
                      total={questions.length}
                      onChange={(updated) => updateQuestion(i, updated)}
                      onRemove={() => removeQuestion(i)}
                      onMoveUp={() => moveQuestion(i, "up")}
                      onMoveDown={() => moveQuestion(i, "down")}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 font-semibold hover:border-[#1b5e20]/40 hover:text-[#1b5e20] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add question
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {step === "questions" && (
              <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {questions.filter((q) => q.type === "short_answer").length >
                    0 && "Short answer questions require manual grading."}
                </p>
                <button
                  onClick={handleSaveQuestions}
                  disabled={isSavingQuestions}
                  className="flex items-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSavingQuestions ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Save quiz
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
