import { registerLocaleModule } from "@/shared/locales";

export const providerProfileLocale = {
  "provider-profile": {
    title: "Perfil",
    about: "Sobre",
    services: "Serviços",
    loadError: "Erro ao carregar o perfil do prestador.",
    reviews: "avaliações",
  },
};

registerLocaleModule(providerProfileLocale);

export default providerProfileLocale;
