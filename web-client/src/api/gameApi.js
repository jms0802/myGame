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

export async function getRank() {
  const response = await fetch(`${API_URL}/api/ranks`, {
    method: "GET",
  });
  return [ response.status, await response.json() ]
}
