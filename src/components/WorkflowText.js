import { useState } from "react";
import { getEnhancedPrompt, generateImage } from "../utils/apiHelpers";

function WorkflowText({ setIsLoading }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [textSummary, setTextSummary] = useState("");

  const handleEnhance = async () => {
  setIsLoading(true);

  const result = await getEnhancedPrompt(userPrompt);

  setEnhancedPrompt(result.enhancedPrompt);
  setTextSummary(result.summary);

  setIsLoading(false);  
};

 const handleGenerate = async () => {
  setIsLoading(true);

  const result = await generateImage(enhancedPrompt);

  console.log("FINAL RESULT:", result);

  setImageUrl(result.image);
  setTextSummary(result.summary);  
  setIsLoading(false);
};

  return (
    <div className="card"> 
    <div> 
     
   
      <textarea
        placeholder="Enter your idea..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />
       <div className="examples">
  <p>Try examples:</p>

  <button onClick={() => setUserPrompt("A futuristic city at sunset, cyberpunk style")}>
    Cyberpunk City
  </button>

  <button onClick={() => setUserPrompt("A cute baby dragon, Pixar style")}>
    Baby Dragon
  </button>

  <button onClick={() => setUserPrompt("A realistic portrait of a warrior in rain")}>
    Warrior
  </button>
</div>
      <button onClick={handleEnhance}>Enhance Prompt</button>

      {enhancedPrompt && (
  <>
    <p className="section-title">Enhanced Prompt</p>
    <div className="enhanced-box">
      {enhancedPrompt}
    </div>
    <div> 
    <button onClick={handleGenerate} disabled={!enhancedPrompt}>
      Generate Image
    </button>
    </div>
  </>
)}

    {imageUrl && (
  <>
    <img src={imageUrl} alt="generated" />

     
    {textSummary && (
      <>
        <p className="section-title">Summary</p>
        <p className="analysis-text">{textSummary}</p>
      </>
    )}

    <a href={imageUrl} download="generated.png"> 
        <div>
      <button>Download Image</button>
      </div>
    </a>
  </>
)}
    </div>
    </div>
  );
}

export default WorkflowText;