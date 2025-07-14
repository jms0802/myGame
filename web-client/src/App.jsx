// src/App.jsx
import React, { useEffect, useState } from "react";
import RicochetRobotGame from "./RicochetTobotGame.jsx";
import "./App.css";
import "./index.css";
import useGuestUID from "./hooks/useGuestUID.js";
import UserInfoButton from "./components/UserInfoButton.jsx";
import SideBarMenu from "./components/SideBarMenu.jsx";

function App() {
  const { uid, nickname, refreshUser } = useGuestUID();
  const [dark, setDark] = useState(() => {
    // 초기 테마 설정을 localStorage에서 가져옴
    return localStorage.getItem("color-theme") === "dark";
  });

  useEffect(() => {
    // 테마 변경 시 body 클래스와 localStorage 업데이트
    document.body.classList.toggle("dark", dark);
    document.documentElement.setAttribute(
      "color-theme",
      dark ? "dark" : "light"
    );
    localStorage.setItem("color-theme", dark ? "dark" : "light");
  }, [dark]);

  if (!uid) {
    return <div>Loading...</div>;
  }

  const handleUserUpdate = () => {
    // useGuestUID 훅의 refreshUser 함수 호출
    if (refreshUser) {
      refreshUser();
    }
  };

  return (
    <>
      <button
        className="dark-light-toggle"
        onClick={() => setDark((d) => !d)}
        aria-hidden="true"
      >
        <div className="icon30 sun">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#222222"
          >
            <path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z" />
          </svg>
        </div>
        <div className="icon30 moon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z" />
          </svg>
        </div>
      </button>
      <RicochetRobotGame dark={dark} nickname={nickname} />
      <UserInfoButton
        user={{ uid, nickname }}
        onUserUpdate={handleUserUpdate}
      />
      <SideBarMenu />
    </>
  );
}

export default App;
