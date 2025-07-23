// src/hooks/useGuestUID.js
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function useGuestUID() {
  const [uid, setUid] = useState(null);
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState({ uid: uid, nickname: nickname });

  const loadUserData = () => {
    let storedUID = localStorage.getItem("uid");
    let storedNickname = localStorage.getItem("nickname");

    if (!storedUID) {
      return null;
    }

    setUid(storedUID);
    setNickname(storedNickname);
    setUser({ uid: storedUID, nickname: storedNickname });
  };

  const refreshUser = () => {
    loadUserData();
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return { user, refreshUser };
}

export function createGuestUser() {
  const newUID = uuidv4();
  const newNickname = `Guest_${newUID.split("-")[0]}`;
  const newUser = { uid: newUID, nickname: newNickname };
  localStorage.setItem("uid", newUID);
  localStorage.setItem("nickname", newNickname);
  return newUser;
}