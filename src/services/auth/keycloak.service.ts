import * as AuthSession from 'expo-auth-session';
import { TokenService } from './token.service';
import axios from 'axios';
import * as Linking from 'expo-linking';

const KEYCLOAK_URL = process.env.EXPO_PUBLIC_KEYCLOAK_URL;
const REALM = process.env.EXPO_PUBLIC_KEYCLOAK_REALM;
const CLIENT_ID = process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID;

const discovery = {
  authorizationEndpoint: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth`,
  tokenEndpoint: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
  revocationEndpoint: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
  endSessionEndpoint: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
};

export const KeycloakService = {
  getDiscovery() {
    return discovery;
  },

  getClientId() {
    return CLIENT_ID!;
  },

  getRedirectUri() {
    return AuthSession.makeRedirectUri({
      scheme: 'cawme',
      path: 'callback',
    });
  },

  async handleTokenExchange(code: string, codeVerifier: string): Promise<void> {
    const response = await axios.post(
      discovery.tokenEndpoint,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID!,
        code,
        redirect_uri: this.getRedirectUri(),
        code_verifier: codeVerifier,
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    await TokenService.save({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });
  },

  async refresh(): Promise<void> {
    const refreshToken = await TokenService.getRefresh();
    if (!refreshToken) throw new Error('No refresh token available');

    try {
      const response = await axios.post(
        discovery.tokenEndpoint,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: CLIENT_ID!,
          refresh_token: refreshToken,
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
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
    const accessToken = await TokenService.getAccess();
    if (accessToken) {
      try {
        await axios.post(
          discovery.revocationEndpoint,
          new URLSearchParams({
            client_id: CLIENT_ID!,
            token: accessToken,
          }).toString(),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
      } catch (e) {
        console.error('Keycloak logout error', e);
      }
    }
    await TokenService.clear();
  },
};
