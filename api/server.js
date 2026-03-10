const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());

// INI KUNCI FIX-NYA: Jalurnya disamakan persis dengan URL Vercel
app.post("/api/server/curhat", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "API KEY BLM DIPASANG DI VERCEL" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { pesan, gender, nama } = req.body;

    const systemPrompt = `Kamu adalah versi kecil dari ${nama}. Gender kamu ${gender}. 
    Hibur dia dengan kenangan masa kecil. Buat jawabanmu singkat, padat, dan menyentuh hati.`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Aku siap mendengarkan." }] },
      ],
    });

    const result = await chat.sendMessage(pesan);
    const response = await result.response;
    
    res.json({ jawaban: response.text() });

  } catch (error) {
    console.error("ERROR VERCEL:", error);
    res.status(500).json({ error: "SYSTEM_ERROR: " + error.message });
  }
});

// Pintu tamu buat ngetes di Chrome
app.get("/api/server/curhat", (req, res) => {
  res.send("Jalur Vercel sudah SINKRON dan server AKTIF!");
});

module.exports = app;
