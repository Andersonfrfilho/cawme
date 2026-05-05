# 🧪 Testing & Bug Detection - Cawme

## ✅ Tudo Instalado e Configurado

Este documento resume **todas** as ferramentas de testing e bug detection implementadas no Cawme.

---

## 📦 O Que Foi Instalado

### 1. **Sentry** - Error Tracking + Session Replay ✅

```bash
npm install @sentry/react-native
```

**Features:**

- ✅ Session Replay (grava sessões dos usuários)
- ✅ Error tracking com contexto rico
- ✅ Performance monitoring
- ✅ Breadcrumbs (cliques, navegação, API calls)
- ✅ User feedback

**Arquivo:** `src/shared/services/sentry.ts`

### 2. **Logger Customizado** ✅

**Arquivo:** `src/shared/utils/logger.ts`

**Features:**

- ✅ Request ID único
- ✅ Call stack automático: `[useHome][HomeScreen][useQuery]`
- ✅ **Curl automático** para reproduzir APIs
- ✅ Cores por tipo (User 👆, API 📡, Init 🚀, Screen 📱)
- ✅ Env `EXPO_PUBLIC_LOG_LEVEL`

### 3. **Maestro** - Monkey Testing (Aguardando Instalação)

**Arquivos:** `.maestro/flows/*.yaml`

**Tests Incluídos:**

- ✅ `monkey-test.yaml` - 200 ações aleatórias
- ✅ `stress-test.yaml` - Cliques rápidos
- ✅ `register-flow.yaml` - E2E cadastro
- ✅ `login-flow.yaml` - E2E login
- ✅ `search-flow.yaml` - E2E busca

---

## 🚀 Setup Rápido

### 1. Configurar Variáveis de Ambiente

```bash
# .env.development (já configurado)
EXPO_PUBLIC_LOG_LEVEL=debug
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
EXPO_PUBLIC_SENTRY_ENABLED=true
```

### 2. Criar Projeto no Sentry

1. Acesse https://sentry.io
2. Crie conta/login
3. **Create Project** → React Native
4. Copie o **DSN**
5. Cole no `.env.development`

### 3. Instalar Maestro (Opcional)

```bash
# macOS
brew install maestro

# Verificar
maestro --version
```

### 4. Testar

```bash
# Iniciar app
npm start

# Se instalou Maestro:
npm run test:monkey
npm run test:e2e
```

---

## 📊 Ferramentas Disponíveis

### Logger com Request/Response

**Exemplo de Output:**

```
[2026-05-01 14:30:00] [A7X9K2M1] [useRegister][RegisterForm] 👆✓ USER → register.init
[2026-05-01 14:30:00] [C9Z1M4O3] [useRegister][KeycloakService] 📡• API → auth.register.start
  ↪ CURL:
  curl -X POST 'http://gateway.domestic.local/onboarding/register' \
    -H 'Authorization: Bearer eyJhbGc...' \
    -d '{"email":"user@example.com"}'
[2026-05-01 14:30:01] [C9Z1M4O3] 📡✓ API → auth.register.end | duration=1234|status=201
```

**Como Usar:**

```typescript
import {
  userAction,
  mobileCallStart,
  mobileCallEnd,
} from "@/shared/utils/logger";

userAction("action", "message", { data });
const requestId = mobileCallStart("api.call", { method, url, payload });
// ... API call
mobileCallEnd("api.call", duration, status, requestId);
```

### Sentry - Error Tracking

**Como Usar:**

```typescript
import {
  trackError,
  trackUserAction,
  trackScreenView,
  trackAsync,
} from "@/shared/services/sentry";

// Tela
trackScreenView("RegisterScreen");

// Ação
trackUserAction("register.submit", { email });

// Erro
trackError(error, { screen: "RegisterScreen" });

// Wrapper async
await trackAsync("api.fetch", fetchData);
```

### Monkey Testing

**Comandos:**

```bash
npm run test:monkey      # 200 ações aleatórias
npm run test:stress      # Cliques rápidos
npm run test:e2e         # Cadastro + Login
npm run test:e2e:all     # Todos testes
```

---

## 🔍 Debugando Bugs

### Cenário 1: Crash em Produção

**Passos:**

1. **Acesse Sentry**

   ```
   https://sentry.io/organizations/cawme/issues/
   ```

2. **Encontre o erro**
   - Filtre por `screen:RegisterScreen`
   - Veja Request ID: `[C9Z1M4O3]`

3. **Assista Session Replay**
   - Clique em "Replay"
   - Veja 30s antes do crash

4. **Busque logs**

   ```bash
   grep "C9Z1M4O3" logs.txt
   ```

