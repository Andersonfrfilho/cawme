# Refatoração — Cawme

## Objetivo

Migrar a estrutura flat (`hooks/`, `services/`, `store/`, `types/`, `components/`) para uma
arquitetura modular em camadas, onde cada domínio de negócio é autocontido em `src/modules/<modulo>/`
e o código verdadeiramente compartilhado vive em `src/shared/`.

**Benefícios:**
- Coesão: tudo de um domínio no mesmo lugar
- Boundaries claros: `app/` só importa de hooks e shared
- Escalabilidade: novos módulos seguem o mesmo padrão sem tocar no resto

---

## Status Geral

- [x] Design System (paleta, tema, tailwind)
- [x] Ícone do app
- [x] Estrutura de pastas criada
- [x] CLAUDE.md com regras do projeto
- [x] Migração de arquivos + atualização de imports

---

## 1. Design System

- [x] `src/shared/constants/colors.ts` — paleta extraída do logo (blue, green, yellow, neutral)
- [x] `src/shared/constants/theme.ts` — spacing, radii, tipografia, sombras, métricas, animações
- [x] `src/shared/constants/index.ts` — re-export
- [x] `tailwind.config.js` — NativeWind com paleta completa

## 2. Ícone do App

- [x] `assets/images/icon.png` — substituído pelo logo Cawme
- [x] `assets/images/adaptive-icon.png` — substituído pelo logo Cawme
- [x] `app.config.ts` — `backgroundColor` do adaptive icon Android → `#1A45E8`

## 3. Estrutura de Pastas

- [x] `src/shared/{constants,types,utils,hooks,components}/`
- [x] `src/modules/auth/{types,services,store,hooks}/`
- [x] `src/modules/chat/{types,services,store,hooks,components}/`
- [x] `src/modules/home/{types,services,hooks,components}/`
- [x] `src/modules/dashboard/{types,services,hooks}/`
- [x] `src/modules/search/{types,services,hooks}/`
- [x] `src/modules/notifications/{types,services,store,hooks}/`
- [x] `src/modules/provider-profile/{types,services,hooks}/`
- [x] `src/modules/app-config/{types,services,store,hooks}/`
- [x] `src/modules/sdui/{types,components}/`

## 4. Regras do Projeto

- [x] `CLAUDE.md` — arquitetura, convenção `NomeFuncaoParams`/`NomeFuncaoResult`, camadas, imports

---

## 5. Migração de Arquivos

### 5.1 Shared Utils

- [x] `src/utils/mmkv-storage.ts` → `src/shared/providers/cache/implementations/mmkv-storage.ts` (singleton)
- [x] `src/utils/sdui-action.ts` → `src/shared/utils/sdui-action.ts`

### 5.2 Shared Services (infraestrutura)

- [x] `src/services/api/api-client.ts` → `src/shared/services/api-client.ts`

### 5.3 Tipos BFF → Módulos

- [x] `src/types/bff/chat.types.ts` → `src/modules/chat/types/chat.types.ts`
- [x] `src/types/bff/dashboard.types.ts` → `src/modules/dashboard/types/dashboard.types.ts`
- [x] `src/types/bff/sdui.types.ts` → `src/modules/sdui/types/sdui.types.ts`
- [x] `src/types/bff/search.types.ts` → `src/modules/search/types/search.types.ts`
- [x] `src/types/bff/provider-profile.types.ts` → `src/modules/provider-profile/types/provider-profile.types.ts`
- [x] `src/types/bff/app-config.types.ts` → `src/modules/app-config/types/app-config.types.ts`
- [x] `src/types/bff/notification.types.ts` → `src/modules/notifications/types/notification.types.ts`

### 5.4 Services Auth → `modules/auth`

- [x] `src/services/auth/auth.types.ts` → `src/modules/auth/types/auth.types.ts`
- [x] `src/services/auth/keycloak.service.ts` → `src/modules/auth/services/keycloak.service.ts`
- [x] `src/services/auth/token.service.ts` → `src/modules/auth/services/token.service.ts`

### 5.5 Services API → Módulos

