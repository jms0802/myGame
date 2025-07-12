// src/hooks/useGuestUID.js
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useGuestUID() {
  const [uid, setUid] = useState(null);
  const [nickname, setNickname] = useState("");

  const loadUserData = () => {
    let storedUID = localStorage.getItem("uid");
    let storedNickname = localStorage.getItem("nickname");

    if (!storedUID) {
      storedUID = uuidv4();
      storedNickname = `Guest_${storedUID.split("-")[0]}`;
      localStorage.setItem("uid", storedUID);
      localStorage.setItem("nickname", storedNickname);
    }

    setUid(storedUID);
    setNickname(storedNickname);
  };

  const refreshUser = () => {
    loadUserData();
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return { uid, nickname, refreshUser };
}
