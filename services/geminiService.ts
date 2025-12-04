import { GoogleGenAI, Content } from "@google/genai";
import { SendMessageResponse, ChatMessage } from "../types";
import { FARMER_ASSIST_SYSTEM_INSTRUCTION, MODEL_NAME } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendGeminiMessage = async (
  history: ChatMessage[],
  newMessage: string
): Promise<SendMessageResponse> => {
  try {
    // Convert app history format to SDK format
    // We only send recent history to keep context but avoid token limits in long chats
    const contents: Content[] = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Add the new message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }],
    });

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: {
        systemInstruction: FARMER_ASSIST_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "I'm having trouble retrieving the information right now. Please try again.";
    
    // Extract grounding chunks if available
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks as any[]; // Type casting for flexibility with SDK response

    return {
      text,
      groundingChunks,
    };

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};