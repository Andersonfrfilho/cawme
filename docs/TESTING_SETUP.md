# 🧪 Testing & Bug Detection - Setup Guide

## Visão Geral

Este guia cobre todas as ferramentas implementadas para detectar, trackear e debugar bugs no Cawme.

## 📦 Instalação

### 1. Dependências Instaladas

```bash
# ✅ Já instalado
@sentry/react-native - Error tracking + Session Replay
```

### 2. Instalar Maestro (Monkey Testing)

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro

# Verificar instalação
maestro --version

# Configurar path (se necessário)
export PATH="$HOME/.maestro/bin:$PATH"
```

### 3. Configurar Environment

```bash
# Copiar .env.example para .env.development
cp .env.example .env.development

# Editar .env.development
EXPO_PUBLIC_LOG_LEVEL=debug
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
EXPO_PUBLIC_SENTRY_ENABLED=true
```

### 4. Criar Projeto no Sentry

1. Acesse https://sentry.io
2. Crie conta/login
3. Create Project → React Native
4. Copie o DSN
5. Cole no `.env.development`

## 🚀 Comandos Disponíveis

### Monkey Testing (Aleatório)

```bash
# Rodar monkey test (200 ações aleatórias)
npm run test:monkey

# Rodar stress test (cliques rápidos)
npm run test:stress

# Ver status do Maestro
npm run test:maestro:status

# Listar devices conectados
npm run test:maestro:devices
```

### E2E Testing (Fluxos)

```bash
# Rodar cadastro + login
npm run test:e2e

# Rodar todos os testes E2E
npm run test:e2e:all
```

### Desenvolvimento

```bash
# Iniciar app com logs detalhados
npm start

# Limpar cache e iniciar
npm run start:clean
```

## 📊 Ferramentas Implementadas

### 1. Logger com Request/Response

**Arquivo:** `src/shared/utils/logger.ts`

**Features:**

- ✅ Request ID único
- ✅ Call stack automático
- ✅ **Curl automático** para reproduzir APIs
- ✅ Cores por tipo de evento
- ✅ Env de log level

**Exemplo de Output:**

```
[2026-05-01 14:30:00] [A7X9K2M1] [useHome][HomeScreen] 📡• API → home.fetch.start
  ↪ CURL:
  curl -X GET 'http://gateway.domestic.local/home' \
    -H 'Authorization: Bearer eyJhbGc...'
```

**Uso:**

```typescript
import {
  userAction,
  mobileCallStart,
  mobileCallEnd,
} from "@/shared/utils/logger";

userAction("register.submit", "User submitted form", { email });
const requestId = mobileCallStart("api.register", {
  method: "POST",
  url,
  payload,
});
// ... chamada API
mobileCallEnd("api.register", duration, status, requestId);
```

### 2. Sentry - Error Tracking

**Arquivo:** `src/shared/services/sentry.ts`

**Features:**

- ✅ Session Replay (grava sessões)
- ✅ Breadcrumbs (cliques, navegação)
- ✅ Performance monitoring
- ✅ User feedback
- ✅ Contexto rico de erros

**Uso:**

```typescript
import {
  trackError,
  trackUserAction,
  trackScreenView,
  trackAsync,
} from "@/shared/services/sentry";

// Track de tela
trackScreenView("RegisterScreen");

// Track de ação
trackUserAction("register.submit", { email });

// Track de erro
trackError(error, { screen: "RegisterScreen", action: "register.submit" });

