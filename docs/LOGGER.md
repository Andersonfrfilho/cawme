# Logger - Padrão Cawme

## Visão Geral

O logger do Cawme segue um padrão inspirado em grandes empresas de tecnologia, com foco em:

- **Rastreabilidade**: Request IDs únicos para correlacionar eventos
- **Contexto**: Call stack automático para entender o fluxo de chamadas
- **Reprodutibilidade**: Comandos curl gerados automaticamente para debug de APIs
- **Performance**: Logs apenas em desenvolvimento ou quando configurado
- **Hierarquia**: Eventos categorizados por tipo e severidade

## Formato do Log

```
[TIMESTAMP] [REQUEST_ID] [CALLER_1][CALLER_2][CALLER_3] ICON SOURCE → ACTION: message | context
```

### Exemplo Real

```
[2026-05-01 14:30:00] [A7X9K2M1] [useHome][HomeScreen] 🚀✓ INIT → home.fetch.ready: Module initialized | duration=95

[2026-05-01 14:30:01] [B8Y0L3N2] [useRegister][RegisterForm][handleRegister] 👆✓ USER → register.init: User started registration | email=user@example.com

[2026-05-01 14:30:01] [C9Z1M4O3] [useRegister][KeycloakService][register] 📡• API → auth.register.start: Request initiated | email=user@example.com
  ↪ CURL:
  curl -X POST 'http://gateway.domestic.local/onboarding/register' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInlwZSI6IkpXVCJ9...' \
    -d '{"email":"user@example.com","password":"***","firstName":"John","lastName":"Doe"}'

[2026-05-01 14:30:02] [C9Z1M4O3] [useRegister][KeycloakService][register] 📡✓ API → auth.register.end: Request completed | duration=1234|status=201

[2026-05-01 14:30:02] [C9Z1M4O3] [useRegister][RegisterForm][handleRegister] 👆✓ USER → register.success: User completed registration | email=user@example.com
```

## Tipos de Eventos

| Tipo         | Ícone | Cor     | Uso                                       |
| ------------ | ----- | ------- | ----------------------------------------- |
| `userAction` | 👆    | Cyan    | Ações do usuário (cliques, submits, etc.) |
| `mobileCall` | 📡    | Blue    | Chamadas de API/HTTP                      |
| `init`       | 🚀    | Magenta | Inicialização de módulos                  |
| `screen`     | 📱    | Yellow  | Navegação e renderização de telas         |

## Níveis de Severidade

| Nível   | Ícone | Cor    | Quando usar                            |
| ------- | ----- | ------ | -------------------------------------- |
| `debug` | •     | Cyan   | Logs detalhados, início de requisições |
| `info`  | ✓     | Green  | Informações gerais, sucesso            |
| `warn`  | ⚠     | Yellow | Avisos, fallbacks                      |
| `error` | ✗     | Red    | Erros, falhas                          |

## API do Logger

### Funções Principais

```typescript
// Ações do usuário
userAction(action: string, message: string, payload?: LogContext, requestId?: string)

// Chamadas de API
mobileCall(action: string, message: string, payload?: LogContext, requestId?: string)
mobileCallStart(action: string, payload?: LogContext): string  // Retorna requestId
mobileCallEnd(action: string, duration: number, status?: number, requestId?: string)
mobileCallError(action: string, error: unknown, duration?: number, requestId?: string)

// Inicialização
initModule(module: string, message: string, payload?: LogContext)
initComplete(module: string, duration: number)

// Telas
screenNavigate(from: string, to: string, params?: Record<string, unknown>)
screenRender(screen: string, duration?: number)
screenEvent(screen: string, event: string, payload?: LogContext)

// Helpers
trackAsync<T>(source: string, action: string, fn: () => Promise<T>): Promise<T>
```

### Exemplo de Uso

