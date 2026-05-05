# User Registration — Tasks v2

**Feature:** `FEAT-REG-001`  
**Total estimado:** ~27 tarefas atômicas

---

## Fase 1: Keycloak Realm (Infra)

### T1.1 — Ativar verificação de email

**Arquivo:** `kubernetes/keycloak/keycloak.realm-configmap.yaml`  
**Alteração:** `"verifyEmail": false` → `"verifyEmail": true`  
**Verificação:** Campo `verifyEmail: true` no realm JSON

### T1.2 — Configurar SMTP no realm

**Arquivo:** `kubernetes/keycloak/keycloak.realm-configmap.yaml`  
**Alteração:** Adicionar bloco `smtpServer` com host, port, from, auth  
**Verificação:** SMTP block presente e válido

---

## Fase 2: BFF — Keycloak Admin Service

### T2.1 — Criar `keycloak-admin.types.ts`

**Arquivo:** `domestic-backend-bff/src/modules/auth/keycloak-admin.types.ts`  
**Conteúdo:** `GetAdminTokenResult`, `CreateKeycloakUserParams`, `CreateKeycloakUserResult`, `KeycloakRole`, `KeycloakAdminInterface`  
**Verificação:** Tipos compilam

### T2.2 — Criar `keycloak-admin.service.ts`

**Arquivo:** `domestic-backend-bff/src/modules/auth/keycloak-admin.service.ts`  
**Conteúdo:** Objeto com: `getAdminToken()`, `createUser()`, `findUserByEmail()`, `assignRealmRole()`, `deleteUser()`, `executeActionsEmailByEmail()`  
**Verificação:** `npm run test:unit` passa

### T2.3 — Criar `auth.constants.ts`

**Arquivo:** `domestic-backend-bff/src/modules/auth/auth.constants.ts`  
**Conteúdo:** Endpoints Keycloak, timeouts, error codes  
**Verificação:** Constantes exportáveis

### T2.4 — Criar `auth.token.ts`

**Arquivo:** `domestic-backend-bff/src/modules/auth/auth.token.ts`  
**Conteúdo:** `AUTH_SERVICE`, `KEYCLOAK_ADMIN_SERVICE` tokens  
**Verificação:** Sem erro de dependência circular

---

## Fase 3: BFF — Auth Module

### T3.1 — Criar DTOs

**Arquivos:** `domestic-backend-bff/src/modules/auth/dtos/register-request.dto.ts`, `forgot-password-request.dto.ts`  
**Conteúdo:** class-validator decorators  
**Verificação:** Validação rejeita payloads inválidos

### T3.2 — Criar `auth.types.ts`

**Arquivo:** `domestic-backend-bff/src/modules/auth/auth.types.ts`  
**Conteúdo:** `RegisterResponseDto`, `AuthServiceInterface`  
**Verificação:** Tipos compilam

### T3.3 — Criar `auth.service.ts`

**Arquivo:** `domestic-backend-bff/src/modules/auth/auth.service.ts`  
**Conteúdo:** `register()` com rollback + `forgotPassword()`  
**Verificação:** `npm run test:unit` (mockando ApiClientService + KeycloakAdminService)

### T3.4 — Criar `auth.controller.ts`

**Arquivo:** `domestic-backend-bff/src/modules/auth/auth.controller.ts`  
**Conteúdo:** `POST /auth/register`, `POST /auth/forgot-password`  
**Verificação:** `npm run test:unit`

### T3.5 — Criar `auth.module.ts`

**Arquivo:** `domestic-backend-bff/src/modules/auth/auth.module.ts`  
**Conteúdo:** NestJS module com controller + providers  
**Verificação:** Módulo importável

### T3.6 — Registrar AuthModule

**Arquivo:** `domestic-backend-bff/src/app.module.ts`  
**Alteração:** Adicionar `AuthModule` aos imports  
**Verificação:** `npm run start:dev` sobe

### T3.7 — Adicionar env vars

**Arquivos:** `domestic-backend-bff/.env.example`, `.env.dev.local`  
**Conteúdo:** `KEYCLOAK_BASE_URL`, `KEYCLOAK_CLIENT_SECRET`, `KEYCLOAK_ADMIN_TIMEOUT_MS`

---

## Fase 4: Kong API Gateway

### T4.1 — Habilitar BFF + rota auth

**Arquivo:** `domestic-backend-api/kong/kong.yml`  
**Alterações:**

