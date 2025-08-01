import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getRank } from "../api/gameApi";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export default function Rank() {
  const { user, isLoading } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const [rank, setRank] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [rankLoading, setRankLoading] = useState(true);
  const navigate = useNavigate();

  const mockRankData = [
    {
      _id: "688b90454e85ab090d8402a1",
      uid: "user123",
      nickname: "게임마스터",
      playCount: 25,
      updatedAt: "2025-08-01T04:00:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402a2",
      uid: "user456",
      nickname: "퍼즐킹",
      playCount: 22,
      updatedAt: "2025-08-01T03:55:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402a3",
      uid: "user789",
      nickname: "로봇조종사",
      playCount: 19,
      updatedAt: "2025-08-01T03:50:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402a4",
      uid: "user101",
      nickname: "스피드러너",
      playCount: 18,
      updatedAt: "2025-08-01T03:45:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402a5",
      uid: "user202",
      nickname: "퍼즐러버",
      playCount: 15,
      updatedAt: "2025-08-01T03:40:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402a6",
      uid: "user303",
      nickname: "게임신동",
      playCount: 14,
      updatedAt: "2025-08-01T03:35:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402a7",
      uid: "user404",
      nickname: "로봇마스터",
      playCount: 12,
      updatedAt: "2025-08-01T03:30:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402a8",
      uid: "user505",
      nickname: "퍼즐헌터",
      playCount: 10,
      updatedAt: "2025-08-01T03:25:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402a9",
      uid: "user606",
      nickname: "게임프로",
      playCount: 8,
      updatedAt: "2025-08-01T03:20:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402aa",
      uid: "user707",
      nickname: "스피드킹",
      playCount: 7,
      updatedAt: "2025-08-01T03:15:00.000Z",
      __v: 0,
    },
    {
      _id: "688b90454e85ab090d8402ab",
      uid: "user808",
      nickname: "퍼즐마스터",
      playCount: 6,
      updatedAt: "2025-08-01T03:10:00.000Z",
      __v: 0,
    },
  ];

  useEffect(() => {
    if (!isLoading && !user?.uid) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
    setRankLoading(true);
    fetchRank();
  }, [user, isLoading]);

  const fetchRank = async () => {
    try {
      const rankData = await getRank();
      rankData.push(...mockRankData);
      rankData.sort((a, b) => b.playCount - a.playCount);

      let currentRank = 1;
      let prevPlayCount = null;
      let sameRankCount = 0;
      const rankedData = rankData.map((item, idx) => {
        if (prevPlayCount === item.playCount) {
          sameRankCount += 1;
        } else {
          currentRank = idx + 1;
          sameRankCount = 1;
        }
        prevPlayCount = item.playCount;
        return { ...item, rank: currentRank };
      });
      setRank(rankedData);
      const myRank = rankedData.find((rank) => rank.uid === user.uid);
      if (myRank) {
        setMyRank(myRank);
      } else {
        setMyRank({
          rank: "-",
          nickname: user.nickname,
          playCount: 0,
        });
      }
    } catch (error) {
      console.error("Rank 데이터 가져오기 실패:", error);
    } finally {
      setRankLoading(false);
    }
  };

  // 10위까지만 표시, showAll이 true면 전체 표시
  const visibleRanks = showAll ? rank : rank.slice(0, 10);

  // 랭킹별 배경색
  const rankBg = (rank) => {
    if (rank === 1) return { background: "#FFD700", color: "#fff" };
    if (rank === 2) return { background: "#C0C0C0", color: "#fff" };
    if (rank === 3) return { background: "#CD7F32", color: "#fff" };
    return { background: "var(--modal-bg)", color: "var(--main-color)" };
  };

  return (
    <>
      {(isLoading || rankLoading) && <Loading isLoading={rankLoading} />}
      {!isLoading && !rankLoading && myRank && (
        <div
          className="min-h-screen flex flex-col items-center"
          style={{ background: "var(--main-board-bg)" }}
        >
          <div
            className="w-full max-w-screen-md mx-auto py-4 px-8"
            style={{ background: "var(--main-bg)", color: "var(--main-color)" }}
          >
            {/* 상단 타이틀 */}
            <h1
              className="text-center font-bold text-lg py-4"
              style={{ color: "var(--main-color)" }}
            >
              Ranking
            </h1>
            {/* 내 랭크 */}
            <div className="mt-2 mb-6">
              <h2
                className="font-bold text-base mb-2"
                style={{ color: "var(--main-color)" }}
              >
                My Rank
              </h2>
              <div
                className="flex items-center gap-3 rounded-lg px-2 py-2"
                style={rankBg(myRank.rank)}
              >
                <div className="w-7 text-center font-bold text-base rounded">
                  {myRank.rank}
                </div>
                <img
                  src="https://www.gravatar.com/avatar/?d=mp"
                  alt={myRank.nickname}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <div
                    className="font-bold"
                    style={{ color: "var(--main-color)" }}
                  >
                    {myRank.nickname}
                  </div>
                </div>
                <div
                  className="ml-auto w-7 text-center font-bold text-base rounded"
                  style={rankBg(myRank.rank)}
                >
                  {myRank.playCount}
                </div>
              </div>
            </div>
            {/* Top 100 */}
            <div>
              <h2
                className="font-bold text-base mb-2"
                style={{ color: "var(--main-color)" }}
              >
                Rankings {showAll ? rank.length : rank.length > 10 ? "10 / "+rank.length : rank.length}
              </h2>
              <ul className="space-y-3">
                {visibleRanks.map((rank) => (
                  <li
                    key={rank._id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2"
                    style={rankBg(rank.rank)}
                  >
                    <div
                      className="w-7 text-center font-bold text-base rounded"
                      style={rankBg(rank.rank)}
                    >
                      {rank.rank}
                    </div>
                    <img
                      src="https://www.gravatar.com/avatar/?d=mp"
                      alt={rank.nickname}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <div
                        className="font-bold"
                        style={{ color: "var(--main-color)" }}
                      >
                        {rank.nickname}
                      </div>
                    </div>
                    <div
                      className="ml-auto w-7 text-center font-bold text-base rounded"
                      style={rankBg(rank.rank)}
                    >
                      {rank.playCount}
                    </div>
                  </li>
                ))}
              </ul>
              {rank.length > 10 && (
                <button
                  className="mt-4 w-full py-2 rounded font-semibold transition cursor-pointer"
                  style={{
                    background: "var(--btn-default)",
                    color: "#fff",
                  }}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "간략히" : "더보기"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
