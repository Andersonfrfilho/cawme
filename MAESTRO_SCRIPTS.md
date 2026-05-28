# Scripts Maestro para Provider Profile Setup

## Scripts Adicionados ao package.json

```json
"test:provider:profile:happy": "npm run maestro -- test .maestro/flows/provider-profile-happy-path-flow.yaml",
"test:provider:profile:validation": "npm run maestro -- test .maestro/flows/provider-profile-validation-flow.yaml",
"test:provider:profile": "npm run test:provider:profile:happy && npm run test:provider:profile:validation",
"test:provider:all": "npm run test:e2e:provider && npm run test:provider:profile"
```

## Como Rodar os Testes

### ✅ Happy Path (Fluxo completo bem-sucedido)
```bash
npm run test:provider:profile:happy
```
**O que testa:**
- Selecionar 2 categorias
- Adicionar 2 serviços com preços
- Configurar disponibilidade para 3 dias
- Revisar e submeter
- Verificar redirecionamento para home

**Tempo estimado:** 30-40 segundos

---

### ⚠️ Validation (Validações e erros)
```bash
npm run test:provider:profile:validation
```
**O que testa:**
- Botão "Continuar" desabilitado sem seleções
- Validação de formulário vazio
- Estados desabilitados em cada tela
- Fluxo mínimo válido (1 categoria, 1 serviço, 1 dia)

**Tempo estimado:** 25-35 segundos

---

### 🎯 Ambos os Testes (Provider Profile)
```bash
npm run test:provider:profile
```
**O que testa:** Happy path + validation (ambos em sequência)

**Tempo estimado:** 60-75 segundos

---

### 🏢 Todos os Testes de Provider (Sprint 1.5 completo)
```bash
npm run test:provider:all
```
**O que testa:**
1. Registro como Provider (test:e2e:provider)
2. Verificação obrigatória
3. Upload de documento obrigatório
4. Seleção de contractor opcional
5. **[NOVO]** Setup do perfil (happy path + validation)

**Tempo estimado:** 5-7 minutos

---

## Scripts Existentes de Teste

### Todos os Testes E2E
```bash
npm run test:e2e:all
```
Executa **TODOS** os fluxos Maestro no projeto (20+ fluxos)

### Testes de Registro (Contractor)
```bash
npm run test:e2e:happy
```
Registros com sucesso (várias variações de documento)

### Testes de Erros de Registro
```bash
npm run test:e2e:errors
```
Validações e duplicatas

### Testes de Provider (Antes do Sprint 1.5)
```bash
npm run test:e2e:provider
```
- Registro como provider
- Verificação obrigatória
- Upload de documento obrigatório
- Verificação opcional para contractor

### Testes de Retomada (Resume)
```bash
npm run test:e2e:resume
```
Fluxos de retomada de registro

---

## Scripts Úteis para Debugging

### Listar Devices/Simuladores Disponíveis
```bash
npm run test:maestro:devices
```

### Status do Maestro
```bash
npm run test:maestro:status
```

### Rodar Maestro Manualmente (Completo)
```bash
PATH=$PATH:$HOME/.maestro/bin maestro test .maestro/flows/provider-profile-happy-path-flow.yaml
```

### Rodar com Verbose Output
```bash
PATH=$PATH:$HOME/.maestro/bin maestro test .maestro/flows/provider-profile-happy-path-flow.yaml --verbose
```

---

## Fluxo de Testes Recomendado

### Para QA Rápido (5 minutos)
```bash
npm run test:provider:profile
```

### Para QA Completo (10-15 minutos)
```bash
npm run test:provider:all
```

### Para Full Regression (30 minutos+)
```bash
npm run test:e2e:all
```

---

## Troubleshooting

### Erro: "maestro: command not found"
```bash
# Instalar Maestro
brew install mobile-dev-io/tap/maestro

# Ou adicionar ao PATH
export PATH=$PATH:$HOME/.maestro/bin
```

### Erro: "Device not available"
```bash
# Verificar devices disponíveis
npm run test:maestro:devices

# Ou iniciar simulator/emulator manualmente
open -a Simulator  # iOS
```

### Erro: Timeout na tela
Aumentar timeout no arquivo YAML:
```yaml
- extendedWaitUntil:
    visible: "texto"
    timeout: 20000  # aumentar de 15000 para 20000
```

### Erro: Element not found
Verificar se testID está presente:
```bash
grep -r "testID=\"nome-do-elemento\"" src/modules/auth/screens/provider-profile/
```

---

## Métricas e Performance

| Teste | Duração | Elementos | Status |
|-------|---------|-----------|--------|
| provider-profile:happy | 30-40s | 4 telas | ✅ Passing |
| provider-profile:validation | 25-35s | 4 telas | ✅ Passing |
| provider:all | 5-7m | Registration + Profile | ✅ Passing |
| e2e:all | 30m+ | 20+ flows | ✅ Passing |

---

## Integração CI/CD

### GitHub Actions Example
```yaml
- name: Run Provider Profile Tests
  run: |
    npm run test:provider:profile
    
- name: Run Provider Complete Tests
  run: |
    npm run test:provider:all
```

### GitLab CI Example
```yaml
test:provider:profile:
  script:
    - npm run test:provider:profile
  timeout: 5 minutes

test:provider:all:
  script:
    - npm run test:provider:all
  timeout: 10 minutes
```

---

## Comandos Rápidos

```bash
# Happy path
npm run test:provider:profile:happy

# Validation
npm run test:provider:profile:validation

# Ambos
npm run test:provider:profile

# Com providers anteriores
npm run test:provider:all

# Ver devices
npm run test:maestro:devices

# Status
npm run test:maestro:status
```

---

## Próximas Adições

- [ ] test:provider:profile:network-error (para offline)
- [ ] test:provider:profile:concurrent (múltiplos usuários)
- [ ] test:provider:profile:performance (medir tempos)
- [ ] test:provider:profile:accessibility (a11y)

---

## Support

Para mais detalhes, consultar:
- `TESTING_GUIDE.md` — Procedimentos de teste detalhados
- `SPRINT_1_5_COMPLETION.md` — Implementação técnica
- `.maestro/flows/*.yaml` — Fluxos específicos
