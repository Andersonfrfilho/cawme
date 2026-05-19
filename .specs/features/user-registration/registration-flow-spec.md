# Spec: Fluxo de Cadastro e Verificação — Mobile

> Baseado em: `/domestic-backend-api/docs/FLUXO_CADASTRO_MOBILE.md`
> Data: 2026-05-08
> Status: Em implementação

---

## 1. Visão Geral

O fluxo de cadastro do Cawme foi reestruturado para seguir o contrato do backend. As mudanças principais são:

1. **Fluxo invertido**: Termos vêm ANTES da criação da conta
2. **Verificação pós-cadastro**: Email/SMS são verificados DEPOIS de criar a conta
3. **Pular verificação**: Usuário pode acessar o app com conta `PENDING`
4. **Login com checagem**: Ao logar, verifica status e redireciona se pendente
5. **Documento**: Backend detecta tipo (CPF/CNPJ) automaticamente pelo tamanho
6. **Feature flags**: `DOCUMENT_PHOTO_VERIFICATION` controla upload de documento

---

## 2. Fluxo Principal (Happy Path)

```
┌─────────────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────┐
│ 1. RegisterForm │ ──▶ │ 2. Terms    │ ──▶ │ 3. Criar     │ ──▶ │ 4. Verification  │ ──▶ │ 5. Home  │
│   (dados)       │     │  (aceite)   │     │    Conta     │     │  (email + SMS)   │     │          │
└─────────────────┘     └─────────────┘     └──────────────┘     └──────────────────┘     └──────────┘
                                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │ Auto-login   │
                                              │ + Token      │
                                              └──────────────┘
```

---

## 3. Fluxo Alternativo: Pular Verificação

```
┌─────────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────┐
│ 1. RegisterForm │ ──▶ │ 2. Terms    │ ──▶ │ 3. Criar     │ ──▶ │ 4. Verification │ ──▶ │ 5. Home  │
│   (dados)       │     │  (aceite)   │     │    Conta     │     │ "Verificar      │     │          │
└─────────────────┘     └─────────────┘     └──────────────┘     │   depois"       │     └──────────┘
                                                                  └─────────────────┘
```

**Consequência:** Ao fazer login futuro, o sistema detecta `PENDING` e redireciona para `VerificationScreen`.

---

## 4. Fluxo Alternativo: Conflito de Cadastro (Conta Bloqueada)

```
┌─────────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ 1. RegisterForm │ ──▶ │ 2. Terms    │ ──▶ │ 3. Criar     │ ──▶ │ 4. Verification │
│   (dados)       │     │  (aceite)   │     │    Conta     │     │                 │
└─────────────────┘     └─────────────┘     └──────────────┘     └─────────────────┘
                                                                          │
                                                                          ▼
                                                              ┌─────────────────────┐
                                                              │ Erro: email/phone   │
                                                              │ já verificado por   │
                                                              │ outra conta         │
                                                              └─────────────────────┘
                                                                          │
                                                                          ▼
                                                              ┌─────────────────────┐
                                                              │ Tela: Conta         │
                                                              │ Bloqueada           │
                                                              │ "Entre em contato   │
                                                              │  com o suporte"     │
                                                              └─────────────────────┘
```

---

## 5. Requisitos por Tela

### 5.1 RegisterForm (Tela de Cadastro)

**Campos:**
| Campo | Tipo | Validação | API Verification |
|---|---|---|---|
| firstName | string | min 3 chars | — |
| lastName | string | min 3 chars | — |
| email | string | email format | `POST /bff/onboarding/verify/email` |
| phone | string | min 10 dígitos | `POST /bff/onboarding/verify/phone` |
| document | string | CPF/CNPJ/RG/Passport* | `POST /bff/onboarding/verify/document` |
| password | string | min 8 chars | — |
| passwordConfirmation | string | match password | — |

> \* O backend detecta tipo automaticamente pelo tamanho: 11 dígitos = CPF, 14 dígitos = CNPJ

**Ação ao submeter:**
- Valida todos os campos localmente
- Verifica disponibilidade de email/phone/document
- Navega para `/terms` com todos os dados

**Navegação:**
```typescript
router.push({
  pathname: "/terms",
  params: { firstName, lastName, email, phone, document, documentType, password }
});
```

---

### 5.2 TermsScreen (Tela de Termos)

**Comportamento:**
- Mostra resumo dos dados preenchidos
- Checkbox obrigatório: "Aceito os Termos de Uso e Política de Privacidade"
- Botão "Finalizar Cadastro" (desabilitado até aceitar)

**Ação ao submeter:**
```typescript
// 1. Cria conta
await register({
  email,
  password,
  firstName,
  lastName,
  phone: digitsOnly,
  cpf: documentDigitsOnly, // backend usa "cpf" no payload de registro
});

// 2. Salva credenciais temporárias para auto-login pós-verificação
// (Keycloak com verifyEmail=true não permite login antes da verificação)
useRegisterStore.getState().setTempCredentials({ email, password });

// 3. Redireciona para verificação
router.replace({
  pathname: "/verification",
  params: { email, phone, mode: "post-register" }
});
```

**Erros possíveis:**
- Email já existe → mostra erro no campo email
- Phone já existe → mostra erro no campo phone
- Documento já existe → mostra erro no campo document
- Senha fraca → mostra erro no campo password

**Ação em caso de erro:**
- Botão "Editar cadastro" → navega de volta para `/register` com dados + erro

---

### 5.3 VerificationScreen (Tela de Verificação)

**Modos:**
| Modo | Contexto | Origem |
|---|---|---|
| `post-register` | Após criar conta | TermsScreen |
| `post-login` | Ao logar com conta PENDING | LoginScreen |

