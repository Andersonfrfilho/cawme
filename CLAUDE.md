# Cawme — Regras do Projeto

## Stack
- React Native 0.83 + Expo 55 + Expo Router
- NativeWind 4 (Tailwind para RN)
- Zustand (estado global), TanStack Query (server state)
- React Hook Form + Zod (formulários)
- TypeScript strict

---

## Estrutura de Pastas

```
src/
  shared/
    constants/        # colors.ts, theme.ts — paleta e métricas do design system
    types/            # tipos globais compartilhados entre módulos
    utils/            # funções utilitárias sem domínio de negócio
    hooks/            # hooks compartilhados (ex: useDebounce, useTheme)
    providers/        # infraestrutura transversal — sempre singleton
      cache/
        cache.types.ts              # interface CacheProvider
        index.ts                    # re-export público
        implementations/
          mmkv-storage.ts           # MmkvStorage (singleton)
    components/       # UI components reutilizáveis sem lógica de negócio
  modules/
    <modulo>/
      types/          # tipos do módulo (*.types.ts)
      services/       # chamadas de API e integrações externas (*.service.ts)
      store/          # zustand store (*.store.ts)
      hooks/          # hooks que combinam store + query + services (use*.ts)
      components/     # componentes específicos do módulo
app/                  # rotas Expo Router (apenas layouts e index files que exportam screens)
```

**Regra:** `app/` só pode importar de `src/modules/<modulo>/hooks` e `src/shared/`.
Nunca importar services ou stores diretamente em `app/`.

---

## Regras de Telas (Screens)

- Toda página em `app/` deve ter seu conteúdo lógico em um arquivo `[name].screens.tsx` no mesmo diretório.
- O arquivo `index.tsx` do diretório da rota deve apenas exportar o screen como default.
- Estilos devem estar sempre em `styles.ts`.

Exemplo de estrutura:
```
app/(app)/home/
  index.tsx           # export { default } from './home.screens';
  home.screens.tsx    # implementação da tela
  styles.ts           # estilos da tela
```

---

## Internacionalização e Textos (Locales)

- NUNCA usar strings literais diretamente nos componentes/telas.
- Todos os textos devem ser extraídos para arquivos de locale em `src/shared/locales/`.
- Usar o sistema de tradução do projeto para acessar os textos.

---

## Constantes e Valores Mágicos

- NUNCA usar strings ou números "jogados" (magic values).
- Valores fixos devem ser exportados como constantes em arquivos dedicados (ex: `constants/*.ts` ou no próprio módulo).

---

## Loading Global

- O projeto possui um sistema de loading global gerenciado via estado (Zustand).
- Utilizar o hook `useLoading` para disparar ou ocultar o loading em processos assíncronos que bloqueiam a tela.

---

## Nomenclatura de Tipos

### Funções/hooks com mais de 1 parâmetro: usar tipos nomeados

```typescript
// ✅ correto
type SendMessageParams = {
  roomId: string;
  content: string;
  attachments?: Attachment[];
};
type SendMessageResult = {
  messageId: string;
  sentAt: string;
};
async function sendMessage(params: SendMessageParams): Promise<SendMessageResult> { ... }

// ❌ errado — parâmetros inline
async function sendMessage(roomId: string, content: string, attachments?: Attachment[]) { ... }
```

### Padrão de nomenclatura
| Artefato | Padrão | Exemplo |
|---|---|---|
| Tipo de params | `NomeFuncaoParams` | `FetchChatParams` |
| Tipo de retorno | `NomeFuncaoResult` | `FetchChatResult` |
| Tipo de store state | `NomeStore` | `ChatStore` |
| Tipo de API response | `NomeResponse` | `ChatResponse` |
| Tipo de request body | `NomeRequest` | `SendMessageRequest` |
| Props de componente | `NomeComponentProps` | `ProviderCardProps` |

---

## Camadas e Responsabilidades

### `types/` — somente tipos, sem lógica
```typescript
// src/modules/chat/types/chat.types.ts
export type Message = { id: string; content: string; sentAt: string };
export type FetchMessagesParams = { roomId: string; page: number };
export type FetchMessagesResult = { messages: Message[]; total: number };
```

