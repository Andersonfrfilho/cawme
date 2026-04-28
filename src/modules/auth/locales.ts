import { registerLocaleModule } from "@/shared/locales";

export const authLocale = {
  auth: {
    loginTitle: "Cawme",
    loginSubtitle: "Sua solução para serviços domésticos",
    welcomeBack: "Bem-vindo de volta",
    accessAccount: "Acesse sua conta para continuar",
    loginButton: "Entrar",
    register: "Criar conta",
    continueAsGuest: "Entrar sem login",
    registerTitle: "Criar conta",
    registerSubtitle: "Em breve você poderá se cadastrar pelo app.",
    loginError: "Usuário ou senha inválidos. Tente novamente.",
    usernamePlaceholder: "Usuário",
    passwordPlaceholder: "Senha",
    usernameRequired: "Usuário obrigatório",
    passwordRequired: "Senha obrigatória",
    rememberMe: "Lembrar-me",
    forgotPassword: "Esqueci minha senha",
    forgotPasswordTitle: "Recuperar senha",
    forgotPasswordSubtitle:
      "Informe seu e-mail para receber o link de recuperação.",
    forgotPasswordButton: "Enviar",
    forgotPasswordError: "Não foi possível enviar o e-mail. Tente novamente.",
    forgotPasswordSuccessTitle: "E-mail enviado!",
    forgotPasswordSuccess:
      "Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.",
    emailPlaceholder: "E-mail",
    emailInvalid: "Informe um e-mail válido",
    backToLogin: "Voltar para login",
  },
};

registerLocaleModule(authLocale);

export default authLocale;
