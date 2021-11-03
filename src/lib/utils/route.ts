const PRESERVE = ["hmac", "host", "locale", "new_design_language", "session", "shop", "timestamp"];

export function route(path: string): string {
  const pathParts = path.split("#");
  const parts = [];
  const params = new URLSearchParams(location.search);
  params.forEach((value, key) => {
    if (PRESERVE.includes(key)) {
      parts.push(`${key}=${value}`);
    }
  });

  const join = path.includes("?") ? "&" : "?";
  return pathParts[0] + (parts.length ? join + parts.join("&") : "") + (pathParts[1] ? `#${pathParts[1]}` : "");
}
