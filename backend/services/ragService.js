const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const DATA_DIR = path.join(__dirname, "..", "data");
const EMBEDDINGS_PATH = path.join(DATA_DIR, "embeddings.json");

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/Harrrdik18/Movie-website",
    "X-Title": "CineGlance",
  },
});

const EMBEDDING_MODEL = "text-embedding-3-small";
const CHAT_MODEL = process.env.OPENROUTER_MODEL || "gpt-4o-mini";

let embeddingsCache = null;

function loadEmbeddings() {
  if (embeddingsCache) return embeddingsCache;
  if (!fs.existsSync(EMBEDDINGS_PATH)) {
    throw new Error("Embeddings not found. Run the seed script first.");
  }
  const raw = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
  embeddingsCache = JSON.parse(raw);
  return embeddingsCache;
}

async function embedText(text) {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

function cosineSimilarity(a, b) {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

async function searchSimilar(query, topK = 6) {
  const movies = loadEmbeddings();
  const queryVec = await embedText(query);

  const scored = movies.map((m) => ({
    ...m,
    score: cosineSimilarity(queryVec, m.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

async function generateResponse(userQuery) {
  const similar = await searchSimilar(userQuery);

  const context = similar
    .map(
      (m, i) =>
        `${i + 1}. "${m.title}" (${m.year}) - ${m.genre}\n   Plot: ${m.plot}`,
    )
    .join("\n\n");

  const systemPrompt = `You are a movie recommendation assistant for CineGlance. You have access to a database of movies. Based on the user's query, recommend movies from the provided list and explain why they match. Be concise, enthusiastic, and specific. Refer to plot details when relevant.

Here are the most semantically similar movies to the user's query:

${context}`;

  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const text =
    response.choices[0]?.message?.content ||
    "Sorry, I couldn't generate a response.";

  return {
    reply: text,
    movies: similar.map((m) => ({
      id: m.id,
      title: m.title,
      year: m.year,
      poster: m.poster,
      genre: m.genre,
      imdbRating: m.imdbRating,
    })),
  };
}

module.exports = {
  loadEmbeddings,
  embedText,
  searchSimilar,
  generateResponse,
  cosineSimilarity,
};
