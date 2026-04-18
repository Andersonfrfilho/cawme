import { registerLocaleModule } from ".";

// Exemplo de locale para um módulo. Copie para `src/modules/<module>/locales.ts`
export const moduleLocale = {
  myModule: {
    title: "Título do módulo",
    button: {
      label: "Clique",
    },
  },
};

// Registrar automaticamente ao importar (opcional)
// registerLocaleModule(moduleLocale);

export default moduleLocale;
