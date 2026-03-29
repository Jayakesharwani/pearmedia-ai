import { useState } from "react";
import { getEnhancedPrompt, generateImage } from "../utils/apiHelpers";

function WorkflowText({ setIsLoading }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleEnhance = async () => {
    setIsLoading(true);
    const result = await getEnhancedPrompt(userPrompt);
    setEnhancedPrompt(result);
    setIsLoading(false);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    const img = await generateImage(enhancedPrompt); 
    console.log("FINAL IMG:", img);
    setImageUrl(img);
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
        <div>
          <textarea
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
          />

          <button onClick={handleGenerate}>Generate Image</button>
        </div>
      )}

      {imageUrl && (
  <>
    <img src={imageUrl} alt="generated" />

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