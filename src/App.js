import { useState } from "react";
import WorkflowText from "./components/WorkflowText";
import WorkflowImage from "./components/WorkflowImage";
import "./App.css";

function App() {
  const [tab, setTab] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

return (
  <div className={darkMode ? "app dark" : "app"}>
    
    
    <div className="header">
      <h1>Pear Media AI Lab</h1>

      <button
        className="dark-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </div>

    <div className="tabs">
      <button onClick={() => setTab("text")}>Creative Studio</button>
      <button onClick={() => setTab("image")}>Style Lab</button>
    </div>

    {isLoading && (
      <p className="loading">Generating... ✨</p>
    )}

    {tab === "text" ? (
      <WorkflowText setIsLoading={setIsLoading} />
    ) : (
      <WorkflowImage setIsLoading={setIsLoading} />
    )}
  </div>
);
}

export default App;