 
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
                  text: `
Do two things:
1. Enhance this into a cinematic 50-word image prompt
2. Also give a short 1-line summary

Input: ${input}

Return in this format:
ENHANCED: ...
SUMMARY: ...
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const enhancedPrompt = text.split("SUMMARY:")[0].replace("ENHANCED:", "").trim();
    const summary = text.split("SUMMARY:")[1]?.trim();

    return { enhancedPrompt, summary };

  } catch (err) {
    console.log(err);
    return { enhancedPrompt: "", summary: "" };
  }
};

 
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

    return data;  
  } catch (err) {
    console.log("ERROR:", err);
  }
};

 
export const analyzeImage = async (base64) => {
  const res = await fetch("http://localhost:5000/analyze-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({  image: base64 }), 
  });

  const data = await res.json();
  console.log("API RESPONSE:", data);
  return data.analysis;
};