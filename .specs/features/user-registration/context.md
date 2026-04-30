# User Registration — Contexto (Decisões do Usuário)

**Feature:** `FEAT-REG-001` — Registro de Usuário  
**Data:** 2026-04-29

---

## GA-01 — Fluxo pós-registro
**Decisão:** Tela de sucesso com instruções  
**Rationale:** Após registro, exibir tela "Verifique seu email para ativar sua conta". Usuário não faz auto-login — deve verificar email primeiro.

## GA-02 — Verificação de Email
**Decisão:** Sim, verificar email  
**Impacto:** `verifyEmail: true` no realm do Keycloak. Keycloak envia email de verificação automaticamente após criação do usuário. Usuário só consegue logar após verificar.

## GA-03 — Tipo de Usuário (Contractor vs Provider)
**Decisão:** Escolha no registro  
**Impacto:** Campo obrigatório tipo select na tela. Labels: "Quero contratar serviços" / "Quero prestar serviços". Mapeia para realm roles `contractor` / `provider`.

## GA-04 — Termos de Uso e Privacidade
**Decisão:** Sim, checkbox obrigatório  
**Impacto:** Checkbox "Aceito os Termos de Uso e Política de Privacidade" com links clicáveis. Campo obrigatório no formulário.

## GA-05 — Autenticação do BFF com Keycloak Admin API
**Decisão:** Service account existente (`domestic-backend-bff`)  
**Impacto:** BFF usa client credentials grant para obter token de admin e chamar Keycloak Admin REST API. Service account `service-account-domestic-backend-bff` já existe no realm com roles apropriadas. Client secret `backend-bff-client-secret` configurado como env var `KEYCLOAK_CLIENT_SECRET` no BFF.
