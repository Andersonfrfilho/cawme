import type { UserProfile } from "@/modules/auth/types/auth.types";

export type AuthStore = {
  user: UserProfile | null;
  isSignedIn: boolean;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
};