- Descomentar serviço `bff` (corrigir porta para `3001`)
- Adicionar rota `bff-auth` (`/auth`, strip_path: false)
- Rate limiting 5 req/min, CORS

### T4.2 — Sincronizar ConfigMap k8s

**Arquivo:** `kubernetes/kong/` (se houver cópia separada)

---

## Fase 5: Mobile — Infra (constantes, types, locales)

### T5.1 — Atualizar `auth.constants.ts`

**Arquivo:** `cawme/src/modules/auth/auth.constants.ts`  
**Alteração:** Adicionar `REGISTER: "/auth/register"` ao `AUTH_ENDPOINTS`

### T5.2 — Atualizar `locales.ts`

**Arquivo:** `cawme/src/modules/auth/locales.ts`  
**Strings a adicionar:**

```
welcome.slide1.headline, welcome.slide1.description,
welcome.slide2.headline, welcome.slide2.description,
welcome.slide3.headline, welcome.slide3.description,
welcome.hireService, welcome.offerService, welcome.alreadyHaveAccount,
register.title, register.toggleClient, register.toggleProvider,
register.fullNamePlaceholder, register.emailPlaceholder,
register.passwordPlaceholder, register.passwordConfirmationPlaceholder,
register.advanceButton, register.passwordMismatch,
register.fullNameRequired, register.emailRequired, register.emailInvalid,
register.passwordRequired, register.passwordMinLength,
terms.title, terms.acceptCheckbox, terms.finalizeButton,
terms.termsLink, terms.privacyLink,
success.title, success.description, success.goToLogin
```

**Verificação:** `npm run check-locales` passa

### T5.3 — Atualizar `services/types.ts`

**Arquivo:** `cawme/src/modules/auth/services/types.ts`  
**Adicionar:** `RegisterServiceParams`, `RegisterServiceResult`

### T5.4 — Adicionar `KeycloakService.register()`

**Arquivo:** `cawme/src/modules/auth/services/keycloak.service.ts`  
**Conteúdo:** POST `/auth/register` com JSON body. Sem armazenar tokens (não é auto-login).

---

## Fase 6: Mobile — Welcome Screen

### T6.1 — Criar `WelcomeSlides` component

**Arquivos:** `cawme/src/modules/auth/components/WelcomeSlides/`

- `WelcomeSlides.component.tsx` — named export `React.FC<WelcomeSlidesProps>`
- `types.ts` — `SlideData`, `WelcomeSlidesProps`
- `styles.ts` — named export, todas medidas via scale/verticalScale/moderateScale
- `index.ts`
- FlatList horizontal pagingEnabled + dots animados (reanimated)
- 3 slides estáticos (placeholder até termos assets visuais)
  **Verificação:** Slides navegam com swipe, dots animam

### T6.2 — Criar `WelcomeActions` component

**Arquivos:** `cawme/src/modules/auth/components/WelcomeActions/`

- 3 botões: primary (contratar), outline (prestar serviço), link (já tenho conta)
- Animações FadeInUp com stagger
  **Verificação:** Botões renderizam e disparam callbacks

### T6.3 — Criar `welcome.screen.tsx`

**Arquivos:** `cawme/src/modules/auth/screens/welcome/`

- `welcome.screen.tsx` — default export
- `styles.ts` — default export
- `types.ts` — `WelcomeScreenParams`
- `index.ts` — re-export default  
  **Implementação:** Compõe WelcomeSlides + WelcomeActions  
  **Navegação:**
- onHireService → `router.push({ pathname: "/register", params: { userType: "contractor" } })`
- onOfferService → `router.push({ pathname: "/register", params: { userType: "provider" } })`
- onAlreadyHaveAccount → `router.push("/login")`

### T6.4 — Atualizar rota `app/(auth)/index.tsx`

**Arquivo:** `cawme/app/(auth)/index.tsx`  
**Mudança:** Apontar para WelcomeScreen em vez de LoginScreen

### T6.5 — Criar rota `app/(auth)/login.tsx`

**Arquivo:** `cawme/app/(auth)/login.tsx`  
**Conteúdo:** `export { default } from "@/modules/auth/screens/login"`  
**Motivo:** LoginScreen era o index, agora index é Welcome

### T6.6 — Atualizar `app/(auth)/_layout.tsx`

**Arquivo:** `cawme/app/(auth)/_layout.tsx`  
**Adicionar:** Rotas `login`, `terms`, screens existentes

---

## Fase 7: Mobile — Register Screen (Redesign)

