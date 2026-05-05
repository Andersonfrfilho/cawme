type AuthErrorCode =
  | "EMAIL_ALREADY_EXISTS"
  | "PHONE_ALREADY_EXISTS"
  | "INVALID_CPF"
  | "WEAK_PASSWORD"
  | "USER_NOT_FOUND"
  | "INVALID_CREDENTIALS"
  | "INVALID_EMAIL"
  | "INVALID_PHONE"
  | "MISSING_REQUIRED_FIELD"
  | "ACCOUNT_DISABLED"
  | "GENERIC_ERROR";

interface BffError {
  statusCode?: number;
  error?: string;
  message?: string;
  field?: string;
}

const ERROR_MAP: Record<AuthErrorCode, string> = {
  EMAIL_ALREADY_EXISTS: "registerEmailExists",
  PHONE_ALREADY_EXISTS: "registerPhoneExists",
  INVALID_CPF: "registerCpfInvalid",
  WEAK_PASSWORD: "registerPasswordMinLength",
  USER_NOT_FOUND: "loginError",
  INVALID_CREDENTIALS: "loginError",
  INVALID_EMAIL: "registerEmailInvalid",
  INVALID_PHONE: "registerPhoneRequired",
  MISSING_REQUIRED_FIELD: "registerRequiredField",
  ACCOUNT_DISABLED: "registerAccountDisabled",
  GENERIC_ERROR: "registerError",
};

export function mapAuthError(
  bffError: BffError | undefined,
  defaultMessage: string = "registerError",
): { message: string; field?: string } {
  if (!bffError) {
    return { message: defaultMessage };
  }

  // Tenta mapear pelo código de erro primeiro
  const errorCode = bffError.error as AuthErrorCode;
  if (errorCode && ERROR_MAP[errorCode]) {
    return {
      message: ERROR_MAP[errorCode],
      field: bffError.field,
    };
  }

  // Fallback: detecta pela mensagem (caso backend envie apenas mensagem em PT-BR)
  const message = bffError.message?.toLowerCase() || '';
  
  if (message.includes('e-mail já está') || message.includes('email já está')) {
    return { message: 'registerEmailExists', field: 'email' };
  }
  
  if (message.includes('telefone já está') || message.includes('celular já está')) {
    return { message: 'registerPhoneExists', field: 'phone' };
  }
  
  if (message.includes('cpf') && (message.includes('invál') || message.includes('invalid'))) {
    return { message: 'registerCpfInvalid', field: 'cpf' };
  }
  
  if (message.includes('senha') && (message.includes('fraca') || message.includes('mínima'))) {
    return { message: 'registerPasswordMinLength', field: 'password' };
  }
  
  if (message.includes('desativ')) {
    return { message: 'registerAccountDisabled', field: undefined };
  }

  return { message: defaultMessage, field: bffError.field };
}

export function getErrorMessage(
  error: any,
  fallbackKey: string = "registerError",
): string {
  const bffError: BffError = error?.response?.data;
  const { message: localeKey } = mapAuthError(bffError, fallbackKey);

  return localeKey;
}

export function getErrorDetails(
  error: any,
  fallbackKey: string = "registerError",
): { message: string; field?: string; statusCode?: number } {
  const bffError: BffError = error?.response?.data;
  const { message: localeKey, field } = mapAuthError(bffError, fallbackKey);

  return {
    message: localeKey,
    field,
    statusCode: bffError?.statusCode || error?.response?.status,
  };
}
