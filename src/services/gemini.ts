import { GoogleGenAI, Type } from "@google/genai";
import { CVAnalysis } from "../types";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
  return new GoogleGenAI({ apiKey });
};

export async function analyzeCV(cvText: string): Promise<CVAnalysis> {
  const ai = getAI();
  const model = "gemini-3.1-pro-preview";

  const prompt = `Analyze the following research CV and extract a structured interactive profile. 
  Identify major research themes (pillars), a career timeline, and key publications with their impact.
  
  CRITICAL: 
  - For publications, extract the DOI link or URL if available in the text.
  - Also generate a network graph of the researcher's work. 
  - Nodes should include the most significant papers, core research concepts, key collaborating institutions, frequent co-authors, and major presentations/talks.
  - The total number of nodes will be around 30 to ensure clarity. Focus on the highest impact items.
  - Links should represent relationships (e.g., "published at", "presented at", "collaborated with", "builds on", "applies concept").
  - For paper and presentation nodes, include a brief "tldr" summary.
  - DO NOT include citation counts.
  
  CV Text:
  ${cvText}`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          themes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                keyContributions: { type: Type.ARRAY, items: { type: Type.STRING } },
                relatedPublications: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "description", "keyContributions"]
            }
          },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                title: { type: Type.STRING },
                institution: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["education", "experience", "award"] }
              },
              required: ["year", "title", "institution", "type"]
            }
          },
          publications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                authors: { type: Type.STRING },
                venue: { type: Type.STRING },
                year: { type: Type.STRING },
                impact: { type: Type.STRING },
                doi: { type: Type.STRING, description: "The DOI URL or link to the publication if available" }
              },
              required: ["title", "year"]
            }
          },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          graph: {
            type: Type.OBJECT,
            properties: {
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["paper", "concept", "institution", "author", "presentation"] },
                    details: {
                      type: Type.OBJECT,
                      properties: {
                        abstract: { type: Type.STRING },
                        tldr: { type: Type.STRING }
                      }
                    }
                  },
                  required: ["id", "label", "type"]
                }
              },
              links: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: { type: Type.STRING },
                    target: { type: Type.STRING },
                    relationship: { type: Type.STRING }
                  },
                  required: ["source", "target", "relationship"]
                }
              }
            },
            required: ["nodes", "links"]
          }
        },
        required: ["name", "title", "summary", "themes", "timeline", "publications", "graph"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function chatWithCV(cvText: string, message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are an expert academic career consultant. You are helping a visitor explore the research CV of a scholar. 
      Use the provided CV text to answer questions accurately and professionally. 
      If information is not in the CV, state that you don't have that specific detail.
      
      CV Context:
      ${cvText}`,
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
}
