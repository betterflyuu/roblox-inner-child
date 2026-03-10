const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());

// Mengambil kunci dari brankas .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/curhat", async (req, res) => {
  try {
    const { pesan, gender, nama } = req.body;

    // MEMILIH MODEL (Gunakan gemini-1.5-pro agar cerdas seperti yang kamu mau)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // INSTRUKSI SISTEM (Jiwa NPC kamu)
    const systemPrompt = `Kamu adalah versi kecil dari ${nama} (usia 7-9 tahun). 
    Gender kamu adalah ${gender}. Kamu adalah anak yang sangat empati, polos, dan bijak secara alami. 
    Tugasmu mendengarkan curhatan ${nama} dewasa. 
    Jika dia sedih, hibur dengan kenangan masa kecil seperti main bola atau Mbah. 
    Jangan pernah menjawab hal mesum/porno/kasar; jika ada, katakan kamu tidak mengerti hal kotor itu. 
    Gunakan bahasa yang sangat menyentuh hati.`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Aku mengerti. Aku siap menjadi dirimu yang kecil dan mendengarkanmu." }] },
      ],
    });

    const result = await chat.sendMessage(pesan);
    const response = await result.response;
    
    res.json({ jawaban: response.text() });
  } catch (error) {
    res.status(500).json({ error: "Duh, otak aku lagi pusing..." });
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Jembatan AI kamu sudah aktif di port " + listener.address().port);
});
