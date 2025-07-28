import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuthCookie,
  getLocalUser,
  removeAuthCookie,
  removeLocalUser,
  setLocalNickname,
} from "../utils/storage";
import { fetchUserInfo, updateNickname } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    uid: null,
    nickname: null,
    googleId: null,
  });
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const logout = () => {
    setUser({ uid: null, nickname: null, googleId: null });
    removeAuthCookie();
    removeLocalUser();
  };

  // 통합 닉네임 변경 함수
  const editNickname = async (user, newNickname) => {
    if (!user?.uid || !newNickname?.trim()) {
      return { success: false, message: "유효하지 않은 정보입니다." };
    }
    const token = getAuthCookie();

    if (token) {
      // 구글 연동 사용자: 서버에 저장
      const result = await updateNickname(user.uid, newNickname, token);
      if (result?.success) {
        setUser({ ...user, nickname: newNickname });
        return { success: true, message: "닉네임이 변경되었습니다." };
      } else {
        return {
          success: false,
          message: result?.message || "서버 변경에 실패했습니다.",
        };
      }
    } else {
      // 게스트 사용자
      setLocalNickname(newNickname);
      setUser({ ...user, nickname: newNickname });

      // TODO: 게스트 사용자 닉네임 api 호출

      console.log(user.uid, newNickname);
      return { success: true, message: "닉네임이 변경되었습니다." };
    }
  };

  // 앱 시작 시 자동 로그인 시도
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userInfo = await fetchUserInfo();
        if (userInfo) {
          setUser(userInfo.user);
        }

        // 로컬 스토리지에서 게스트 사용자 정보 확인
        const { storedUID, storedNickname } = getLocalUser();
        if (storedUID && storedNickname) {
          setUser((prev) => ({
            ...prev,
            uid: storedUID,
            nickname: storedNickname,
          }));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        editNickname,
        isLoading, // 로딩 상태 추가
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
