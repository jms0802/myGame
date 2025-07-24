import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "../components/LoginModal";
import { editNickname } from "../hooks/useGuestUID";

export default function Profile() {
  const { user, setUser, refreshUser } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user.nickname);

  // 닉네임 변경 핸들러
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    if (value.length > 15) {
      alert("닉네임은 15글자 이하로 입력해주세요.");
      setNickname(value.slice(0, 15));
    } else {
      setNickname(value);
    }
  };

  // 닉네임 저장
  const handleNicknameSave = () => {
    if (nickname.trim() && nickname !== user.nickname) {
      setUser({ ...user, nickname });
      editNickname(user, nickname);
    }
    setEditing(false);
  };

  // 엔터로 저장
  const handleNicknameKeyDown = (e) => {
    if (e.key === "Enter") handleNicknameSave();
    if (e.key === "Escape") {
      setNickname(user.nickname);
      setEditing(false);
    }
  };

  const user1 = {
    uid: "123e4567-abcd-1234-ef00-1234567890ab",
    email: "guest@example.com",
    googleId: null,
    nickname: "Guest_123e4567",
    createdAt: new Date("2024-06-01T12:00:00Z"),
    history: [
      { puzzle: "example #1", result: "성공", date: "2024-06-01", score: 100 },
      { puzzle: "example #2", result: "실패", date: "2024-06-02", score: 60 },
    ],
  };

  return (
    <>
      <div
        className="flex flex-col items-center min-h-screen"
        style={{ background: "var(--main-board-bg)" }}
      >
        <div
          className="w-full max-w-screen-md mx-auto min-h-screen shadow p-6"
          style={{
            background: "var(--main-bg)",
            color: "var(--main-color)",
          }}
        >
          {/* 상단 My Info */}
          <div className="w-full py-2">
            <h1 className="text-center font-bold text-lg" style={{ color: "var(--main-color)" }}>
              내 정보
            </h1>
          </div>
          {/* 프로필 영역 */}
          <div className="flex flex-col items-center mt-4">
            <img
              src="https://www.gravatar.com/avatar/?d=mp"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
            />
            <div className="mt-4 text-center">
              <div
                className="font-bold text-2xl flex items-end justify-center gap-2"
                style={{ color: "var(--main-color)" }}
              >
                {editing ? (
                  <>
                    <input
                      className="border rounded px-2 py-1 text-lg w-45"
                      value={nickname}
                      onChange={handleNicknameChange}
                      onKeyDown={handleNicknameKeyDown}
                      autoFocus
                      style={{ color: "var(--main-color)", background: "var(--main-bg)" }}
                    />
                    <button
                      className="ml-2 px-2 py-1 rounded bg-blue-500 text-white text-sm"
                      onClick={handleNicknameSave}
                    >
                      확인
                    </button>
                    <button
                      className="ml-1 px-2 py-1 rounded bg-gray-300 text-gray-700 text-sm"
                      onClick={() => {
                        setNickname(user.nickname);
                        setEditing(false);
                      }}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <span className="user-nickname">{user.nickname}</span>
                    <button
                      className="edit-nickname cursor-pointer"
                      onClick={() => setEditing(true)}
                      title="닉네임 수정"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-pencil-line-icon lucide-pencil-line"
                      >
                        <path d="M13 21h8" />
                        <path d="m15 5 4 4" />
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div
                className="text-base mt-2 cursor-pointer select-all transition-colors duration-150 rounded px-2 py-1 inline-block"
                style={{ color: "var(--count-color)", background: "transparent" }}
                title="클릭하면 UID가 복사됩니다"
                onClick={() => {
                  navigator.clipboard.writeText(user.uid);
                }}
              >
                UID: {user.uid}
              </div>
            </div>
          </div>
          {/* 연동 정보 */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span style={{ color: "var(--main-color)" }}>Linked with Google</span>
            {user1.googleId ? (
              // 체크 아이콘 (연동됨)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "#22c55e" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              // 연동 추가 아이콘 (연동 안됨)
              <button className="google-link-button cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--main-color)" }}
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </button>
            )}
          </div>
          {/* Game History */}
          <div
            className="mt-8 px-6 rounded-lg p-4"
            style={{ background: "var(--main-board-bg)", color: "var(--main-color)" }}
          >
            <h2 className="font-bold text-lg mb-4" style={{ color: "var(--main-color)" }}>
              Game History
            </h2>
            {user1.history.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl py-3 border-b p-6 mb-2"
                style={{ background: "var(--modal-bg)", color: "var(--main-color)" }}
              >
                <div>
                  <div className="font-medium text-base">{item.puzzle}</div>
                  <div style={{ color: "var(--count-color)" }}>{item.date}</div>
                </div>
                <button
                  className="rounded-full px-4 py-1 text-sm font-medium shadow"
                  style={{
                    background: "var(--btn-default)",
                    color: "#fff",
                  }}
                >
                  See More
                </button>
              </div>
            ))}
            {user1.history.length > 3 && (
              <div className="flex justify-center mt-4">
                <button
                  className="rounded-full px-4 py-1 text-sm font-medium shadow"
                  style={{
                    background: "var(--btn-default)",
                    color: "#fff",
                  }}
                >
                  See More history
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onGuestLogin={() => {
          refreshUser();
          setLoginOpen(false);
        }}
        onGoogleLogin={() => {
          setLoginOpen(false);
        }}
      />
    </>
  );
}
