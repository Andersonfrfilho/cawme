import { registerLocaleModule } from "@/shared/locales";

export const authLocale = {
  auth: {
    loginTitle: "Entrar",
    loginSubtitle: "Acesse sua conta",
    loginButton: "Entrar",
    loginError: "Erro ao realizar login",
  },
};

registerLocaleModule(authLocale);

export default authLocale;
