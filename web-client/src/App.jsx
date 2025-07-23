// src/App.jsx
import React from "react";
import "./App.css";
import "./index.css";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useGuestUID from "./hooks/useGuestUID";
import SideBarMenu from "./components/SideBarMenu";
import Main from "./pages/Main";
import Profile from "./pages/Profile";

function App() {
  const { uid, nickname, refreshUser } = useGuestUID();

  if (!uid) return <div>Loading...</div>;

  return (
    <DarkModeProvider>
      <React.Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          {/* 공통 사이드바 */}
          <SideBarMenu user={{ uid, nickname }} />
          <Routes>
            <Route path="/" element={<Main user={{ uid, nickname, refreshUser }} />} />
            <Route path="/profile" element={<Profile user={{ uid, nickname, refreshUser }} />} />
          </Routes>
        </BrowserRouter>
      </React.Suspense>
    </DarkModeProvider>
  );
}

export default App;
