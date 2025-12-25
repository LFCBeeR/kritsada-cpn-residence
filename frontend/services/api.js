async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!res.ok) {
    let msg = "Backend failed";
    try {
      const body = await res.json();
      msg = body?.detail || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

export function fetchProperties() {
  return request("/api/properties");
}

export function fetchFavorites(userId) {
  return request(`/api/users/${encodeURIComponent(userId)}/favorites`);
}

export function favoriteProperty(userId, propertyId) {
  return request(`/api/users/${encodeURIComponent(userId)}/favorites/${propertyId}`, {
    method: "POST"
  });
}

export function unfavoriteProperty(userId, propertyId) {
  return request(`/api/users/${encodeURIComponent(userId)}/favorites/${propertyId}`, {
    method: "DELETE"
  });
}

export function fetchUsers() {
  return request("/api/users");
}