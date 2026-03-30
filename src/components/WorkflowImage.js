import { useState } from "react";
import { analyzeImage, generateImage } from "../utils/apiHelpers"; 
import "./index.css"; 

function WorkflowImage({ setIsLoading }) {
  const [analysis, setAnalysis] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [summary, setSummary] = useState("");

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

  const result = await generateImage(finalPrompt);
  
setImageUrl(result.image);    
setSummary(result.summary);  
  setIsLoading(false);
};

 const handleUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onloadend = async () => {
    setIsLoading(true);

    const base64 = reader.result.split(",")[1];
    console.log("BASE64:", base64);

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
    <p><strong>Analysis:</strong></p> 
    <pre className="analysis-text">{analysis}</pre>
   

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
         <p className="section-title">Summary</p>
        <p className="analysis-text">{summary}</p>
    </div>
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