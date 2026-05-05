# User Registration — Feature Specification v2

## Feature ID

`FEAT-REG-001` — Registro de Usuário via Mobile App

## Status

**Specify** ✅ → **Design** ✅ → **Tasks** ✅ → **Execute** (pronto)

---

## Visão Geral

Fluxo completo de onboarding + registro + guest mode:

```
Welcome (slides onboarding)
  ├── "Quero contratar" ──→ Register (toggle = contractor) ──→ Terms ──→ Sucesso
  ├── "Quero cadastrar meu serviço" ──→ Register (toggle = provider) ──→ Terms ──→ Sucesso
  └── "Já tenho conta" ──→ Login (existente)

Guest mode: Home browse sem login (já encaminhado via "Entrar sem login" no Login)
```

### Sistemas envolvidos

```
Mobile App (cawme)
    │  POST /auth/register
    ▼
Kong API Gateway (porta 8000)
    │  Rota: /auth/register → upstream bff:3001
    ▼
domestic-backend-bff (NestJS, porta 3001)
    │  1. Chama Keycloak Admin API para criar usuário
    │  2. Chama API interna POST /users para criar registro local
    ▼
    ├── Keycloak (8080) — identity provider
    └── domestic-backend-api (3000) — banco PostgreSQL
```

---

## Requisitos Funcionais

### RF-01 — Welcome Screen (Onboarding)

**Prioridade:** P0 (MVP)

Tela exibida ao abrir o app (primeiro acesso). Deve conter:

| Elemento                          | Descrição                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| Slides                            | 3-4 slides com FlatList horizontal + snap. Cada slide: ilustração + headline + descrição |
| Page indicator                    | Dots animados indicando slide atual                                                      |
| CTA "Quero contratar"             | Botão primary, navega para Register com `userType = contractor`                          |
| CTA "Quero cadastrar meu serviço" | Botão outline/secondary, navega para Register com `userType = provider`                  |
| CTA "Já tenho conta"              | Link text, navega para Login                                                             |

Animação: transição suave entre slides com `react-native-reanimated`. Dots com scale/opacity no slide ativo.

### RF-02 — Register Screen (Redesign)

**Prioridade:** P0 (MVP)

Tela de cadastro com toggle de tipo no topo:

| Elemento                  | Descrição                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| Toggle Cliente\|Prestador | Switch animado no header da tela. Pre-selecionado conforme CTA da Welcome |
| Campo nome completo       | TextInput com ícone person-outline                                        |
| Campo email               | TextInput com keyboardType email, autoCapitalize none                     |
| Campo senha               | TextInput com secureTextEntry + toggle visibilidade                       |
| Campo confirmar senha     | TextInput com secureTextEntry                                             |
| Botão "Avançar"           | Navega para TermsScreen passando os dados do form                         |

Validação (Zod): nome (min 3), email (formato), senha (min 8), confirmar senha (match).

**Padrão visual:** Segue o mesmo layout hero + card da LoginScreen para consistência. Hero adaptado com cor secundária para diferenciar de login.

### RF-03 — Terms Screen (Confirmação)

**Prioridade:** P0 (MVP)

Tela de aceite de termos antes de finalizar cadastro:

| Elemento                   | Descrição                                                               |
| -------------------------- | ----------------------------------------------------------------------- |
| Header                     | Título "Termos de Uso" com botão voltar                                 |
| Conteúdo                   | Texto dos termos em ScrollView (placeholder por enquanto)               |
| Checkbox                   | "Aceito os Termos de Uso e Política de Privacidade" com links clicáveis |
| Botão "Finalizar cadastro" | Disabled até checkbox marcado. Dispara o registro.                      |

### RF-04 — Serviço de Registro no BFF

**Prioridade:** P0 (MVP)

O BFF deve expor `POST /auth/register` que:

1. Recebe `{ fullName, email, password, userType }` no body (JSON)
2. Valida os campos (class-validator)
3. Verifica se o email já existe no Keycloak
4. Chama Keycloak Admin API para criar usuário com `requiredActions: ["VERIFY_EMAIL"]`
5. Atribui realm role (`contractor` ou `provider`)
6. Chama `POST /users` na API interna com `{ fullName, keycloakId }`
7. Retorna 201 ou erro apropriado

### RF-05 — Registro no Keycloak

**Prioridade:** P0 (MVP)

BFF autentica como `domestic-backend-bff` (service account) via client credentials grant. Service account `service-account-domestic-backend-bff` já existe.

### RF-06 — Criação de Usuário Local (API)

**Prioridade:** P0 (MVP)

Endpoint `POST /users` da API já existe. Payload: `{ fullName, keycloakId, status: "PENDING" }`.

