import React from "react";

export default function LoginModal({
  open,
  onClose,
  onGuestLogin,
  onGoogleLogin,  
  isGoogleLoading,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#697284]/70"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-6">로그인</h2>
        {/* 닫기 버튼을 오른쪽 상단에 추상적으로 배치 */}
        <button
          className="w-full py-2 mb-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition font-semibold"
          onClick={onGuestLogin}
        >
          게스트 로그인
        </button>
        <button
          className="w-full py-2 rounded"
          style={{
            backgroundColor: "#ea4335",
            color: "#fff",
            fontWeight: 600,
            transition: "background 0.2s",
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#c5221f")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#ea4335")}
          onClick={onGoogleLogin}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? "로그인 중..." : "구글 로그인"} 
        </button>
      {/* 로딩 오버레이: 구글 로그인 등 로딩 중일 때 화면 전체에 표시 */}
      {isGoogleLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-xl">
          <svg
            className="animate-spin h-8 w-8 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="로딩 중"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="ml-3 text-gray-700 font-medium">로딩 중...</span>
        </div>
      )}
      </div>
    </div>
  );
} 