import { useState, useCallback } from "react";
import { ColorInfo, extractColorsFromImage } from "../lib/colorExtraction";
import DropZone from "./DropZone";
import ColorSwatch from "./ColorSwatch";
import ColorChip from "./ColorChip";

interface ImageColorDetectorProps {
  onColorsExtracted?: (colors: ColorInfo[]) => void;
}

export default function ImageColorDetector({ onColorsExtracted }: ImageColorDetectorProps) {
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [colorCount, setColorCount] = useState(4);

  const extractFromSrc = useCallback(
    (src: string, count: number) => {
      const img = new Image();
      img.onload = () => {
        const extracted = extractColorsFromImage(img, count);
        setColors(extracted);
        onColorsExtracted?.(extracted);
      };
      img.src = src;
    },
    [onColorsExtracted]
  );

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreviewSrc(src);
      extractFromSrc(src, colorCount);
    };
    reader.readAsDataURL(file);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    setColorCount(val);
    if (previewSrc) extractFromSrc(previewSrc, val);
  };

  const copyHex = (hex: string) => navigator.clipboard?.writeText(hex);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 560, margin: "0 auto" }}>
      <DropZone onFile={handleFile} />

      {previewSrc && (
        <div style={{ marginTop: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div
            style={{
              flexShrink: 0,
              background: "#f0f0f0",
              borderRadius: 10,
              padding: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={previewSrc}
              alt="Image preview"
              style={{ maxWidth: 160, maxHeight: 160, display: "block" }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: "#666" }}>Colors:</label>
              <select value={colorCount} onChange={handleCountChange} style={{ fontSize: 13 }}>
                {[3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {colors.map((c) => (
                <ColorSwatch key={c.hex} color={c} onCopy={copyHex} />
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {colors.map((c) => (
                <ColorChip key={c.hex} color={c} onCopy={copyHex} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