**Comportamento:**
- Abas: Email | Telefone
- Envia código automaticamente ao abrir a aba
- Campo de 4 dígitos para digitar o código
- Botão "Reenviar código" com countdown de 60s
- **Botão "Verificar depois"** (se modo = `post-register`)

**Ação ao verificar:**
```typescript
// Verifica código
await verifyCode({ type: "email" | "sms", destination, code });

// Se verificado:
// - Marca aba como verificada (checkmark verde)
// - Se ambos verificados → mostra botão "Continuar" → vai para Home
// - Se falta telefone → muda para aba telefone automaticamente
```

**Ação "Verificar depois":**
- Vai direto para Home
- Ao fazer login futuro, será redirecionado de volta para verificação

---

### 5.4 LoginScreen (Tela de Login)

**Comportamento atualizado:**
```typescript
async function login(params) {
  // 1. Autentica no Keycloak
  const { id, name, email } = await KeycloakService.login(params);

  // 2. Verifica status de verificação
  const status = await KeycloakService.getVerificationStatus();

  if (!status.emailVerified || !status.phoneVerified) {
    // Redireciona para verificação antes de liberar o app
    router.replace({
      pathname: "/verification",
      params: {
        email,
        phone: "",
        mode: "post-login",
        emailVerified: status.emailVerified,
        phoneVerified: status.phoneVerified,
      }
    });
    return;
  }

  // 3. Tudo verificado → libera o app
  setUser({ id, name, email, type: "contractor" });
  router.replace("/(app)/home");
}
```

---

## 6. Endpoints da API

### 6.1 Verificação de Disponibilidade
```
POST /bff/onboarding/verify/{field}
Body: { "email": "..." } | { "phone": "..." } | { "document": "..." }
```

> Campo `document` detecta automaticamente CPF (11 dígitos) ou CNPJ (14 dígitos)

### 6.2 Registro
```
POST /bff/onboarding/register
Body: {
  "email": "...",
  "firstName": "...",
  "lastName": "...",
  "phone": "...",
  "password": "...",
  "cpf": "..."  // ← payload usa "cpf", mas pode ser CPF ou CNPJ
}
Response: { "userId": "uuid", "keycloakId": "uuid" }
```

### 6.3 Enviar Código
```
POST /bff/onboarding/verification/send
Body: { "type": "email" | "sms", "destination": "..." }
```

### 6.4 Verificar Código
```
POST /bff/onboarding/verification/verify
Body: { "type": "email" | "sms", "destination": "...", "code": "1234" }
Response: { "verified": true }
```

### 6.5 Status de Verificação
```
GET /v1/users/me/verification-status
Response: {
  "emailVerified": boolean,
  "phoneVerified": boolean,
  "status": "PENDING" | "ACTIVE"
}
```

### 6.6 Configuração do App (Feature Flags)
```
GET /bff/app-config
Response: {
  "features": {
    "documentPhotoVerification": boolean
  }
}
```

### 6.7 Upload de Documento (Feature Flag)
```
POST /bff/onboarding/documents/upload
Content-Type: multipart/form-data
Body: { file: File, type: "RG" | "CNH" | "CPF" }
```

---

## 7. Feature Flags

| Flag | Descrição | Padrão |
|---|---|---|
| `DOCUMENT_PHOTO_VERIFICATION` | Exige upload de foto do documento | `false` |

**Quando habilitada:**
```
[Criar Conta] → [Upload de Documento] → [Aguardar Verificação] → [Documento Verificado]
```

---

## 8. Decisões de Arquitetura

### 8.1 Campo `document` vs `cpf`

- **Verificação de disponibilidade**: Usa `document` (API)
- **Payload de registro**: Usa `cpf` (API ainda mantém esse nome por compatibilidade)
- **UI**: Mostra "Documento" (genérico, não "CPF")

### 8.2 Auto-login após registro

O TermsScreen faz login automático após criar a conta para obter o token JWT necessário para chamar endpoints autenticados (como `verification/send` e `verification/verify`).

### 8.3 Redirecionamento pós-login

O hook `useAuth` sempre verifica o status de verificação antes de liberar o acesso ao app. Isso garante que usuários com conta `PENDING` não acessem áreas restritas.

---

## 9. Estados da Conta

| Estado | Condição | Acesso |
|---|---|---|
| `PENDING` | Conta criada, email/phone não verificados | Login permitido, mas redirecionado para verificação |
| `ACTIVE` | Email e phone verificados | Acesso total ao app |
| `BLOCKED` | Conflito de email/phone com outra conta | Acesso bloqueado, exibe tela de suporte |

---

## 10. Tela de Conta Bloqueada (Futuro)

**Cenário:** Durante verificação, detecta-se que email/phone já pertence a outra conta verificada.

**Tela:**
- Título: "Conta Temporariamente Bloqueada"
- Mensagem: "Detectamos que este e-mail/telefone já está vinculado a outra conta verificada. Entre em contato com o suporte para resolver."
- Botão: "Falar com Suporte" (abre WhatsApp/email)

---

## 11. Checklist de Implementação

- [x] Reestruturar fluxo: Register → Terms → Criar Conta → Verification
- [x] Ajustar payload de registro para usar `cpf` (conforme contrato)
- [x] Adicionar endpoint `GET /v1/users/me/verification-status`
- [x] Atualizar login para checar status pós-autenticação
- [x] Adicionar botão "Verificar depois" na VerificationScreen
- [x] Adicionar endpoint `GET /bff/app-config` para feature flags
- [ ] Implementar tela de Upload de Documento (feature flag)
- [ ] Implementar tela de Conta Bloqueada
- [ ] Adicionar ícone/label "Pendente" no perfil do usuário
