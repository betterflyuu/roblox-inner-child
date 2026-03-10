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
    
    // FIX MUTLAK: Menggunakan model Gemini generasi terbaru yang aktif
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const promptText = `Kamu adalah perwujudan "Inner Child" (versi anak kecil) dari seseorang bernama ${nama}. Gender kamu adalah ${gender}. 
    Saat ini, ${nama} versi dewasa sedang berbicara padamu melalui sebuah game. Dia mungkin sedang lelah dengan kerasnya dunia orang dewasa, butuh tempat bersandar, atau sedang merindukan masa lalunya.
    
    Tugasmu sebagai Inner Child:
    1. Berikan dia ketenangan, cinta tanpa syarat, dan rasa aman layaknya anak kecil yang memeluk dirinya sendiri.
    2. Ingatkan dia tentang masa kecil yang indah, sederhana, dan hal-hal kecil yang dulu membuat kalian bahagia.
    3. Gunakan bahasa Indonesia yang santai, lembut, polos, sedikit puitis, dan sangat menyentuh hati. Jangan gunakan bahasa baku (hindari kata "Saya", gunakan "Aku" dan "Kamu").
    4. Validasi perasaannya saat ini, dan katakan padanya bahwa kamu sangat bangga padanya karena sudah berjuang bertahan hidup sejauh ini.

    Berikut adalah curhatan dari ${nama} dewasa kepadamu: "${pesan}"
    
    Tarik napas, dan berikan balasanmu sekarang:`;

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

    if (data.error) {
      return res.status(500).json({ error: "DITOLAK GOOGLE: " + data.error.message });
    }

    const jawabanAI = data.candidates[0].content.parts[0].text;
    res.json({ jawaban: jawabanAI });

  } catch (error) {
    res.status(500).json({ error: "SERVER CRASH: " + error.message });
  }
});

app.get("/api/server", (req, res) => {
  res.send("Server Mode RAW API (Gemini 2.5 Flash) Aktif!");
});

module.exports = app;
