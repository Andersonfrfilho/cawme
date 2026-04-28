import axios from "axios";
import { TokenService } from "./token.service";
import { AUTH_ENDPOINTS, CLIENT, HEADERS } from "../auth.constants";
import { BASE_URL, FORM_HEADERS } from "./keycloak.constants";
import { decodeJwtPayload } from "@/shared/utils/jwt";
import type {
  LoginServiceParams,
  LoginServiceResult,
  ForgotPasswordServiceParams,
} from "./types";



export const KeycloakService = {
  async login({
    username,
    password,
  }: LoginServiceParams): Promise<LoginServiceResult> {
    const response = await axios.post(
      `${BASE_URL}${AUTH_ENDPOINTS.TOKEN}`,
      new URLSearchParams({
        grant_type: HEADERS.GRANT_TYPE.PASSWORD,
        client_id: CLIENT.ID,
        client_secret: CLIENT.SECRET,
        username,
        password,
      }).toString(),
      { headers: FORM_HEADERS },
    );

    await TokenService.save({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });

    const claims = decodeJwtPayload(response.data.access_token);
    return {
      id: claims.sub,
      name: claims.name ?? claims.given_name ?? username,
      email: claims.email ?? username,
    };
  },

  async refresh(): Promise<void> {
    const refreshToken = await TokenService.getRefresh();
    if (!refreshToken) throw new Error("No refresh token available");

    try {
      const response = await axios.post(
        `${BASE_URL}${AUTH_ENDPOINTS.TOKEN}`,
        new URLSearchParams({
          grant_type: HEADERS.GRANT_TYPE.REFRESH_TOKEN,
          client_id: CLIENT.ID,
          client_secret: CLIENT.SECRET,
          refresh_token: refreshToken,
        }).toString(),
        { headers: FORM_HEADERS },
      );

      await TokenService.save({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });
    } catch (error) {
      await TokenService.clear();
      throw error;
    }
  },

  async logout(): Promise<void> {
    const refreshToken = await TokenService.getRefresh();
    if (refreshToken) {
      try {
        await axios.post(
          `${BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`,
          new URLSearchParams({
            client_id: CLIENT.ID,
            client_secret: CLIENT.SECRET,
            refresh_token: refreshToken,
          }).toString(),
          { headers: FORM_HEADERS },
        );
      } catch {
        // logout failure is non-fatal
      }
    }
    await TokenService.clear();
  },

  async forgotPassword({ email }: ForgotPasswordServiceParams): Promise<void> {
    try {
      await axios.post(`${BASE_URL}${AUTH_ENDPOINTS.FORGOT_PASSWORD}`, { email });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("[forgotPassword] failed", {
          status: error.response?.status,
          url: error.config?.url,
          data: error.response?.data,
          message: error.message,
        });
      }
      throw error;
    }
  },
};
