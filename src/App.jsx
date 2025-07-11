import React, { useState,useRef } from "react";

const App = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [text, setText] = useState("start");
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ argument: input }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  const record = () => {
    if (!recording) {
      
      start();
    } else {
      stop();
    }
    setRecording(!recording); 
  };

  const start = () => {

    setText("stop");
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      setRecording(false);
      setText("Start");
    };

    recognition.start();
    recognitionRef.current = recognition;
    console.log("Recording started...");
  };

  const stop = () => {
    setText("start");
    recognitionRef.current?.stop();
    console.log("Recording stopped.");
  };

  return (
    <div>
      <button
        className="border-2 hover:bg-blue-600"
        onClick={record}
        id="button"
      >
        {text}
      </button>
      <form onSubmit={handleSubmit}>
        <input
          className="w-40 h-10 bg-amber-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="border-2 hover:bg-amber-100">Submit</button>
      </form>
      <div>{result && <pre>{result}</pre>}</div>
    </div>
  );
};

export default App;
