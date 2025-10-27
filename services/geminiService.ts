
import { GoogleGenAI, Modality } from "@google/genai";

const VINTAGE_PHOTO_PROMPT = `Ultra-realistic recreation of an old vintage photo, keeping the same original face (99% likeness, no alteration). Transform into a modern high-quality digital portrait with vibrant updated colors, smooth realistic skin textures, and natural lighting. The outfit and background should be upgraded into a clean, modern aesthetic while preserving the authenticity of the original pose and expression.`;

export async function modernizeVintagePhoto(base64ImageData: string, mimeType: string): Promise<string | null> {
  // Do not create the GoogleGenAI instance when the component is first rendered.
  // Create it right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: VINTAGE_PHOTO_PROMPT,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while contacting the Gemini API.');
  }
}
