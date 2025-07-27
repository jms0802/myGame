// UID, 닉네임 저장/불러오기/삭제
export function setLocalUser(uid, nickname) {
  localStorage.setItem("uid", uid);
  localStorage.setItem("nickname", nickname);
}

export function getLocalUser() {
  return {
    uid: localStorage.getItem("uid"),
    nickname: localStorage.getItem("nickname"),
  };
}

export function removeLocalUser() {
  localStorage.removeItem("uid");
  localStorage.removeItem("nickname");
}

// 닉네임만 수정
export function setLocalNickname(nickname) {
  localStorage.setItem("nickname", nickname);
}

// 인증 토큰 저장/불러오기/삭제
export function setAuthToken(token) {
  localStorage.setItem("authToken", token);
}

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function removeAuthToken() {
  localStorage.removeItem("authToken");
}

// 다크모드(테마) 저장/불러오기
export function setColorTheme(theme) {
  localStorage.setItem("color-theme", theme);
}

export function getColorTheme() {
  return localStorage.getItem("color-theme");
} 