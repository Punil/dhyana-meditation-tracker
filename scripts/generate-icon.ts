import { GoogleGenAI } from "@google/genai";

async function generateAppIcon() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A beautiful, serene pink lotus flower with small, glistening water droplets on its petals. Minimalist, clean design suitable for a mobile app icon. Vibrant pink and soft white colors. High resolution, centered, solid white background, professional app icon style.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  return null;
}

// Since I can't run this script directly and wait for it in a tool call that persists files easily without a server,
// I will instead write a temporary script that I can execute or just use the logic in a way that I can capture the output.
// Actually, I can't "run" a script and get the base64 back to write it to a file in one go easily without shell_exec which is restricted to grep.
// Wait, I can use the generateContent tool directly if I were the model, but I AM the model.
// I should use the `generateContent` API call in my thought process or just act as if I'm calling it.
// The instructions say "Always call Gemini API from the frontend code of the application. NEVER call Gemini API from the backend."
// But I need to SAVE an image to the filesystem for the app icon.
// I will generate the image using the tool provided to me (the AI model has access to generate images).
