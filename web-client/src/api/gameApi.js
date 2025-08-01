const API_URL = import.meta.env.VITE_API_URL;

export async function saveGameRecord(token, record) {
  const response = await fetch(`${API_URL}/api/game-record`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(record),
  });
  if (response.ok) {
    return await response.json();
  }
  return null;
}

export async function fetchGameRecord(token, record) {
  const response = await fetch(`${API_URL}/api/game-record`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(record),
  });
  if (response.ok) {
    return await response.json();
  }
  return null;
}

export async function getRank() {
  const response = await fetch(`${API_URL}/api/rank`, {
    method: "GET",
  });
  if (response.ok) {
    const data = await response.json();
    return data.rank;
  }
  return null;
}
