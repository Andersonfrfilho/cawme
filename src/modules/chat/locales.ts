import { registerLocaleModule } from "@/shared/locales";

export const chatLocale = {
  chat: {
    title: "Chat",
    roomsTitle: "Conversas",
    emptyRooms: "Inicie uma conversa",
    inputPlaceholder: "Mensagem...",
    send: "Enviar",
  },
};

registerLocaleModule(chatLocale);

export default chatLocale;
