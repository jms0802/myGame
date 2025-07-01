// src/hooks/useGuestUID.js
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useUser() {
  const [user, setUser] = useState({ uid: "", nickname: "" });

  useEffect(() => {
    let uid = localStorage.getItem("uid");
    let nickname = localStorage.getItem("nickname");

    if (!uid) {
      uid = uuidv4();
      nickname = `Guest_${uid.split('-')[0]}`;
      localStorage.setItem("uid", uid);
      localStorage.setItem("nickname", nickname);
    }

    setUser({ uid, nickname });
  }, []);

  return user;
}