### T7.1 — Criar `UserTypeToggle` component

**Arquivos:** `cawme/src/modules/auth/components/UserTypeToggle/`

- Animação de pill deslizante com `useAnimatedStyle` + `withSpring`
- Estilo: container com `theme.colors.background.elevated` de fundo, pill com `theme.colors.primary.DEFAULT`
  **Verificação:** Toggle anima ao trocar, pre-seleciona corretamente

### T7.2 — Criar `RegisterForm` component

**Arquivos:** `cawme/src/modules/auth/components/RegisterForm/`

- 4 campos: fullName, email, password, passwordConfirmation
- Sem campo userType (está no toggle)
- Sem checkbox termos (está na TermsScreen)
- Botão "Avançar" → `onSubmit()`
- Validação Zod inline
  **Verificação:** Validações funcionam, erros exibidos

### T7.3 — Criar `register.screen.tsx` (substituir stub)

**Arquivos:** `cawme/src/modules/auth/screens/register/`

- Lê `userType` de `useLocalSearchParams()` para pré-selecionar toggle
- Hero + card (mesmo padrão LoginScreen)
- UserTypeToggle no topo do card
- RegisterForm abaixo
- `onSubmit` → navega para TermsScreen passando todos os dados
  **Verificação:** Fluxo Register → Terms funciona

---

## Fase 8: Mobile — Terms Screen

### T8.1 — Criar `TermsContent` component

**Arquivos:** `cawme/src/modules/auth/components/TermsContent/`

- ScrollView com texto placeholder dos termos
- Checkbox customizado + texto com links
- Botão "Finalizar cadastro" (disabled até aceitar)
  **Verificação:** Botão habilita/desabilita com checkbox

### T8.2 — Criar `terms.screen.tsx`

**Arquivos:** `cawme/src/modules/auth/screens/terms/`

- Recebe dados do form + userType via `useLocalSearchParams()`
- Usa `useRegister()` hook no submit
- Gerencia estado: form → loading → success/error
- Sucesso: mostra inline RegisterSuccess ou navega
  **Verificação:** Fluxo completo Terms → submit → sucesso/erro

### T8.3 — Criar `RegisterSuccess` component

**Arquivos:** `cawme/src/modules/auth/components/RegisterSuccess/`

- Ícone envelope, título, descrição, botão "Ir para login"
- Exibido inline na TermsScreen após sucesso (evita rota extra)

---

## Fase 9: Mobile — Guest Mode Home

### T9.1 — Expandir guest mode

**Arquivos:** `cawme/src/modules/home/`, `cawme/app/(app)/`

- Usuário sem auth pode ver Home/Search completos
- Navegação no app group sem proteção de auth para telas públicas
- Botão "Entrar" no header para redirecionar ao login
  **Verificação:** Guest consegue navegar por serviços sem login

---

## Fase 10: Mobile — Hooks & Índices

### T10.1 — Criar `useRegister()` hook

**Arquivo:** `cawme/src/modules/auth/hooks/useRegister.ts`  
**Conteúdo:** Chama `KeycloakService.register()` com loading state. Não faz auto-login (vai para tela de sucesso).

### T10.2 — Atualizar índices

**Arquivos:** `components/index.ts`, `hooks/index.ts`, `screens/index.ts`  
**Adicionar:** Exports de todos os novos componentes, hooks, screens

### T10.3 — Atualizar `app/(auth)/_layout.tsx`

**Arquivo:** `cawme/app/(auth)/_layout.tsx`  
**Adicionar:** `terms` na Stack

---

## Fase 11: Integração & Verificação

### T11.1 — Teste E2E local

1. Subir stack (API + BFF + Keycloak + Kong + MongoDB + Redis)
2. POST `http://localhost:3001/auth/register` — verificar 201
3. Verificar usuário no Keycloak admin console
4. Verificar email de verificação (Mailhog)
5. Verificar `SELECT * FROM users` no PostgreSQL
6. Testar rollback: simular falha API → Keycloak limpo
7. Testar email duplicado → 409

### T11.2 — Teste mobile integrado

1. `EXPO_PUBLIC_BFF_URL` → ambiente local
2. Abrir app → Welcome screen
3. "Quero contratar" → Register (toggle = contractor)
4. Preencher form → Avançar → Terms
5. Aceitar termos → Finalizar → Sucesso
6. "Ir para login" → Login screen
7. Login com credenciais criadas (após verificar email)
8. Guest mode: "Entrar sem login" → Home → navegar serviços
