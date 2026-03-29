import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); 

app.post("/analyze-image", async (req, res) => {
  try {
    const { base64 } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Analyze this image and describe:

1. Main objects
2. Color palette
3. Artistic style

Give short structured output.
                  `,
                },
                {
                  inlineData: {
                    mimeType: "image/png",
                    data: base64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis";

    res.json({ analysis: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    
   const response = await fetch(
  "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt || "A beautiful cinematic scene",
    }),
  }
);
    if (!response.ok) {
  const errText = await response.text();
  console.log("HF ERROR:", errText);
   
  return res.status(500).json({ error: "HF failed" });
}

    const buffer = await response.arrayBuffer();

    
    const base64Image = Buffer.from(buffer).toString("base64");
console.log("Sending image...");
    res.json({
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "HF image generation failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
 