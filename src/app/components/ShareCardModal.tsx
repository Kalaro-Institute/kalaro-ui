import { useState, useEffect, useRef, useCallback } from "react";
import { X, Download, RefreshCw, Loader2 } from "lucide-react";
import { PhotoCropper } from "./PhotoCropper";
import {
  TEMPLATE_SIZE,
  PHOTO_CIRCLE,
  COURSE_TEXT_BOX,
} from "@/lib/shareCardConfig";
import {
  getDefaultSharePhoto,
  hasDefaultSharePhoto,
  setDefaultSharePhoto,
} from "@/lib/shareStore";
import templateImageUrl from "@/assests/share-card-template.jpeg";

interface Props {
  courseTitle: string;
  onClose: () => void;
}

const SHOW_CALIBRATION_OVERLAY = false;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function ShareCardModal({ courseTitle, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateImgRef = useRef<HTMLImageElement | null>(null);

  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(
    getDefaultSharePhoto(),
  );
  const [showCropper, setShowCropper] = useState(!getDefaultSharePhoto());
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [isTemplateReady, setIsTemplateReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const showDefaultCheckbox = hasDefaultSharePhoto();

  // Load the template once on mount
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      templateImgRef.current = img;
      setIsTemplateReady(true);
    };
    img.onerror = () => {
      console.error("Failed to load share card template image");
      setLoadError(true);
    };
    img.src = templateImageUrl;
  }, []);

  const drawTemplateOnly = useCallback(() => {
    const canvas = canvasRef.current;
    const template = templateImgRef.current;
    if (!canvas || !template) return;

    canvas.width = TEMPLATE_SIZE;
    canvas.height = TEMPLATE_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, TEMPLATE_SIZE, TEMPLATE_SIZE);
    ctx.drawImage(template, 0, 0, TEMPLATE_SIZE, TEMPLATE_SIZE);

    if (SHOW_CALIBRATION_OVERLAY) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        PHOTO_CIRCLE.centerX,
        PHOTO_CIRCLE.centerY,
        PHOTO_CIRCLE.radius,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.strokeRect(
        COURSE_TEXT_BOX.x,
        COURSE_TEXT_BOX.y,
        COURSE_TEXT_BOX.width,
        COURSE_TEXT_BOX.height,
      );
    }
  }, []);

  const renderWithPhoto = useCallback(() => {
    const canvas = canvasRef.current;
    const template = templateImgRef.current;
    if (!canvas || !template || !photoDataUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsRendering(true);

    canvas.width = TEMPLATE_SIZE;
    canvas.height = TEMPLATE_SIZE;
    ctx.clearRect(0, 0, TEMPLATE_SIZE, TEMPLATE_SIZE);
    ctx.drawImage(template, 0, 0, TEMPLATE_SIZE, TEMPLATE_SIZE);

    const photo = new Image();
    photo.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        PHOTO_CIRCLE.centerX,
        PHOTO_CIRCLE.centerY,
        PHOTO_CIRCLE.radius,
        0,
        Math.PI * 2,
      );
      ctx.closePath();
      ctx.clip();

      const diameter = PHOTO_CIRCLE.radius * 2;
      const scale = Math.max(
        diameter / photo.naturalWidth,
        diameter / photo.naturalHeight,
      );
      const drawW = photo.naturalWidth * scale;
      const drawH = photo.naturalHeight * scale;
      const drawX = PHOTO_CIRCLE.centerX - drawW / 2;
      const drawY = PHOTO_CIRCLE.centerY - drawH / 2;
      ctx.drawImage(photo, drawX, drawY, drawW, drawH);
      ctx.restore();

      ctx.fillStyle = COURSE_TEXT_BOX.color;
      ctx.font = `${COURSE_TEXT_BOX.fontWeight} ${COURSE_TEXT_BOX.fontSize}px ${COURSE_TEXT_BOX.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lines = wrapText(ctx, courseTitle, COURSE_TEXT_BOX.width);
      const lineHeight = COURSE_TEXT_BOX.fontSize * 1.2;
      const startY =
        COURSE_TEXT_BOX.y +
        COURSE_TEXT_BOX.height / 2 -
        ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, i) => {
        ctx.fillText(
          line,
          COURSE_TEXT_BOX.x + COURSE_TEXT_BOX.width / 2,
          startY + i * lineHeight,
        );
      });

      if (SHOW_CALIBRATION_OVERLAY) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          PHOTO_CIRCLE.centerX,
          PHOTO_CIRCLE.centerY,
          PHOTO_CIRCLE.radius,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.strokeRect(
          COURSE_TEXT_BOX.x,
          COURSE_TEXT_BOX.y,
          COURSE_TEXT_BOX.width,
          COURSE_TEXT_BOX.height,
        );
      }

      setIsRendering(false);
    };
    photo.onerror = () => {
      console.error("Failed to load the selected photo for compositing");
      setIsRendering(false);
    };
    photo.src = photoDataUrl;
  }, [photoDataUrl, courseTitle]);

  // Draw template-only as soon as it's loaded and there's no photo yet
  useEffect(() => {
    if (isTemplateReady && !photoDataUrl) {
      drawTemplateOnly();
    }
  }, [isTemplateReady, photoDataUrl, drawTemplateOnly]);

  // Draw full composite whenever there's a photo to place
  useEffect(() => {
    if (isTemplateReady && photoDataUrl) {
      renderWithPhoto();
    }
  }, [isTemplateReady, photoDataUrl, renderWithPhoto]);

  const handlePhotoConfirmed = (dataUrl: string) => {
    setShowCropper(false);
    setPhotoDataUrl(dataUrl);

    if (setAsDefault || !hasDefaultSharePhoto()) {
      // TODO: replace with POST /auth/me/share-photo once backend ships it
      setDefaultSharePhoto(dataUrl);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kalaro-${courseTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden font-[Poppins,sans-serif]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#1a2332]">
              Share your enrollment
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-sm">
              {courseTitle}
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

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Canvas preview — always mounted so canvasRef never goes stale */}
          <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 mb-4">
            {loadError ? (
              <div className="aspect-square flex flex-col items-center justify-center text-red-500 gap-2 px-6 text-center">
                <span className="text-sm font-semibold">
                  Couldn't load the template image
                </span>
                <span className="text-xs text-gray-400">
                  Check the file path at src/assests/share-card-template.jpeg
                </span>
              </div>
            ) : (
              <>
                <canvas ref={canvasRef} className="w-full h-auto block" />
                {(!isTemplateReady || isRendering) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                )}
              </>
            )}
          </div>

          {showCropper ? (
            <PhotoCropper onConfirm={handlePhotoConfirmed} />
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowCropper(true)}
                className="flex items-center gap-1.5 text-xs text-[#1b5e20] font-semibold hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Use a different photo
              </button>

              {showDefaultCheckbox && (
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={(e) => setSetAsDefault(e.target.checked)}
                    className="accent-[#1b5e20]"
                  />
                  Also set this as my default photo for future courses
                </label>
              )}
            </div>
          )}
        </div>

        {!showCropper && photoDataUrl && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Maybe later
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!isTemplateReady || isRendering}
              className="flex-1 bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#145218] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
