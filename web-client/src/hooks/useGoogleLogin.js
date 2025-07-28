import { useAuth } from "../contexts/AuthContext";
import { createUserFromGoogle, fetchUserInfo } from "../api/authApi";
import { useState } from "react";
import { nanoid } from "nanoid";
import { removeLocalUser, getLocalUser } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;

export function useGoogleLogin() {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    window.open(
      `${API_URL}/auth/google`,
      "googleLogin",
      "width=500,height=600"
    );

    //구글 로그인 완료 후 처리
    const messageHandler = async (event) => {
      if (event.origin !== API_URL) return;

      const { nickname, existUser } = event.data;

      // 새로운 유저 등록인 경우
      if (!existUser) {
        const { storedUID } = getLocalUser();
        let newUid = storedUID || nanoid(12);
        await createUserFromGoogle(newUid, nickname);
      }

      const userInfo = await fetchUserInfo();
      setUser(userInfo.user);
      removeLocalUser();

      setIsLoading(false);
      window.removeEventListener("message", messageHandler);
      return true;
    };

    window.addEventListener("message", messageHandler);
  };

  return { loginWithGoogle, isLoading };
}
