export type BlockAction = {
  type: "contact_support" | "retry" | "logout" | "go_to_login" | "dismiss";
  label: string;
  url?: string;
  route?: string;
  blockId?: string;
  variant?: "primary" | "secondary" | "outline";
};

export type BlockReason =
  | "EMAIL_CONFLICT"
  | "PHONE_CONFLICT"
  | "DOCUMENT_CONFLICT"
  | "FRAUD_SUSPICION"
  | "TERMS_VIOLATION"
  | "MANUAL_BLOCK"
  | "VERIFICATION_FAILED"
  | "ACCOUNT_DISABLED"
  | string;

export type AccountBlockStatus = {
  blocked: boolean;
  reason: BlockReason | null;
  message: string | null;
  title?: string | null;
  icon?: string | null;
  severity?: "error" | "warning" | "info" | null;
  actions: BlockAction[];
  canRetryAt?: string | null;
};

export type BlockedAccountScreenParams = {
  reason?: BlockReason;
  message?: string;
  title?: string;
};
