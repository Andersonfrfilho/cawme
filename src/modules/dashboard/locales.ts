import { registerLocaleModule } from "@/shared/locales";

export const dashboardLocale = {
  dashboard: {
    title: "Dashboard",
    contractorTitle: "Solicitações Recentes",
    providerActiveTitle: "Agenda Ativa",
    providerPendingTitle: "Novas Solicitações",
    loginRequired: "Você precisa estar logado para ver o dashboard.",
    loadError: "Erro ao carregar dashboard.",
  },
};

registerLocaleModule(dashboardLocale);

export default dashboardLocale;
