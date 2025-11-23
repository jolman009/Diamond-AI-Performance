import { GoogleGenAI, Schema, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeMechanics = async (
  mediaBase64: string,
  mimeType: string,
  promptContext: string
): Promise<string> => {
  try {
    const client = getClient();
    const modelId = "gemini-2.5-flash"; // Fast, multimodal

    const prompt = `
      You are an elite Baseball and Softball biomechanics expert coach.
      Analyze the provided video/image of a player. 
      Context: ${promptContext}
      
      Please provide:
      1. A breakdown of mechanical flaws (e.g., hip rotation, arm angle, stride, balance).
      2. Positive aspects of the form.
      3. A calculated 'Form Score' out of 100 based on elite standards.
      4. Three specific, actionable drills to correct the identified issues.
      
      Format the response in clear Markdown. Use bolding for emphasis.
    `;

    const response = await client.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: mediaBase64,
            },
          },
          { text: prompt },
        ],
      },
    });

    return response.text || "Analysis failed to generate text.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error connecting to Diamond AI via the Europa deep-space network. Please check your API key or internet connection.";
  }
};

export const generateMentalDrill = async (topic: string): Promise<string> => {
  try {
    const client = getClient();
    const modelId = "gemini-2.5-flash";

    const prompt = `
      Create a short, powerful mental performance exercise for a baseball/softball player focusing on: ${topic}.
      Include a brief visualization script and a breathing technique.
      Keep it under 200 words.
    `;

    const response = await client.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Mental drill generation failed.";
  } catch (error) {
    console.error("Gemini Mental Drill Error:", error);
    return "Neural link disrupted.";
  }
};

export const getRecruitingSummary = async (stats: string, bio: string): Promise<string> => {
  try {
    const client = getClient();
    const modelId = "gemini-2.5-flash";
    
    const prompt = `
      Write a professional recruiting profile summary for a college prospect.
      Stats: ${stats}
      Bio: ${bio}
      Tone: Confident, humble, hardworking. Max 150 words.
    `;

    const response = await client.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    
    return response.text || "Summary generation failed.";
  } catch (error) {
    console.error("Recruiting Summary Error:", error);
    return "Error generating summary.";
  }
};