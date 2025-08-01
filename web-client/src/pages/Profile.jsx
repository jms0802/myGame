import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import { useNavigate } from "react-router-dom";
import { checkNickname } from "../api/authApi";
import { useGameRecord } from "../hooks/useGameRecord";
import Loading from "../components/Loading";

export default function Profile() {
  const { user, editNickname, isLoading } = useAuth();
  const { getRecords } = useGameRecord();
  const { loginWithGoogle } = useGoogleLogin();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [nicknameStatus, setNicknameStatus] = useState({
    available: true,
    message: "",
  });
  const [isChecking, setIsChecking] = useState(true);
  const [userHistory, setUserHistory] = useState([]);
  const [recordLoading, setRecordLoading] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false); // 추가

  useEffect(() => {
    const fetchUserHistory = async () => {
      setRecordLoading(true);
      const history = await getRecords();
      setUserHistory(history.records);
      setRecordLoading(false);
    };
    fetchUserHistory();
  }, [getRecords]);

  // 유저 정보가 없으면 메인 페이지로 리다이렉션
  useEffect(() => {
    if (!isLoading && !user?.uid) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, [user, navigate, isLoading]);

  useEffect(() => {
    setNickname(user?.nickname || "");
  }, [user]);

  // 닉네임 중복확인 함수
  const checkNicknameAvailability = async (nickname) => {
    if (
      !nickname.trim() ||
      nickname === user?.nickname
    ) {
      setNicknameStatus({ available: true, message: "" });
      return;
    }

    try {
      const result = await checkNickname(nickname, user?.uid);
      if (result) {
        setNicknameStatus({
          available: result.available,
          message: result.message,
        });
      } else {
        setNicknameStatus({
          available: false,
          message: "중복확인 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      setNicknameStatus({
        available: false,
        message: "중복확인 중 오류가 발생했습니다.",
        error,
      });
    } finally {
      setIsChecking(false);
    }
  };

  // 닉네임 변경 핸들러 (디바운스 적용)
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    if (value.length > 15) {
      setNicknameStatus({ available: false, message: "닉네임은 15글자 이하로 입력해주세요." });
      setNickname(value.slice(0, 15));
    } else {
      setNickname(value);
      // 디바운스: 500ms 후 중복확인 실행
      clearTimeout(window.nicknameCheckTimeout);
      window.nicknameCheckTimeout = setTimeout(() => {
        setIsChecking(true);

        if (value.length < 2 || value === "") {
          setNicknameStatus({ available: false, message: "닉네임은 2글자 이상으로 입력해주세요." });
          return;
        }

        checkNicknameAvailability(value);
      }, 500);
    }
  };

  // 닉네임 저장
  const handleNicknameSave = async () => {
    if (!nickname || nickname === user?.nickname) {
      setEditing(false);
      setNickname(user?.nickname);
      return;
    }

    // 중복확인 결과가 없거나 사용 불가능한 경우
    if (
      !nicknameStatus.available ||
      nickname.length < 2 ||
      nickname.length > 15
    ) {
      setNicknameStatus({ available: false, message: "사용할 수 없는 닉네임입니다." });
      return;
    }

    setIsUpdating(true);
    try {
      const result = await editNickname(user, nickname);
      if (result.success) {
        alert(result.message);
        setEditing(false);
        setNicknameStatus({ available: true, message: "" });
      } else {
        setIsUpdating(true);
        alert(result.message);
        setNickname(user?.nickname || "");
      }
    } catch (error) {
      alert("닉네임 변경 중 오류가 발생했습니다.", error);
      setNickname(user?.nickname || "");
    } finally {
      setIsUpdating(false);
    }
  };

  // 엔터로 저장
  const handleNicknameKeyDown = (e) => {
    if (e.key === "Enter") handleNicknameSave();
    if (e.key === "Escape") {
      setNickname(user?.nickname);
      setEditing(false);
      setNicknameStatus({ available: true, message: "" });
    }
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
            <h1
              className="text-center font-bold text-lg"
              style={{ color: "var(--main-color)" }}
            >
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
                    <div className="flex flex-col gap-2">
                      <div className="flex items-end gap-2">
                        <input
                          className="border rounded px-2 py-1 text-lg w-45"
                          value={nickname}
                          onChange={handleNicknameChange}
                          onKeyDown={handleNicknameKeyDown}
                          autoFocus
                          disabled={isUpdating}
                          style={{
                            color: "var(--main-color)",
                            background: "var(--main-bg)",
                          }}
                        />
                        <button
                          className={`ml-2 px-2 py-1 rounded text-white text-sm ${
                            isUpdating ||
                            !nicknameStatus.available ||
                            isChecking || !user?.nickname
                              ? "bg-gray-400"
                              : "bg-blue-500"
                          }`}
                          onClick={handleNicknameSave}
                          disabled={
                            isUpdating ||
                            !nicknameStatus.available ||
                            isChecking || !user?.nickname
                          }
                        >
                          {isUpdating ? "변경 중..." : "확인"}
                        </button>
                        <button
                          className="ml-1 px-2 py-1 rounded bg-gray-300 text-gray-700 text-sm"
                          onClick={() => {
                            setNickname(user?.nickname);
                            setEditing(false);
                            setNicknameStatus({ available: true, message: "" });
                          }}
                          disabled={isUpdating}
                        >
                          취소
                        </button>
                      </div>
                      {/* 중복확인 상태 표시 */}
                      {nickname !== user?.nickname && (
                        <div className="text-sm">
                          {isChecking ? (
                            <span style={{ color: "var(--count-color)" }}>
                              {nicknameStatus.message || "중복확인 중..."}
                            </span>
                          ) : (
                            <span
                              style={{
                                color: nicknameStatus.available
                                  ? "#22c55e"
                                  : "#ef4444",
                              }}
                            >
                              {nicknameStatus.message}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className="user-nickname">{user?.nickname}</span>
                    <button
                      className="edit-nickname cursor-pointer"
                      onClick={() => {
                        setEditing(true);
                        setNicknameStatus({ available: false, message: "" });
                      }}
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
                style={{
                  color: "var(--count-color)",
                  background: "transparent",
                }}
                title="클릭하면 UID가 복사됩니다"
                onClick={() => {
                  navigator.clipboard.writeText(user?.uid || "");
                }}
              >
                UID: {user?.uid}
              </div>
            </div>
          </div>
          {/* 연동 정보 */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span style={{ color: "var(--main-color)" }}>
              Linked with Google
            </span>
            {user?.googleId ? (
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              // 연동 추가 아이콘 (연동 안됨)
              <button
                className="google-link-button cursor-pointer"
                onClick={async () => {
                  loginWithGoogle();
                }}
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
            className="mt-8 px-6 rounded-lg p-4 relative"
            style={{
              background: "var(--main-board-bg)",
              color: "var(--main-color)",
            }}
          >
            <h2
              className="font-bold text-lg mb-4"
              style={{ color: "var(--main-color)" }}
            >
              Game History {(!user.googleId || !userHistory) ? "" 
              : showAllHistory ? userHistory.length 
              : userHistory.length > 3 ? "3 / "+userHistory.length : ""}
            </h2>
            {recordLoading && <Loading isLoading={recordLoading} />}
            {!user.googleId ? (
              <>
                <div className="mb-4 text-center">
                  <div className="text-base font-bold text-blue-600 mb-2">
                    <span className="px-2 py-1 rounded">
                      구글 연동 시{" "}
                      <span className="underline decoration-wavy decoration-pink-500">
                        게임 기록
                      </span>
                      이 저장됩니다!
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 italic">
                    먼저 게임을 플레이하여 기록을 만들어보세요!
                  </div>
                </div>
              </>
            ) : !userHistory ? (
              <>
                <div className="mb-4 text-center">
                  <div className="text-base font-bold text-blue-600 mb-2">
                    <span className="px-2 py-1 rounded">
                      아직 게임 기록이 없습니다!
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 italic">
                    먼저 게임을 플레이하여 기록을 만들어보세요!
                  </div>
                </div>
              </>
            ) : (
              <>
                {userHistory
                  .slice(0, showAllHistory ? userHistory.length : 3)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl py-3 border-b p-6 mb-2"
                      style={{
                        background: "var(--modal-bg)",
                        color: "var(--main-color)",
                      }}
                    >
                      <div>
                        <div className="font-medium text-base">
                          이동 횟수 : {item.score} 회
                        </div>
                        <div style={{ color: "var(--count-color)" }}>
                          {(() => {
                            const date = new Date(item.playDate);
                            const formattedDate = date.toLocaleString("ko-KR", {
                              timeZone: "Asia/Seoul",
                              dateStyle: "short",
                              timeStyle: "medium",
                              hour12: false,
                            });
                            return formattedDate;
                          })()}
                        </div>
                      </div>
                      <button
                        className="rounded-full px-4 py-1 text-sm font-medium shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: "var(--btn-default)",
                          color: "#fff",
                        }}
                        disabled={true}
                      >
                        상세보기
                      </button>
                    </div>
                  ))}
                {/* 버튼 영역 */}
                {userHistory.length > 3 && (
                  <div className="flex justify-center mt-4">
                    <button
                      className="rounded-full px-4 py-1 text-sm font-medium shadow cursor-pointer"
                      style={{
                        background: "var(--btn-default)",
                        color: "#fff",
                      }}
                      onClick={() => {
                        setShowAllHistory(!showAllHistory);
                      }}
                    >
                      {showAllHistory ? "간략히" : "더보기"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Loading isLoading={isLoading} />
    </>
  );
}
