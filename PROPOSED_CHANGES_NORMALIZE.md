# Propostas de normalização de nomes — checklist

Data: 2026-04-27

Objetivo: padronizar nomenclatura de arquivos de constantes e outras convenções para seguir o estilo do projeto.

Arquivos detectados que fogem do padrão atual

- `src/modules/auth/auth.constant.ts`
  - Proposta: renomear para `src/modules/auth/auth.constants.ts` (ou mover para `src/modules/auth/constants/index.ts`).
  - Motivo: sufixo plural `.constants.ts` é consistente com `src/shared/constants/*` e deixa claro que o arquivo contém múltiplas constantes.

- `src/modules/auth/services/keycloak.constant.ts`
  - Proposta: renomear para `src/modules/auth/services/keycloak.constants.ts` (ou mover para `src/modules/auth/constants/keycloak.ts`).
  - Motivo: mesma razão acima; também evita confusão com funções (constantes devem conter apenas valores/objetos imutáveis).

Impacto esperado

- Mudanças locais de import — exemplos a atualizar:
  - `import { BASE_URL, FORM_HEADERS } from './keycloak.constant'` → `import { BASE_URL, FORM_HEADERS } from './keycloak.constants'`
  - `import { HEADERS } from '../auth.constant'` → `import { HEADERS } from '../auth.constants'`

- Não existem mudanças de API JS — apenas renome de ficheiros e updates de imports.

Plano proposto

1. Criar branch com as renomeações.
2. Atualizar todos os imports que referenciam os arquivos renomeados (busca e substituição automática via script ou editor).
3. Rodar `pnpm -w build` / `yarn tsc` / `npm run typecheck` (ou `tsc --noEmit`) e testes para garantir que nada quebrou.
4. Commitar mudanças e abrir PR.

Checks antes de aplicar (marcar quando ok):

- [x] Confirmar que todos os imports foram atualizados automaticamente.
- [x] Rodar TypeScript build / checagem de tipos.
- [ ] Rodar testes unitários (se aplicável).
- [ ] Revisão rápida para garantir que nenhum arquivo de configuração nativo depende do nome antigo.

Quer que eu aplique automaticamente estas renomeações agora e atualize os imports (faço em uma branch), ou prefere revisar primeiro e aprovar manualmente?  
