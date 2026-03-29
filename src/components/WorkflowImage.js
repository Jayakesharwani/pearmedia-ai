import { useState } from "react";
import { analyzeImage, generateImage } from "../utils/apiHelpers"; 
import "./index.css"; 

function WorkflowImage({ setIsLoading }) {
  const [analysis, setAnalysis] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  const handleGenerate = async () => {
  setIsLoading(true);

  const finalPrompt = `
Create an image based on:

Image details:
${analysis}

User instructions:
${userPrompt}

Keep the main subject consistent.
Enhance quality, lighting, and style.
Make it visually appealing and realistic.
`;

  const img = await generateImage(finalPrompt);
  setImageUrl(img);

  setIsLoading(false);
};

 const handleUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    setIsLoading(true);

    const base64 = reader.result.split(",")[1];

    const result = await analyzeImage(base64);
    setAnalysis(result);

    setIsLoading(false);
  };

  reader.readAsDataURL(file);
};

  return (
    <div className="card">
    <div> 
    
      <input type="file" onChange={handleUpload} />

   {analysis && (
  <>
    <p><strong>Give Prompt:</strong></p>
   

    <textarea
      placeholder="Add style instructions..."
      value={userPrompt}
      onChange={(e) => setUserPrompt(e.target.value)}
    />

    <button onClick={handleGenerate} disabled={!userPrompt}>
      Generate Image
    </button>
  </>
)}   <div> 
      {imageUrl && (
  <>
    <img src={imageUrl} alt="generated" />
 <div> 
    <a href={imageUrl} download="generated-image.png">
      <button>Download Image</button>
    </a>
    </div>
  </>
)}
      </div>
    </div>
    </div>
  );
}

export default WorkflowImage;