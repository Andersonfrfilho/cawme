# Cawme Testing Tools

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
# Error Tracking & Session Replay
npm install @sentry/react-native

# Analytics (opcional)
npm install mixpanel-react-native

# Testing (dev)
npm install -D @playwright/test
```

### 2. Configurar Variáveis de Ambiente

```bash
# .env.development
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/123
EXPO_PUBLIC_SENTRY_ENABLED=true
EXPO_PUBLIC_LOG_LEVEL=debug

# .env.production
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/123
EXPO_PUBLIC_SENTRY_ENABLED=true
EXPO_PUBLIC_LOG_LEVEL=error
```

### 3. Instalar Maestro (Monkey Testing)

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro

# Linux/Windows
# Ver https://maestro.mobile.dev/getting-started/installation
```

### 4. Configurar Sentry

```typescript
// src/shared/providers/index.tsx
import { initSentry } from '@/shared/services/sentry';

export function Providers({ children }: { children: React.ReactNode }) {
  // Inicializa Sentry no app start
  initSentry();

  return (
    // ... providers
  );
}
```

## 📋 Comandos Disponíveis

### Monkey Testing

```bash
# Rodar monkey test (200 ações aleatórias)
maestro test .maestro/flows/monkey-test.yaml

# Rodar stress test (cliques rápidos)
maestro test .maestro/flows/stress-test.yaml

# Rodar todos os testes
maestro test .maestro/flows/*.yaml
```

### E2E Testing

```bash
# Rodar fluxo de cadastro completo (Register → Terms → Verification → Home)
maestro test .maestro/flows/register-flow.yaml

# Rodar fluxo de login com checagem de verificação pendente
maestro test .maestro/flows/login-flow.yaml

# Rodar fluxo de verificação (email + SMS)
maestro test .maestro/flows/verification-flow.yaml

# Rodar fluxo de conta bloqueada
maestro test .maestro/flows/blocked-account-flow.yaml

# Rodar fluxo de upload de documento (feature flag)
maestro test .maestro/flows/document-upload-flow.yaml

# Rodar fluxo de busca
maestro test .maestro/flows/search-flow.yaml

# Rodar todos os testes E2E
npm run test:e2e

# Rodar TODOS os testes (e2e + monkey + stress)
npm run test:e2e:all
```

### Debug

```bash
# Ver status do Maestro
maestro status

# Listar devices conectados
maestro list-devices

# Ver logs do último teste
maestro logs
```

## 📊 Monitoramento

### Sentry Dashboard

Acesse: https://sentry.io/organizations/cawme/

**Dashboards recomendados:**

1. **Errors by Screen** - Quais telas têm mais erros
2. **Performance** - Tempo de carregamento
3. **Session Replay** - Gravações de sessões com erro
4. **Release Health** - Estabilidade por versão

### Métricas Chave

| Métrica             | Meta    | Alerta |
| ------------------- | ------- | ------ |
| Crash-free sessions | > 99.5% | < 99%  |
| ANR rate            | < 0.1%  | > 0.5% |
| Cold start          | < 2s    | > 3s   |
| API error rate      | < 1%    | > 5%   |

## 🐛 Debugando Bugs

### 1. Encontrar o Erro no Sentry

```
1. Acesse Issues → All Issues
2. Filtre por screen:RegisterScreen
3. Clique no erro mais recente
4. Veja "Replays" para assistir a sessão
```

### 2. Reproduzir com Curl

```bash
# Copie o curl do log
curl -X POST 'http://gateway.domestic.local/onboarding/register' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com",...}'

# Teste a resposta
```

### 3. Rodar Monkey Test

```bash
# Tenta reproduzir o bug aleatoriamente
maestro test .maestro/flows/monkey-test.yaml

# Se falhar, veja o screenshot e logs
open .maestro/results/
```

### 4. Analisar Session Replay

```
No Sentry:
1. Clique em "Replay" no erro
2. Assista os últimos 30s antes do erro
3. Veja breadcrumbs (cliques, navegação, API calls)
4. Identifique a ação que causou o erro
```

## 📁 Estrutura de Arquivos

```
.maestro/
  config.yaml                    # Configuração do Maestro
  flows/
    monkey-test.yaml             # Teste aleatório (200 ações)
    stress-test.yaml             # Teste de estresse (cliques rápidos)
    register-flow.yaml           # E2E cadastro completo
    login-flow.yaml              # E2E login com verificação
    verification-flow.yaml       # E2E verificação email/SMS
    blocked-account-flow.yaml    # E2E conta bloqueada
    document-upload-flow.yaml    # E2E upload de documento
    search-flow.yaml             # E2E busca
    navigate-to-register.yaml    # Helper: navega para registro
    random-swipe.yaml            # Helper: swipe aleatório
```

## 🔧 Troubleshooting

### Maestro não encontra device

```bash
# Android: Habilite USB debugging
# iOS: Abra o simulador

# Verifique devices
maestro list-devices

# Se vazio, inicie um emulador/simulador
```

### Sentry não envia erros

```bash
# Verifique se DSN está correto
echo $EXPO_PUBLIC_SENTRY_DSN

# Verifique se.enabled é true
grep SENTRY_ENABLED .env.development

# Em dev, erros podem ser ignorados
# Verifique ignoreErrors em src/shared/services/sentry.ts
```

### Session Replay não grava

```typescript
// Verifique sample rates
Sentry.init({
  replaysSessionSampleRate: 0.1, // 10% das sessões
  replaysOnErrorSampleRate: 1.0, // 100% com erro
});
```

## 🎯 Próximos Passos

### Imediato (Semana 1)

- [ ] Instalar e configurar Sentry
- [ ] Configurar session replay
- [ ] Adicionar track de erros em todos os hooks

### Curto Prazo (Semana 2-3)

- [ ] Instalar Maestro
- [ ] Criar monkey tests básicos
- [ ] Configurar CI/CD para rodar testes

### Médio Prazo (Mês 1)

- [ ] Implementar analytics (Mixpanel)
- [ ] Criar dashboards no Sentry
- [ ] Estabelecer métricas de performance

### Longo Prazo (Mês 2-3)

- [ ] E2E tests completos
- [ ] Chaos engineering
- [ ] Pipeline automático de testes

## 📚 Recursos

- [Sentry Docs](https://docs.sentry.io/platforms/react-native/)
- [Maestro Docs](https://maestro.mobile.dev/)
- [Mixpanel Docs](https://developer.mixpanel.com/docs/react-native)
- [Testing Strategy](../docs/TESTING_STRATEGY.md)
- [Logger Docs](../docs/LOGGER.md)
