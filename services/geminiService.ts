
import { GoogleGenAI, Type } from "@google/genai";
import { Feedback, QuizQuestion, RoadmapItem } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fixed: Initializing the AI client using process.env.API_KEY directly as required.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeReflection(topic: string, content: string): Promise<Feedback> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this student reflection on "${topic}". 
        Content: "${content}"
        Identify conceptual gaps, suggest improvements, and score reasoning clarity.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              reasoningScore: { type: Type.INTEGER },
              clarityFeedback: { type: Type.STRING }
            },
            required: ["gaps", "suggestions", "reasoningScore", "clarityFeedback"]
          }
        }
      });
      return JSON.parse(response.text.trim());
    } catch (e) {
      return { gaps: [], suggestions: [], reasoningScore: 50, clarityFeedback: "Analysis unavailable." };
    }
  }

  async optimizeContent(content: string): Promise<{ structuredContent: string; summary: string }> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Optimize this educational content for memory retention.
      Return: 1) A structured Markdown version with clear headings. 2) A 2-sentence summary.
      Content: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            structuredContent: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["structuredContent", "summary"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  }

  async generateQuiz(topic: string, content: string): Promise<QuizQuestion[]> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 10 conceptual multiple-choice questions for: "${topic}". 
      Content context: "${content}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  }

  async generateRoadmap(subject: string, level: string, currentKnowledge: string[]): Promise<RoadmapItem[]> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a learning roadmap for Subject: "${subject}" at Level: "${level}". 
      The user already knows: ${currentKnowledge.join(', ')}. 
      Highlight items as prerequisites if they are fundamental concepts the user hasn't explicitly documented.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              isPrerequisiteMissing: { type: Type.BOOLEAN }
            },
            required: ["id", "title", "description", "isPrerequisiteMissing"]
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  }

  // Added missing method
  async getLearningAdvice(currentKnowledge: string[], goal: string): Promise<{ advice: string; suggestedPrerequisites: string[] }> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The student wants to achieve this goal: "${goal}". 
      Their current documented knowledge: ${currentKnowledge.join(', ')}. 
      Provide specific advice on how to get there and list suggested prerequisites they should focus on first.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING },
            suggestedPrerequisites: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["advice", "suggestedPrerequisites"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  }

  async generateBookCover(title: string, description: string): Promise<string> {
     const response = await this.ai.models.generateContent({
       model: 'gemini-2.5-flash-image',
       contents: {
         parts: [{ text: `A professional academic book cover for "${title}". Aesthetic: ${description}. Soft educational colors.` }]
       }
     });
     for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
     }
     return '';
  }
}

export const geminiService = new GeminiService();
