import { registerLocaleModule } from "@/shared/locales";

export const notificationsLocale = {
  notifications: {
    title: "Avisos",
    empty: "Você não tem notificações no momento.",
  },
};

registerLocaleModule(notificationsLocale);

export default notificationsLocale;
