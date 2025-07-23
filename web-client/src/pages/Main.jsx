import React from "react";
import RicochetRobotGame from "../components/Game/RicochetRobotGame.jsx";
import UserInfoButton from "../components/UserInfoButton.jsx";

export default function Main({ user }) {
  const { uid, nickname, refreshUser } = user;

  if (!uid) return <div>Loading...</div>;

  const handleUserUpdate = () => {
    if (refreshUser) refreshUser();
  };

  return (
    <>
      <RicochetRobotGame />
      <UserInfoButton user={{ uid, nickname }} onUserUpdate={handleUserUpdate} />
    </>
  );
}