### `services/` — acesso a dados, sem estado
```typescript
// src/modules/chat/services/chat.service.ts
import type { FetchMessagesParams, FetchMessagesResult } from '../types/chat.types';

export async function fetchMessages(params: FetchMessagesParams): Promise<FetchMessagesResult> { ... }
```

### `store/` — estado global com Zustand
```typescript
// src/modules/chat/store/chat.store.ts
import { create } from 'zustand';
import type { ChatStore } from '../types/chat.types';

export const useChatStore = create<ChatStore>(() => ({ ... }));
```

### `hooks/` — orquestração (query + store + service)
```typescript
// src/modules/chat/hooks/useChat.ts
// Único ponto que os componentes e pages importam
export function useChat(params: UseChatParams): UseChatResult { ... }
```

### `components/` — UI pura, recebe dados via props
Sem chamadas de API ou acesso direto ao store.

---

## Arquivos de Tipos

Cada módulo tem seus próprios tipos em `types/*.types.ts`.
Tipos compartilhados entre módulos vão em `src/shared/types/`.

```
modules/chat/types/
  chat.types.ts         # entidades do domínio
  chat.api.types.ts     # formatos de request/response da API
```

---

## Providers (`shared/providers/`)

Providers são infraestrutura transversal: cache, analytics, logger, feature flags, etc.

**Regras:**
- Todo provider vive em `src/shared/providers/<nome>/`
- Cada provider tem sua interface em `<nome>.types.ts` e re-export em `index.ts`
- Implementações concretas ficam em `implementations/`
- **Todo provider é singleton** — usar o padrão `static getInstance()`

```
shared/providers/
  cache/
    cache.types.ts          # interface CacheProvider { get, set, remove, clear }
    index.ts                # export público
    implementations/
      mmkv-storage.ts       # class MmkvStorage (singleton)
  analytics/                # (futuro)
    analytics.types.ts
    implementations/
  logger/                   # (futuro)
    logger.types.ts
    implementations/
```

**Padrão singleton obrigatório:**
```typescript
class MeuProvider implements MeuProviderInterface {
  private static instance: MeuProvider;

  private constructor() { /* setup */ }

  static getInstance(): MeuProvider {
    if (!MeuProvider.instance) MeuProvider.instance = new MeuProvider();
    return MeuProvider.instance;
  }
}

export const meuProvider = MeuProvider.getInstance();
```

Importar sempre pelo index do provider, nunca pela implementação diretamente:
```typescript
// ✅
import { mmkvStorage } from '@/shared/providers/cache';
// ❌
import { mmkvStorage } from '@/shared/providers/cache/implementations/mmkv-storage';
```

---

## Design System

Sempre importar cores e tema de `@/shared/constants`:
```typescript
import { colors, theme } from '@/shared/constants';
```

Nunca usar hex/valores mágicos no código. Usar as classes Tailwind ou `colors.*` / `theme.*`.

Paleta principal:
- **Primary**: `#1A45E8` (azul royal — background do logo)
- **Accent green**: `#22C55E` (checkmark)
- **Accent yellow**: `#F5A623` (exclamação)
- **Background**: `#F8FAFC`
- **Text primary**: `#0F172A`

---

## Regras Gerais

- TypeScript strict — sem `any`, sem type assertions desnecessárias
- Sem comentários que explicam o que o código faz — só o porquê quando não-óbvio
- Sem features para requisitos hipotéticos futuros
- Validação só em boundaries: input do usuário, respostas de API externa
- Sem error handling para cenários que não podem acontecer
- Preferir composição a herança
- Hooks retornam objetos nomeados, nunca arrays (exceto `useState`)

---

## Imports

Usar path alias `@/` mapeado para `src/`:
```typescript
import { colors } from '@/shared/constants';
import { useChat } from '@/modules/chat/hooks/useChat';
```

Nunca import relativo que suba mais de 2 níveis (`../../..`).