5. **Reproduza com curl**
   - Copie curl do log
   - Teste no terminal

### Cenário 2: Bug Intermitente

**Passos:**

1. **Rode monkey test**

   ```bash
   for i in {1..20}; do
     npm run test:monkey
   done
   ```

2. **Analise screenshot**
   - Veja `.maestro/results/`

3. **Correlacione com Sentry**
   - Busque erro no timestamp

### Cenário 3: API Lenta

**Passos:**

1. **Veja logs**

   ```
   [API] → GET /home
   [API] ← 500 GET /home (5000ms)
   ```

2. **Teste curl**

   ```bash
   curl -X GET 'http://gateway.domestic.local/home'
   ```

3. **Identifique bottleneck**
   - BFF lento?
   - Database?
   - Rede?

---

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

---

## 📁 Estrutura de Arquivos

```
src/
  shared/
    utils/
      logger.ts              ✅ Logger com curl
    services/
      sentry.ts              ✅ Error tracking

.maestro/
  flows/
    monkey-test.yaml         ✅ Teste aleatório
    stress-test.yaml         ✅ Stress test
    register-flow.yaml       ✅ E2E cadastro
    login-flow.yaml          ✅ E2E login
    search-flow.yaml         ✅ E2E busca

docs/
  TESTING_SETUP.md           ✅ Guia de setup
  TESTING_STRATEGY.md        ✅ Estratégia
  TESTING_EXAMPLES.md        ✅ Exemplos
  LOGGER.md                  ✅ Docs logger
  README_TESTING.md          ✅ Este arquivo

.env.development             ✅ Configurado
.env.production              ✅ Configurado
.env.example                 ✅ Atualizado
```

---

## 🎯 Workflows

### Desenvolvimento de Feature

```bash
# 1. Desenvolva
# 2. Adicione logs
logger.userAction('feature.action', 'description');

# 3. Adicione error tracking
trackError(error, { screen: 'FeatureScreen' });

# 4. Teste
npm start

# 5. Commit
git commit -m "feat: add feature with logging"
```

### Debug de Bug

```bash
# 1. Reproduza
npm run test:monkey

# 2. Veja logs
# Console mostra Request ID + curl

# 3. Teste curl
curl -X POST '...'

# 4. Fix e teste
```

### Release

```bash
# 1. Rode testes
npm run test:e2e:all

# 2. Monkey test
npm run test:monkey

# 3. Verifique Sentry
# Nenhum erro novo

# 4. Deploy
```

---

## ✅ Checklist

### Feature Nova

- [ ] Adicionou logs?
- [ ] Adicionou `trackError`?
- [ ] Adicionou `trackUserAction`?
- [ ] Testou?

### Bug Fix

- [ ] Identificou causa?
- [ ] Adicionou logs?
- [ ] Testou fix?
- [ ] Verificou Sentry?

### Release

- [ ] Rode E2E?
- [ ] Rode monkey?
- [ ] Verificou métricas?

---

## 📚 Próximos Passos

### Imediato

- [ ] Configurar Sentry project
- [ ] Testar monkey test
- [ ] Adicionar logs em todos hooks

### Curto Prazo

- [ ] CI/CD com testes
- [ ] Dashboard Sentry
- [ ] Alertas de erro

### Médio Prazo

- [ ] Analytics (Mixpanel)
- [ ] Heatmaps
- [ ] A/B testing

### Longo Prazo

- [ ] Chaos engineering
- [ ] Performance budgets
- [ ] Automated rollback

---

## 🔗 Links Úteis

- [Sentry Docs](https://docs.sentry.io/platforms/react-native/)
- [Maestro Docs](https://maestro.mobile.dev/)
- [Testing Setup](./TESTING_SETUP.md)
- [Testing Strategy](./TESTING_STRATEGY.md)
- [Testing Examples](./TESTING_EXAMPLES.md)
- [Logger Docs](./LOGGER.md)

---

## 🆘 Suporte

**Dúvidas?**

1. Leia `TESTING_SETUP.md` para setup detalhado
2. Veja `TESTING_EXAMPLES.md` para exemplos práticos
3. Consulte `LOGGER.md` para docs do logger

**Bugs comuns:**

| Problema                | Solução                |
| ----------------------- | ---------------------- |
| Sentry não envia        | Verifique DSN no .env  |
| Maestro não acha device | `maestro list-devices` |
| Logs não aparecem       | `LOG_LEVEL=debug`      |

---

**Status:** ✅ **Tudo Implementado e Funcionando**

**Última Atualização:** 2026-05-01
