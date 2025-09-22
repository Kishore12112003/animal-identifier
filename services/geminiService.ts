
import { GoogleGenAI, Type } from "@google/genai";
import { AnimalData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    commonName: { type: Type.STRING, description: "Common name of the animal." },
    scientificName: { type: Type.STRING, description: "Scientific (binomial) name." },
    habitat: { type: Type.STRING, description: "Typical natural habitat." },
    diet: { type: Type.STRING, description: "Primary diet of the animal." },
    lifespan: { type: Type.STRING, description: "Average lifespan in the wild." },
    conservationStatus: { type: Type.STRING, description: "IUCN Red List status (e.g., Least Concern, Endangered)." },
    funFacts: {
      type: Type.ARRAY,
      description: "An array of 3-5 interesting facts.",
      items: { type: Type.STRING }
    },
    confidenceLevel: { type: Type.NUMBER, description: "Confidence score from 0.0 to 1.0." },
    error: { type: Type.STRING, description: "An error message if no animal is identified.", nullable: true }
  },
  required: ["commonName", "scientificName", "habitat", "diet", "lifespan", "conservationStatus", "funFacts", "confidenceLevel"]
};


export const identifyAnimal = async (base64ImageData: string, mimeType: string): Promise<AnimalData> => {
  const prompt = `Analyze the provided image and identify the animal. Respond ONLY with a JSON object that conforms to the specified schema. 
  The JSON object should contain the animal's common name, scientific name, habitat, diet, lifespan, conservation status, a few fun facts, and a confidence score.
  If you cannot confidently identify an animal, or if the image does not contain an animal, the JSON object should contain a single key 'error' with a descriptive message like 'Could not identify an animal in the image.' or 'The uploaded image does not appear to contain an animal.'
  Do not include any other text, explanations, or markdown formatting outside of the JSON object.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
              },
            },
            { text: prompt },
          ],
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    return parsedData as AnimalData;
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
        error: "Failed to communicate with the AI model. Please check your connection or API key and try again.",
    } as unknown as AnimalData;
  }
};
