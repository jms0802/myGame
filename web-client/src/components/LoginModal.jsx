import React from "react";

export default function LoginModal({
  open,
  onClose,
  onGuestLogin,
  onGoogleLogin,
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
        >
          구글 로그인
        </button>
      </div>
    </div>
  );
} 