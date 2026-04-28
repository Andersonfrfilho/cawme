export function decodeJwtPayload(token: string): Record<string, any> {
  const [, payload] = token.split(".");
  // base64 url -> base64
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  let json: string;
  try {
    if (typeof atob === "function") json = atob(padded);
    else if (typeof Buffer !== "undefined") json = Buffer.from(padded, "base64").toString("utf8");
    else throw new Error("No base64 decoder available");
  } catch (e) {
    throw new Error("Invalid JWT payload: " + String(e));
  }

  return JSON.parse(json);
}

export default decodeJwtPayload;
