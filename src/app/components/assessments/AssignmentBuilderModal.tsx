import { useState, useEffect } from "react";
import {
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Award,
  FileText,
} from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

interface Assignment {
  id: number;
  title: string;
  instructions: string;
  due_at: string;
  max_points: number;
}

interface Props {
  lessonId: number;
  lessonTitle: string;
  onClose: () => void;
}

export function AssignmentBuilderModal({
  lessonId,
  lessonTitle,
  onClose,
}: Props) {
  const [existingAssignment, setExistingAssignment] =
    useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    instructions: "",
    due_at: "",
    max_points: "100",
  });

  const update = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  useEffect(() => {
    // Try to load existing assignment for this lesson
    // No GET endpoint provided, so we start fresh
    setIsLoading(false);
  }, [lessonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Please enter an assignment title.");
      return;
    }
    if (!form.instructions.trim()) {
      toast.error("Please enter instructions for students.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest<Assignment>(
        `/assessments/lessons/${lessonId}/assignment`,
        {
          method: "POST",
          body: {
            title: form.title.trim(),
            instructions: form.instructions.trim(),
            due_at: form.due_at || null,
            max_points: Number(form.max_points),
          },
        },
      );

      toast.success("Assignment created successfully.");
      onClose();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to create assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden font-[Poppins,sans-serif]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-[#1a2332]">
              Create assignment
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
              {lessonTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Assignment title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Week 2 Case Study"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Instructions for students *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe what students need to do, what to submit, and how they will be graded..."
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Due date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="datetime-local"
                    value={form.due_at}
                    onChange={(e) => update("due_at", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Leave empty for no deadline
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Maximum points
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={1}
                    value={form.max_points}
                    onChange={(e) => update("max_points", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#f7faf7] border border-gray-100 rounded-xl px-4 py-3 flex items-start gap-3">
              <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                Students can submit a written response or a link to their work.
                You will grade submissions from the grading queue.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !form.title.trim() ||
                  !form.instructions.trim()
                }
                className="flex-1 bg-[#1b5e20] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Create assignment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
