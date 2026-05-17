import ImageColorDetector from "./components/ImageColorDetector";
import { ColorInfo } from "./lib/colorExtraction";

export default function App() {
  const handleColors = (colors: ColorInfo[]) => {
    console.log("Extracted colors:", colors);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontFamily: "sans-serif", marginBottom: "1.5rem", fontWeight: 600 }}>
        Image Color Detector
      </h2>
      <ImageColorDetector onColorsExtracted={handleColors} />
    </div>
  );
}
