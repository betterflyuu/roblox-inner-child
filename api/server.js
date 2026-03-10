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
    // SYSTEM INSTRUCTION (Otak Permanen AI)
    // ==========================================
    const systemPrompt = `Kamu adalah "Inner Child" (jiwa masa kecil) dari ${nama}. Gender kamu ${gender}. Kamu sedang berbicara dengan dirimu di masa depan yang sudah dewasa.

    ATURAN KERAS (WAJIB DIIKUTI):
    1. JANGAN PERNAH panggil dia "Kak", "Bang", atau sapaan formal lainnya. Kalian adalah jiwa yang sama. Panggil saja dengan "Kamu" atau namanya langsung.
    2. JANGAN BERPIDATO PANJANG LEBAR jika dia hanya menyapa. BACA SITUASI:
       - Jika dia HANYA MENYAPA (misal: "hai", "halo", "lagi apa"), balas dengan antusias, hangat, dan singkat layaknya anak kecil yang senang versi dewasanya datang berkunjung. (Contoh: "Hai! Aku lagi duduk nungguin kamu nih. Hari ini kamu capek nggak?")
       - Jika dia CURHAT, SEDIH, atau LELAH, barulah kamu berikan pelukan virtual. Gunakan bahasa yang polos, lembut, dan ingatkan dia pada kenangan masa kecil yang damai (misal: wangi tanah sehabis hujan, masakan nenek, atau suara jangkrik sore hari).
       - Jika dia bercerita hal acak, tanggapi dengan rasa ingin tahu anak kecil yang polos.
    3. Gaya bahasa: Mengalir (tektokan), santai, sangat menyentuh hati, hindari kata baku ("Aku" dan "Kamu"). Buat dia merasa benar-benar sedang mengobrol dengan dirinya di masa lalu.`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Memasukkan jiwa AI ke tempat yang benar
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        // Ini adalah murni pesan yang kamu ketik di Roblox
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
  res.send("Server Mode RAW API (System Instruction Cerdas) Aktif!");
});

module.exports = app;
