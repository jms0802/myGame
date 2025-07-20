// src/App.jsx
import React from "react";
import RicochetRobotGame from "./RicochetRobotGame.jsx";
import "./App.css";
import "./index.css";
import useGuestUID from "./hooks/useGuestUID.js";
import UserInfoButton from "./components/UserInfoButton.jsx";
import SideBarMenu from "./components/SideBarMenu.jsx";
import { DarkModeProvider } from "./contexts/DarkModeContext";

function App() {
  const { uid, nickname, refreshUser } = useGuestUID();

  if (!uid) {
    return <div>Loading...</div>;
  }

  const handleUserUpdate = () => {
    if (refreshUser) {
      refreshUser();
    }
  };

  return (
    <DarkModeProvider>
      <RicochetRobotGame />
      <UserInfoButton
        user={{ uid, nickname }}
        onUserUpdate={handleUserUpdate}
      />
      <SideBarMenu user={{ uid, nickname }} />
    </DarkModeProvider>
  );
}

export default App;
