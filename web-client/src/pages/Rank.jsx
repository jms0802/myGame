import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// 샘플 데이터 (실제 데이터는 props나 API로 받아오세요)
const myRank = {
  name: "Ethan Carter",
  rank: 12,
  avatar: "https://randomuser.me/api/portraits/men/12.jpg",
};
const top100 = [
  {
    name: "Liam Harper",
    rank: 1,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Noah Bennett",
    rank: 2,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Oliver Hayes",
    rank: 3,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Elijah Foster",
    rank: 4,
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "James Carter",
    rank: 5,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "William Hayes",
    rank: 6,
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    name: "Benjamin Foster",
    rank: 7,
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "Lucas Bennett",
    rank: 8,
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    name: "Henry Harper",
    rank: 9,
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    name: "Alexander Carter",
    rank: 10,
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    name: "Alexander Carter",
    rank: 11,
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

export default function Rank() {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);

  if (!user.uid) return <div>Loading...</div>;

  // 10위까지만 표시, showAll이 true면 전체 표시
  const visibleRanks = showAll ? top100 : top100.slice(0, 10);

  // 랭킹별 배경색
  const rankBg = (rank) => {
    if (rank === 1) return { background: "#FFD700", color: "#fff" };
    if (rank === 2) return { background: "#C0C0C0", color: "#fff" };
    if (rank === 3) return { background: "#CD7F32", color: "#fff" };
    return { background: "var(--modal-bg)", color: "var(--main-color)" };
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: "var(--main-board-bg)" }}
    >
      <div
        className="w-full max-w-screen-md mx-auto py-4 px-8"
        style={{ background: "var(--main-bg)", color: "var(--main-color)" }}
      >
        {/* 상단 타이틀 */}
        <h1 className="text-center font-bold text-lg py-4" style={{ color: "var(--main-color)" }}>
          Ranking
        </h1>

        {/* 내 랭크 */}
        <div className="mt-2 mb-6">
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--main-color)" }}>
            My Rank
          </h2>
          <div className="flex items-center gap-3">
            {/* 내 순위 숫자 (왼쪽) */}
            <div
              className="w-7 text-center font-bold text-base rounded"
              style={rankBg(myRank.rank)}
            >
              {myRank.rank}
            </div>
            <img
              src={myRank.avatar}
              alt={myRank.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <div className="font-medium" style={{ color: "var(--main-color)" }}>
                {myRank.name}
              </div>
            </div>
          </div>
        </div>

        {/* Top 100 */}
        <div>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--main-color)" }}>
            Top 100
          </h2>
          <ul className="space-y-3">
            {visibleRanks.map((user) => (
              <li
                key={user.rank}
                className="flex items-center gap-3 rounded-lg px-2 py-2"
                style={rankBg(user.rank)}
              >
                <div className="w-7 text-center font-bold text-base rounded" style={rankBg(user.rank)}>
                  {user.rank}
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <div className="font-medium" style={{ color: "var(--main-color)" }}>
                    {user.name}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {!showAll && top100.length > 10 && (
            <button
              className="mt-4 w-full py-2 rounded font-semibold transition cursor-pointer"
              style={{
                background: "var(--btn-default)",
                color: "#fff",
              }}
              onClick={() => setShowAll(true)}
            >
              더보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}