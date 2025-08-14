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
      const [ status, msg ] = await updateNickname(user.uid, newNickname, token);
      if (status >= 200 && status < 300) {
        setUser({ ...user, nickname: newNickname });
      } 

      return [ status, msg.message ]

    } else {
      // 게스트 사용자
      setLocalNickname(newNickname);
      setUser({ ...user, nickname: newNickname });

      console.log(user.uid, newNickname);
      return { status: 200, message: "닉네임이 변경되었습니다." };
    }
  };

  // 앱 시작 시 자동 로그인 시도
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthCookie();
        const [status, data] = await fetchUserInfo(token);
        if (status >= 200 && status < 300) {
          setUser(data.user);
          return;
        }

        // 로컬 스토리지에서 게스트 사용자 정보 확인
        const { storedUID, storedNickname } = getLocalUser();
        if (storedUID && storedNickname) {
          setUser((prev) => ({
            ...prev,
            uid: storedUID,
            nickname: storedNickname,
          }));
          return;
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
