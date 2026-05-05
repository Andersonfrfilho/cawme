# Exemplos de Uso - Testing & Debug

## 1. Logger com Request/Response

```typescript
// src/modules/auth/hooks/useRegister.ts
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
      userType: "contractor",
    });

    // Início da chamada API (curl gerado automaticamente!)
    const requestId = mobileCallStart("auth.register", {
      method: "POST",
      url: `${BASE_URL}/onboarding/register`,
      headers: { "Content-Type": "application/json" },
      payload: {
        email: params.email,
        password: "***", // Mascarar senha
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone,
        cpf: params.cpf,
      },
    });

    const startTime = Date.now();

    try {
      await KeycloakService.register(params);
      const duration = Date.now() - startTime;

      // Sucesso
      mobileCallEnd("auth.register", duration, 201, requestId);
      userAction("register.success", "User completed registration");
    } catch (error: any) {
      const duration = Date.now() - startTime;

      // Erro
      mobileCallError("auth.register", error, duration, requestId);
      userAction("register.error", "Registration failed", {
        statusCode: error.response?.status,
        message: error.message,
      });

      throw error;
    }
  }
}
```

**Output no Console:**

```
[2026-05-01 14:30:00] [A7X9K2M1] [useRegister][RegisterForm][handleRegister] 👆✓ USER → register.init: User started registration | email=user@example.com|phone=11999999999

[2026-05-01 14:30:00] [C9Z1M4O3] [useRegister][KeycloakService][register] 📡• API → auth.register.start: Request initiated | method=POST|url=http://gateway.domestic.local/onboarding/register
  ↪ CURL:
  curl -X POST 'http://gateway.domestic.local/onboarding/register' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' \
    -d '{"email":"user@example.com","password":"***","firstName":"John","lastName":"Doe"}'

[2026-05-01 14:30:01] [C9Z1M4O3] [useRegister][KeycloakService][register] 📡✓ API → auth.register.end: Request completed | duration=1234|status=201

[2026-05-01 14:30:01] [C9Z1M4O3] [useRegister][RegisterForm][handleRegister] 👆✓ USER → register.success: User completed registration
```

## 2. Sentry com Session Replay

```typescript
// src/modules/auth/screens/register/register.screen.tsx
import { trackError, trackUserAction, trackScreenView } from '@/shared/services/sentry';

export default function RegisterScreen() {
  // Track de tela
  useEffect(() => {
    trackScreenView('RegisterScreen', { source: 'welcome' });
  }, []);

  const onSubmit = async (values: RegisterFormValues) => {
    // Track de ação
    trackUserAction('register.submit', {
      hasEmail: !!values.email,
      hasPhone: !!values.phone,
      hasCpf: !!values.cpf,
    });

    try {
      await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        cpf: values.cpf,
      });

      // Sucesso
      trackUserAction('register.success', {
        email: values.email,
      });

    } catch (error) {
      // Erro com contexto rico
      trackError(error as Error, {
        screen: 'RegisterScreen',
        action: 'register.submit',
        userId: user?.id,
        metadata: {
          email: values.email,
          phone: values.phone,
          errors: formState.errors,
        },
      });

      throw error;
    }
  };

  return (
    // ... UI
  );
}
```

## 3. Monkey Testing

```bash
# Rodar teste aleatório (200 ações)
npm run test:monkey

# Output esperado:
# 🐵 Starting monkey test...
# ✅ 200 actions completed
# 📸 Screenshot saved: monkey-test-final.png
# ✅ No crashes detected
```

**O que o monkey test faz:**

- Clica em elementos aleatórios
- Faz scroll em todas as direções
- Digita texto em inputs
- Navega entre telas
- Verifica se app não crashou

## 4. E2E Testing

```bash
# Rodar fluxo de cadastro
npm run test:e2e

# Output esperado:
# ✅ Register Flow: PASSED (15s)
# ✅ Login Flow: PASSED (8s)
```

**O que o E2E test faz:**

- Abre o app
- Navega para cadastro
- Preenche formulário
- Submete
- Verifica sucesso
- Navega para login

## 5. Debugando com Curl

Quando um erro de API ocorre, o logger gera automaticamente um curl:

```
[2026-05-01 14:30:00] [C9Z1M4O3] 📡✗ API → auth.register.error: Request failed
  ↪ CURL:
  curl -X POST 'http://gateway.domestic.local/onboarding/register' \
    -H 'Content-Type: application/json' \
    -H 'Authorization: Bearer eyJhbGc...' \
    -d '{"email":"user@example.com",...}'
```

**Para debugar:**

```bash
# 1. Copie o curl do log
# 2. Cole no terminal
# 3. Veja a resposta do servidor
# 4. Identifique o problema

# Exemplo de resposta:
# {
#   "statusCode": 409,
#   "error": "EMAIL_ALREADY_EXISTS",
#   "message": "This email is already registered"
# }
```

