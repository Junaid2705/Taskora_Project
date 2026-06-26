// Central helpers for the cached user session (JWT + identity)
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  const u = getCurrentUser();
  return !!(u && u.token);
}

export function getToken() {
  const u = getCurrentUser();
  return u ? u.token : null;
}

export function getRole() {
  const u = getCurrentUser();
  return u ? u.role : null; // e.g. "ROLE_EMPLOYER"
}

export function hasRole(role) {
  const r = getRole();
  if (!r) return false;
  const normalized = role.startsWith('ROLE_') ? role : 'ROLE_' + role;
  return r === normalized;
}

export function logout() {
  localStorage.removeItem('user');
}

// Authorization header for protected requests
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: 'Bearer ' + token } : {};
}
