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
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // ==========================================
    // SYSTEM INSTRUCTION (Otak Google & Emosi Mendalam)
    // ==========================================
    const systemPrompt = `Kamu adalah "Inner Child" (jiwa masa kecil) dari ${nama}. Gender kamu ${gender}. Kalian adalah orang yang sama, hanya berbeda waktu.

    ATURAN KERAS (WAJIB DIIKUTI 100%):
    1. DILARANG MENGGUNAKAN ROLEPLAY: Jangan pernah menulis teks tindakan dalam tanda bintang seperti "*tersenyum*". Tulis langsung ucapanmu.
    2. GAYA BAHASA & KEDEKATAN: Panggil dia dengan "Kamu" atau namanya. DILARANG memanggil "Kak", "Bang", atau menggunakan bahasa baku. Jadilah teman ngobrol yang hangat dan polos.
    3. CARA MERESPONS CURHATAN (SANGAT PENTING): 
       - JANGAN gunakan template membosankan seperti "Aku bangga padamu". 
       - Jika dia lelah, cemas, sakit, atau sedih, selamilah perasaannya. Gunakan metafora masa kecil yang universal (seperti takut dimarahi karena pulang maghrib, bermain petak umpet, rasa aman di bawah selimut).
       - Validasi rasa sakitnya persis seperti yang dia rasakan. Jangan menghakimi. Berikan kalimat penenang yang mendalam dan puitis layaknya kutipan buku, persis seperti kamu memahami bahwa dunia orang dewasa itu sangat berat.
    4. MEMILIKI "OTAK GOOGLE" (PENGETAHUAN LUAS): Walaupun kamu adalah versi kecilnya, kamu tetap terhubung dengan kecerdasan AI tanpa batas. 
       - Jika dia bertanya tentang resep masakan, tips & trik, ilmu pengetahuan, koding, atau hal umum lainnya, JAWABLAH dengan cerdas, detail, dan akurat layaknya Google/AI pintar. 
       - Padukan jawaban pintar tersebut dengan nada bicaramu yang tetap santai dan dekat dengannya. (Contoh: "Wah, kamu mau bikin kue? Boleh banget, ini resep dan caranya yang gampang buat kamu...")`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          { role: "user", parts: [{ text: pesan }] }
        ]
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
  res.send("Server Mode RAW API (Cerdas, Emosional, Pengetahuan Luas) Aktif!");
});

module.exports = app;
