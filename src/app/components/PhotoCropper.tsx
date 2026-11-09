import { useRef, useState, useCallback } from "react";
import { Upload, ZoomIn, Check, Loader2 } from "lucide-react";

interface Props {
  onConfirm: (dataUrl: string) => void;
  isProcessing?: boolean;
}

const OUTPUT_SIZE = 600; // square output resolution for the cropped photo

export function PhotoCropper({ onConfirm, isProcessing = false }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      startX: e.clientX - offset.x,
      startY: e.clientY - offset.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    setOffset({
      x: e.clientX - dragState.current.startX,
      y: e.clientY - dragState.current.startY,
    });
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleConfirm = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The preview box is 280x280 CSS px — map that viewport to the output size
    const PREVIEW_SIZE = 280;
    const scale = OUTPUT_SIZE / PREVIEW_SIZE;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const baseScale = Math.max(
      PREVIEW_SIZE / naturalW,
      PREVIEW_SIZE / naturalH,
    );
    const drawW = naturalW * baseScale * zoom;
    const drawH = naturalH * baseScale * zoom;
    const drawX = (PREVIEW_SIZE - drawW) / 2 + offset.x;
    const drawY = (PREVIEW_SIZE - drawH) / 2 + offset.y;

    ctx.drawImage(
      img,
      drawX * scale,
      drawY * scale,
      drawW * scale,
      drawH * scale,
    );

    onConfirm(canvas.toDataURL("image/jpeg", 0.92));
  }, [zoom, offset, onConfirm]);

  if (!imageSrc) {
    return (
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-10 cursor-pointer hover:border-[#1b5e20]/40 hover:bg-[#f7faf7] transition-colors">
        <Upload className="w-6 h-6 text-gray-400" />
        <span className="text-sm font-semibold text-gray-500">
          Upload your photo
        </span>
        <span className="text-xs text-gray-400">JPG or PNG</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </label>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-[280px] h-[280px] rounded-full overflow-hidden border-2 border-[#1b5e20]/30 cursor-move select-none bg-gray-100"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Your photo"
          draggable={false}
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            maxWidth: "none",
            width: "280px",
            height: "280px",
            objectFit: "cover",
          }}
        />
      </div>

      <div className="flex items-center gap-3 w-full max-w-xs">
        <ZoomIn className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 accent-[#1b5e20]"
        />
      </div>
      <p className="text-[11px] text-gray-400">
        Drag to reposition, slide to zoom
      </p>

      <div className="flex items-center gap-3 w-full max-w-xs">
        <button
          type="button"
          onClick={() => setImageSrc(null)}
          className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Choose different photo
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isProcessing}
          className="flex-1 bg-[#1b5e20] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#145218] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Use this photo
        </button>
      </div>
    </div>
  );
}
