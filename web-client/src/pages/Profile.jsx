import React, { useState } from "react";
import { useGuestUID, createGuestUser } from "../hooks/useGuestUID";
import LoginModal from "../components/LoginModal";

export default function Profile() {
  const { user, refreshUser } = useGuestUID();
  const [loginOpen, setLoginOpen] = useState(false);

  const handleUserUpdate = () => {
    if (refreshUser) refreshUser();
  };

  const user1 = {
    uid: "123e4567-abcd-1234-ef00-1234567890ab",
    email: "guest@example.com",
    googleId: null,
    nickname: "Guest_123e4567",
    createdAt: new Date("2024-06-01T12:00:00Z"),
    history: [
      {
        puzzle: "스도쿠 #1",
        result: "성공",
        date: "2024-06-01",
        score: 100,
      },
      {
        puzzle: "스도쿠 #2",
        result: "실패",
        date: "2024-06-02",
        score: 60,
      },
    ],
  };

  return (
    <>
      <div className="bg-gray-50 flex flex-col items-center min-h-screen">
        <div className="w-1/2 mx-auto min-h-screen bg-white shadow p-6">
          {/* 상단 My Info */}
          <div className="w-full py-2">
            <h1 className="text-center font-bold text-lg text-gray-900 ">
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
            {user.uid ? (
              <>
                <div className="mt-4 text-center">
                  <div className="font-bold text-2xl text-gray-900 flex items-end justify-center gap-2">
                    <span className="user-nickname">{user.nickname}</span>
                    <button className="edit-nickname cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-pencil-line-icon lucide-pencil-line"
                      >
                        <path d="M13 21h8" />
                        <path d="m15 5 4 4" />
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      </svg>
                    </button>
                  </div>
                  <div
                    className="text-blue-600 text-base mt-2 cursor-pointer select-all transition-colors duration-150 hover:bg-blue-100 rounded px-2 py-1 inline-block"
                    title="클릭하면 UID가 복사됩니다"
                    onClick={() => {
                      navigator.clipboard.writeText(user.uid);
                    }}
                  >
                    UID: {user.uid}
                  </div>
                </div>
              </>
            ) : (
              <button
                className="w-3/4 py-2 mt-10 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => setLoginOpen(true)}
              >
                로그인
              </button>
            )}
          </div>
          {user.uid ? (
            <>
              {/* 연동 정보 */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="text-gray-900 text-base">
                  Linked with Google
                </span>
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
                    className="text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
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
                      className="text-gray-400"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>
                  </button>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
          {user.uid ? (
            <>
              {/* Game History */}
              <div className="mt-8 px-2 bg-gray-100 rounded-lg p-4">
                <h2 className="font-bold text-lg text-gray-900 mb-4">
                  Game History
                </h2>
                {user1.history.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white rounded-xl py-3 border-b p-6 mb-2"
                  >
                    <div>
                      <div className="font-medium text-base text-gray-900">
                        {item.puzzle}
                      </div>
                      <div className="text-blue-600 text-sm">{item.date}</div>
                    </div>
                    <button className="bg-blue-100 text-gray-900 rounded-full px-4 py-1 text-sm font-medium shadow">
                      See More
                    </button>
                  </div>
                ))}
                {user1.history.length > 3 && (
                  <div className="flex justify-center mt-4">
                    <button className="bg-blue-100 text-gray-900 rounded-full px-4 py-1 text-sm font-medium shadow">
                      See More history
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onGuestLogin={() => {
          createGuestUser();
          refreshUser();
          setLoginOpen(false);
        }}
        onGoogleLogin={() => {
          // 구글 로그인 로직
          setLoginOpen(false);
        }}
      />
    </>
  );
}
