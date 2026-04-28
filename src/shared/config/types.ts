interface Keycloak {
  url: string;
  realm: string;
  clientId: string;
  clientSecret: string;
}

export interface Config {
  keycloak: Keycloak;
}
