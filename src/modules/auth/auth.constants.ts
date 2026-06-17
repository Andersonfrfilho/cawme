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
  TOKEN: "/bff/auth/token",
  LOGOUT: "/bff/auth/logout",
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
  SERVICES: "/bff/auth/services",
  CATEGORIES: "/bff/auth/categories",
  CATEGORIES_CREATE: "/bff/auth/categories",
  SERVICES_CREATE: "/bff/auth/services",
  PROVIDER_SERVICES: "/bff/auth/providers/me/services",
  PROVIDER_SERVICE_UPDATE: (serviceId: string) => `/bff/auth/providers/me/services/${serviceId}`,
  PROVIDER_SERVICE_DELETE: (serviceId: string) => `/bff/auth/providers/me/services/${serviceId}`,
  PROVIDER_AVAILABILITY: "/bff/auth/providers/me/availability",
  PROVIDER_AVAILABILITY_BY_ID: (id: string) => `/bff/auth/providers/me/availability/${id}`,
  ACCOUNT_PROFILE: "/bff/account/me",
  ACCOUNT_UPDATE_NAME: "/bff/account/me/name",
  ACCOUNT_EMAIL_CHANGE: "/bff/account/me/email/change",
  ACCOUNT_EMAIL_CHANGE_CONFIRM: "/bff/account/me/email/change/confirm",
  ACCOUNT_PHONE_CHANGE: "/bff/account/me/phone/change",
  ACCOUNT_PHONE_CHANGE_CONFIRM: "/bff/account/me/phone/change/confirm",
  ACCOUNT_EMAIL_CHECK: "/bff/account/me/email/check",
  ACCOUNT_PHONE_CHECK: "/bff/account/me/phone/check",
  ACCOUNT_ADDRESS_UPDATE: "/bff/account/me/address",
  ACCOUNT_DOCUMENT_UPLOAD: "/bff/account/me/document",
  ACCOUNT_DOCUMENT_CHECK: "/bff/account/me/document/check",
  ACCOUNT_DOCUMENTS_LIST: "/bff/account/me/documents",
  ACCOUNT_DOCUMENT_URL: (id: string) => `/bff/account/me/documents/${id}/url`,
  ACCOUNT_DOCUMENT_DELETE: (id: string) => `/bff/account/me/documents/${id}`,
  PAYMENT_METHOD_TYPES: "/bff/auth/payment-method-types",
  PROVIDER_PAYMENT_METHODS: "/bff/auth/providers/me/payment-methods",
  PROVIDER_PIX_KEY_CHECK: "/bff/auth/providers/me/pix-key/check",
  PROVIDER_PROFILE_ME: "/bff/auth/providers/me/profile",
  PROVIDER_WORK_LOCATIONS: "/bff/auth/providers/me/work-locations",
  PROVIDER_WORK_LOCATION_DELETE: (locationId: string) =>
    `/bff/auth/providers/me/work-locations/${locationId}`,
  PROVIDER_VERIFICATION: "/bff/auth/providers/me/verification",
  PROVIDER_VERIFICATION_SUBMIT: "/bff/auth/providers/me/verification/submit",
};

export const HERO_OVERLAY = {
  white80: "rgba(255, 255, 255, 0.8)",
  white08: "rgba(255, 255, 255, 0.08)",
  white05: "rgba(255, 255, 255, 0.05)",
  white03: "rgba(255, 255, 255, 0.03)",
} as const;

export const TOGGLE_PILL_WIDTH = 140 as const;
