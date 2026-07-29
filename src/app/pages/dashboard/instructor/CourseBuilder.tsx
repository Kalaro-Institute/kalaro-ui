import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  GripVertical,
  BookOpen,
  FileText,
  Video,
  ArrowLeft,
  Send,
} from "lucide-react";
import { apiRequest, apiUpload } from "@/lib/api-client";
import type { ApiError } from "@/lib/api-client";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────

interface Lesson {
  id: number;
  title: string;
  order: number;
  content_type: string;
  duration_seconds: number;
  is_preview: boolean;
}

interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  objectives: string[];
  price: number;
  currency: string;
  duration_weeks: number;
  status: string;
  cover_image: string;
  instructor_id: number;
  modules: Module[];
}

interface Resource {
  id: number;
  title: string;
  file_url: string;
  size_bytes: number;
}

interface CourseFormState {
  title: string;
  summary: string;
  description: string;
  objectives: string[];
  price: string;
  currency: string;
  duration_weeks: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Course details form ──────────────────────────────────────

function CourseDetailsForm({
  initial,
  courseId,
  onSaved,
}: {
  initial?: Course;
  courseId?: number;
  onSaved: (course: Course) => void;
}) {
  const [form, setForm] = useState<CourseFormState>({
    title: initial?.title ?? "",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    objectives: initial?.objectives?.length ? initial.objectives : [""],
    price: initial?.price?.toString() ?? "",
    currency: initial?.currency ?? "NGN",
    duration_weeks: initial?.duration_weeks?.toString() ?? "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initial?.cover_image ?? null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof CourseFormState>(
    field: K,
    value: CourseFormState[K],
  ) => setForm((f) => ({ ...f, [field]: value }));

  const updateObjective = (index: number, value: string) => {
    const next = [...form.objectives];
    next[index] = value;
    update("objectives", next);
  };

  const addObjective = () => update("objectives", [...form.objectives, ""]);

  const removeObjective = (index: number) => {
    if (form.objectives.length === 1) return;
    update(
      "objectives",
      form.objectives.filter((_, i) => i !== index),
    );
  };

  const handleCoverSelect = (file: File) => {
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadCover = async (savedCourseId: number): Promise<void> => {
    if (!coverFile) return;
    const formData = new FormData();
    formData.append("file", coverFile);
    await apiUpload<{ cover_image: string }>(
      `/catalog/courses/${savedCourseId}/cover-image`,
      formData,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      objectives: form.objectives.filter((o) => o.trim() !== ""),
      price: Number(form.price),
      currency: form.currency,
      duration_weeks: Number(form.duration_weeks),
    };

    try {
      let course: Course;
      if (courseId) {
        course = await apiRequest<Course>(`/catalog/courses/${courseId}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        course = await apiRequest<Course>("/catalog/courses", {
          method: "POST",
          body: payload,
        });
      }

      // Upload cover image if one was selected — optional, don't fail the whole save
      if (coverFile) {
        try {
          await uploadCover(course.id);
        } catch {
          toast.warning(
            "Course saved but cover image upload failed. You can retry.",
          );
        }
      }

      toast.success(
        courseId
          ? "Course details saved."
          : "Course created. Now add your modules.",
      );
      onSaved(course);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Failed to save course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Cover image */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Cover image{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-start gap-4">
          <div className="w-32 h-20 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-6 h-6 text-gray-300" />
            )}
          </div>
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#1b5e20] cursor-pointer hover:text-[#145218] transition-colors">
              <Upload className="w-3.5 h-3.5" />
              {coverPreview ? "Change image" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverSelect(file);
                  e.target.value = "";
                }}
              />
            </label>
            {coverFile && (
              <p className="text-[11px] text-gray-400 truncate max-w-[160px]">
                {coverFile.name}
              </p>
            )}
            <p className="text-[11px] text-gray-400">
              JPG, PNG or WebP. Recommended 16:9.
            </p>
            {coverPreview && (
              <button
                type="button"
                onClick={() => {
                  setCoverFile(null);
                  setCoverPreview(null);
                }}
                className="text-[11px] text-red-500 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Course title *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Introduction to HMO Operations"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Short summary *
        </label>
        <input
          type="text"
          required
          placeholder="One sentence describing the course"
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Full description
        </label>
        <textarea
          rows={4}
          placeholder="Detailed description of what students will learn..."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Learning objectives
          </label>
          <button
            type="button"
            onClick={addObjective}
            className="text-xs text-[#1b5e20] font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.objectives.map((obj, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Objective ${i + 1}`}
                value={obj}
                onChange={(e) => updateObjective(i, e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors"
              />
              <button
                type="button"
                onClick={() => removeObjective(i)}
                disabled={form.objectives.length === 1}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                aria-label="Remove objective"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Price *
          </label>
          <input
            type="number"
            required
            min={0}
            placeholder="0"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Currency
          </label>
          <select
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors bg-white"
          >
            <option value="NGN">NGN</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Duration (weeks)
          </label>
          <input
            type="number"
            required
            min={1}
            placeholder="e.g. 6"
            value={form.duration_weeks}
            onChange={(e) => update("duration_weeks", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1b5e20] transition-colors"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !form.title.trim()}
          className="w-full sm:w-auto bg-[#1b5e20] text-white text-sm font-semibold px-8 py-3 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />{" "}
              {courseId ? "Save changes" : "Create course"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}


function LessonRow({ lesson }: { lesson: Lesson }) {
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isResourceUploading, setIsResourceUploading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceFile, setResourceFile] = useState<File | null>(null);

  const iconMap: Record<string, React.ElementType> = {
    video: Video,
    text: FileText,
  };
  const LessonIcon = iconMap[lesson.content_type] ?? FileText;

  const handleRetryVideoUpload = async (file: File) => {
    setIsVideoUploading(true);
    try {
      const { upload_url } = await apiRequest<{ upload_url: string }>(
        `/catalog/lessons/${lesson.id}/video-upload-url`,
        { method: "POST" },
      );
      await fetch(upload_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      setVideoUploaded(true);
      toast.success("Video uploaded.");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Video upload failed. Please try again.");
    } finally {
      setIsVideoUploading(false);
    }
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim() || !resourceFile) return;
    setIsResourceUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", resourceTitle.trim());
      formData.append("file", resourceFile);
      const resource = await apiUpload<Resource>(
        `/catalog/lessons/${lesson.id}/resources`,
        formData,
      );
      setResources((prev) => [...prev, resource]);
      setResourceTitle("");
      setResourceFile(null);
      setShowResourceForm(false);
      toast.success("Resource attached.");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to attach resource.");
    } finally {
      setIsResourceUploading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Lesson title row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0" />
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
          lesson.content_type === "video" ? "bg-blue-50" : "bg-gray-100"
        }`}>
          <LessonIcon className={`w-3.5 h-3.5 ${
            lesson.content_type === "video" ? "text-blue-500" : "text-gray-400"
          }`} />
        </div>
        <span className="text-sm text-[#1a2332] font-medium flex-1 truncate">
          {lesson.title}
        </span>
      </div>

      {/* Video retry — only shows if video upload failed during creation */}
      {lesson.content_type === "video" && !videoUploaded && (
        <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100 flex items-center justify-between gap-3">
          <p className="text-xs text-amber-700">
            Video not yet uploaded. Upload it now.
          </p>
          <label className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
            isVideoUploading
              ? "text-gray-400 pointer-events-none"
              : "text-[#1b5e20] hover:text-[#145218]"
          }`}>
            {isVideoUploading ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-3.5 h-3.5" /> Upload video</>
            )}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              disabled={isVideoUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleRetryVideoUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      )}

      {/* Video uploaded confirmation */}
      {lesson.content_type === "video" && videoUploaded && (
        <div className="px-4 py-2 bg-[#e8f5e9] border-t border-[#1b5e20]/10 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-[#1b5e20]" />
          <span className="text-xs text-[#1b5e20] font-medium">Video uploaded</span>
        </div>
      )}

      {/* Resources */}
      <div className="px-4 py-3 border-t border-gray-50">
        {resources.length > 0 && (
          <div className="space-y-1.5 mb-2.5">
            {resources.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
              >
                <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-700 flex-1 truncate">{r.title}</span>
                <span className="text-[11px] text-gray-400 shrink-0">
                  {formatBytes(r.size_bytes)}
                </span>
              </div>
            ))}
          </div>
        )}

        {showResourceForm ? (
          <form onSubmit={handleResourceSubmit} noValidate className="space-y-2">
            <input
              type="text"
              placeholder="Resource title (e.g. Week 1 PDF)"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#1b5e20] transition-colors"
            />
            {resourceFile ? (
              <div className="flex items-center gap-2 bg-[#e8f5e9] border border-[#1b5e20]/20 rounded-lg px-3 py-2">
                <FileText className="w-3.5 h-3.5 text-[#1b5e20] shrink-0" />
                <span className="text-xs text-[#1b5e20] flex-1 truncate">{resourceFile.name}</span>
                <button
                  type="button"
                  onClick={() => setResourceFile(null)}
                  className="text-[#1b5e20]/60 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 border border-dashed border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-[#1b5e20]/40 transition-colors">
                <Upload className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400">Select file</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setResourceFile(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isResourceUploading || !resourceTitle.trim() || !resourceFile}
                className="flex-1 bg-[#1b5e20] text-white text-xs font-semibold py-2 rounded-lg disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
              >
                {isResourceUploading ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                ) : (
                  "Attach resource"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResourceForm(false);
                  setResourceTitle("");
                  setResourceFile(null);
                }}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowResourceForm(true)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1b5e20] transition-colors font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Attach resource
          </button>
        )}
      </div>
    </div>
  );
}


function AddLessonForm({
  moduleId,
  nextOrder,
  onAdded,
}: {
  moduleId: number;
  nextOrder: number;
  onAdded: (lesson: Lesson) => void;
}) {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<"video" | "text">("video");
  const [textContent, setTextContent] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (contentType === "video" && !videoFile) {
      toast.error("Please select a video file before adding the lesson.");
      return;
    }
    setIsSubmitting(true);

    try {
      // Step 1: create the lesson
      const lesson = await apiRequest<Lesson>(
        `/catalog/modules/${moduleId}/lessons`,
        {
          method: "POST",
          body: {
            title: title.trim(),
            order: nextOrder,
            content_type: contentType,
            text_content: contentType === "text" ? textContent : "",
            video_provider_id: "",
            duration_seconds: 0,
          },
        },
      );

      // Step 2: if video, get presigned URL and upload
      if (contentType === "video" && videoFile) {
        try {
          const { upload_url } = await apiRequest<{ upload_url: string }>(
            `/catalog/lessons/${lesson.id}/video-upload-url`,
            { method: "POST" },
          );
          await fetch(upload_url, {
            method: "PUT",
            body: videoFile,
            headers: { "Content-Type": videoFile.type },
          });
          toast.success("Lesson and video added.");
        } catch {
          // Lesson was created but video failed — still add the lesson
          // so the instructor can retry the upload from the lesson row
          toast.warning("Lesson created but video upload failed. You can retry from the lesson.");
        }
      } else {
        toast.success("Lesson added.");
      }

      onAdded(lesson);
      setTitle("");
      setTextContent("");
      setVideoFile(null);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to add lesson.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 bg-white border border-dashed border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Add lesson
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {/* Title and content type on same row */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Lesson title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1b5e20] transition-colors"
          />
          <div className="flex items-center gap-1 shrink-0 bg-gray-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setContentType("video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                contentType === "video"
                  ? "bg-white text-[#1b5e20] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Video
            </button>
            <button
              type="button"
              onClick={() => setContentType("text")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                contentType === "text"
                  ? "bg-white text-[#1b5e20] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Text
            </button>
          </div>
        </div>

        {/* Video picker — shows when video is selected */}
        {contentType === "video" && (
          <div>
            {videoFile ? (
              <div className="flex items-center gap-3 bg-[#e8f5e9] border border-[#1b5e20]/20 rounded-lg px-3 py-2.5">
                <Video className="w-4 h-4 text-[#1b5e20] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1b5e20] truncate">
                    {videoFile.name}
                  </p>
                  <p className="text-[11px] text-[#1b5e20]/60">
                    {formatBytes(videoFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="text-[#1b5e20]/60 hover:text-red-500 transition-colors"
                  aria-label="Remove video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg px-4 py-4 cursor-pointer hover:border-[#1b5e20]/40 hover:bg-[#f7faf7] transition-colors group">
                <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#1b5e20] transition-colors" />
                <span className="text-sm text-gray-400 group-hover:text-[#1b5e20] transition-colors">
                  Click to select video file
                </span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setVideoFile(file);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        )}

        {/* Text editor — shows when text is selected */}
        {contentType === "text" && (
          <textarea
            rows={5}
            placeholder="Write your lesson content here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors resize-none"
          />
        )}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !title.trim() ||
            (contentType === "video" && !videoFile)
          }
          className="w-full bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {contentType === "video" ? "Creating & uploading..." : "Adding lesson..."}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add {contentType} lesson
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Module card ──────────────────────────────────────────────

function ModuleCard({
  module,
  index,
  total,
  onReorder,
  onLessonAdded,
}: {
  module: Module;
  index: number;
  total: number;
  courseId: number;
  onReorder: (moduleId: number, direction: "up" | "down") => void;
  onLessonAdded: (moduleId: number, lesson: Lesson) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>(module.lessons);

  return (
    <div className="bg-[#f7faf7] border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1a2332] truncate">
            {module.title}
          </p>
          <p className="text-xs text-gray-400">
            {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onReorder(module.id, "up")}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors text-gray-500"
            aria-label="Move module up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={() => onReorder(module.id, "down")}
            className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors text-gray-500"
            aria-label="Move module down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 ml-1"
            aria-label={expanded ? "Collapse module" : "Expand module"}
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="space-y-2 mb-2">
            {lessons.length === 0 ? (
              <p className="text-xs text-gray-400 py-2 text-center">
                No lessons yet. Add one below.
              </p>
            ) : (
              lessons.map((lesson) => (
                <LessonRow key={lesson.id} lesson={lesson} />
              ))
            )}
          </div>
          <AddLessonForm
            moduleId={module.id}
            nextOrder={lessons.length + 1}
            onAdded={(lesson) => {
              setLessons((prev) => [...prev, lesson]);
              onLessonAdded(module.id, lesson);
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Add module form ──────────────────────────────────────────

function AddModuleForm({
  courseId,
  nextOrder,
  onAdded,
}: {
  courseId: number;
  nextOrder: number;
  onAdded: (module: Module) => void;
}) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const module = await apiRequest<Module>(
        `/catalog/courses/${courseId}/modules`,
        {
          method: "POST",
          body: { title: title.trim(), order: nextOrder },
        },
      );
      onAdded(module);
      setTitle("");
      toast.success("Module added.");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to add module.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="New module title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1b5e20] transition-colors bg-white"
      />
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="bg-[#1b5e20] text-white text-sm font-semibold px-4 py-2.5 rounded-xl disabled:opacity-60 transition-colors flex items-center gap-2 shrink-0"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Add module
      </button>
    </form>
  );
}

// ─── Main component ───────────────────────────────────────────

export default function CourseBuilder() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId?: string }>();
  const isEditing = Boolean(courseId);

  const [step, setStep] = useState<"details" | "modules">(
    isEditing ? "modules" : "details",
  );
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(isEditing);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    apiRequest<Course[]>("/catalog/instructor/courses")
      .then((courses) => {
        const found = courses.find((c) => c.id === Number(courseId));
        if (!found) {
          toast.error("Course not found.");
          return;
        }
        setCourse(found);
        setModules(found.modules ?? []);
      })
      .catch(() => toast.error("Failed to load course."))
      .finally(() => setIsLoadingCourse(false));
  }, [courseId]);

  const handleDetailsSaved = (savedCourse: Course) => {
    setCourse(savedCourse);
    setModules(savedCourse.modules ?? []);
    setStep("modules");
  };

  const handleReorder = useCallback(
    async (moduleId: number, direction: "up" | "down") => {
      const index = modules.findIndex((m) => m.id === moduleId);
      if (index === -1) return;

      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= modules.length) return;

      const next = [...modules];
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      setModules(next);

      try {
        await apiRequest(`/catalog/modules/${moduleId}/reorder`, {
          method: "PATCH",
          body: { order: swapIndex + 1 },
        });
      } catch {
        setModules(modules);
        toast.error("Failed to reorder module.");
      }
    },
    [modules],
  );

  const handlePublish = async () => {
    if (!course) return;
    setIsPublishing(true);
    try {
      await apiRequest(`/catalog/courses/${course.id}/publish`, {
        method: "POST",
      });
      toast.success("Course published successfully.");
      navigate("/dashboard/instructor/courses");
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message ?? "Failed to publish course.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Loading course...</span>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard/instructor/courses")}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
          aria-label="Back to courses"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#1a2332]">
            {isEditing ? "Edit course" : "Create course"}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {course?.title ?? "New course"}
          </p>
        </div>
        {course && course.status !== "published" && (
          <button
            onClick={handlePublish}
            disabled={isPublishing || modules.length === 0}
            className="flex items-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isPublishing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
            ) : (
              <><Send className="w-4 h-4" /> Publish</>
            )}
          </button>
        )}
        {course?.status === "published" && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e8f5e9] text-[#1b5e20]">
            Published
          </span>
        )}
      </div>

      {/* Step tabs */}
      <div className="flex items-center gap-0 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setStep("details")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors ${
            step === "details"
              ? "bg-white text-[#1b5e20] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Course details
        </button>
        <button
          onClick={() => { if (course) setStep("modules"); }}
          disabled={!course}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            step === "modules"
              ? "bg-white text-[#1b5e20] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Modules & lessons
        </button>
      </div>

      {/* Step content */}
      {step === "details" && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <CourseDetailsForm
            initial={course ?? undefined}
            courseId={course?.id}
            onSaved={handleDetailsSaved}
          />
        </div>
      )}

      {step === "modules" && course && (
        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-xl px-6 py-10 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-semibold text-gray-500 mb-1">
                No modules yet
              </p>
              <p className="text-xs text-gray-400">Add your first module below.</p>
            </div>
          ) : (
            modules.map((mod, i) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                index={i}
                total={modules.length}
                courseId={course.id}
                onReorder={handleReorder}
                onLessonAdded={(moduleId, lesson) => {
                  setModules((prev) =>
                    prev.map((m) =>
                      m.id === moduleId
                        ? { ...m, lessons: [...m.lessons, lesson] }
                        : m,
                    ),
                  );
                }}
              />
            ))
          )}

          <AddModuleForm
            courseId={course.id}
            nextOrder={modules.length + 1}
            onAdded={(mod) =>
              setModules((prev) => [...prev, { ...mod, lessons: [] }])
            }
          />

          {modules.length > 0 && course.status !== "published" && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center gap-2 bg-[#1b5e20] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#145218] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isPublishing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                ) : (
                  <><Send className="w-4 h-4" /> Publish course</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
