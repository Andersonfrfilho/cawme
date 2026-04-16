export interface SaveTokensParams {
  accessToken: string;
  refreshToken: string;
}

export type SaveTokensResult = Promise<void>;
