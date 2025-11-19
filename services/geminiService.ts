import { GoogleGenAI } from "@google/genai";
import { Order } from "../types";

const apiKey = process.env.API_KEY || '';

// Function to analyze sales data and give recommendations
export const analyzeBusinessPerformance = async (orders: Order[]): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure process.env.API_KEY.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Prepare data summary for the prompt
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const popularItems: Record<string, number> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        popularItems[item.name] = (popularItems[item.name] || 0) + item.quantity;
      });
    });

    const topItems = Object.entries(popularItems)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, qty]) => `${name} (${qty})`)
      .join(', ');

    const prompt = `
      You are a restaurant consultant. Analyze the following sales snapshot:
      - Total Revenue: $${totalRevenue.toFixed(2)}
      - Total Orders: ${totalOrders}
      - Top Selling Items: ${topItems}

      Provide 3 brief, actionable strategic insights to improve revenue or operations. 
      Format as a clean list. Keep it under 100 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights available at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights due to an API error.";
  }
};