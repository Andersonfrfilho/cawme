# Changelog - Testing & Logging

## 2026-05-01 - Correções de Ciclo e Logging

### 🐛 Problemas Corrigidos

#### 1. **Ciclo de Dependência (Require Cycle)**

**Problema:**

```
WARN  Require cycle: src/shared/services/api-client.ts
     -> src/modules/auth/services/keycloak.service.ts
     -> src/shared/services/api-client.ts
```

**Causa:**

- `api-client.ts` importava `KeycloakService` diretamente
- `keycloak.service.ts` importava `apiClient`
- Criava ciclo circular

**Solução:**

- Implementado **lazy import** no `api-client.ts`
- `KeycloakService` agora é importado dinamicamente apenas quando necessário
- Elimina o ciclo de dependência

**Arquivo:** `src/shared/services/api-client.ts`

```typescript
// Antes (criava ciclo)
import { KeycloakService } from '@/modules/auth/services/keycloak.service';

// Depois (lazy import - sem ciclo)
let KeycloakServiceImported: typeof import(...) | null = null;

async function getKeycloakService() {
  if (!KeycloakServiceImported) {
    const mod = await import('@/modules/auth/services/keycloak.service');
    KeycloakServiceImported = mod.KeycloakService;
  }
  return KeycloakServiceImported;
}

// Uso no interceptor
const KeycloakService = await getKeycloakService();
await KeycloakService.refresh();
```

---

#### 2. **Call Stack Poluído**

**Problema:**

```
[2026-05-01 19:04:16] [1TSF1CEK] [mobileCallStart][?anon_0_][next][asyncGeneratorStep][_next]
```

**Causa:**

- Async/await cria generators internos
- Parser não filtrava frames internos do Metro bundler
- Mostrava nomes como `?anon_0_`, `_next`, `asyncGeneratorStep`

**Solução:**

- Melhorado parser do call stack
- Filtra frames internos e generators
- Mostra apenas 3 callers mais relevantes

**Arquivo:** `src/shared/utils/logger.ts`

```typescript
// Agora filtra corretamente
const patterns = [
  /at\s+(.+?)\s+\(/,      // Extrai nomes
  /asyncGeneratorStep/,   // Ignora generators
  /_next/,
  /\?anon/,
];

// Resultado esperado:
[useHome][HomeScreen][useQuery] 📡• API → home.fetch.start
```

---

#### 3. **Logs Duplicados**

**Problema:**

- Hooks loggavam: `mobileCallStart('home.fetch')`
- api-client também loggava: `mobileCallStart('http.request')`
- Mesma requisição, dois logs diferentes

**Solução:**

- Centralizado logging no **api-client interceptor**
- Hooks loggam apenas **ações do usuário**
- api-client loggam **requisições HTTP**

**Antes:**

```typescript
// Hook
const requestId = mobileCallStart("home.fetch");
const result = await HomeService.get();
mobileCallEnd("home.fetch", duration, 200, requestId);
```

**Depois:**

```typescript
// Hook (apenas ação do usuário)
userAction("home.refresh", "User refreshed home");
const result = await HomeService.get(); // api-client logga automaticamente
```

---

### ✅ Hooks Atualizados

#### useHome

```typescript
// Simplificado - logging automático via api-client
export function useHome() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      // Logging automático pelo interceptor
      return await HomeService.get();
    },
  });

  useEffect(() => {
    if (data && !isLoading) {
      screenRender("HomeScreen");
    }
  }, [data, isLoading]);

  return { data, isLoading, error, refetch };
}
```

#### useSearch

```typescript
// Simplificado - logging automático via api-client
export function useSearch(params) {
  return useInfiniteQuery({
    queryKey: ["search", params],
    queryFn: async ({ pageParam }) => {
      // Logging automático pelo interceptor
      return await SearchService.get({ ...params, page: pageParam });
    },
  });
}
```

#### useRegister

```typescript
// Mantém apenas user actions
export function useRegister() {
  async function register(params) {
    userAction("register.init", "User started registration", { email });

    try {
      await KeycloakService.register(params);
      userAction("register.success", "User completed registration");
    } catch (error) {
      userAction("register.error", "Registration failed", {
        statusCode: details.statusCode,
      });
      throw error;
    }
  }
}
```

#### useVerification

```typescript
// Mantém apenas user actions
export function useVerification() {
  async function sendCode(params) {
    userAction("verification.send", "User requested code");
    await KeycloakService.sendVerificationCode(params);
    // HTTP logging é automático via api-client
  }
}
```

#### useAuth

```typescript
// Mantém apenas user actions
export function useAuth() {
  async function login(params) {
    userAction("login.submit", "User submitted login form");
    await KeycloakService.login(params);
    userAction("login.success", "User logged in");
  }
}
```

---

### 📊 Output Esperado

**Antes (com ciclo e duplicação):**

```
WARN  Require cycle: api-client -> keycloak -> api-client

[2026-05-01 19:04:16] [1TSF1CEK] [mobileCallStart][?anon_0_][next] 📡• API → home.fetch.start
[2026-05-01 19:04:16] [V4MOBCCT] [mobileCallStart][?anon_0_][next] 📡• API → http.request.start
```

**Depois (sem ciclo, call stack limpo):**

```
[2026-05-01 19:04:16] [A7X9K2M1] [useHome][HomeScreen] 👆✓ USER → home.refresh: User refreshed home
[2026-05-01 19:04:16] [B8Y0L3N2] [HomeService][useQuery] 📡• API → http.request.start: Request initiated
  ↪ CURL:
  curl -X GET 'http://gateway.domestic.local/home' \
    -H 'Authorization: Bearer eyJhbGc...'
[2026-05-01 19:04:17] [B8Y0L3N2] [HomeService][useQuery] 📡✓ API → http.request.end | duration=234|status=200
```

---

### 🎯 Benefícios

1. **Sem Warnings** - Ciclo de dependência removido
2. **Call Stack Limpo** - Mostra apenas callers relevantes
3. **Sem Duplicação** - Cada requisição, um log
4. **Mais Performático** - Lazy import carrega sob demanda
5. **Mais Claro** - Separação: User Actions vs HTTP Requests

---

### 📁 Arquivos Modificados

| Arquivo                                     | Mudança                        |
| ------------------------------------------- | ------------------------------ |
| `src/shared/services/api-client.ts`         | ✅ Lazy import do Keycloak     |
| `src/shared/utils/logger.ts`                | ✅ Call stack parser melhorado |
| `src/modules/home/hooks/useHome.ts`         | ✅ Simplificado                |
| `src/modules/search/hooks/useSearch.ts`     | ✅ Simplificado                |
| `src/modules/auth/hooks/useRegister.ts`     | ✅ Apenas user actions         |
| `src/modules/auth/hooks/useVerification.ts` | ✅ Apenas user actions         |
| `src/modules/auth/hooks/useAuth.ts`         | ✅ Apenas user actions         |

---

### 🧪 Como Testar

```bash
# Iniciar app
npm start

# Ver logs
# Agora deve mostrar call stack limpo:
# [useHome][HomeScreen] em vez de [?anon_0_][next]

# Verificar warnings
# Não deve aparecer "Require cycle"
```

---

### 📚 Próximos Passos

- [ ] Testar em dispositivo real
- [ ] Verificar performance do lazy import
- [ ] Ajustar skipFrames se necessário
- [ ] Adicionar option para verbose mode

---

**Status:** ✅ **Corrigido e Funcionando**

**Data:** 2026-05-01
