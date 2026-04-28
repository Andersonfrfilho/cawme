# Plano de Refatoração Arquitetural e Estilização - Cawme

Este documento detalha as mudanças necessárias para alinhar o projeto aos padrões de arquitetura (separação de responsabilidades) e estilização (uso do tema centralizado).

## Objetivos Gerais
1.  **Decomposição de Telas:** Telas com mais de 200 linhas devem ser divididas em sub-componentes funcionais.
2.  **Padronização de Estilos:** Proibir o uso de hexadecimais *hardcoded*. Todos os estilos devem consumir `theme` de `@/shared/constants`.
3.  **Tipagem Estrita:** Garantir que cada componente tenha seu arquivo `types.ts` e props devidamente definidas.
4.  **Exportação Centralizada:** Uso consistente de `index.ts` para exportar componentes e telas.

---

## Análise por Módulo

### 1. Auth (`src/modules/auth`)
*   **`screens/login/login.screen.tsx`**:
    *   **Problema:** Lógica de formulário, animações e renderização de UI misturadas. Estilos em `styles.ts` estão vazios. Cores fixas no JSX.
    *   **Refatoração:**
        *   Mover todos os estilos para `styles.ts` usando `theme`.
        *   Criar componentes: `LoginHero`, `LoginForm`, `SocialLogin` (se houver).
        *   Extrair lógica de validação do Zod para um arquivo separado se crescer.
*   **`screens/forgot-password/styles.ts`**:
    *   **Problema:** Uso de `#FEF2F2` (background de erro) e `#FCA5A5` (borda).
    *   **Refatoração:** Mapear essas cores para `theme.colors.status.errorLight` ou similar.

### 2. Chat (`src/modules/chat`)
*   **`screens/styles.ts`**:
    *   **Problema:** Grande quantidade de hexadecimais fixos para bolhas de chat, inputs e badges.
    *   **Refatoração:**
        *   Substituir `#007AFF` por `theme.colors.primary.DEFAULT`.
        *   Substituir tons de cinza por `theme.colors.neutral`.
        *   Mover componentes de lista (`RoomItem`) e bolhas (`ChatMessage`) para `src/modules/chat/components`.

### 3. Dashboard (`src/modules/dashboard`)
*   **`components/StatCard/styles.ts`**:
    *   **Problema:** Uso de `#666` para labels.
    *   **Refatoração:** Usar `theme.colors.text.secondary`.
*   **`screens/dashboard.screen.tsx`**:
    *   **Problema:** Lógica de alternância entre `ContractorDashboard` e `ProviderDashboard` pode ser mais limpa.

### 4. Shared Components (`src/shared/components`)
*   **`error-screen/error-screen.styles.ts`**:
    *   **Problema:** Uso de `#555` e cores genéricas.
    *   **Refatoração:** Alinhar com a paleta oficial em `colors.ts`.

---

## Próximos Passos Recomendados

1.  **Fase 1: Shared Theme Injection**
    *   Atualizar todos os `styles.ts` para importar `theme` ou `colors` de `@/shared/constants`.
2.  **Fase 2: Decomposição do Módulo Auth**
    *   O Login é a porta de entrada e a tela mais complexa visualmente. Servirá de modelo para as demais.
3.  **Fase 3: Refatoração do Chat**
    *   Limpeza de estilos e criação de componentes reutilizáveis para a interface de mensagens.
4.  **Fase 4: Auditoria de Tipagem**
    *   Revisar `types.ts` em todos os módulos para evitar o uso de `any`.

## Convenção de Arquivos (Padrão)
Cada diretório de componente/screen deve conter:
- `index.ts` (Export default)
- `[Name].screen.tsx` ou `[Name].component.tsx`
- `styles.ts` (Usando StyleSheet e theme)
- `types.ts` (Interfaces e Types)
- `[Name].test.ts` (Se aplicável)
