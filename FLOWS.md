# Rastreamento de Fluxos — Cobertura do Banco

Cada item representa um fluxo funcional do app e as tabelas do banco que ele atinge.
Marque `[x]` quando o fluxo estiver implementado de ponta a ponta (app → BFF → API → banco).

---

## ✅ Fluxos Implementados

### Auth
- [x] **Login** → `users`
- [x] **Logout** → (revoga token Keycloak)
- [x] **Esqueci a senha** → `users`, `verification_codes`
- [x] **Conta bloqueada / auto-desbloqueio** → `account_blocks` ← `blocked-account.screen`

### Onboarding — Usuário
- [x] **Cadastro** → `users`, `emails`, `user_emails`, `phones`, `user_phones`, `verification_codes`
- [x] **Endereço** → `addresses`, `user_addresses`
- [x] **Verificação de email + telefone** → `verification_codes`, `user_emails`, `user_phones`
- [x] **Aceite de termos** → `terms_versions`, `terms_acceptances`
- [x] **Upload de documento pessoal** → `documents`, `user_documents`

### Onboarding — Provider (fluxo `/(auth)/provider-profile/`)
- [x] **Seleção de categorias** → `categories` ← `categories.screen`
- [x] **Seleção de serviços** → `services`, `provider_services` ← `services.screen`
- [x] **Configurar disponibilidade** → `provider_availability` ← `availability.screen`
- [x] **Revisão e confirmação** → `provider_profiles` ← `review.screen`

### Account — Usuário
- [x] **Editar nome** → `users` ← `profile-edit.screen`
- [x] **Alterar email** → `emails`, `user_emails`, `verification_codes` ← `contact-change.screen`
- [x] **Alterar telefone** → `phones`, `user_phones`, `verification_codes` ← `contact-change.screen`
- [x] **Gerenciar endereços** → `addresses`, `user_addresses` ← `address-list / address-change.screen`
- [x] **Gerenciar documentos pessoais** → `documents`, `user_documents` ← `document-list / document-change.screen`

### Account — Provider (quando `user.type === 'provider'`)
- [x] **Gerenciar serviços** → `provider_services`, `services`, `categories` ← `provider-services.screen`
- [x] **Gerenciar disponibilidade** → `provider_availability` ← `provider-availability.screen`
- [x] **Gerenciar formas de pagamento** → `provider_payment_methods`, `payment_method_types` ← `provider-payment-methods.screen`

### Dashboard
- [x] **Dashboard do contratante** → `service_requests`
- [x] **Dashboard do provider** → `service_requests`, `provider_profiles`

### Busca e Perfil de Provider
- [x] **Buscar providers** → `provider_profiles`, `provider_services`, `services`, `categories`, `provider_work_locations` (leitura)
- [x] **Ver perfil completo do provider** → `provider_profiles`, `provider_services`, `provider_work_locations`, `reviews` (leitura)

### Solicitações de Serviço
- [x] **Criar solicitação** → `service_requests`, `payment_method_types`
- [x] **Listar solicitações** → `service_requests`
- [x] **Calendário de solicitações** → `service_requests` ← `schedule.screen`
- [x] **Aceitar / Rejeitar / Completar / Cancelar** → `service_requests`

### Avaliações
- [x] **Avaliar provider após conclusão** → `reviews` ← `review.screen`
- [x] **Ver avaliações no perfil** → `reviews` (leitura)

### Notificações
- [x] **Listar notificações** → `notifications` (MongoDB via worker)
- [x] **Marcar como lida / todas lidas** → `notifications`
- [x] **Registrar token FCM** → `user_device_tokens`

### Empresa
- [x] **Criar empresa** (wizard: dados, endereço, horários, revisão) → `companies`, `company_addresses`, `company_emails`, `company_phones`, `company_business_hours` ← `create-company.screen`

### Chat
- [x] **Salas e mensagens** → MongoDB (fora do PostgreSQL)

---

## 🔲 Fluxos Pendentes

### Provider — Perfil Próprio
- [ ] **Editar bio / nome comercial / avatar** → `provider_profiles` (`businessName`, `description`, `avatarUrl`)
  - BFF: falta `PUT /auth/providers/me/profile`
  - App: tela de edição existe (`profile-edit.screen`) mas só edita `users.name` — falta seção provider
- [ ] **Gerenciar localizações de atendimento** → `provider_work_locations`
  - `provider_work_locations` é lido via busca/perfil mas sem CRUD no app
  - BFF: falta CRUD `/auth/providers/me/work-locations`
  - App: falta tela (candidato: expandir `profile-edit` ou nova tela)
- [ ] **Gerenciar documentos do provider** → `provider_documents`
  - Diferente de `user_documents` — são os docs de verificação do prestador
  - BFF: falta CRUD `/auth/providers/me/documents`
  - App: falta tela
- [ ] **Solicitar / acompanhar verificação de cadastro** → `provider_verifications`
  - BFF: falta `POST /auth/providers/me/verification` + `GET` de status
  - App: falta tela de status de verificação

### Provider — Contatos Próprios
- [ ] **Gerenciar emails do provider** → `provider_emails`
  - Atualmente só lidos no perfil via GET
  - BFF: falta CRUD `/auth/providers/me/emails`
- [ ] **Gerenciar telefones do provider** → `provider_phones`
  - Atualmente só lidos no perfil via GET
  - BFF: falta CRUD `/auth/providers/me/phones`

### Empresa — Pós-Criação
- [ ] **Adicionar membros à empresa** → `company_members`
  - BFF: endpoint existe (`/companies/:id/members`) mas sem tela no app
- [ ] **Vincular providers à empresa** → `company_providers`
  - BFF: endpoint existe (`/companies/:id/providers`) mas sem tela no app

---

## Tabelas sem fluxo previsto no app mobile

| Tabela | Motivo |
|--------|--------|
| `provider_verification_logs` | Auditoria interna — painel admin |
| `migrations` | Controle interno do TypeORM |

---

## Resumo de Cobertura

| Categoria | Tabelas | Cobertas | Pendentes |
|-----------|---------|----------|-----------|
| Usuário / Auth | 10 | 10 | 0 |
| Provider | 10 | 5 | 5 |
| Negócio (requests, reviews) | 4 | 4 | 0 |
| Empresa | 6 | 5 | 1 (`company_members` via tela, `company_providers` sem tela) |
| Infra (account_blocks, tokens) | 3 | 3 | 0 |
| **Total** | **35** | **27** | **8** |

> `provider_verification_logs` e `migrations` excluídas por serem tabelas de sistema.
