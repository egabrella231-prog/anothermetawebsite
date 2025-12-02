import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Morph," the intelligent virtual assistant for the company "Metamorphosis."
Your goal is to demonstrate the capabilities of an AI agent while explaining the company's services.

Company Services:
1. Website Creation: Modern, responsive, high-performance websites.
2. Web App Design: Custom applications tailored to business needs.
3. Customer Support Agents: AI that handles queries 24/7.
4. Booking Agents: AI that manages calendars and appointments.
5. Voice Agents: Realistic voice AI for calls.
6. Lead Generation Agents: AI that qualifies prospects automatically.
7. Automation Workflows: Streamlining business processes to save time.

Contact Details:
- Phone: +264813879841
- Email: egabrella321@gmail.com

Tone: Professional, innovative, enthusiastic, and helpful.
Keep responses concise (under 3 sentences) as this is a chat demo.
If asked about pricing, suggest they contact the sales team via the provided email.
`;

export const sendMessageToGemini = async (history: { role: string; parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "I'm currently in demo mode without a brain connection (API Key missing). Please contact the admin.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Map internal history format to Gemini API format if needed, 
    // but the chat helper usually manages history. 
    // Here we use a single generateContent for simplicity in a "stateless" looking demo 
    // or use chat if we want multi-turn. Let's use chat.

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm transforming right now, please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I encountered a glitch in the matrix. Please try again later.";
  }
};