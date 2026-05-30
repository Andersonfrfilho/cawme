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
  REGISTER: "/bff/onboarding/register",
  VERIFICATION_SEND: "/bff/onboarding/verification/send",
  VERIFICATION_VERIFY: "/bff/onboarding/verification/verify",
  VERIFICATION_STATUS: "/bff/auth/verification-status",
  ACCOUNT_STATUS: "/bff/auth/account-status",
  DOCUMENT_UPLOAD: "/bff/onboarding/documents/upload",
  APP_CONFIG: "/bff/app-config",
  TERMS_CURRENT: "/bff/auth/terms/current",
  TERMS_VERSIONS: "/bff/auth/terms/versions",
  TERMS_CHECK_PENDING: "/bff/auth/terms/check-pending",
  TERMS_ACCEPT: "/bff/auth/terms/accept",
  ADDRESS_SAVE: "/bff/onboarding/address",
  ONBOARDING_STATUS: "/bff/onboarding/status",
  SELF_UNLOCK: (blockId: string) => `/bff/auth/account-block/${blockId}/self-unlock`,
  SELF_UNLOCK_VERIFY: (blockId: string) => `/bff/auth/account-block/${blockId}/self-unlock/verify`,
  CATEGORIES: "/bff/auth/categories",
  PROVIDER_SERVICES: "/bff/auth/providers/me/services",
  PROVIDER_SERVICE_UPDATE: (serviceId: string) => `/bff/auth/providers/me/services/${serviceId}`,
  PROVIDER_SERVICE_DELETE: (serviceId: string) => `/bff/auth/providers/me/services/${serviceId}`,
  PROVIDER_AVAILABILITY: "/bff/auth/providers/me/availability",
  PROVIDER_AVAILABILITY_UPDATE: (dayOfWeek: number) => `/bff/auth/providers/me/availability/${dayOfWeek}`,
  ACCOUNT_PROFILE: "/bff/account/me",
  ACCOUNT_UPDATE_NAME: "/bff/account/me/name",
  ACCOUNT_EMAIL_CHANGE: "/bff/account/me/email/change",
  ACCOUNT_EMAIL_CHANGE_CONFIRM: "/bff/account/me/email/change/confirm",
  ACCOUNT_PHONE_CHANGE: "/bff/account/me/phone/change",
  ACCOUNT_PHONE_CHANGE_CONFIRM: "/bff/account/me/phone/change/confirm",
};

export const HERO_OVERLAY = {
  white80: "rgba(255, 255, 255, 0.8)",
  white08: "rgba(255, 255, 255, 0.08)",
  white05: "rgba(255, 255, 255, 0.05)",
  white03: "rgba(255, 255, 255, 0.03)",
} as const;

export const TOGGLE_PILL_WIDTH = 140 as const;
