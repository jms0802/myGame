import React, { useState, useCallback } from "react";
import "./RicochetRobotGame.css";

const BOARD_SIZE = 10;
const WALL_TYPES = {
  TOP: "top",
  RIGHT: "right",
  BOTTOM: "bottom",
  LEFT: "left",
};

const ROBOT_COLORS = {
  RED: "#ff4444",
  BLUE: "#4444ff",
  GREEN: "#44ff44",
  YELLOW: "#ffff44",
};

// 게임판 초기 설정
const createInitialBoard = () => {
  const board = Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({ walls: new Set() }))
    );

  // 외곽 벽 설정
  for (let i = 0; i < BOARD_SIZE; i++) {
    board[0][i].walls.add(WALL_TYPES.TOP);
    board[BOARD_SIZE - 1][i].walls.add(WALL_TYPES.BOTTOM);
    board[i][0].walls.add(WALL_TYPES.LEFT);
    board[i][BOARD_SIZE - 1].walls.add(WALL_TYPES.RIGHT);
  }

  const wallCount = Math.floor(Math.random() * 10) + 10;

  for (let i = 0; i < wallCount; i++) {
    const x = Math.floor(Math.random() * BOARD_SIZE); // 1 ~ BOARD_SIZE-2
    const y = Math.floor(Math.random() * BOARD_SIZE); // 1 ~ BOARD_SIZE-2
    const direction = Object.values(WALL_TYPES)[Math.floor(Math.random() * 4)];

    // 벽 추가
    board[y][x].walls.add(direction);

    // 반대쪽 셀에도 벽 추가
    switch (direction) {
      case WALL_TYPES.RIGHT:
        if (x + 1 < BOARD_SIZE) board[y][x + 1].walls.add(WALL_TYPES.LEFT);
        break;
      case WALL_TYPES.LEFT:
        if (x - 1 >= 0) board[y][x - 1].walls.add(WALL_TYPES.RIGHT);
        break;
      case WALL_TYPES.TOP:
        if (y - 1 >= 0) board[y - 1][x].walls.add(WALL_TYPES.BOTTOM);
        break;
      case WALL_TYPES.BOTTOM:
        if (y + 1 < BOARD_SIZE) board[y + 1][x].walls.add(WALL_TYPES.TOP);
        break;
    }
  }

  return board;
};

// 랜덤 위치 생성 함수
const generateRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * BOARD_SIZE), // 1 ~ BOARD_SIZE-2
    y: Math.floor(Math.random() * BOARD_SIZE), // 1 ~ BOARD_SIZE-2
  };
};

const generateUniquePositions = () => {
  const positions = new Set();
  const robots = [];

  const robotColors = [
    { id: "red", color: ROBOT_COLORS.RED },
    { id: "blue", color: ROBOT_COLORS.BLUE },
    { id: "green", color: ROBOT_COLORS.GREEN },
    { id: "yellow", color: ROBOT_COLORS.YELLOW },
  ];

  // 로봇 위치 생성
  robotColors.forEach((robot) => {
    let position;
    do {
      position = generateRandomPosition();
    } while (positions.has(`${position.x},${position.y}`));

    positions.add(`${position.x},${position.y}`);
    robots.push({
      ...robot,
      x: position.x,
      y: position.y,
    });
  });

  // 타겟 위치 생성
  let targetPosition;
  do {
    targetPosition = generateRandomPosition();
  } while (positions.has(`${targetPosition.x},${targetPosition.y}`));

  const targetColor = Object.values(ROBOT_COLORS)[Math.floor(Math.random() * 4)];

  return { robots, target: {...targetPosition, color:targetColor} };
};

