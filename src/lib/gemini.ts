import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google Gen AI client with the system-provided API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * AI SERVICE: Scope Extraction
 * 
 * Flow: User "Brain Dump" (String) -> Gemini API -> Structured JSON Object
 * 
 * Uses 'Structured Outputs' (responseSchema) to strictly constrain the LLM into 
 * returning verifiable JSON data. This prevents hallucinated keys and guarantees
 * the UI form receives `title`, `deliverables`, `priceAdjustment`, and `extraTimeDays`.
 */
export async function extractScopeFromBrainDump(brainDump: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash",
    contents: `Extract structured scope details from the following brain dump: "${brainDump}"`,
    config: {
      systemInstruction: "You are an expert logistics project manager. Extract scope, pricing, and timeline details from unstructured text.",
      responseMimeType: "application/json",
      // Enforce the output structure using JSON Schema Standard 
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

  // The output is guaranteed to be a JSON string due to the responseMimeType property
  return JSON.parse(response.text);
}

/**
 * AI SERVICE: Client Message Generation
 * 
 * Flow: Structured Details + Tone Preference -> Gemini API -> Formatted Email Body (String)
 * 
 * Translates dry, structured scope data into a human-readable, persuasive message 
 * ready to be copied into WhatsApp, Slack, or Email. Injects a hardcoded link that 
 * the UI later intercepts for demo purposes.
 */
export async function generateClientMessage(details: any, tone: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash",
    contents: `Generate a polished client message for a scope adjustment with the following details: ${JSON.stringify(details)}. The tone should be ${tone}.`,
    config: {
      systemInstruction: "You are a professional account manager at ScopeGuard. Write a clear, persuasive message explaining the surcharge. Always end the message by asking the client to review and approve the details at the following secure portal: https://scopeguard.app/approval-portal/SC-4821. Do not includes the URL in markdown brackets, just as a plain string.",
    }
  });

  return response.text;
}
