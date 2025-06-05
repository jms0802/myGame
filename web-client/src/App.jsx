// src/App.jsx
import React, { useEffect, useState } from "react";
import RicochetRobotGame from './RicochetTobotGame.jsx'
import "./App.css";
import "./index.css";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <button
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 100,
        }}
        onClick={() => setDark((d) => !d)}
      >
        {dark ? "라이트 모드" : "다크 모드"}
      </button>
      <RicochetRobotGame />
    </>
  );
}

export default App;
