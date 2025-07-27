// src/hooks/useGuestUID.js
import { useAuth } from "../contexts/AuthContext";
import { setLocalUser, getLocalUser } from "../utils/storage";
import { nanoid } from "nanoid";

export function useGuestLogin() {
  const { setUser } = useAuth();

  const loginGuest = () => {
    const newUID = nanoid(12);
    const newNickname = `Guest_${newUID.slice(0, 8)}`;
    const newUser = { uid: newUID, nickname: newNickname };
    setLocalUser(newUID, newNickname);
    setUser(newUser);
    return newUser;
  };

  const loadGuestUser = () => {
    const { storedUID, storedNickname } = getLocalUser();

    if (!storedUID) {
      return null;
    }

    setUser({ uid: storedUID, nickname: storedNickname });
  };

  return { loginGuest, loadGuestUser };
}

