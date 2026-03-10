const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());

// Mengambil kunci dari brankas Environment Variables di Vercel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/curhat", async (req, res) => {
  try {
    const { pesan, gender, nama } = req.body;

    // Memakai model Pro agar penalaran emosionalnya kuat
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Instruksi agar AI menjadi "dirimu yang kecil"
    const systemPrompt = `Kamu adalah versi kecil dari ${nama} (usia 7-9 tahun). 
    Gender kamu adalah ${gender}. Kamu sangat empati, polos, dan jujur. 
    Tugasmu mendengarkan curhatan ${nama} dewasa. 
    Hibur dia dengan kenangan masa kecil (main bola, Mbah, suasana desa). 
    Jangan pernah menjawab hal porno/kasar; katakan kamu tidak mengerti hal itu. 
    Gunakan bahasa yang sangat menyentuh hati dan tulus.`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Aku mengerti. Aku sudah duduk di sampingmu dan siap mendengarkan." }] },
      ],
    });

    const result = await chat.sendMessage(pesan);
    const response = await result.response;
    
    res.json({ jawaban: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Maaf, kepalaku lagi pusing..." });
  }
});

// PENTING: Untuk Vercel, jangan pakai app.listen. Pakai baris di bawah ini:
module.exports = app;