- [x] `src/services/api/chat.service.ts` → `src/modules/chat/services/chat.service.ts`
- [x] `src/services/api/dashboard.service.ts` → `src/modules/dashboard/services/dashboard.service.ts`
- [x] `src/services/api/home.service.ts` → `src/modules/home/services/home.service.ts`
- [x] `src/services/api/notification.service.ts` → `src/modules/notifications/services/notification.service.ts`
- [x] `src/services/api/search.service.ts` → `src/modules/search/services/search.service.ts`
- [x] `src/services/api/app-config.service.ts` → `src/modules/app-config/services/app-config.service.ts`
- [x] `src/services/api/provider-profile.service.ts` → `src/modules/provider-profile/services/provider-profile.service.ts`
- [x] `src/services/websocket/chat-socket.service.ts` → `src/modules/chat/services/chat-socket.service.ts`

### 5.6 Stores → Módulos

- [x] `src/store/auth.store.ts` → `src/modules/auth/store/auth.store.ts`
- [x] `src/store/chat.store.ts` → `src/modules/chat/store/chat.store.ts`
- [x] `src/store/notification.store.ts` → `src/modules/notifications/store/notification.store.ts`
- [x] `src/store/app-config.store.ts` → `src/modules/app-config/store/app-config.store.ts`

### 5.7 Hooks → Módulos

- [x] `src/hooks/useChat.ts` → `src/modules/chat/hooks/useChat.ts`
- [x] `src/hooks/useDashboard.ts` → `src/modules/dashboard/hooks/useDashboard.ts`
- [x] `src/hooks/useHome.ts` → `src/modules/home/hooks/useHome.ts`
- [x] `src/hooks/useNotifications.ts` → `src/modules/notifications/hooks/useNotifications.ts`
- [x] `src/hooks/useProviderProfile.ts` → `src/modules/provider-profile/hooks/useProviderProfile.ts`
- [x] `src/hooks/useSearch.ts` → `src/modules/search/hooks/useSearch.ts`

### 5.8 Components SDUI → `modules/sdui`

- [x] `src/components/sdui/BannerCarousel.tsx` → `src/modules/sdui/components/BannerCarousel.tsx`
- [x] `src/components/sdui/CategoryGrid.tsx` → `src/modules/sdui/components/CategoryGrid.tsx`
- [x] `src/components/sdui/CategoryList.tsx` → `src/modules/sdui/components/CategoryList.tsx`
- [x] `src/components/sdui/EmptyState.tsx` → `src/modules/sdui/components/EmptyState.tsx`
- [x] `src/components/sdui/PromoBanner.tsx` → `src/modules/sdui/components/PromoBanner.tsx`
- [x] `src/components/sdui/ProviderGrid.tsx` → `src/modules/sdui/components/ProviderGrid.tsx`
- [x] `src/components/sdui/ProviderList.tsx` → `src/modules/sdui/components/ProviderList.tsx`
- [x] `src/components/sdui/SduiRenderer.tsx` → `src/modules/sdui/components/SduiRenderer.tsx`
- [x] `src/components/sdui/SearchBar.tsx` → `src/modules/sdui/components/SearchBar.tsx`
- [x] `src/components/sdui/SearchFilters.tsx` → `src/modules/sdui/components/SearchFilters.tsx`
- [x] `src/components/sdui/SectionHeader.tsx` → `src/modules/sdui/components/SectionHeader.tsx`

### 5.9 Limpeza (após migração e imports atualizados)

- [x] Remover `src/hooks/` (vazio)
- [x] Remover `src/services/` (vazio)
- [x] Remover `src/store/` (vazio)
- [x] Remover `src/types/` (vazio)
- [x] Remover `src/components/` (vazio)
- [x] Remover `src/utils/` (vazio)

---

## 6. Atualização de Imports (após migração)

- [x] Atualizar imports em `app/**/*.tsx` após mover hooks e stores
- [x] Atualizar imports cruzados entre módulos (services importando types, etc.)
- [x] Verificar compilação TypeScript — 0 erros de refatoração (4 erros pré-existentes não relacionados: `ExpoImage`, `.badge`, `MMKV`)

---

## Erros Pré-existentes (fora do escopo da refatoração)

- `app/(app)/chat/index.tsx:4` — `ExpoImage` não exportado por `expo-image`
- `app/(app)/providers/[id]/profile.tsx:5` — mesmo erro de `ExpoImage`
- `app/(app)/_layout.tsx:41` — propriedade `.badge` não tipada no objeto de tab
- `src/shared/providers/cache/implementations/mmkv-storage.ts` — `MMKV` e `.delete` com erro de tipo (versão/typings do pacote)
