# Testing & Bug Detection - Cawme

## Visão Geral

Estratégias e ferramentas para detectar bugs através de testes automatizados e monitoramento de comportamento do usuário.

## 1. Monkey Testing (Cliques Aleatórios)

### O que é

Simula usuários aleatórios clicando, swipando e interagindo com o app para encontrar bugs inesperados.

### Ferramentas Recomendadas

#### **Maestro** (Recomendado ⭐)

```yaml
# flows/monkey-test.yaml
appId: com.andersonfilho.cawme
name: Monkey Test Session
tags:
  - monkey
  - stress
---
- launchApp
- repeat:
    times: 100
    commands:
      - tapOn: "random"
      - scroll
      - swipe:
          direction: "DOWN"
      - inputText: "monkey test"
      - tapOn: "random"
      - assertVisible: ".*"
```

**Instalação:**

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro

# Rodar teste
maestro test flows/monkey-test.yaml
```

**Vantagens:**

- ✅ Fácil de configurar
- ✅ Funciona em iOS e Android
- ✅ Gera relatórios automáticos
- ✅ Captura screenshots em falhas
- ✅ Gratuito para projetos open-source

#### **Appium** + Monkey

```bash
# Instalar monkey para Android
adb shell pm list packages | grep monkey

# Rodar monkey test (500 eventos)
adb shell monkey -p com.andersonfilho.cawme -v 500

# Rodar monkey test avançado
adb shell monkey -p com.andersonfilho.cawme \
  --pct-touch 40 \
  --pct-motion 20 \
  --pct-nav 10 \
  --pct-appswitch 15 \
  --pct-any-event 15 \
  -v 1000
```

## 2. Session Recording (Gravação de Sessões)

### **Sentry** (Recomendado ⭐)

Captura erros + grava sessões dos usuários para reproduzir bugs.

**Instalação:**

```bash
npm install @sentry/react-native
```

**Configuração:**

```typescript
// src/shared/services/sentry.ts
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% das sessões
  replaysOnErrorSampleRate: 1.0, // 100% das sessões com erro

  // Performance
  tracesSampleRate: 0.2, // 20% das transações

  // Environment
  environment: __DEV__ ? "development" : "production",

  // Breadcrumbs
  beforeBreadcrumb: (breadcrumb) => {
    // Adiciona contexto de cada ação
    if (breadcrumb.category === "ui.click") {
      breadcrumb.data = {
        ...breadcrumb.data,
        timestamp: Date.now(),
      };
    }
    return breadcrumb;
  },
});

// Track de ações do usuário
export function trackUserAction(
  action: string,
  data?: Record<string, unknown>,
) {
  Sentry.addBreadcrumb({
    category: "user.action",
    message: action,
    data,
    level: "info",
  });
}
```

**Uso:**

```typescript
import { trackUserAction } from "@/shared/services/sentry";

// Track de cliques
trackUserAction("register.submit", {
  email: user.email,
  userType: "contractor",
});

// Track de navegação
trackUserAction("screen.view", {
  screen: "RegisterScreen",
  duration: screenTime,
});
```

### **LogRocket** (Alternativa)

```bash
npm install logrocket-react-native
```

## 3. Error Tracking em Tempo Real

### **Sentry** + Logger Customizado

```typescript
// src/shared/utils/error-tracker.ts
import * as Sentry from "@sentry/react-native";
import { logger } from "./logger";

export function trackError(
  error: Error,
  context: {
    screen?: string;
    action?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  },
) {
  // Sentry captura o erro
  Sentry.withScope((scope) => {
    scope.setTag("screen", context.screen || "unknown");
    scope.setTag("action", context.action || "unknown");
    scope.setUser(context.userId ? { id: context.userId } : null);

    if (context.metadata) {
      scope.setContext("metadata", context.metadata);
    }

    Sentry.captureException(error);
  });

  // Logger local para debug
  logger.error("error.tracker", error.message, context);
}

// Usage em hooks
export function useRegister() {
  async function register(params: RegisterServiceParams) {
    try {
      await api.register(params);
    } catch (error) {
      trackError(error as Error, {
        screen: "RegisterScreen",
        action: "register.submit",
        metadata: {
          email: params.email,
          phone: params.phone,
        },
      });
      throw error;
    }
  }
}
```

## 4. Heatmaps (Onde Usuários Clicam)

### **Microsoft App Center**

```bash
npm install appcenter appcenter-analytics appcenter-crashes
```

**Configuração:**

```typescript
// src/shared/services/app-center.ts
import AppCenter from "appcenter";
import Analytics from "appcenter-analytics";
import Crashes from "appcenter-crashes";

export async function initAppCenter() {
  await AppCenter.start({
    appSecret: process.env.EXPO_PUBLIC_APP_CENTER_SECRET,
    services: [Analytics, Crashes],
  });
}

// Track de eventos
export function trackEvent(name: string, properties?: Record<string, unknown>) {
  Analytics.trackEvent(name, properties);
}

