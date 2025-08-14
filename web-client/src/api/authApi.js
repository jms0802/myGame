const API_URL = import.meta.env.VITE_API_URL;

// 구글 회원가입
export async function createUserFromGoogle(uid, nickname, token) {
  const response = await fetch(`${API_URL}/api/auth/register/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, nickname, token }),
  });
  return [response.status, await response.json()];
}

// 토큰으로 사용자 정보 조회
export async function fetchUserInfo(token) {
  const response = await fetch(`${API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return [response.status, await response.json()];
}

// 닉네임 변경 API
export async function updateNickname(uid, nickname, token) {
  const response = await fetch(`${API_URL}/api/users/nickname`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ uid, nickname }),
  });

  return [response.status, await response.json()];
}

// 닉네임 중복확인 API
export async function checkNickname(nickname, uid = null) {
  const params = new URLSearchParams({ nickname });
  if (uid) params.append("uid", uid);

  const response = await fetch(
    `${API_URL}/api/users/check-nickname?${params}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  return [response.status, await response.json()];
}
