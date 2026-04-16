const ADMIN_USER = 'miguel';
const ADMIN_PASSWORD = 'meolvide01';
const STORAGE_KEY = 'centronea_admin_session';

export function loginAdmin(username, password) {
  const normalizedUsername = username.trim().toLowerCase();

  if (normalizedUsername !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return { ok: false, message: 'Usuario o contraseña incorrectos.' };
  }

  const sessionPayload = {
    username: ADMIN_USER,
    loggedAt: new Date().toISOString(),
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionPayload));

  return { ok: true };
}

export function logoutAdmin() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getAdminSession() {
  const rawSession = sessionStorage.getItem(STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function isAdminAuthenticated() {
  return Boolean(getAdminSession());
}
