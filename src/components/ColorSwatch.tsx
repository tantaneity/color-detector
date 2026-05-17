import { ColorInfo, luminance } from "../lib/colorExtraction";

interface ColorSwatchProps {
  color: ColorInfo;
  onCopy: (hex: string) => void;
}

export default function ColorSwatch({ color, onCopy }: ColorSwatchProps) {
  return (
    <div
      title={`${color.hex} — click to copy`}
      onClick={() => onCopy(color.hex)}
      style={{
        width: 52,
        height: 52,
        borderRadius: 10,
        background: color.hex,
        cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 5,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: luminance(color.r, color.g, color.b) > 128 ? "#111" : "#fff",
        }}
      >
        {color.percentage}%
      </span>
    </div>
  );
}
