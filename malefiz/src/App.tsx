import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { Editor } from "@prisma/text-editors";

function App() {
  const [code, setCode] = useState("");

  return (
    <div className="App">
      <Editor lang="ts" value={code} onChange={setCode} />;
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