// Track de tela
export function trackScreen(screen: string) {
  Analytics.trackEvent("screen_view", { screen });
}
```

## 5. E2E Testing (Testes Automatizados)

### **Maestro** - Testes de Fluxo

```yaml
# flows/register-flow.yaml
appId: com.andersonfilho.cawme
name: Register Flow Test
---
- launchApp
- assertVisible: "Cawme"
- tapOn: "Criar conta"
- assertVisible: "Crie sua conta"
- inputText: "John"
- inputText: "Doe"
- inputText: "john@example.com"
- inputText: "11999999999"
- inputText: "12345678909"
- inputText: "password123"
- inputText: "password123"
- tapOn: "Avançar"
- assertVisible: "Termos de Uso"
- tapOn: "Li e aceito"
- tapOn: "Finalizar cadastro"
- assertVisible: "Cadastro realizado"
```

**Rodar:**

```bash
maestro test flows/register-flow.yaml
```

### **Detox** - Testes de Performance

```javascript
// e2e/register.spec.js
describe("Register", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should complete registration flow", async () => {
    await element(by.text("Criar conta")).tap();
    await element(by.id("register.firstName")).typeText("John");
    await element(by.id("register.lastName")).typeText("Doe");
    await element(by.id("register.email")).typeText("john@example.com");
    await element(by.id("register.submit")).tap();
    await expect(element(by.text("Termos de Uso"))).toBeVisible();
  });

  it("should show validation errors", async () => {
    await element(by.text("Criar conta")).tap();
    await element(by.id("register.submit")).tap();
    await expect(element(by.text("Nome obrigatório"))).toBeVisible();
  });
});
```

## 6. Chaos Engineering (Condições Adversas)

### **Network Throttling**

```typescript
// src/shared/services/network-condition.ts
import NetInfo from "@react-native-community/netinfo";

export type NetworkCondition = "excellent" | "good" | "poor" | "offline";

export function simulateNetworkCondition(condition: NetworkCondition) {
  // Em desenvolvimento, simula condições de rede
  if (__DEV__) {
    const delays = {
      excellent: 0,
      good: 500,
      poor: 3000,
      offline: 10000,
    };

    // Adiciona delay artificial
    return new Promise((resolve) => {
      setTimeout(resolve, delays[condition]);
    });
  }
}

// Uso no api-client
apiClient.interceptors.request.use(async (config) => {
  if (__DEV__ && process.env.EXPO_PUBLIC_SIMULATE_NETWORK) {
    await simulateNetworkCondition("poor");
  }
  return config;
});
```

### **Random Error Injection**

```typescript
// src/shared/services/chaos.ts
export function shouldInjectError(rate = 0.1): boolean {
  // 10% de chance de erro em DEV
  if (!__DEV__) return false;
  return Math.random() < rate;
}

// Uso
async function fetchData() {
  if (shouldInjectError(0.1)) {
    throw new Error("Chaos: Random error injected");
  }
  return api.get("/data");
}
```

## 7. Analytics de Comportamento

### **Mixpanel** ou **Amplitude**

```typescript
// src/shared/services/analytics.ts
import Mixpanel from "mixpanel-react-native";

const mixpanel = new Mixpanel({
  token: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN,
  trackAutomaticEvents: true,
});

export async function initAnalytics() {
  await mixpanel.init();
}

// Track de evento
export function track(name: string, properties?: Record<string, unknown>) {
  mixpanel.track(name, properties);
}

// Identify usuário
export function identify(userId: string, properties?: Record<string, unknown>) {
  mixpanel.identify(userId);
  if (properties) {
    mixpanel.people.set(properties);
  }
}

// Track de tela
export function trackScreen(screen: string, duration?: number) {
  mixpanel.track("screen_view", {
    screen,
    duration,
    timestamp: Date.now(),
  });
}

// Track de clique
export function trackClick(element: string, screen: string) {
  mixpanel.track("ui.tap", {
    element,
    screen,
    timestamp: Date.now(),
  });
}
```

## 8. Teste de Estresse (Stress Test)

### Script Customizado

```typescript
// src/shared/utils/stress-test.ts
import { trackUserAction } from "./analytics";

export async function runStressTest(scenario: "register" | "login" | "search") {
  const iterations = 50;
  const results = {
    success: 0,
    failure: 0,
    errors: [] as string[],
  };

  console.log(
    `🧪 Starting stress test: ${scenario} (${iterations} iterations)`,
  );

  for (let i = 0; i < iterations; i++) {
    try {
      await executeScenario(scenario);
      results.success++;
    } catch (error) {
      results.failure++;
      results.errors.push((error as Error).message);
    }
  }

  console.log(`✅ Results: ${results.success}/${iterations} success`);
  console.log(`❌ Failures: ${results.failure}`);
  console.log(`📝 Errors:`, results.errors);

  return results;
}

