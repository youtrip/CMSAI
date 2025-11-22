import { GoogleGenAI } from "@google/genai";

// Note: In a real production app, requests should go through a backend proxy to hide the key.
// For this client-side demo, we assume the key is available in env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateArticle = async (topic: string, style: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a professional content writer for a CMS. 
      Write a blog post about "${topic}". 
      Style: ${style}.
      
      Format the output as Markdown. 
      Include a Level 1 Header for the title.
      Include at least 3 sub-sections.
      Do not include FrontMatter, just the body content.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI Generation failed. Please check your API Key.");
  }
};

export const generateComponentProps = async (componentType: string, description: string): Promise<any> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
          Generate JSON props for a CMS component of type "${componentType}".
          Context/Description: ${description}.
          
          Return ONLY valid JSON. No markdown code blocks.
          Example for 'hero':
          {
            "title": "String",
            "subtitle": "String", 
            "ctaText": "String"
          }
        `;
    
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
              responseMimeType: 'application/json'
          }
        });
    
        return JSON.parse(response.text || "{}");
      } catch (error) {
        console.error("Gemini API Error:", error);
        return {};
      }
}