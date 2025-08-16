const API_URL = import.meta.env.VITE_API_URL;

export async function saveGameRecord(token, record) {
  const response = await fetch(`${API_URL}/api/game-records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(record),
  });
  return [ response.status, await response.json() ]
}

// 게임 기록 전체 검색
export async function fetchGameRecord(token, record_id) {
  const response = await fetch(`${API_URL}/api/game-records`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(record_id),
  });
  return [ response.status, await response.json() ]
}

// 게임 기록 부분 검색
export async function fetchGameStageData(record_id) {
  const response = await fetch(`${API_URL}/api/game-records/${record_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return [ response.status, await response.json() ]
}

// 게임 기록 삭제
export async function deleteGameRecord(token, record_id) {
  const response = await fetch(`${API_URL}/api/game-records/${record_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return [ response.status, await response.json() ]
}

export async function getRank() {
  const response = await fetch(`${API_URL}/api/ranks`, {
    method: "GET",
  });
  return [ response.status, await response.json() ]
}

export async function updateGameRecordPublic(token, id, isPublic) {
  const response = await fetch(`${API_URL}/api/game-records/${id}/public`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isPublic }),
  });
  return [ response.status, await response.json() ]
}