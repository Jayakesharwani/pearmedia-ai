//TEXT ENHANCEMENT
export const getEnhancedPrompt = async (input) => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_KEY}`,
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
                  text: `Enhance this into a cinematic 50-word image prompt: ${input}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    console.log("Gemini Response:", data);

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Failed";
  } catch (err) {
    console.log(err);
    return "Error occurred";
  }
};

//IMAGE GENERATION  
export const generateImage = async (prompt) => {
  try {
    const res = await fetch("http://localhost:5000/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    console.log("BACKEND RESPONSE:", data); 

    return data.image;  
  } catch (err) {
    console.log("ERROR:", err);
  }
};

//IMAGE ANALYSIS
export const analyzeImage = async (base64) => {
  const res = await fetch("http://localhost:5000/analyze-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ base64 }),
  });

  const data = await res.json();
  return data.analysis;
};