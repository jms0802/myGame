const API_URL = import.meta.env.VITE_API_URL;

// 게스트 회원가입
export async function createUserFromGuest(uid, nickname) {
    try {
      const response = await fetch(`${API_URL}/auth/register/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, nickname }),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("게스트 회원가입 실패:", error);
      return null;
    }
  }
  
  // 구글 회원가입
  export async function createUserFromGoogle(uid, nickname, token) {
    try {
      const response = await fetch(`${API_URL}/auth/register/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, nickname, token }),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("구글 회원가입 실패:", error);
      return null;
    }
  }
  
  // 토큰으로 사용자 정보 조회
  export async function fetchUserInfo(token) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      return null;
    }
  }

// 닉네임 변경 API
export async function updateNickname(uid, nickname, token) {
  try {
    const response = await fetch(`${API_URL}/api/user/nickname`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({ uid, nickname }),
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("닉네임 변경 실패:", error);
    return null;
  }
}

// 닉네임 중복확인 API
export async function checkNickname(nickname, uid = null) {
  try {
    const params = new URLSearchParams({ nickname });
    if (uid) params.append('uid', uid);
    
    const response = await fetch(`${API_URL}/api/user/check-nickname?${params}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("닉네임 중복확인 실패:", error);
    return null;
  }
}