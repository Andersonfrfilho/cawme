export const KEYS = {
  ACCESS: "auth_access_token",
  REFRESH: "auth_refresh_token",
};

export const CLIENT = {
  ID: "domestic-bff",
  SECRET: "backend-bff-client-secret",
};

export const HEADERS = {
  GRANT_TYPE: {
    PASSWORD: "password",
    REFRESH_TOKEN: "refresh_token",
  },
  CONTENT_TYPE: {
    FORM_URLENCODED: "application/x-www-form-urlencoded",
  },
  PROPERTIES: {
    CONTENT_TYPE: "Content-Type",
  },
};

export const AUTH_ENDPOINTS = {
  TOKEN: "/auth/token",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/bff/auth/forgot-password",
  REGISTER: "/bff/auth/register",
  VERIFICATION_SEND: "/bff/auth/verification/send",
  VERIFICATION_VERIFY: "/bff/auth/verification/verify",
};

export const HERO_OVERLAY = {
  white80: "rgba(255, 255, 255, 0.8)",
  white08: "rgba(255, 255, 255, 0.08)",
  white05: "rgba(255, 255, 255, 0.05)",
  white03: "rgba(255, 255, 255, 0.03)",
} as const;

export const TOGGLE_PILL_WIDTH = 140 as const;