## 6. Session Replay no Sentry

**Passos para debugar:**

1. **Acesse o erro no Sentry**

   ```
   https://sentry.io/organizations/cawme/issues/
   ```

2. **Clique em "Replay"**
   - Veja os últimos 30s antes do erro
   - Pause em momentos chave
   - Veja cliques e navegação

3. **Analise breadcrumbs**

   ```
   [14:30:00] User clicked "Criar conta"
   [14:30:01] Navigated to RegisterScreen
   [14:30:05] User submitted form
   [14:30:06] API call failed (500)
   [14:30:06] App crashed
   ```

4. **Identifique a causa raiz**
   - Foi erro de rede?
   - Foi dado inválido?
   - Foi estado inconsistente?

## 7. Performance Tracking

```typescript
// src/modules/home/hooks/useHome.ts
import { trackAsync } from "@/shared/services/sentry";

export function useHome() {
  return useQuery({
    queryKey: ["home"],
    queryFn: () =>
      trackAsync(
        "home.fetch",
        async () => {
          const result = await HomeService.get();
          return result;
        },
        { screen: "HomeScreen" },
      ),
  });
}
```

**Output no Sentry:**

```
Transaction: home.fetch
Status: ok
Duration: 234ms
Screen: HomeScreen
```

## 8. Error Boundaries

```typescript
// src/shared/components/error-boundary.tsx
import { trackError } from "@/shared/services/sentry";

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Track erro com contexto do React
    trackError(error, {
      screen: "ErrorBoundary",
      component: errorInfo.componentStack,
      metadata: {
        props: this.props,
        state: this.state,
      },
    });
  }

  render() {
    // ...
  }
}
```

## 9. Network Throttling (Dev)

```typescript
// .env.development
EXPO_PUBLIC_SIMULATE_NETWORK=poor  # excellent | good | poor | offline

// src/shared/services/api-client.ts
apiClient.interceptors.request.use(async (config) => {
  if (__DEV__ && process.env.EXPO_PUBLIC_SIMULATE_NETWORK) {
    const delays = {
      excellent: 0,
      good: 500,
      poor: 3000,
      offline: 10000,
    };

    const condition = process.env.EXPO_PUBLIC_SIMULATE_NETWORK as keyof typeof delays;
    await new Promise(resolve => setTimeout(resolve, delays[condition]));
  }
  return config;
});
```

**Use para testar:**

- Loading states
- Timeout handling
- Retry logic
- Offline mode

## 10. Chaos Engineering

```typescript
// src/shared/services/chaos.ts
export function shouldInjectError(rate = 0.1): boolean {
  if (!__DEV__) return false;
  return Math.random() < rate;
}

// Uso em serviços
export const HomeService = {
  async get(): Promise<HomeResponse> {
    if (shouldInjectError(0.1)) {
      // 10% de erro
      throw new Error("Chaos: Random failure injected");
    }

    const response = await apiClient.get("/home");
    return response.data;
  },
};
```

**Teste resiliência:**

```bash
# Rode 50 vezes
for i in {1..50}; do
  npm run test:e2e
done

# Quantas falharam?
# O app se recuperou graciosamente?
```

## Checklist de Debug

### ✅ Ao Reportar um Bug

- [ ] Request ID do log
- [ ] Timestamp do erro
- [ ] Screen/Componente
- [ ] Ação do usuário
- [ ] Curl da requisição (se API)
- [ ] Session Replay link (se Sentry)
- [ ] Passos para reproduzir
- [ ] Device/OS version

### ✅ Ao Corrigir um Bug

- [ ] Adicionou logs no fluxo?
- [ ] Adicionou track de erro?
- [ ] Testou com monkey test?
- [ ] Testou com network throttling?
- [ ] Atualizou documentação?

## Exemplo Real de Debug

**Problema:** Usuário reporta crash no cadastro

**Investigação:**

```bash
# 1. Busca no Sentry
https://sentry.io/organizations/cawme/issues/?query=RegisterScreen

# 2. Encontra erro
Error: Network Timeout
Request ID: C9Z1M4O3
Screen: RegisterScreen
Action: register.submit

# 3. Vê session replay
- Usuário preenche formulário (15s)
- Clica em "Avançar"
- Loading spinner por 10s
- Crash

# 4. Busca logs com Request ID
grep "C9Z1M4O3" logs.txt

# 5. Encontra curl
curl -X POST 'http://gateway.domestic.local/onboarding/register' ...

# 6. Testa curl
# Resultado: Timeout após 10s

# 7. Conclusão: BFF está lento
# Solução: Adicionar retry + loading state melhor
```

**Fix:**

```typescript
// Adiciona retry
await retry(() => KeycloakService.register(params), {
  attempts: 3,
  delay: 1000,
});

// Melhora loading
showLoading("Criando sua conta...");
```
