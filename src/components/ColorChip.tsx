import { ColorInfo } from "../lib/colorExtraction";

interface ColorChipProps {
  color: ColorInfo;
  onCopy: (hex: string) => void;
}

export default function ColorChip({ color, onCopy }: ColorChipProps) {
  return (
    <div
      title="Click to copy"
      onClick={() => onCopy(color.hex)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#f4f4f4",
        borderRadius: 20,
        padding: "4px 10px 4px 6px",
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: color.hex,
          border: "1px solid rgba(0,0,0,0.1)",
          flexShrink: 0,
        }}
      />
      <span style={{ fontFamily: "monospace" }}>{color.hex}</span>
    </div>
  );
}
