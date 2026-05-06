# Rotas de Cadastro — Mobile → BFF

Base URL: `process.env.EXPO_PUBLIC_BFF_URL`

---

## Fluxo de Cadastro

```
1. Verificar disponibilidade dos campos (email, telefone, CPF)
2. Registrar usuário
3. Enviar código de verificação (e-mail e SMS)
4. Confirmar código de verificação
```

---

## Rotas

### 1. Verificar Disponibilidade de Campo

Verifica se email, telefone ou CPF já estão cadastrados antes do submit.

| Atributo | Valor |
|---|---|
| Método | `POST` |
| Path | `/bff/onboarding/verify/{field}` |
| Autenticação | Não |

**Variantes de `{field}`:**

| Campo UI | `{field}` na URL | Chave no body |
|---|---|---|
| email | `email` | `email` |
| telefone | `phone` | `phone` |
| CPF | `document` | `document` |

**Request body:**
```json
{ "email": "usuario@exemplo.com" }
// ou
{ "phone": "+5511999999999" }
// ou
{ "document": "12345678901" }
```

**Response:**
```json
{
  "valid": true,
  "available": true
}
```

**Códigos de erro:**
| Status | Significado |
|---|---|
| `409` | Campo já cadastrado |
| `429` | Rate limit atingido |
| `400` / `422` | Formato inválido |

**Arquivo:** `src/modules/auth/hooks/useFieldVerification.ts:56`

---

### 2. Registrar Usuário

| Atributo | Valor |
|---|---|
| Método | `POST` |
| Path | `/bff/onboarding/register` |
| Autenticação | Não |

**Request body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "SenhaForte123!",
  "firstName": "Anderson",
  "lastName": "Filho",
  "phone": "+5511999999999",
  "cpf": "12345678901"
}
```

**Response:**
```json
{
  "keycloakId": "uuid-do-usuario",
  "email": "usuario@exemplo.com",
  "success": true,
  "message": "Usuário criado com sucesso"
}
```

> **Campos de empresa (quando `documentType === "cnpj"`):**
> ```json
> {
>   "email": "empresa@exemplo.com",
>   "password": "SenhaForte123!",
>   "firstName": "João",
>   "lastName": "Silva",
>   "phone": "+5511999999999",
>   "document": "12345678000195",
>   "documentType": "cnpj",
>   "companyName": "Empresa LTDA",
>   "tradeName": "Empresa"
> }
> ```
> - `companyName` (string, obrigatório): Razão Social
> - `tradeName` (string, opcional): Nome Fantasia

**Arquivo:** `src/modules/auth/services/keycloak.service.ts:98`

---

### 3. Enviar Código de Verificação

Envia OTP por e-mail ou SMS. Chamado duas vezes no fluxo: uma para e-mail, uma para telefone.

| Atributo | Valor |
|---|---|
| Método | `POST` |
| Path | `/bff/onboarding/verification/send` |
| Autenticação | Não |

**Request body — e-mail:**
```json
{
  "type": "email",
  "destination": "usuario@exemplo.com"
}
```

**Request body — SMS:**
```json
{
  "type": "sms",
  "destination": "+5511999999999"
}
```

> **Mapeamento UI → API:** o frontend usa `"phone"` internamente; ao chamar a API converte para `"sms"`.

**Arquivo:** `src/modules/auth/services/keycloak.service.ts:109`

---

### 4. Confirmar Código de Verificação

| Atributo | Valor |
|---|---|
| Método | `POST` |
| Path | `/bff/onboarding/verification/verify` |
| Autenticação | Não |

**Request body — e-mail:**
```json
{
  "type": "email",
  "destination": "usuario@exemplo.com",
  "code": "123456"
}
```

**Request body — SMS:**
```json
{
  "type": "sms",
  "destination": "+5511999999999",
  "code": "123456"
}
```

**Response:**
```json
{
  "verified": true
}
```

**Arquivo:** `src/modules/auth/services/keycloak.service.ts:117`

---

## Rotas de Autenticação (pós-cadastro)

### Login

| Atributo | Valor |
|---|---|
| Método | `POST` |
| Path | `/auth/token` |
| Client HTTP | `axios` direto (não passa pelo `apiClient`) |
| Content-Type | `application/x-www-form-urlencoded` |

**Request body (form-urlencoded):**
```
grant_type=password
client_id=domestic-bff
client_secret=backend-bff-client-secret
username=usuario@exemplo.com
password=SenhaForte123!
```

**Response:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

**Arquivo:** `src/modules/auth/services/keycloak.service.ts:22`

---

### Refresh Token

| Atributo | Valor |
|---|---|
| Método | `POST` |
| Path | `/auth/token` |
| Disparo | Automático pelo interceptor do `apiClient` em resposta 401 |

**Request body (form-urlencoded):**
```
grant_type=refresh_token
client_id=domestic-bff
client_secret=backend-bff-client-secret
refresh_token=eyJ...
```

**Arquivo:** `src/modules/auth/services/keycloak.service.ts:52`

---

## Constantes

Todas as rotas estão centralizadas em:

```
src/modules/auth/auth.constants.ts → AUTH_ENDPOINTS
```

| Constante | Path |
|---|---|
| `TOKEN` | `/auth/token` |
| `LOGOUT` | `/auth/logout` |
| `FORGOT_PASSWORD` | `/bff/auth/forgot-password` |
| `REGISTER` | `/bff/onboarding/register` |
| `VERIFICATION_SEND` | `/bff/onboarding/verification/send` |
| `VERIFICATION_VERIFY` | `/bff/onboarding/verification/verify` |

---

## Infraestrutura HTTP

- **`apiClient`** (`src/shared/services/api-client.ts`): injeta Bearer token automaticamente, faz refresh em 401, timeout 10s.
- **`axios` direto**: usado apenas nas rotas `/auth/token` e `/auth/logout` — fluxo Keycloak que não carrega token.
