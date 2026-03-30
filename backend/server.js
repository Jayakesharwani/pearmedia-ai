import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));  
app.use(express.urlencoded({ limit: "50mb", extended: true })); 
 

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.REACT_APP_GEMINI_KEY,
});

app.post("/analyze-image", async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image received" });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",  
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Summarize this image in a single short paragraph (max 50 words). Do not use bullet points or headings.`,
            },
            {
              inlineData: {
                mimeType: mimeType || "image/png",
                data: image,
              },
            },
          ],
        },
      ],
    });

    const analysis = result.text || "No analysis";

    res.json({ analysis });

  } catch (err) {
    console.error("GEMINI ERROR:", err);
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

 
const summaryResult = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [
    {
      role: "user",
      parts: [
        {
          text: `Summarize this image in one short paragraph (max 40 words). Do not use bullet points.`,
        },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
      ],
    },
  ],
});

const summary = summaryResult.text || "No summary";

 
res.json({
  image: `data:image/png;base64,${base64Image}`,
  summary: summary,
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "HF image generation failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
 