const RicochetRobotGame = ({ dark }) => {
  const { robots: initialRobots, target: initialTarget } = generateUniquePositions();

  const [board] = useState(createInitialBoard);
  const [robots, setRobots] = useState(initialRobots);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [target, setTarget] = useState(initialTarget);
  const [moveCount, setMoveCount] = useState(0);
  const [prevRobots, setPrevRobots] = useState(initialRobots);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [showClearMessage, setShowClearMessage] = useState(false);
  const [clearMoveCount, setClearMoveCount] = useState(0);

  // 하이라이트할 셀 계산 (경로 포함) - moveRobot보다 먼저 선언
  const calculateHighlightedCells = useCallback((robot) => {
    if (!robot) return [];
    
    const directions = ['up', 'down', 'left', 'right'];
    const cells = new Set();
    
    directions.forEach(direction => {
      let currentX = robot.x;
      let currentY = robot.y;
      let nextX = currentX;
      let nextY = currentY;
      
      while (true) {
        switch (direction) {
          case 'up':
            nextY = currentY - 1;
            break;
          case 'down':
            nextY = currentY + 1;
            break;
          case 'left':
            nextX = currentX - 1;
            break;
          case 'right':
            nextX = currentX + 1;
            break;
        }
        
        // 경계 체크
        if (nextX < 0 || nextX >= BOARD_SIZE || nextY < 0 || nextY >= BOARD_SIZE) {
          break;
        }
        
        // 벽 체크
        let blocked = false;
        switch (direction) {
          case 'up':
            if (board[currentY][currentX].walls.has(WALL_TYPES.TOP)) blocked = true;
            break;
          case 'down':
            if (board[currentY][currentX].walls.has(WALL_TYPES.BOTTOM)) blocked = true;
            break;
          case 'left':
            if (board[currentY][currentX].walls.has(WALL_TYPES.LEFT)) blocked = true;
            break;
          case 'right':
            if (board[currentY][currentX].walls.has(WALL_TYPES.RIGHT)) blocked = true;
            break;
        }
        
        if (blocked) break;
        
        // 다른 로봇과 충돌 체크
        const otherRobot = robots.find(r => r.id !== robot.id && r.x === nextX && r.y === nextY);
        if (otherRobot) break;
        
        // 이동 가능한 셀 추가
        cells.add(`${nextX},${nextY}`);
        
        // 다음 셀로 이동
        currentX = nextX;
        currentY = nextY;
      }
    });
    
    return Array.from(cells).map(pos => {
      const [x, y] = pos.split(',').map(Number);
      return { x, y };
    });
  }, [board, robots]);

  // 로봇이 특정 방향으로 이동할 수 있는 최대 거리 계산
  const getMaxDistance = useCallback(
    (robot, direction) => {
      let newX = robot.x;
      let newY = robot.y;
      let distance = 0;

      while (true) {
        let nextX = newX;
        let nextY = newY;

        switch (direction) {
          case "up":
            nextY = newY - 1;
            break;
          case "down":
            nextY = newY + 1;
            break;
          case "left":
            nextX = newX - 1;
            break;
          case "right":
            nextX = newX + 1;
            break;
        }

        // 경계 체크
        if (
          nextX < 0 ||
          nextX >= BOARD_SIZE ||
          nextY < 0 ||
          nextY >= BOARD_SIZE
        ) {
          break;
        }

        // 벽 체크
        let blocked = false;
        switch (direction) {
          case "up":
            if (board[newY][newX].walls.has(WALL_TYPES.TOP)) blocked = true;
            break;
          case "down":
            if (board[newY][newX].walls.has(WALL_TYPES.BOTTOM)) blocked = true;
            break;
          case "left":
            if (board[newY][newX].walls.has(WALL_TYPES.LEFT)) blocked = true;
            break;
          case "right":
            if (board[newY][newX].walls.has(WALL_TYPES.RIGHT)) blocked = true;
            break;
        }

        if (blocked) break;

        // 다른 로봇과 충돌 체크
        const otherRobot = robots.find(
          (r) => r.id !== robot.id && r.x === nextX && r.y === nextY
        );
        if (otherRobot) break;

        newX = nextX;
        newY = nextY;
        distance++;
      }

      return { x: newX, y: newY, distance };
    },
    [board, robots]
  );

  // 로봇 이동 - calculateHighlightedCells 이후에 선언
  const moveRobot = useCallback(
    (robotId, direction) => {
      const robot = robots.find((r) => r.id === robotId);
      if (!robot) return;

      const newPosition = getMaxDistance(robot, direction);

      if (newPosition.x !== robot.x || newPosition.y !== robot.y) {
        setMoveCount((prev) => prev + 1);

        // 타겟 도달 체크 (경로 상의 모든 셀 확인)
        let currentX = robot.x;
        let currentY = robot.y;
        let targetReached = false;
        
        while (true) {
          let nextX = currentX;
          let nextY = currentY;
          
          switch (direction) {
            case 'up':
              nextY = currentY - 1;
              break;
            case 'down':
              nextY = currentY + 1;
              break;
            case 'left':
              nextX = currentX - 1;
              break;
            case 'right':
              nextX = currentX + 1;
              break;
          }
          
          // 경계 체크
          if (nextX < 0 || nextX >= BOARD_SIZE || nextY < 0 || nextY >= BOARD_SIZE) {
            break;
          }
          
          // 벽 체크
          let blocked = false;
          switch (direction) {
            case 'up':
              if (board[currentY][currentX].walls.has(WALL_TYPES.TOP)) blocked = true;
              break;
            case 'down':
              if (board[currentY][currentX].walls.has(WALL_TYPES.BOTTOM)) blocked = true;
              break;
            case 'left':
              if (board[currentY][currentX].walls.has(WALL_TYPES.LEFT)) blocked = true;
              break;
            case 'right':
              if (board[currentY][currentX].walls.has(WALL_TYPES.RIGHT)) blocked = true;
              break;
          }
          
          if (blocked) break;
          
          // 다른 로봇과 충돌 체크
            const otherRobot = robots.find(r => r.id !== robotId && r.x === nextX && r.y === nextY);
          if (otherRobot) break;
          
            // 타겟 체크
            if (nextX === target.x && nextY === target.y && robot.color === target.color) {
              targetReached = true;
            break;
          }
          
          currentX = nextX;
          currentY = nextY;
        }
        
        // 타겟에 도달했다면
        if (targetReached) {
          setClearMoveCount(moveCount+1);  // 현재 무브 카운트 저장
          setMoveCount(0);  // 무브 카운트 즉시 초기화
          setShowClearMessage(true);
          setSelectedRobot(null);
          
          setTimeout(() => {
            setShowClearMessage(false);
          }, 1500);

          // 새로운 타겟 생성
          let newTargetPosition;
          let attempts = 0;
          const maxAttempts = 100; // 무한 루프 방지

          do {
            newTargetPosition = generateRandomPosition();
            attempts++;
            // 로봇 위치와 겹치지 않는지 확인
            const isOverlapping = robots.some(r => r.x === newTargetPosition.x && r.y === newTargetPosition.y);
            if (!isOverlapping || attempts >= maxAttempts) break;
          } while (attempts < maxAttempts);

          // 랜덤 색상 선택
          const newTargetColor = Object.values(ROBOT_COLORS)[Math.floor(Math.random() * 4)];
          
          setTarget({
            x: newTargetPosition.x,
            y: newTargetPosition.y,
            color: newTargetColor
          });

          // 로봇을 타겟 위치에 멈추게 함
          setRobots((prevRobots) => {
            const newRobots = prevRobots.map((r) =>
              r.id === robotId ? { ...r, x: target.x, y: target.y } : r
            );
            setPrevRobots(newRobots);
            return newRobots;
        });
          return; // 여기서 함수 종료
        }

        // 타겟에 도달하지 않았다면 정상적으로 이동
        setRobots((prevRobots) => {
          const newRobots = prevRobots.map((r) =>
            r.id === robotId ? { ...r, x: newPosition.x, y: newPosition.y } : r
          );
          // 이동 후 새로운 위치에서의 하이라이트 계산
          const movedRobot = newRobots.find(r => r.id === robotId);
          setHighlightedCells(calculateHighlightedCells(movedRobot));
          return newRobots;
        });
      }
    },
    [getMaxDistance, robots, target, board, calculateHighlightedCells]
  );

  // 게임 리셋
  const resetGame = useCallback(() => {
    setRobots(prevRobots);
    setSelectedRobot(null);
    setMoveCount(0);
    setHighlightedCells([]);
  }, [prevRobots]);

  // 로봇 선택 시 하이라이트 계산
  const handleRobotSelect = useCallback((robotId) => {
    // 이미 선택된 로봇을 다시 클릭하면 선택 해제
    if (selectedRobot === robotId) {
      setSelectedRobot(null);
      setHighlightedCells([]); // 하이라이트 제거
      return;
    }

    setSelectedRobot(robotId);
    const robot = robots.find(r => r.id === robotId);
    setHighlightedCells(calculateHighlightedCells(robot));
  }, [robots, calculateHighlightedCells, selectedRobot]);

  // 셀 클릭으로 로봇 이동
  const handleCellClick = useCallback((x, y) => {
    if (!selectedRobot || !highlightedCells.some(cell => cell.x === x && cell.y === y)) return;
    
    const robot = robots.find(r => r.id === selectedRobot);
    if (!robot) return;

    // 클릭한 셀이 속한 방향 찾기
    const directions = ['up', 'down', 'left', 'right'];
    let targetDirection = null;

    // 클릭한 셀이 속한 방향 찾기
    for (const direction of directions) {
      let currentX = robot.x;
      let currentY = robot.y;
      
      while (true) {
        let nextX = currentX;
        let nextY = currentY;
        
        switch (direction) {
          case 'up':
            nextY = currentY - 1;
            break;
          case 'down':
            nextY = currentY + 1;
            break;
          case 'left':
            nextX = currentX - 1;
            break;
          case 'right':
            nextX = currentX + 1;
            break;
        }
        
        // 경계 체크
        if (nextX < 0 || nextX >= BOARD_SIZE || nextY < 0 || nextY >= BOARD_SIZE) {
          break;
        }
        
        // 벽 체크
        let blocked = false;
        switch (direction) {
          case 'up':
            if (board[currentY][currentX].walls.has(WALL_TYPES.TOP)) blocked = true;
            break;
          case 'down':
            if (board[currentY][currentX].walls.has(WALL_TYPES.BOTTOM)) blocked = true;
            break;
          case 'left':
            if (board[currentY][currentX].walls.has(WALL_TYPES.LEFT)) blocked = true;
            break;
          case 'right':
            if (board[currentY][currentX].walls.has(WALL_TYPES.RIGHT)) blocked = true;
            break;
        }
        
        if (blocked) break;
        
        // 다른 로봇과 충돌 체크
        const otherRobot = robots.find(r => r.id !== robot.id && r.x === nextX && r.y === nextY);
        if (otherRobot) break;
        
        // 클릭한 셀을 찾았으면 해당 방향으로 이동
        if (nextX === x && nextY === y) {
          targetDirection = direction;
          break;
        }
        
        currentX = nextX;
        currentY = nextY;
      }
      
      if (targetDirection) break;
    }

    if (targetDirection) {
      moveRobot(selectedRobot, targetDirection);
      setHighlightedCells([]); // 이동 후 하이라이트 제거
    }
  }, [selectedRobot, highlightedCells, robots, moveRobot, board]);

  // 셀 렌더링 수정
  const renderCell = (x, y) => {
    const cell = board[y][x];
    const robot = robots.find(r => r.x === x && r.y === y);
    const isTarget = target.x === x && target.y === y;
    const isHighlighted = highlightedCells.some(cell => cell.x === x && cell.y === y);
    
    const wallStyles = {
      borderTopWidth: cell.walls.has(WALL_TYPES.TOP) ? '4px' : '1px',
      borderRightWidth: cell.walls.has(WALL_TYPES.RIGHT) ? '4px' : '1px',
      borderBottomWidth: cell.walls.has(WALL_TYPES.BOTTOM) ? '4px' : '1px',
      borderLeftWidth: cell.walls.has(WALL_TYPES.LEFT) ? '4px' : '1px',
      borderColor: dark ? '#dedede' : 'dimgray',
      backgroundColor: isHighlighted 
        ? (dark ? 'rgba(144, 238, 144, 0.2)' : 'rgba(144, 238, 144, 0.3)')
        : (dark ? '#434343' : 'white'),
      cursor: (robot || isHighlighted) ? 'pointer' : 'default'
    };

    return (
      <div
        key={`${x}-${y}`}
        className="game-cell"
        style={wallStyles}
        onClick={() => {
          if (robot) {
            handleRobotSelect(robot.id);
          } else if (isHighlighted) {
            handleCellClick(x, y);
          }
        }}
      >
        {isTarget && (
          <div 
            className="target" 
            style={{ 
              backgroundColor: target.color,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid white'
            }} 
          />
        )}
        {robot && (
          <div
            className={`robot ${selectedRobot === robot.id ? 'selected' : ''}`}
            style={{ backgroundColor: robot.color }}
          >
            {robot.id[0].toUpperCase()}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="game-container">
      {console.log(dark)}
      <h1 className="game-title">리코셰 로봇</h1>

      {/* 클리어 메시지 */}
      {showClearMessage && (
        <div className="clear-message">
          <h2>클리어!</h2>
          <p>이동 횟수: <span className="count">{clearMoveCount}</span></p>
        </div>
      )}

      <div className="game-info">
        {/* <p className="selected-robot">
          선택된 로봇:{" "}
          {selectedRobot ? (
            <span
              className="robot-name"
              style={{
                color: robots.find((r) => r.id === selectedRobot)?.color,
              }}
            >
              {selectedRobot.toUpperCase()}
            </span>
          ) : (
            "없음"
          )}
        </p> */}
        <p className="move-count">
          이동 횟수: <span className="count">{moveCount}</span>
        </p>
        <p className="instructions">
          로봇을 클릭하여 선택하고 이동하세요
        </p>
      </div>

      <div className="game-board">
        {Array(BOARD_SIZE)
          .fill(null)
          .map((_, y) =>
            Array(BOARD_SIZE)
              .fill(null)
              .map((_, x) => renderCell(x, y))
          )}
      </div>

      <div className="controls">
        <div className="robot-buttons">
          {robots.map(robot => (
            <button
              key={robot.id}
              className={`robot-button ${selectedRobot === robot.id ? 'active' : ''}`}
              style={{ backgroundColor: robot.color }}
              onClick={() => handleRobotSelect(robot.id)}
            >
              {robot.id.toUpperCase()} 로봇
            </button>
          ))}
        </div>

        <button onClick={resetGame} className="reset-button">
          🔄 로봇 리셋
        </button>
      </div>

      <div className="game-instructions">
        <p>목표: 색깔 원에 해당 로봇을 도달시키세요!</p>
        <p>로봇은 벽이나 다른 로봇에 부딪힐 때까지 계속 이동합니다.</p>
      </div>
    </div>
  );
};

export default RicochetRobotGame;
