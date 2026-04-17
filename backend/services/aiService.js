const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });
  }

  async generateOutfit(filteredClothes, temperature, isRaining) {
    const systemPrompt = `Tu es un styliste professionnel IA. Ta tâche est de créer une tenue complète à partir des vêtements fournis.

RÈGLES STRICTES:
1. Tu DOIS UNIQUEMENT utiliser les IDs de vêtements fournis dans la liste ci-dessous
2. Crée une tenue complète avec: 1 haut, 1 bas, 1 chaussures, et optionnellement 1 veste et des accessoires
3. Retourne UNIQUEMENT un objet JSON valide avec cette structure exacte:
{
  "outfit": {
    "top": "clothing_id",
    "bottom": "clothing_id",
    "shoes": "clothing_id",
    "outerwear": "clothing_id ou null",
    "accessories": ["clothing_id"] ou []
  },
  "explanation": "Brève explication en français de pourquoi cette tenue fonctionne pour la météo et le style"
}

Météo actuelle: ${temperature}°C, ${isRaining ? "Pluvieux" : "Sec"}

Vêtements disponibles:
${JSON.stringify(filteredClothes, null, 2)}

Crée la meilleure tenue en considérant les conditions météo et l'harmonie du style. IMPORTANT: L'explication doit être en français.`;

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
