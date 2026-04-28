import * as SecureStore from "expo-secure-store";
import type {
  TokenServiceInterface,
  SaveTokensParams,
  SaveTokensResult,
} from "@/modules/auth/types/auth.types";
import { KEYS } from "../auth.constants";

export const TokenService: TokenServiceInterface = {
  async save({
    accessToken,
    refreshToken,
  }: SaveTokensParams): SaveTokensResult {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.ACCESS, accessToken),
      SecureStore.setItemAsync(KEYS.REFRESH, refreshToken),
    ]);
  },

  async getAccess(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.ACCESS);
  },

  async getRefresh(): Promise<string | null> {
    return SecureStore.getItemAsync(KEYS.REFRESH);
  },

  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.ACCESS),
      SecureStore.deleteItemAsync(KEYS.REFRESH),
    ]);
  },
};
