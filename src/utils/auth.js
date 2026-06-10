const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map(character => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  );
};

export const getSessionFromToken = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return {
      token,
      user: payload,
      isAdmin: payload.role === 'admin' || Boolean(payload.isAdmin),
    };
  } catch {
    return null;
  }
};