// Wrapper async
await trackAsync("api.fetch", async () => fetchData(), {
  screen: "HomeScreen",
});
```

### 3. Monkey Testing (Maestro)

**Arquivos:** `.maestro/flows/*.yaml`

**Tipos de Testes:**

#### Monkey Test (Aleatório)

- 200 ações aleatórias
- Cliques, scrolls, inputs
- Detecta crashes inesperados

#### Stress Test

- 50 cliques rápidos
- Scroll acelerado
- Testa performance

#### E2E Flows

- Register flow (cadastro completo)
- Login flow (login)
- Search flow (busca)

**Exemplo de Teste:**

```yaml
# .maestro/flows/register-flow.yaml
- launchApp
- tapOn: "Criar conta"
- inputText: "John"
- inputText: "Doe"
- inputText: "john@test.com"
- tapOn: "Avançar"
- assertVisible: "Sucesso"
```

## 🔍 Debugando Bugs

### Cenário 1: Crash em Produção

**Passos:**

1. **Acesse Sentry Dashboard**

   ```
   https://sentry.io/organizations/cawme/issues/
   ```

2. **Encontre o erro**
   - Filtre por screen: `RegisterScreen`
   - Ordene por mais recentes

3. **Assista Session Replay**
   - Clique em "Replay"
   - Veja os 30s antes do crash
   - Identifique ação problemática

4. **Veja breadcrumbs**

   ```
   [14:30:00] User clicked "Criar conta"
   [14:30:01] API call started
   [14:30:05] API call failed (500)
   [14:30:06] Crash
   ```

5. **Reproduza com curl**
   - Copie curl do log
   - Teste no terminal
   - Identifique problema

### Cenário 2: Bug Intermitente

**Passos:**

1. **Rode monkey test**

   ```bash
   npm run test:monkey
   ```

2. **Repita até falhar**

   ```bash
   for i in {1..20}; do
     npm run test:monkey
   done
   ```

3. **Analise screenshot**
   - Veja `.maestro/results/`
   - Identifique tela do erro

4. **Correlacione com Sentry**
   - Busque erro no timestamp
   - Veja session replay

### Cenário 3: Lentidão

**Passos:**

1. **Ative performance tracking**

   ```typescript
   await trackAsync("api.fetch", fetchData);
   ```

2. **Veja no Sentry**
   - Performance → Transactions
   - Filtre por operação
   - Veja duration

3. **Identifique bottleneck**
   - API lenta?
   - Render pesado?
   - Memory leak?

## 📈 Métricas para Monitorar

### Error Tracking

| Métrica             | Meta    | Alerta |
| ------------------- | ------- | ------ |
| Crash-free sessions | > 99.5% | < 99%  |
| ANR rate            | < 0.1%  | > 0.5% |
| Error rate          | < 1%    | > 5%   |

### Performance

| Métrica       | Meta    | Alerta |
| ------------- | ------- | ------ |
| Cold start    | < 2s    | > 3s   |
| API response  | < 1s    | > 3s   |
| Screen render | < 500ms | > 1s   |

### Testing

| Métrica       | Meta        | Frequência  |
| ------------- | ----------- | ----------- |
| E2E pass rate | 100%        | Cada commit |
| Monkey test   | Sem crashes | Diário      |
| Coverage      | > 80%       | Semanal     |

## 🎯 Workflows

### Workflow de Desenvolvimento

```bash
# 1. Desenvolva feature
# 2. Adicione logs
git add src/shared/utils/logger.ts

# 3. Adicione error tracking
git add src/shared/services/sentry.ts

# 4. Teste localmente
npm run test:monkey

# 5. Commit
git commit -m "feat: add new feature with proper logging"
```

### Workflow de Debug

```bash
# 1. Reproduza bug
npm run test:e2e

# 2. Veja logs
# Console mostra request ID + curl

# 3. Teste curl
curl -X POST '...'

# 4. Fix e teste novamente
```

### Workflow de Release

```bash
# 1. Rode todos testes
npm run test:e2e:all

# 2. Monkey test
npm run test:monkey

# 3. Verifique Sentry
# Nessun error novo

# 4. Deploy
```

## 🛠 Troubleshooting

### Maestro não encontra device

```bash
# Android
adb devices
# Se vazio: habilite USB debugging

# iOS
xcrun simctl list devices
# Se vazio: abra Simulator

# Verifique
maestro list-devices
```

### Sentry não envia erros

```bash
# Verifique DSN
echo $EXPO_PUBLIC_SENTRY_DSN

# Verifique se enabled
grep SENTRY_ENABLED .env.development

# Teste em dev
# Erros podem ser ignorados no ignoreErrors
```

### Logs não aparecem

```bash
# Verifique log level
grep LOG_LEVEL .env.development

# Deve ser 'debug' para ver tudo
EXPO_PUBLIC_LOG_LEVEL=debug
```

## 📚 Recursos

### Documentação Interna

- [LOGGER.md](./LOGGER.md) - Docs do logger
- [TESTING_STRATEGY.md](./TESTING_STRATEGY.md) - Estratégia completa
- [TESTING_EXAMPLES.md](./TESTING_EXAMPLES.md) - Exemplos práticos

### Links Externos

- [Sentry React Native](https://docs.sentry.io/platforms/react-native/)
- [Maestro](https://maestro.mobile.dev/)
- [Mixpanel](https://developer.mixpanel.com/docs/react-native)

## ✅ Checklist de Implementação

### Feature Nova

- [ ] Adicionou logs com `logger.*`?
- [ ] Adicionou `trackError` nos catches?
- [ ] Adicionou `trackUserAction` nas ações?
- [ ] Testou com monkey test?
- [ ] Atualizou docs?

### Bug Fix

- [ ] Identificou causa raiz?
- [ ] Adicionou logs no fluxo?
- [ ] Adicionou error tracking?
- [ ] Testou fix com E2E?
- [ ] Verificou no Sentry?

### Release

- [ ] Rode todos E2E tests?
- [ ] Rode monkey test?
- [ ] Verificou métricas no Sentry?
- [ ] Atualizou changelog?

## 🎓 Próximos Passos

### Imediato

- [ ] Configurar Sentry project
- [ ] Testar monkey test
- [ ] Adicionar logs em todos hooks

### Curto Prazo

- [ ] Configurar CI/CD com testes
- [ ] Dashboard no Sentry
- [ ] Alertas de erro

### Médio Prazo

- [ ] Analytics (Mixpanel)
- [ ] Heatmaps
- [ ] A/B testing

### Longo Prazo

- [ ] Chaos engineering
- [ ] Performance budgets
- [ ] Automated rollback
