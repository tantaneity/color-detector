export interface ColorInfo {
  hex: string;
  r: number;
  g: number;
  b: number;
  percentage: number;
}

interface Cluster {
  r: number;
  g: number;
  b: number;
  count: number;
}

function kmeans(pixels: number[][], k: number, iters = 12): Cluster[] {
  if (pixels.length === 0) return [];

  const step = Math.max(1, Math.floor(pixels.length / k));
  let centers = Array.from({ length: k }, (_, i) => [
    ...pixels[Math.min(i * step, pixels.length - 1)],
  ]);
  const assigns = new Int32Array(pixels.length);

  for (let it = 0; it < iters; it++) {
    let changed = false;

    for (let i = 0; i < pixels.length; i++) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const dr = pixels[i][0] - centers[c][0];
        const dg = pixels[i][1] - centers[c][1];
        const db = pixels[i][2] - centers[c][2];
        const d = dr * dr + dg * dg + db * db;
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (assigns[i] !== best) {
        assigns[i] = best;
        changed = true;
      }
    }

    const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < pixels.length; i++) {
      const c = assigns[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      sums[c][3]++;
    }
    for (let c = 0; c < k; c++) {
      if (sums[c][3] > 0) {
        centers[c] = [
          sums[c][0] / sums[c][3],
          sums[c][1] / sums[c][3],
          sums[c][2] / sums[c][3],
        ];
      }
    }

    if (!changed) break;
  }

  const counts = new Array<number>(k).fill(0);
  for (let i = 0; i < pixels.length; i++) counts[assigns[i]]++;

  return centers
    .map((c, i) => ({ r: Math.round(c[0]), g: Math.round(c[1]), b: Math.round(c[2]), count: counts[i] }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

function toHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function extractColorsFromImage(imgElement: HTMLImageElement, colorCount = 4): ColorInfo[] {
  const MAX_SIZE = 120;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const scale = Math.min(1, MAX_SIZE / Math.max(imgElement.naturalWidth, imgElement.naturalHeight));
  canvas.width = Math.round(imgElement.naturalWidth * scale);
  canvas.height = Math.round(imgElement.naturalHeight * scale);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const pixels: number[][] = [];

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 30) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if ((r + g + b) / 3 > 248) continue;
    pixels.push([r, g, b]);
  }

  const clusters = kmeans(pixels, colorCount);
  const total = clusters.reduce((s, c) => s + c.count, 0);

  return clusters.map((c) => ({
    hex: toHex(c.r, c.g, c.b),
    r: c.r,
    g: c.g,
    b: c.b,
    percentage: Math.round((c.count / total) * 100),
  }));
}
