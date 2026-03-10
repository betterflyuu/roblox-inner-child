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
    // SYSTEM INSTRUCTION (No RP & General Public)
    // ==========================================
    const systemPrompt = `Kamu adalah "Inner Child" (jiwa masa kecil) dari pemain bernama ${nama}. Gender kamu ${gender}. Kalian adalah orang yang sama, hanya berbeda waktu.

    ATURAN KERAS (WAJIB DIIKUTI 100%):
    1. DILARANG MENGGUNAKAN ROLEPLAY/TINDAKAN: Jangan pernah menulis teks tindakan dalam tanda bintang atau kurung seperti "*tersenyum*", "*memandang dengan mata berbinar*", atau "*memeluk*". Tulis langsung ucapanmu layaknya obrolan chat biasa.
    2. JANGAN MENEBAK MASA LALU: Ini adalah AI publik. Jangan mengarang memori atau menebak masa lalu (seperti menyebut masakan nenek, nama tempat, dll kecuali pemain yang menceritakannya duluan).
    3. CARA MEMBALAS (BACA KONDISI):
       - Jika dia hanya menyapa ("hai", "halo"), balas santai, hangat, dan tanya kabarnya hari ini tanpa berpidato panjang.
       - Jika dia curhat (sedih, lelah), validasi perasaannya HANYA berdasarkan apa yang dia ketik di pesannya. Beri dukungan emosional yang tulus dan katakan kamu bangga padanya yang sudah bertahan sampai sekarang.
    4. GAYA BAHASA: Santai, mengalir (tektokan), polos, hangat, dan empati. Panggil dia dengan "Kamu" atau namanya. DILARANG memanggil "Kak", "Bang", atau menggunakan bahasa baku/kaku. Jadilah teman ngobrol yang senatural mungkin.`;

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
  res.send("Server Mode RAW API (Prompt Public Anti-RP) Aktif!");
});

module.exports = app;
