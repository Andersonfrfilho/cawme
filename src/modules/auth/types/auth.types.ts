export interface TokenServiceInterface {
  save(params: SaveTokensParams): SaveTokensResult;
  getAccess(): Promise<string | null>;
  getRefresh(): Promise<string | null>;
  clear(): Promise<void>;
}

export type SaveTokensParams = {
  accessToken: string;
  refreshToken: string;
};

export type SaveTokensResult = Promise<void>;

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  type: "contractor" | "provider";
};
