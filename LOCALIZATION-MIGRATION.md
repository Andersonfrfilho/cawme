# Localização — Status de migração por módulo

Gerado em: 2026-04-17

Este arquivo lista os módulos em `src/modules` e indica se eles já possuem um arquivo de `locales` e se chamam `registerLocaleModule(...)` para registrar seus textos no sistema global.

Resumo rápido

| Módulo           | Possui `locales` | Chama `registerLocaleModule` |
| ---------------- | ---------------: | ---------------------------: |
| app-config       |           ❌ não |                       ❌ não |
| auth             |           ❌ não |                       ❌ não |
| chat             |           ❌ não |                       ❌ não |
| dashboard        |           ❌ não |                       ❌ não |
| home             |           ❌ não |                       ❌ não |
| notifications    |           ❌ não |                       ❌ não |
| provider-profile |           ❌ não |                       ❌ não |
| sdui             |           ❌ não |                       ❌ não |
| search           |           ❌ não |                       ❌ não |

Observações

- No momento não há arquivos `locales.ts` (ou `locales/index.ts`) dentro dos módulos listados.
- Também não há chamadas a `registerLocaleModule(...)` nos módulos; a função existe apenas em `src/shared/locales` e há um template em `src/shared/locales/module-template.ts`.

Próximos passos sugeridos

1. Para cada módulo que precisa de textos localizáveis, criar `src/modules/<module>/locales.ts` baseado em `src/shared/locales/module-template.ts`.

Exemplo:

```ts
// src/modules/home/locales.ts
export const homeLocale = {
  home: {
    title: "Início",
    button: { label: "Ver serviços" },
  },
};

export default homeLocale;
```

2. Registrar o locale do módulo na inicialização do módulo (por exemplo num hook `useInit` do módulo ou no provider do módulo):

```ts
import { registerLocaleModule } from "@/shared/locales";
import homeLocale from "./locales";

registerLocaleModule(homeLocale);
```

3. Rodar o script de checagem para validar cobertura:

```bash
npm run check-locales
```

4. Opcional: adicionar tipagem mais estrita do shape do locale por módulo e testes unitários que verifiquem a presença das chaves essenciais.

Se quiser, eu posso: gerar automaticamente `locales.ts` vazios para todos os módulos listados, ou abrir PRs com templates já adicionados módulo a módulo. Diga qual fluxo prefere.
