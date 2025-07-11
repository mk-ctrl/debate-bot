import React, { useState,useRef } from "react";

const App = () => {
<<<<<<< HEAD
  // const [input,setInput] = useState("");
  // const [result,setResult] = useState("")

  // const handleSubmit = async (e)=>{
  //   e.preventDefault();
  //   const r = await debatJudge(input);
  //   setResult(r)
    
  // }
=======
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
>>>>>>> 9849dcd8ca58b3ce73e878718a74ea45bc9598b2

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
<<<<<<< HEAD
      {/* <form onSubmit={handleSubmit}>
        <input type="text" name="" id="" className='w-40 h-10 bg-amber-400' value={input} onChange={(e)=> setInput(e.target.value)}/>
        <button className='border-2'>submit</button>
      </form>
      <div>
      {result && <prev>{result}</prev>}
      </div> */}
      <h1>Naanfa dhan</h1>

=======
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
>>>>>>> 9849dcd8ca58b3ce73e878718a74ea45bc9598b2
    </div>
  );
};

export default App;
