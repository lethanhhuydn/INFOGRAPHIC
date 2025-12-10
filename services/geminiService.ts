import { GoogleGenAI, Type, Schema } from "@google/genai";
import { InfographicData } from "../types";

// Helper to get the AI client.
// Note: For gemini-3-pro-image-preview, we will need to handle the key selection flow in the UI 
// if the environment key isn't sufficient, but per instructions we use process.env.API_KEY.
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const infographicSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "Tiêu đề chính của infographic (ngắn gọn, ấn tượng)." },
    subtitle: { type: Type.STRING, description: "Tiêu đề phụ hoặc slogan." },
    targetAudience: { type: Type.STRING, description: "Đối tượng học sinh (VD: THPT, THCS)." },
    points: {
      type: Type.ARRAY,
      description: "4 đến 6 bước hoặc ý chính. Nếu là quy trình, hãy bắt đầu tiêu đề bằng 'Bước 1:', 'Bước 2:', v.v.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Tiêu đề (Ví dụ: Bước 1: Chuẩn bị)." },
          content: { type: Type.STRING, description: "Nội dung cô đọng, súc tích." },
          icon: { type: Type.STRING, description: "Tên icon tiếng Anh (VD: 'settings', 'edit', 'check', 'book', 'atom', 'brain', 'calculator', 'globe', 'history', 'leaf', 'microscope', 'music', 'pen-tool', 'rocket', 'scale', 'sun', 'trophy', 'user')." },
        },
        required: ["title", "content", "icon"],
      },
    },
    summary: { type: Type.STRING, description: "Lời kết hoặc thông điệp cốt lõi." },
    colorPalette: {
      type: Type.OBJECT,
      description: "Bảng màu hài hòa cho thiết kế.",
      properties: {
        primary: { type: Type.STRING, description: "Màu chủ đạo (Hex code)." },
        secondary: { type: Type.STRING, description: "Màu phụ trợ (Hex code)." },
        background: { type: Type.STRING, description: "Màu nền (Hex code, nên sáng sủa)." },
        text: { type: Type.STRING, description: "Màu chữ (Hex code, tương phản tốt)." },
        accent: { type: Type.STRING, description: "Màu nhấn (Hex code)." },
      },
      required: ["primary", "secondary", "background", "text", "accent"],
    },
  },
  required: ["topic", "subtitle", "targetAudience", "points", "summary", "colorPalette"],
};

export const analyzeContent = async (text: string, images: File[]): Promise<InfographicData> => {
  const ai = getAIClient();
  
  const parts: any[] = [];
  
  if (text) {
    parts.push({ text });
  }

  for (const img of images) {
    const base64Data = await fileToBase64(img);
    parts.push({
      inlineData: {
        mimeType: img.type,
        data: base64Data,
      },
    });
  }

  const prompt = `
    Bạn là một chuyên gia thiết kế giáo dục và sư phạm. Nhiệm vụ của bạn là phân tích nội dung đầu vào để tạo cấu trúc cho một Infographic dạy học dạng quy trình hoặc sơ đồ tư duy.
    
    Yêu cầu đặc biệt quan trọng:
    1. Giữ nguyên toàn bộ dấu câu và chính tả tiếng Việt. Không được làm sai lệch chữ cái có dấu (ă, â, ê, ô, ơ, ư, đ...).
    2. Nội dung phải cực kỳ cô đọng, chia thành các Bước hoặc các Ý rõ ràng.
    3. Phù hợp với phong cách "Card-based" (thẻ thông tin).
    4. Trả về định dạng JSON chính xác theo Schema.
    5. Chọn icon phong phú, phù hợp với từng bước.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      role: "user",
      parts: [
        { text: prompt },
        ...parts
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: infographicSchema,
      systemInstruction: "Bạn là trợ lý AI chuyên tạo nội dung giáo dục chất lượng cao. Bạn cực kỳ cẩn thận với chính tả tiếng Việt.",
    },
  });

  const responseText = response.text;
  if (!responseText) throw new Error("Không nhận được dữ liệu từ Gemini.");

  return JSON.parse(responseText) as InfographicData;
};

export const generateBackground = async (topic: string, colors: any): Promise<string> => {
  const ai = getAIClient();
  const prompt = `
    A high quality, abstract, minimal educational background texture for an infographic about "${topic}".
    Soft, harmonious colors matching this palette: Main ${colors.primary}, Secondary ${colors.secondary}.
    No text, no letters. High resolution, 16:9 aspect ratio.
    Clean, modern, vector art style or soft watercolor.
    White space in the center for text content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K", 
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.warn("Could not generate background image, falling back to color.", error);
  }
  return "";
};