```typescript
import {
  userAction,
  mobileCallStart,
  mobileCallEnd,
  mobileCallError,
} from "@/shared/utils/logger";

export function useRegister() {
  async function register(params: RegisterServiceParams): Promise<void> {
    // Log da ação do usuário
    userAction("register.init", "User started registration", {
      email: params.email,
      phone: params.phone,
    });

    // Início da chamada API (gera requestId e curl automaticamente)
    const requestId = mobileCallStart("auth.register", {
      email: params.email,
      method: "POST",
      url: `${BASE_URL}/onboarding/register`,
      headers: { "Content-Type": "application/json" },
      payload: { ...params, password: "***" }, // Mascarar dados sensíveis
    });

    const startTime = Date.now();

    try {
      await KeycloakService.register(params);
      const duration = Date.now() - startTime;

      // Sucesso
      mobileCallEnd("auth.register", duration, 201, requestId);
      userAction("register.success", "User completed registration");
    } catch (error) {
      const duration = Date.now() - startTime;

      // Erro
      mobileCallError("auth.register", error, duration, requestId);
      userAction("register.error", "Registration failed", {
        error: error.message,
      });
      throw error;
    }
  }
}
```

## Configuração

### Variável de Ambiente

```bash
# .env.development
EXPO_PUBLIC_LOG_LEVEL=debug  # none | error | warn | info | debug

# .env.production
EXPO_PUBLIC_LOG_LEVEL=none   # Desativa logs em produção
```

### Níveis

- `none`: Nenhum log
- `error`: Apenas erros
- `warn`: Erros e avisos
- `info`: Erros, avisos e informações
- `debug`: Todos os logs (incluindo detalhes de requisições)

## Call Stack Automático

O logger captura automaticamente a call stack para mostrar o fluxo de chamadas:

```
[useHome][HomeScreen][useQuery] 📡• API → home.fetch.start: Request initiated
```

Isso ajuda a entender:

1. Qual hook iniciou a chamada (`useHome`)
2. Qual componente está usando (`HomeScreen`)
3. Qual função disparou (`useQuery`)

## Comandos Curl Automáticos

Sempre que uma requisição HTTP é logada com `mobileCallStart` e inclui uma `url`, o logger gera automaticamente um comando curl que pode ser copiado e executado para reproduzir a requisição:

```bash
curl -X POST 'http://gateway.domestic.local/onboarding/register' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'User-Agent: CawmeApp/1.0.0' \
  -d '{"email":"user@example.com","password":"***"}'
```

**Nota**: Tokens de autorização são mascarados parcialmente por segurança.

## Boas Práticas

### ✅ Faça

```typescript
// Use contexto rico
userAction("login.submit", "User submitted login form", {
  email: user.email,
  rememberMe: true,
});

// Passe o requestId entre camadas
const requestId = mobileCallStart("api.users.get");
await getUsers(requestId);

// Use trackAsync para wrappers
const result = await trackAsync("UserService", "getUsers", () =>
  api.get("/users"),
);
```

### ❌ Não Faça

```typescript
// Logs sem contexto
logger.info("User logged in");

// Dados sensíveis expostos
logger.info("Login", { password: user.password });

// Ignorar requestId
mobileCallStart("api.call");
// Depois não usar o requestId retornado
```

## Performance

- Logs são **zero-cost** em produção (`__DEV__` check + nível `none`)
- Call stack é capturada apenas em desenvolvimento
- Strings de log não são construídas se o nível não permitir
- Cores ANSI não afetam performance (apenas terminal)

## Debugando Problemas

### 1. Encontre o Request ID

```
[2026-05-01 14:30:00] [A7X9K2M1] ...
```

### 2. Busque todos os logs com esse ID

```bash
# No console do metro
grep "A7X9K2M1" logs.txt
```

### 3. Reproduza a requisição

Copie o comando curl gerado e execute no terminal.

### 4. Entenda o fluxo

Siga a call stack: `[useHome][HomeScreen][useQuery]`

## Comparação com Outros Loggers

| Feature         | Cawme Logger | console.log | Winston | Pino |
| --------------- | ------------ | ----------- | ------- | ---- |
| Call stack auto | ✅           | ❌          | ❌      | ❌   |
| Curl auto       | ✅           | ❌          | ❌      | ❌   |
| Request ID      | ✅           | ❌          | ✅      | ✅   |
| Cores           | ✅           | Parcial     | ✅      | ✅   |
| Zero-cost prod  | ✅           | ❌          | ❌      | ❌   |
| Tipado TS       | ✅           | ❌          | ✅      | ✅   |
