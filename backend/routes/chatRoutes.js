const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const rag = require("../services/ragService");

const DATA_DIR = path.join(__dirname, "..", "data");
const EMBEDDINGS_PATH = path.join(DATA_DIR, "embeddings.json");
const LOCK_PATH = path.join(DATA_DIR, ".seed-lock");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const result = await rag.generateResponse(message.trim());
    res.json(result);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to generate response" });
  }
});

router.get("/seed-status", (_req, res) => {
  const exists = fs.existsSync(EMBEDDINGS_PATH);
  if (exists) {
    const raw = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
    const count = JSON.parse(raw).length;
    return res.json({ seeded: true, count });
  }
  res.json({ seeded: false, count: 0 });
});

router.post("/seed", async (_req, res) => {
  if (fs.existsSync(LOCK_PATH)) {
    return res.status(409).json({ error: "Seeding already in progress" });
  }

  fs.writeFileSync(LOCK_PATH, Date.now().toString());

  try {
    delete require.cache[require.resolve("../scripts/seedEmbeddings")];
    await require("../scripts/seedEmbeddings");
    fs.unlinkSync(LOCK_PATH);
    const raw = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
    const count = JSON.parse(raw).length;
    res.json({ success: true, count });
  } catch (error) {
    if (fs.existsSync(LOCK_PATH)) fs.unlinkSync(LOCK_PATH);
    res.status(500).json({ error: error.message || "Seed failed" });
  }
});

module.exports = router;