async function executeScenario(scenario: string) {
  switch (scenario) {
    case "register":
      // Simula registro
      break;
    case "login":
      // Simula login
      break;
    case "search":
      // Simula busca
      break;
  }
}
```

## Configuração Recomendada

### `.env.development`

```bash
# Logging
EXPO_PUBLIC_LOG_LEVEL=debug

# Error Tracking
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/123
EXPO_PUBLIC_SENTRY_ENABLED=true

# Analytics
EXPO_PUBLIC_MIXPANEL_TOKEN=xxx
EXPO_PUBLIC_APP_CENTER_SECRET=xxx

# Chaos Engineering
EXPO_PUBLIC_SIMULATE_NETWORK=false
EXPO_PUBLIC_CHAOS_RATE=0.0
```

### `.env.production`

```bash
# Logging
EXPO_PUBLIC_LOG_LEVEL=error

# Error Tracking
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/123
EXPO_PUBLIC_SENTRY_ENABLED=true

# Analytics
EXPO_PUBLIC_MIXPANEL_TOKEN=xxx
EXPO_PUBLIC_APP_CENTER_SECRET=xxx

# Chaos Engineering
EXPO_PUBLIC_SIMULATE_NETWORK=false
EXPO_PUBLIC_CHAOS_RATE=0.0
```

## Pipeline de Testes

### **GitHub Actions**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  monkey-test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Maestro
        run: |
          brew tap mobile-dev-inc/tap
          brew install maestro

      - name: Run Monkey Test
        run: |
          maestro test flows/monkey-test.yaml

      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: monkey-test-results
          path: .maestro/results/

  e2e-test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Dependencies
        run: npm ci

      - name: Run E2E Tests
        run: |
          npm run test:e2e
```

## Dashboard de Monitoramento

### **Sentry Dashboard**

Configure dashboards para monitorar:

1. **Erros por tela** - Quais telas têm mais erros
2. **Erros por versão** - Bugs introduzidos em releases
3. **Performance** - Tempo de carregamento por tela
4. **User Journey** - Fluxo dos usuários antes do erro

### **Mixpanel/Amplitude Dashboard**

Monitore:

1. **Funnel de Conversão** - Quantos completam o cadastro
2. **Retention** - Quantos voltam ao app
3. **Feature Usage** - Quais features são mais usadas
4. **Drop-off Points** - Onde usuários desistem

## Checklist de Bug Detection

### ✅ Implementado

- [ ] Logger com request ID e call stack
- [ ] Sentry com session replay
- [ ] Analytics de cliques e telas
- [ ] Monkey testing com Maestro
- [ ] E2E tests de fluxos críticos
- [ ] Error tracking com contexto
- [ ] Network throttling para testes
- [ ] Stress tests automatizados

### 📊 Métricas para Monitorar

- Crash-free sessions: > 99.5%
- ANR rate: < 0.1%
- Cold start: < 2s
- API error rate: < 1%
- User action failure: < 0.5%

## Exemplo de Debug de Bug

### Cenário: Usuário reporta crash no cadastro

**1. Sentry Dashboard**

```
Error: Network Error
Screen: RegisterScreen
Action: register.submit
User: abc123
Session: 50 gravadações disponíveis
```

**2. Session Replay**

- Usuário preenche formulário
- Clica em "Avançar"
- App congela por 3s
- Crash ocorre

**3. Logs Correlacionados**

```
[A7X9K2M1] [useRegister][RegisterForm] 👆✓ USER → register.init
[C9Z1M4O3] [useRegister][KeycloakService] 📡• API → auth.register.start
  ↪ CURL: curl -X POST ...
[C9Z1M4O3] [useRegister][KeycloakService] 📡✗ API → auth.register.error | duration=3000
```

**4. Reprodução**

```bash
# Copia curl do log
curl -X POST 'http://gateway.domestic.local/onboarding/register' \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com",...}'

# Resultado: Timeout após 3s
# Conclusão: BFF está lento, adicionar retry
```

**5. Fix**

```typescript
// Adiciona retry logic
await retry(() => KeycloakService.register(params), {
  attempts: 3,
  delay: 1000,
});
```

## Ferramentas Gratuitas vs Pagas

| Ferramenta | Free Tier       | Pago    | Recomendado |
| ---------- | --------------- | ------- | ----------- |
| Sentry     | 5K erros/mês    | $26/mês | ✅ Free     |
| Maestro    | Ilimitado       | $0      | ✅ Free     |
| Mixpanel   | 100K events/mês | $20/mês | ✅ Free     |
| App Center | 1GB/mês         | $50/mês | ⚠️ Limitado |
| LogRocket  | 1K sessões/mês  | $99/mês | ❌ Caro     |

## Próximos Passos

1. **Imediato**: Instalar Sentry + configurar session replay
2. **Curto Prazo**: Implementar Maestro monkey tests
3. **Médio Prazo**: Configurar analytics de comportamento
4. **Longo Prazo**: Pipeline completo de E2E testing
