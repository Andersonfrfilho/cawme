import type { UserProfile } from "@/modules/auth/types/auth.types";

export type VerificationStatus = {
  emailVerified: boolean;
  phoneVerified: boolean;
};

export type AuthStore = {
  user: UserProfile | null;
  isSignedIn: boolean;
  verificationStatus: VerificationStatus;
  setUser: (user: UserProfile | null) => void;
  setVerificationStatus: (status: Partial<VerificationStatus>) => void;
  logout: () => void;
};
