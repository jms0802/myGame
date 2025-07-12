import React, { useState } from "react";
import "./UserInfoButton.css";

function UserInfoButton({ user, onUserUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || "");

  const openModal = () => {
    // 모달을 열 때 현재 유저의 닉네임으로 초기화
    setNickname(user?.nickname || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // 모달을 닫을 때 원래 닉네임으로 되돌리기
    setNickname(user?.nickname || "");
    setIsModalOpen(false);
  };

  const handleApplyClick = () => {
    localStorage.setItem("nickname", nickname);
    if (onUserUpdate) {
      onUserUpdate();
    }
    setIsModalOpen(false);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleCheckClick = () => {
    //서버 닉네임 중복확인 api 호출
    console.log("닉네임 수정:", nickname);
  };

  return (
    <>
      <button className="user-info-button" onClick={openModal}>
        내 정보
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">내 정보</h3>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="user-info">
              <div className="user-info-item">
                <div className="nickname-input-container">
                  <span className="user-info-label">닉네임:</span>
                  <input
                    type="text"
                    value={nickname}
                    onChange={handleNicknameChange}
                    className="nickname-input"
                    placeholder="닉네임을 입력하세요"
                  />
                  <button
                    className="check-button"
                    onClick={handleCheckClick}
                    style={{ pointerEvents: "none", filter: "grayscale(100%)" }}
                  >
                    중복확인
                  </button>
                </div>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">UID:</span>
                <span>{user?.uid || "없음"}</span>
              </div>
              <div className="user-info-item">
                <span className="user-info-label">이메일:</span>
                <span>{user?.email ? "연동됨 " : "연동안됨 "}</span>
                <button
                  className="email-button"
                  style={{ pointerEvents: "none", filter: "grayscale(100%)" }}
                >
                  연동하기
                </button>
              </div>
            </div>

            <button className="auth-button" onClick={handleApplyClick}>
              적용
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserInfoButton;
