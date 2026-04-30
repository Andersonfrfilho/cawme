import { registerLocaleModule } from "@/shared/locales";

export const homeLocale = {
  home: {
    title: "Início",
    loadError: "Falha ao carregar a home",
    button: { label: "Ver serviços" },
    signIn: "Entrar",
    guestWelcome: "Bem-vindo ao Cawme",
    guestDescription: "Encontre profissionais qualificados para serviços domésticos. Crie uma conta para agendar e gerenciar seus serviços.",
  },
};

registerLocaleModule(homeLocale);

export default homeLocale;
