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
};
