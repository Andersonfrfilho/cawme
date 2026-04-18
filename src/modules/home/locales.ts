import { registerLocaleModule } from "@/shared/locales";

export const homeLocale = {
  home: {
    title: "Início",
    loadError: "Falha ao carregar a home",
    button: { label: "Ver serviços" },
  },
};

registerLocaleModule(homeLocale);

export default homeLocale;
