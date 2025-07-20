// SidebarMenu.jsx
import React, { useState } from "react";
import "./SideBarMenu.css";
import { useDarkMode } from "../contexts/DarkModeContext";

function SideBarMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { dark, setDark } = useDarkMode();

  // body 스크롤 방지 (메뉴 열릴 때)
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 다크모드 토글
  const handleDarkToggle = () => {
    setDark((prev) => !prev);
  };

  return (
    <div>
      {/* 햄버거 버튼 */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* 사이드 메뉴 */}
      <nav className={`sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <img
            className="sidebar-profile-img"
            src="https://www.gravatar.com/avatar/?d=mp"
            alt="프로필"
          />
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{user.nickname}</div>
            <div
              className="sidebar-profile-uid"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigator.clipboard.writeText(user.uid);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              aria-label="UID 복사"
              title="클릭하면 UID가 복사됩니다"
            >
              UID: <span className="sidebar-profile-uid-value">{user.uid}</span>
              {copied && (
                <span className="sidebar-profile-uid-copied">복사됨!</span>
              )}
            </div>
          </div>
          <button className="sidebar-close" onClick={() => setIsOpen(false)}>
            &times;
          </button>
        </div>
        <button
          className="sidebar-dark-toggle"
          onClick={handleDarkToggle}
          title="다크모드 토글"
          aria-hidden="true"
        >
          {dark ? (
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
          ) : (
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
          )}
        </button>
        <ul className="sidebar-menu">
          <li className="sidebar-menu-group">
            <button
              className="sidebar-menu-toggle"
              onClick={() => setGameOpen((v) => !v)}
            >
              <span className="sidebar-menu-icon">🎮</span>
              <span>게임</span>
              <span className="sidebar-menu-arrow">{gameOpen ? "▲" : "▼"}</span>
            </button>
            {gameOpen && (
              <ul className="sidebar-submenu">
                <li>기본 모드</li>
                {/* 추후 다른 게임 모드 추가 */}
              </ul>
            )}
          </li>
          <li>
            <span className="sidebar-menu-icon">🏆</span>
            <span>랭킹</span>
          </li>
          <li>
            <span className="sidebar-menu-icon">👤</span>
            <span>내 정보</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SideBarMenu;
