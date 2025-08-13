export function setAuthCookie(token) {
  // 만료 기간 7일(604800초)로 설정
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `authToken=${token}; expires=${expires}; path=/;`;
}

export function getAuthCookie() {
  const match = document.cookie.match('(^|;)\\s*authToken\\s*=\\s*([^;]+)');
  return match ? match.pop() : null;
}

export function removeAuthCookie() {
  document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

// --- 게스트 유저 localStorage 관리 ---

export function setLocalUser(uid, nickname) {
  localStorage.setItem("uid", uid);
  localStorage.setItem("nickname", nickname);
}

export function getLocalUser() {
  return {
    storedUID: localStorage.getItem("uid"),
    storedNickname: localStorage.getItem("nickname"),
  };
}

export function removeLocalUser() {
  localStorage.removeItem("uid");
  localStorage.removeItem("nickname");
}

export function setLocalNickname(nickname) {
  localStorage.setItem("nickname", nickname);
}

export function getLocalNickname() {
  return localStorage.getItem("nickname");
}

export function removeLocalNickname() {
  localStorage.removeItem("nickname");
}