### RF-07 — Rota no Kong

**Prioridade:** P0 (MVP)

Serviço BFF habilitado no Kong (`http:/:3001`). Rota `/auth` com rate limiting 5 req/min + CORS.

### RF-08 — Tratamento de Erros

**Prioridade:** P1

| Cenário                | Comportamento                      |
| ---------------------- | ---------------------------------- |
| Email já cadastrado    | 409 Conflict                       |
| Falha Keycloak         | Rollback (nada criado)             |
| Falha API pós-Keycloak | Rollback (deleta usuário Keycloak) |
| Rede indisponível      | Erro genérico mobile               |

### RF-09 — Esqueci Minha Senha (BFF)

**Prioridade:** P1

Endpoint `POST /auth/forgot-password` (documentado no AuthFlow.md, não implementado).

### RF-10 — Guest Mode Home

**Prioridade:** P0 (MVP)

Usuário sem login pode navegar pelo app, visualizar serviços e categorias. Já parcialmente implementado via `continueAsGuest → /(app)/search`. Deve ser expandido para a Home completa em modo visitante.

---

## Requisitos Não-Funcionais

### NFR-01 — Segurança

- Senha nunca logada/armazenada
- Client secret nunca exposto ao mobile (Kong injeta)
- Service account BFF → Keycloak via client credentials (server-side)
- Rate limiting: 5 registros/min/IP no Kong

### NFR-02 — Consistência

- Registro transacional: Keycloak + PostgreSQL, ou rollback completo

### NFR-03 — Performance

- Registro < 3s (p95)
- Timeout Keycloak: 10s, timeout API: 5s

### NFR-04 — Design System

- Todas medidas via `scale()`, `verticalScale()`, `moderateScale()` de `@/shared/utils/scale`
- Todas cores via `theme.colors` / `theme.palette` de `@/shared/constants`
- Nenhum valor mágico (hex, número solto) em StyleSheet
- Animações via `react-native-reanimated` com `FadeIn`, `FadeInUp`, `useAnimatedStyle`
- Profundidade: sombras do `theme.shadows` + overlay/borderRadius para hierarquia visual

### NFR-05 — Observabilidade

- Logs Winston em cada etapa do BFF
- Métricas: registration_attempts_total, registration_duration_seconds

---

## Áreas Cinzentas (Resolvidas)

| ID    | Decisão                                                                           |
| ----- | --------------------------------------------------------------------------------- |
| GA-01 | Tela de sucesso com instruções "Verifique seu email"                              |
| GA-02 | Sim, verificar email (`verifyEmail: true` no realm)                               |
| GA-03 | Toggle Cliente\|Prestador no topo da Register, pré-selecionado via CTA da Welcome |
| GA-04 | Termos em tela separada (TermsScreen) com checkbox + botão finalizar              |
| GA-05 | Service account `domestic-backend-bff` (client credentials)                       |

---

## Dependências

| Sistema  | Componente               | Status                                              |
| -------- | ------------------------ | --------------------------------------------------- |
| Mobile   | `src/modules/auth/`      | ✅ Login, logout, forgot-password. Registro é stub. |
| Mobile   | Welcome/Onboarding       | ❌ Não existe                                       |
| Mobile   | TermsScreen              | ❌ Não existe                                       |
| BFF      | `auth/` module           | ❌ Não existe                                       |
| BFF      | `ApiClientService`       | ✅ Proxy para API interna                           |
| BFF      | Keycloak Admin Client    | ❌ Não existe                                       |
| API      | `POST /users`            | ✅ Já existe                                        |
| Keycloak | Realm `domestic-backend` | ✅ `registrationAllowed: true`                      |
| Kong     | Service `bff`            | ⚠️ Comentado no `kong.yml`                          |

---

## Critérios de Aceitação

1. **AC-01:** Welcome screen exibe slides + 3 CTAs funcionais
2. **AC-02:** Toggle Cliente\|Prestador pré-seleciona corretamente ao vir da Welcome
3. **AC-03:** Register → Terms → Sucesso flui sem perder dados entre telas
4. **AC-04:** Usuário criado no Keycloak + PostgreSQL após submit
5. **AC-05:** Email duplicado retorna 409 com mensagem amigável
6. **AC-06:** Rollback funciona: falha parcial = nada persiste
7. **AC-07:** Rate limiting 5 req/min ativo no Kong
8. **AC-08:** Guest mode permite navegar sem login
9. **AC-09:** Todas as medidas usam scale/verticalScale/moderateScale
10. **AC-10:** Nenhum valor hex ou número mágico em StyleSheet
