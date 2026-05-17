import { useRef, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
}

export default function DropZone({ onFile }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (file?.type.startsWith("image/")) onFile(file);
  };

  return (
    <>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        style={{
          border: `2px dashed ${dragging ? "#888" : "#ccc"}`,
          borderRadius: 12,
          padding: "2rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#f5f5f5" : "transparent",
          transition: "background 0.15s, border-color 0.15s",
        }}
      >
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>Drop image here or click to upload</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </>
  );
}
