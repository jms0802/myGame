// SidebarMenu.jsx
import React, { useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { Link } from "react-router-dom";
import "./SideBarMenu.css";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/Auth/LoginModal";
import { useGuestLogin } from "../hooks/useGuestLogin";
import { useGoogleLogin } from "../hooks/useGoogleLogin";

function SideBarMenu() {
  const { user, logout } = useAuth();
  const { loginGuest } = useGuestLogin();
  const { loginWithGoogle, isLoading } = useGoogleLogin();
  const [isOpen, setIsOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { dark, setDark } = useDarkMode();
  const [loginOpen, setLoginOpen] = useState(false);

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

  const handleDarkToggle = () => {
    setDark((prev) => !prev);
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        className="fixed top-4 right-4 z-50 p-2 bg-white rounded shadow-md text-2xl focus:outline-none sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="사이드바 열기"
      >
        ☰
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* 사이드바 */}
      <nav className={`sidebar${isOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <img
            className="sidebar-profile-img"
            src="https://www.gravatar.com/avatar/?d=mp"
            alt="프로필"
          />
          <div className="sidebar-profile-info">
            {user.uid ? (
              <>
                <div className="sidebar-profile-name">{user.nickname}</div>
                <div
                  className="sidebar-profile-uid cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(user.uid);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                  aria-label="UID 복사"
                  title="클릭하면 UID가 복사됩니다"
                >
                  UID:{" "}
                  <span
                    className="sidebar-profile-uid-value max-w-[120px] inline-block align-middle truncate"
                    style={{ verticalAlign: "middle" }}
                  >
                    {user.uid && user.uid.length > 16
                      ? `${user.uid.slice(0, 8)}...${user.uid.slice(-4)}`
                      : user.uid}
                  </span>
                </div>
                {copied && (
                  <span className="sidebar-profile-uid-copied text-green-500 text-xs">
                    복사됨!
                  </span>
                )}
              </>
            ) : (
              <button
                className="w-full py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => setLoginOpen(true)}
              >
                로그인
              </button>
            )}
          </div>
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            aria-label="사이드바 닫기"
          >
            &times;
          </button>
        </div>
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
                <Link
                  to="/"
                  className="sidebar-menu-link no-underline"
                  onClick={() => setIsOpen(false)}
                >
                  <li>기본 모드</li>
                </Link>
              </ul>
            )}
          </li>
          <li>
            <Link
              to="/rank"
              className="sidebar-menu-link no-underline"
              onClick={(e) => {
                if (!user.uid) {
                  e.preventDefault();
                  alert("로그인이 필요합니다.");
                  return;
                }
                setIsOpen(false);
              }}
            >
              <span className="sidebar-menu-icon">🏆</span>
              <span>랭킹</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="sidebar-menu-link no-underline"
              onClick={(e) => {
                if (!user.uid) {
                  e.preventDefault();
                  alert("로그인이 필요합니다.");
                  return;
                }
                setIsOpen(false);
              }}
            >
              <span className="sidebar-menu-icon">👤</span>
              <span>내 정보</span>
            </Link>
          </li>
        </ul>
        <div className="sidebar-menu-footer flex justify-between items-center px-5 py-2">
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
                  fill="currentColor"
                >
                  <path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"></path>
                </svg>
              </div>
            )}
          </button>
          {user.uid && (
            <button
              className="sidebar-menu-logout font-bold text-sm text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
              style={{
                backgroundColor: "var(--btn-default)",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onClick={logout}
            >
              로그아웃
            </button>
          )}
        </div>
      </nav>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onGuestLogin={() => {
          loginGuest();
          setLoginOpen(false);
        }}
        onGoogleLogin={async () => {
          await loginWithGoogle();
          setLoginOpen(false);
        }}
        isGoogleLoading={isLoading}
      />
    </>
  );
}

export default SideBarMenu;
