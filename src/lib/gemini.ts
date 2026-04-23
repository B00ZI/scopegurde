import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractScopeFromBrainDump(brainDump: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract structured scope details from the following brain dump: "${brainDump}"`,
    config: {
      systemInstruction: "You are an expert logistics project manager. Extract scope, pricing, and timeline details from unstructured text.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          deliverables: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          priceAdjustment: { type: Type.NUMBER },
          extraTimeDays: { type: Type.NUMBER }
        },
        required: ["title", "deliverables", "priceAdjustment", "extraTimeDays"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateClientMessage(details: any, tone: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a polished client message for a scope adjustment with the following details: ${JSON.stringify(details)}. The tone should be ${tone}.`,
    config: {
      systemInstruction: "You are a professional account manager at ScopeGuard. Write a clear, persuasive message explaining the surcharge. Always end the message by asking the client to review and approve the details at the following secure portal: https://scopeguard.app/approval-portal/SC-4821. Do not includes the URL in markdown brackets, just as a plain string.",
    }
  });

  return response.text;
}
