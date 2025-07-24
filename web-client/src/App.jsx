// src/App.jsx
import React from "react";
import "./App.css";
import "./index.css";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBarMenu from "./components/SideBarMenu";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Rank from "./pages/Rank";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <React.Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            {/* 공통 사이드바 */}
            <SideBarMenu />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rank" element={<Rank />} />
            </Routes>
          </BrowserRouter>
        </React.Suspense>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
