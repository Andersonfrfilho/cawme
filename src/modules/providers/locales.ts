import { registerLocaleModule } from "@/shared/locales";

export const providersLocale = {
  providers: {
    title: "Profissionais",
    available: "Disponível",
    unavailable: "Indisponível",
    loadError: "Erro ao carregar profissionais.",
    empty: "Nenhum profissional encontrado.",
  },
};

registerLocaleModule(providersLocale);

export default providersLocale;
