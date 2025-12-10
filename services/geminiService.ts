import { GoogleGenerativeAI } from "@google/genai";
import { InfographicData } from "../types";

// Đọc API key từ Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing. Please add it to .env or Vercel Env Settings.");
}

// Tạo Gemini client
const genAI = new GoogleGenerativeAI(apiKey);

// Convert ảnh sang base64
export async function fileToBase64(file: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // remove prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// PHÂN TÍCH NỘI DUNG
export async function analyzeContent(text: string, images: File[]): Promise<InfographicData> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // nếu có ảnh → convert base64
  const imageParts = await Promise.all(
    images.map(async (img) => ({
      inlineData: {
        data: await fileToBase64(img),
        mimeType: img.type
      }
    }))
  );

  const prompt = `
Bạn là AI chuyên tạo infographic học tập.
Hãy phân tích nội dung sau và tạo cấu trúc infographic phù hợp với học sinh.

Trả về JSON theo dạng sau:
{
  "topic": "...",
  "subtitle": "...",
  "targetAudience": "...",
  "points": [
    { "title": "...", "content": "...", "icon": "..." }
  ],
  "summary": "...",
  "colorPalette": ["#hex1", "#hex2", "#hex3"]
}
`;

  const result = await model.generateContent([
    prompt,
    { text },
    ...imageParts  // hỗ trợ phân tích ảnh
  ]);

  const json = JSON.parse(result.response.text());

  return json as InfographicData;
}

// TẠO BACKGROUND
export async function generateBackground(topic: string, palette: string[]) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
Tạo mô tả ảnh nền infographic chủ đề "${topic}".
Tông màu: ${palette.join(", ")}.
Trả về đường dẫn ảnh hoặc mô tả short caption.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
