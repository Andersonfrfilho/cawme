import { registerLocaleModule } from "@/shared/locales";

export const appConfigLocale = {
  "app-config": {
    loading: "Carregando configuração...",
    error: "Erro ao carregar configuração",
  },
};

registerLocaleModule(appConfigLocale);

export default appConfigLocale;
