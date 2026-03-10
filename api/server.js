const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());

app.post("/curhat", async (req, res) => {
  try {
    // Cek apakah API Key terbaca oleh Vercel
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: "API_KEY_HILANG_DI_VERCEL" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // PENTING: Pakai FLASH agar jauh di bawah batas 10 detik Vercel
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
    // Kirim error asli ke Roblox, bukan error 500 biasa
    res.status(500).json({ error: "SYSTEM_ERROR: " + error.message });
  }
});

// Pintu cek kesehatan browser
app.get("/", (req, res) => {
  res.send("Server Flash Aktif dan Cepat!");
});

module.exports = app;
