import { registerLocaleModule } from "@/shared/locales";

export const accountLocale = {
  account: {
    editTitle: "Editar perfil",
    nameLabel: "Nome completo",
    namePlaceholder: "Seu nome completo",
    nameRequired: "Nome obrigatório",
    emailLabel: "E-mail",
    phoneLabel: "Telefone",
    tapToChange: "Toque para alterar",
    saveButton: "Salvar",
    savingButton: "Salvando...",
    saveSuccess: "Perfil atualizado com sucesso",
    changeEmailTitle: "Alterar e-mail",
    changePhoneTitle: "Alterar telefone",
    newEmailPlaceholder: "Novo e-mail",
    newPhonePlaceholder: "Novo telefone",
    newEmailRequired: "E-mail obrigatório",
    newEmailInvalid: "E-mail inválido",
    newPhoneRequired: "Telefone obrigatório",
    newPhoneInvalid: "Telefone inválido",
    sendCodeButton: "Enviar código",
    sendingCodeButton: "Enviando...",
    otpLabel: "Código de verificação",
    otpPlaceholder: "6 dígitos",
    confirmButton: "Confirmar",
    confirmingButton: "Confirmando...",
    otpSentTo: "Código enviado para",
    changeSuccess: "Contato atualizado com sucesso",
    resendCode: "Reenviar código",
  },
};

registerLocaleModule(accountLocale);
export default accountLocale;
