import React, { useState, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";

const WALL = { TOP: "top", RIGHT: "right", BOTTOM: "bottom", LEFT: "left" };

export default function BoardPreview({ board, robots = [], target }) {
  const { dark } = useDarkMode();
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px 미만을 모바일로 간주
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rows = Array.isArray(board) && board.length > 0 ? board.length : 10;
  const cols = Array.isArray(board?.[0]) && board[0].length > 0 ? board[0].length : rows;

  const wallStrong = dark ? "#dedede" : "dimgray";
  const wallWeak = dark ? "#7d7d7d" : "#d3d3d3";
  const cellBg = dark ? "#434343" : "white";

  const hasWall = (walls, dir) => {
    if (!walls) return false;
    
    if (walls && typeof walls.has === "function") {
      try { 
        return walls.has(dir); 
      } catch { 
        return false; 
      }
    }
    
    if (Array.isArray(walls)) {
      return walls.includes(dir);
    }
    
    if (typeof walls === "object" && walls !== null) {
      return false;
    }
    
    return false;
  };

  const getWalls = (x, y) => {
    const w = board?.[y]?.[x]?.walls;
    return {
      top: hasWall(w, WALL.TOP) || y === 0,
      right: hasWall(w, WALL.RIGHT) || x === cols - 1,
      bottom: hasWall(w, WALL.BOTTOM) || y === rows - 1,
      left: hasWall(w, WALL.LEFT) || x === 0,
    };
  };

  const cells = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const w = getWalls(x, y);
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "relative",
            backgroundColor: cellBg,
            borderTopWidth: w.top ? 3 : 1,
            borderRightWidth: w.right ? 3 : 1,
            borderBottomWidth: w.bottom ? 3 : 1,
            borderLeftWidth: w.left ? 3 : 1,
            borderTopStyle: "solid",
            borderRightStyle: "solid",
            borderBottomStyle: "solid",
            borderLeftStyle: "solid",
            borderTopColor: w.top ? wallStrong : wallWeak,
            borderRightColor: w.right ? wallStrong : wallWeak,
            borderBottomColor: w.bottom ? wallStrong : wallWeak,
            borderLeftColor: w.left ? wallStrong : wallWeak,
          }}
        >
          {target && target.x === x && target.y === y && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "60%",
                height: "60%",
                transform: "translate(-50%, -50%)",
                backgroundColor: target.color,
                borderRadius: "50%",
                border: dark ? "2px solid #434343" : "2px solid white",
                zIndex: 1,
                opacity: 0.9,
              }}
            />
          )}
          {robots
            .filter((r) => r.x === x && r.y === y)
            .map((r, i) => (
              <div
                key={i}
                title={r.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "60%",
                  height: "60%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: r.color || "#888",
                  borderRadius: "50%",
                  border: "2px solid rgba(0,0,0,0.15)",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                }}
              >
              </div>
            ))}
        </div>
      );
    }
  }

  // 모바일이면 100%, 데스크톱이면 55%
  const boardSize = isMobile ? "100%" : "55%";

  return (
    <div
      style={{
        width: boardSize,
        height: boardSize,
        maxWidth: "100%",
        maxHeight: "100%",
        aspectRatio: "1 / 1",
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        backgroundColor: dark ? "#2b2b2b" : "#fafafa",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {cells}
    </div>
  );
}
