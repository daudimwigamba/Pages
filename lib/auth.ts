export function getAccessToken() {
  if (typeof document === "undefined") return null;

  return document.cookie
    .split("; ")
    .find(row => row.startsWith("accessToken="))
    ?.split("=")[1] || null;
}

