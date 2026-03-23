import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { NewsCluster, NewsPriority, ClusterCategory } from "../types";

export const analyzeNewsWithGemini = async (
  clusters: NewsCluster[],
  userProvidedKey?: string
): Promise<NewsCluster[]> => {
  try {
    const apiKey = userProvidedKey || process.env.API_KEY;

    if (!apiKey) {
      throw new Error("No se encontró API Key de Gemini.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // INCREASED: Send up to 50 clusters to get a larger list
    const itemsToAnalyze = clusters.slice(0, 50).map(c => ({
      id: c.cluster_id,
      title: c.title,
      source: c.top_source,
      technical_score: c.score,
      articles_count: c.coverage_count,
      snippet: c.articles[0].snippet
    }));

    const userPrompt = `
    Analiza estos clusters de noticias pre-procesados.
    Input Data:
    ${JSON.stringify(itemsToAnalyze, null, 2)}

    Tarea:
    Para cada cluster, genera el objeto "ai_analysis" con:
    1. Un titular periodístico sugerido para Economía 3.
    2. Un resumen ejecutivo.
    3. Asigna Prioridad (P1, P2, P3, DISCARD).
    4. Asigna Categoría.
    5. Razonamiento editorial.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              suggestedTitle: { type: Type.STRING },
              summary: { type: Type.STRING },
              priority: { type: Type.STRING, enum: Object.values(NewsPriority) },
              category: { type: Type.STRING, enum: Object.values(ClusterCategory) },
              reasoning: { type: Type.STRING },
            },
            required: ["id", "suggestedTitle", "priority", "category", "reasoning"],
          },
        },
      },
    });

    if (response.text) {
      const aiResults = JSON.parse(response.text) as any[];
      
      // Merge AI results back into the full cluster objects
      // UPDATED: If AI didn't return a result for an ID, fallback to raw data instead of filtering it out
      const merged = clusters.map(cluster => {
        const aiRes = aiResults.find(r => r.id === cluster.cluster_id);
        
        if (aiRes) {
            cluster.ai_analysis = {
                suggestedTitle: aiRes.suggestedTitle,
                summary: aiRes.summary,
                priority: aiRes.priority,
                category: aiRes.category,
                reasoning: aiRes.reasoning
            };
        } else {
            // FALLBACK: Don't hide items just because Gemini missed them in the JSON output
            // or if we are outside the slice range (though this map iterates over all)
            // Only items inside the slice 'itemsToAnalyze' had a chance to be analyzed.
            // Items outside the slice will also hit this else.
            
            // Only add fallback if it was part of the request or if we want to show raw items
            // Let's show everything to ensure "Big List".
             cluster.ai_analysis = {
                suggestedTitle: cluster.title,
                summary: cluster.articles[0].snippet || "Sin análisis de IA disponible.",
                priority: NewsPriority.DISCARD, // Mark as discard/low prio so it goes to bottom or sidebar
                category: ClusterCategory.OTROS,
                reasoning: "Ítem crudo (No analizado por IA o fuera de límite)."
            };
        }
        return cluster;
      });
      
      // Sort: P1 first, then Score
      return merged.sort((a, b) => {
          const pA = a.ai_analysis?.priority === 'P1' ? 2000 : a.ai_analysis?.priority === 'P2' ? 1000 : 0;
          const pB = b.ai_analysis?.priority === 'P1' ? 2000 : b.ai_analysis?.priority === 'P2' ? 1000 : 0;
          return (pB + b.score) - (pA + a.score);
      });
    }

    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};