const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/server", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "API KEY KOSONG DI VERCEL" });
    }

    const { pesan, gender, nama } = req.body;
    
    // JALUR TIKUS: Tembak langsung ke server Google pakai URL murni
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Instruksi untuk Inner Child
    const promptText = `Kamu adalah versi kecil dari ${nama}. Gender kamu ${gender}. Hibur dia dengan kenangan masa kecil. Jawab singkat, polos, dan menyentuh hati layaknya anak kecil. Pesan dari dia: "${pesan}"`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    // Kalau Google menolak, tangkap alasan aslinya
    if (data.error) {
      return res.status(500).json({ error: "DITOLAK GOOGLE: " + data.error.message });
    }

    // Ambil jawaban AI dan kirim ke Roblox
    const jawabanAI = data.candidates[0].content.parts[0].text;
    res.json({ jawaban: jawabanAI });

  } catch (error) {
    res.status(500).json({ error: "SERVER CRASH: " + error.message });
  }
});

app.get("/api/server", (req, res) => {
  res.send("Server Mode RAW API (Jalur Tikus) Aktif!");
});

module.exports = app;
