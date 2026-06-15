import { registerLocaleModule } from "@/shared/locales";

export const providerProfileLocale = {
  "provider-profile": {
    title: "Perfil",
    about: "Sobre",
    services: "Serviços",
    loadError: "Erro ao carregar o perfil do prestador.",
    reviews: "avaliações",
    recentReviews: "Avaliações recentes",
    noReviews: "Nenhuma avaliação ainda",
    paymentMethods: "Formas de pagamento",
    noPaymentMethods: "Nenhuma forma de pagamento informada",
    providerNotApproved: "Prestador em análise — não disponível para solicitações",
  },
};

registerLocaleModule(providerProfileLocale);

export default providerProfileLocale;
