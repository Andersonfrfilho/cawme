# Contrato de Erros - Auth API

## Estrutura da Resposta de Erro (BFF)

O backend deve retornar erros no seguinte formato:

```json
{
  "statusCode": 409,
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "This email is already registered",
  "field": "email"
}
```

## Campos

| Campo        | Tipo   | Obrigatório | Descrição                                |
| ------------ | ------ | ----------- | ---------------------------------------- |
| `statusCode` | number | Não         | Código HTTP (400, 409, 422, etc.)        |
| `error`      | string | **Sim**     | Código do erro para tradução no frontend |
| `message`    | string | Não         | Mensagem em inglês (fallback)            |
| `field`      | string | Não         | Campo específico que causou o erro       |

## Códigos de Erro Suportados

### Registro de Usuário

| Código                   | HTTP | Descrição                  | Tradução (pt-BR)                                    |
| ------------------------ | ---- | -------------------------- | --------------------------------------------------- |
| `EMAIL_ALREADY_EXISTS`   | 409  | E-mail já cadastrado       | "Este e-mail já está cadastrado"                    |
| `PHONE_ALREADY_EXISTS`   | 409  | Telefone já cadastrado     | "Este telefone já está cadastrado"                  |
| `INVALID_CPF`            | 422  | CPF inválido               | "CPF inválido"                                      |
| `WEAK_PASSWORD`          | 422  | Senha fraca                | "Senha deve ter pelo menos 8 caracteres"            |
| `INVALID_EMAIL`          | 422  | E-mail inválido            | "Informe um e-mail válido"                          |
| `INVALID_PHONE`          | 422  | Telefone inválido          | "Telefone obrigatório"                              |
| `MISSING_REQUIRED_FIELD` | 400  | Campo obrigatório faltando | "Campo obrigatório não preenchido"                  |
| `ACCOUNT_DISABLED`       | 403  | Conta desativada           | "Conta desativada. Entre em contato com o suporte." |

### Login

| Código                | HTTP | Descrição              | Tradução (pt-BR)                               |
| --------------------- | ---- | ---------------------- | ---------------------------------------------- |
| `INVALID_CREDENTIALS` | 401  | Credenciais inválidas  | "Usuário ou senha inválidos. Tente novamente." |
| `USER_NOT_FOUND`      | 404  | Usuário não encontrado | "Usuário ou senha inválidos. Tente novamente." |

## Exemplos

### Erro de E-mail Duplicado

```json
// POST /auth/register
// 409 Conflict
{
  "statusCode": 409,
  "error": "EMAIL_ALREADY_EXISTS",
  "message": "This email is already registered",
  "field": "email"
}
```

### Erro de CPF Inválido

```json
// POST /auth/register
// 422 Unprocessable Entity
{
  "statusCode": 422,
  "error": "INVALID_CPF",
  "message": "Invalid CPF format",
  "field": "cpf"
}
```

### Erro de Login

```json
// POST /auth/token
// 401 Unauthorized
{
  "statusCode": 401,
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid username or password"
}
```

## Implementação no Frontend

O frontend usa o módulo `error-mapper.ts` para traduzir códigos de erro:

```typescript
import { getErrorDetails } from "@/modules/auth/services/error-mapper";

try {
  await register(params);
} catch (error) {
  const details = getErrorDetails(error);
  // details.message → chave de tradução (ex: "registerEmailExists")
  // details.field → campo com erro (ex: "email")
  // details.statusCode → código HTTP (ex: 409)
}
```

## Fluxo de Tradução

1. Frontend recebe erro do BFF
2. Extrai `error` code (ex: `EMAIL_ALREADY_EXISTS`)
3. Busca tradução no dicionário (`ERROR_MAP`)
4. Se não encontrar, usa mensagem do BFF como fallback
5. Se não tiver mensagem, usa mensagem genérica
