import { registerLocaleModule } from "@/shared/locales";

export const searchLocale = {
  search: {
    title: "Buscar",
    placeholder: "O que você precisa?",
    loadError: "Erro ao buscar resultados.",
    empty: "Nenhum resultado encontrado.",
  },
};

registerLocaleModule(searchLocale);

export default searchLocale;
