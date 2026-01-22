import type { OcrResult } from "@/types/ocr"

export const mockOcrResults: OcrResult[] = [
  {
    fullText: "Hello World\nThis is a sample handwritten text.\nIt contains multiple lines of text.",
    lines: [
      {
        id: "1",
        text: "Hello World",
        confidence: 0.95,
        words: [
          { text: "Hello", confidence: 0.98, bbox: { x: 10, y: 10, w: 50, h: 20 } },
          { text: "World", confidence: 0.92, bbox: { x: 70, y: 10, w: 55, h: 20 } },
        ],
      },
      {
        id: "2",
        text: "This is a sample handwritten text.",
        confidence: 0.88,
        words: [
          { text: "This", confidence: 0.91, bbox: { x: 10, y: 40, w: 35, h: 20 } },
          { text: "is", confidence: 0.89, bbox: { x: 50, y: 40, w: 20, h: 20 } },
          { text: "a", confidence: 0.95, bbox: { x: 75, y: 40, w: 15, h: 20 } },
          { text: "sample", confidence: 0.85, bbox: { x: 95, y: 40, w: 60, h: 20 } },
          { text: "handwritten", confidence: 0.72, bbox: { x: 160, y: 40, w: 100, h: 20 } },
          { text: "text.", confidence: 0.90, bbox: { x: 265, y: 40, w: 35, h: 20 } },
        ],
      },
      {
        id: "3",
        text: "It contains multiple lines of text.",
        confidence: 0.86,
        words: [
          { text: "It", confidence: 0.93, bbox: { x: 10, y: 70, w: 20, h: 20 } },
          { text: "contains", confidence: 0.88, bbox: { x: 35, y: 70, w: 70, h: 20 } },
          { text: "multiple", confidence: 0.82, bbox: { x: 110, y: 70, w: 70, h: 20 } },
          { text: "lines", confidence: 0.87, bbox: { x: 185, y: 70, w: 45, h: 20 } },
          { text: "of", confidence: 0.94, bbox: { x: 235, y: 70, w: 25, h: 20 } },
          { text: "text.", confidence: 0.89, bbox: { x: 265, y: 70, w: 35, h: 20 } },
        ],
      },
    ],
    meta: {
      processingMs: 2345,
      language: "English",
      model: "CNN+LSTM (default)",
      rotated: false,
      denoised: true,
    },
  },
  {
    fullText: "Xin chào\nĐây là văn bản tiếng Việt.\nCó dấu và ký tự đặc biệt.",
    lines: [
      {
        id: "1",
        text: "Xin chào",
        confidence: 0.91,
        words: [
          { text: "Xin", confidence: 0.94, bbox: { x: 10, y: 10, w: 30, h: 20 } },
          { text: "chào", confidence: 0.88, bbox: { x: 45, y: 10, w: 40, h: 20 } },
        ],
      },
      {
        id: "2",
        text: "Đây là văn bản tiếng Việt.",
        confidence: 0.79,
        words: [
          { text: "Đây", confidence: 0.85, bbox: { x: 10, y: 40, w: 35, h: 20 } },
          { text: "là", confidence: 0.92, bbox: { x: 50, y: 40, w: 20, h: 20 } },
          { text: "văn", confidence: 0.88, bbox: { x: 75, y: 40, w: 30, h: 20 } },
          { text: "bản", confidence: 0.86, bbox: { x: 110, y: 40, w: 30, h: 20 } },
          { text: "tiếng", confidence: 0.68, bbox: { x: 145, y: 40, w: 50, h: 20 } },
          { text: "Việt.", confidence: 0.82, bbox: { x: 200, y: 40, w: 45, h: 20 } },
        ],
      },
      {
        id: "3",
        text: "Có dấu và ký tự đặc biệt.",
        confidence: 0.84,
        words: [
          { text: "Có", confidence: 0.90, bbox: { x: 10, y: 70, w: 25, h: 20 } },
          { text: "dấu", confidence: 0.76, bbox: { x: 40, y: 70, w: 35, h: 20 } },
          { text: "và", confidence: 0.93, bbox: { x: 80, y: 70, w: 25, h: 20 } },
          { text: "ký", confidence: 0.71, bbox: { x: 110, y: 70, w: 25, h: 20 } },
          { text: "tự", confidence: 0.88, bbox: { x: 140, y: 70, w: 20, h: 20 } },
          { text: "đặc", confidence: 0.65, bbox: { x: 165, y: 70, w: 30, h: 20 } },
          { text: "biệt.", confidence: 0.87, bbox: { x: 200, y: 70, w: 40, h: 20 } },
        ],
      },
    ],
    meta: {
      processingMs: 3120,
      language: "Vietnamese",
      model: "Transformer (beta)",
      rotated: true,
      denoised: true,
    },
  },
]
