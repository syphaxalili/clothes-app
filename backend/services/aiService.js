const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });
  }

  async generateOutfit(filteredClothes, temperature, isRaining) {
    const systemPrompt = `You are a professional fashion stylist AI. Your task is to create a complete outfit from the provided clothing items.

STRICT RULES:
1. You MUST ONLY use the clothing IDs provided in the list below
2. Create a complete outfit with: 1 top, 1 bottom, 1 shoes, and optionally 1 outerwear and accessories
3. Return ONLY a valid JSON object with this exact structure:
{
  "outfit": {
    "top": "clothing_id",
    "bottom": "clothing_id",
    "shoes": "clothing_id",
    "outerwear": "clothing_id or null",
    "accessories": ["clothing_id"] or []
  },
  "explanation": "Brief explanation of why this outfit works for the weather and style"
}

Current weather: ${temperature}°C, ${isRaining ? "Rainy" : "Dry"}

Available clothing items:
${JSON.stringify(filteredClothes, null, 2)}

Create the best outfit considering the weather conditions and style harmony.`;

    try {
      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("AI did not return valid JSON");
      }

      const outfitData = JSON.parse(jsonMatch[0]);
      return outfitData;
    } catch (error) {
      console.error("AI Service error:", error.message);
      throw new Error("Failed to generate outfit suggestion");
    }
  }
}

module.exports = new AIService();
