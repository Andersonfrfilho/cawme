import { registerLocaleModule } from "@/shared/locales";

export const homeLocale = {
  home: {
    title: "Início",
    loadError: "Falha ao carregar a home",
    button: { label: "Ver serviços" },
    signIn: "Entrar",
    guestWelcome: "Bem-vindo ao Cawme",
    guestDescription: "Encontre profissionais qualificados para serviços domésticos. Crie uma conta para agendar e gerenciar seus serviços.",
    pendingOnboardingTitle: "Quase lá!",
    pendingOnboardingSubtitle: "Faça login para verificar sua conta e acessar todos os recursos.",
  },
};

registerLocaleModule(homeLocale);

export default homeLocale;
