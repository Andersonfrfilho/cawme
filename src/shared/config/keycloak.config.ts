import { z } from "zod";

const keycloakConfigSchema = z.object({
  url: z.url().default("http://localhost:8080/auth"),
  realm: z.string().default("domestic"),
  clientId: z.string().default("domestic-bff"),
  clientSecret: z.string().default("backend-bff-client-secret"),
});

export const keycloakConfig = keycloakConfigSchema.parse({
  url: process.env.EXPO_PUBLIC_KEYCLOAK_URL,
  realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
  clientSecret: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_SECRET,
});
