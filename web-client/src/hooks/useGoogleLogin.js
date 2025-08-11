import { useAuth } from "../contexts/AuthContext";
import { createUserFromGoogle, fetchUserInfo } from "../api/authApi";
import { useState } from "react";
import { nanoid } from "nanoid";
import { removeLocalUser, getLocalUser, setAuthCookie } from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL;

export function useGoogleLogin() {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    const popup = window.open(
      `${API_URL}/api/auth/google`,
      "googleLogin",
      "width=500,height=600"
    );

    // 팝업창이 닫혔는지 확인하는 interval
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setIsLoading(false);
        window.removeEventListener("message", messageHandler);
      }
    }, 1000);

    //구글 로그인 완료 후 처리
    const messageHandler = async (event) => {
      if (event.origin !== API_URL) return;

      const { nickname, existUser, token } = event.data;

      // 새로운 유저 등록인 경우
      if (!existUser) {
        const { storedUID } = getLocalUser();
        let newUid = storedUID || nanoid(12);
        const [status, msg] = await createUserFromGoogle(
          newUid,
          nickname,
          token
        );
        if (!(status >= 200 && status < 300))
          console.error(status, msg.message);
      }

      const [status, data] = await fetchUserInfo(token);

      if (status >= 200 && status < 300) {
        setUser(data.user);
        removeLocalUser();
        setAuthCookie(token);
        // 성공적으로 로그인 완료 시
        clearInterval(checkClosed);
        setIsLoading(false);
      } else {
        console.error(data.message);
        alert(data.message);
      }

      window.removeEventListener("message", messageHandler);
      popup.close(); // 팝업창 닫기
      return true;
    };

    window.addEventListener("message", messageHandler);
  };

  return { loginWithGoogle, isLoading };
}
