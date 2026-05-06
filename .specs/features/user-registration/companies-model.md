# Modelo de Dados — Empresas (Companies)

> **Contexto:** O app Cawme permite tanto pessoas físicas (CPF/RG/Passaporte) quanto empresas (CNPJ) se cadastrarem. Quando o documento informado é um CNPJ, o sistema deve criar uma entrada na tabela `companies` e vincular o usuário como sócio/administrador.

---

## Tabela: `companies`

Armazena os dados da empresa jurídica.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID / SERIAL | PK | Identificador único |
| `document` | VARCHAR(20) | UNIQUE | CNPJ (apenas números, sem máscara) |
| `company_name` | VARCHAR(255) | Sim | Razão Social |
| `trade_name` | VARCHAR(255) | Não | Nome Fantasia |
| `email` | VARCHAR(255) | Sim | E-mail corporativo |
| `phone` | VARCHAR(20) | Sim | Telefone corporativo |
| `state_registration` | VARCHAR(20) | Não | Inscrição Estadual (IE) |
| `municipal_registration` | VARCHAR(20) | Não | Inscrição Municipal (IM) |
| `status` | ENUM | Sim | `active`, `inactive`, `pending` |
| `created_at` | TIMESTAMP | Sim | Data de criação |
| `updated_at` | TIMESTAMP | Sim | Data da última atualização |

**Índices sugeridos:**
- `UNIQUE(document)` — CNPJ deve ser único
- `INDEX(status)` — Filtros por status
- `INDEX(company_name)` — Busca por nome
- `INDEX(trade_name)` — Busca por nome fantasia

---

## Tabela: `company_members` (Sócios / Vínculos)

Relaciona usuários (pessoas físicas) às empresas. Um usuário pode estar em várias empresas; uma empresa pode ter vários sócios.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID / SERIAL | PK | Identificador único |
| `company_id` | UUID / FK | Sim | Ref. `companies.id` |
| `user_id` | UUID / FK | Sim | Ref. `users.keycloakId` |
| `role` | ENUM | Sim | `admin`, `partner`, `employee` |
| `status` | ENUM | Sim | `active`, `inactive`, `pending` |
| `joined_at` | TIMESTAMP | Sim | Data do vínculo |
| `created_at` | TIMESTAMP | Sim | Data de criação |
| `updated_at` | TIMESTAMP | Sim | Data da última atualização |

**Restrições:**
- `UNIQUE(company_id, user_id)` — Um usuário não pode ser vinculado duas vezes à mesma empresa
- `FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE`
- `FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE`

---

## Tabela: `company_providers` (Provedores Vinculados)

Relaciona **provedores de serviço** (prestadores) às empresas. Uma empresa pode ter vários provedores vinculados; um provedor pode trabalhar para várias empresas.

Isso permite que empresas (ex: empresas de limpeza, construtoras) cadastrem seus funcionários/profissionais na plataforma para prestarem serviços em nome da empresa.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID / SERIAL | PK | Identificador único |
| `company_id` | UUID / FK | Sim | Ref. `companies.id` |
| `provider_id` | UUID / FK | Sim | Ref. `users.id` (usuário com role `provider`) |
| `role` | ENUM | Sim | `employee`, `manager`, `freelancer` |
| `commission_rate` | DECIMAL(5,2) | Não | Percentual de comissão pago ao provedor (ex: 70.00 = 70%) |
| `fixed_salary` | DECIMAL(10,2) | Não | Salário fixo mensal (se aplicável) |
| `status` | ENUM | Sim | `active`, `inactive`, `pending` |
| `assigned_at` | TIMESTAMP | Sim | Data do vínculo |
| `created_at` | TIMESTAMP | Sim | — |
| `updated_at` | TIMESTAMP | Sim | — |

**Restrições:**
- `UNIQUE(company_id, provider_id)` — Um provedor não pode ser vinculado duas vezes à mesma empresa
- `FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE`
- `FOREIGN KEY(provider_id) REFERENCES users(id) ON DELETE CASCADE`
- `CHECK(commission_rate >= 0 AND commission_rate <= 100)` — Comissão entre 0% e 100%

### Cenários de Uso

| Cenário | Descrição |
|---|---|
| **Empresa de Limpeza** | Cadastra 10 faxineiros como `company_providers`. Clientes contratam serviços pela empresa, e a plataforma distribui entre os provedores disponíveis |
| **Construtora** | Cadastra pedreiros, eletricistas, encanadores. A empresa recebe o pagamento e repassa ao provedor conforme comissão |
| **Freelancer Associado** | Provedor individual se vincula a uma empresa como `freelancer` para receber indicações de clientes |

### Fluxo de Vinculação de Provedor

```
1. Admin da empresa acessa "Gerenciar Provedores"
2. Pesquisa usuário por email/CPF ou envia convite por email
3. Provedor aceita convite (ou é adicionado diretamente pelo admin)
4. Sistema cria vínculo em `company_providers` com status = 'pending'
5. Após aceite, status = 'active' e provedor pode receber ordens da empresa
```

---

## Tabela: `company_addresses`

Endereços da empresa. Uma empresa pode ter vários endereços (matriz, filiais, etc).

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID / SERIAL | PK | Identificador único |
| `company_id` | UUID / FK | Sim | Ref. `companies.id` |
| `type` | ENUM | Sim | `headquarters`, `branch`, `billing`, `delivery` |
| `zip_code` | VARCHAR(10) | Sim | CEP |
| `street` | VARCHAR(255) | Sim | Logradouro |
| `number` | VARCHAR(20) | Sim | Número |
| `complement` | VARCHAR(100) | Não | Complemento |
| `neighborhood` | VARCHAR(100) | Sim | Bairro |
| `city` | VARCHAR(100) | Sim | Cidade |
| `state` | VARCHAR(2) | Sim | UF (ex: SP, RJ) |
| `country` | VARCHAR(2) | Sim | País (padrão: BR) |
| `latitude` | DECIMAL(10,8) | Não | Latitude |
| `longitude` | DECIMAL(11,8) | Não | Longitude |
| `is_default` | BOOLEAN | Sim | Endereço principal da empresa |
| `created_at` | TIMESTAMP | Sim | — |
| `updated_at` | TIMESTAMP | Sim | — |

**Restrições:**
- `FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE`
- `UNIQUE(company_id, type)` quando `type = 'headquarters'` — Só um endereço matriz por empresa

---

## Tabela: `company_emails`

Emails da empresa. Uma empresa pode ter vários emails (vendas, suporte, financeiro, etc).

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID / SERIAL | PK | Identificador único |
| `company_id` | UUID / FK | Sim | Ref. `companies.id` |
| `email` | VARCHAR(255) | Sim | Endereço de email |
| `type` | ENUM | Sim | `commercial`, `billing`, `support`, `sales`, `general` |
| `is_default` | BOOLEAN | Sim | Email principal de contato |
| `created_at` | TIMESTAMP | Sim | — |
| `updated_at` | TIMESTAMP | Sim | — |

**Restrições:**
- `FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE`
- `UNIQUE(company_id, email)` — Não repetir o mesmo email na mesma empresa

---

## Tabela: `company_phones`

Telefones da empresa. Uma empresa pode ter vários telefones (fixo, celular, WhatsApp, etc).

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID / SERIAL | PK | Identificador único |
| `company_id` | UUID / FK | Sim | Ref. `companies.id` |
| `phone` | VARCHAR(20) | Sim | Número com DDD |
| `type` | ENUM | Sim | `landline`, `mobile`, `whatsapp`, `fax` |
| `is_default` | BOOLEAN | Sim | Telefone principal |
| `created_at` | TIMESTAMP | Sim | — |
| `updated_at` | TIMESTAMP | Sim | — |

**Restrições:**
- `FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE`

---

## Tabela: `company_business_hours`

Horário de disponibilidade / funcionamento da empresa. Permite configurar horários por dia da semana.

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | UUID / SERIAL | PK | Identificador único |
| `company_id` | UUID / FK | Sim | Ref. `companies.id` |
| `day_of_week` | TINYINT | Sim | 0=Dom, 1=Seg, ..., 6=Sáb |
| `is_open` | BOOLEAN | Sim | Aberto neste dia? |
| `open_time` | TIME | Não | Horário de abertura (se `is_open = true`) |
| `close_time` | TIME | Não | Horário de fechamento (se `is_open = true`) |
| `created_at` | TIMESTAMP | Sim | — |
| `updated_at` | TIMESTAMP | Sim | — |

**Restrições:**
- `FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE`
- `UNIQUE(company_id, day_of_week)` — Só um registro por dia por empresa
- `CHECK(open_time < close_time)` — Horário de abertura deve ser anterior ao fechamento

**Exemplo de dados:**
```json
[
  { "day_of_week": 1, "is_open": true, "open_time": "08:00", "close_time": "18:00" },
  { "day_of_week": 2, "is_open": true, "open_time": "08:00", "close_time": "18:00" },
  { "day_of_week": 6, "is_open": false, "open_time": null, "close_time": null }
]
```

---

## Fluxo de Cadastro

### Fase 1 — Cadastro do Representante (Pessoa Física)

Sempre começa como pessoa física, independente de pretender criar empresa depois:

```
1. Usuário preenche dados pessoais (nome, email, telefone, CPF)
2. Verificação por código (email + SMS)
3. Aceite dos termos
4. Registro no Keycloak como usuário padrão (role: contractor/provider)
```

### Fase 2 — Criar Empresa (Pós-cadastro, opcional)

Acessível via menu "Minha Empresa" ou "Criar Empresa" no perfil:

```
1. Usuário informa CNPJ
2. Sistema valida CNPJ e verifica se já existe
3. Usuário preenche dados da empresa:
   - Razão Social, Nome Fantasia
   - Email e telefone corporativos
   - Endereço completo
   - IE / IM (opcional)
   - Horários de funcionamento
4. Ao salvar:
   a. Cria registro na tabela `companies`
   b. Cria vínculo na `company_members` com role = 'admin'
   c. Usuário logado vira representante legal automaticamente
```

> **Vantagem:** O onboarding inicial permanece curto e focado. Empresa é um passo opcional posterior.

---

## Endpoints Relacionados

### Criar Empresa (implícito no registro)
O endpoint `POST /bff/onboarding/register` já aceita os campos `companyName` e `tradeName`. O BFF deve:
1. Criar o usuário no Keycloak
2. Criar a empresa na tabela `companies`
3. Criar o vínculo na tabela `company_members`

### Listar Minhas Empresas
```
GET /bff/companies/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "companies": [
    {
      "id": "uuid",
      "companyName": "Empresa LTDA",
      "tradeName": "Empresa",
      "document": "12345678000195",
      "role": "admin",
      "status": "active"
    }
  ]
}
```

### Adicionar Sócio a Empresa
```
POST /bff/companies/{companyId}/members
Authorization: Bearer <token> (requer role = admin)
```

**Request body:**
```json
{
  "userId": "uuid-do-usuario",
  "role": "partner"
}
```

### Remover Sócio
```
DELETE /bff/companies/{companyId}/members/{userId}
Authorization: Bearer <token> (requer role = admin)
```

---

## Campos no Formulário de Registro (Mobile)

O cadastro de empresa é dividido em **duas etapas** para não tornar o onboarding longo e cansativo.

### Etapa 1 — Cadastro Inicial (Tela de Registro)

Campos que aparecem no fluxo de registro quando `documentType === "cnpj"`:

| Campo UI | Chave API | Obrigatório | Placeholder |
|---|---|---|---|
| Razão Social | `companyName` | Sim | "Razão Social" |
| Nome Fantasia | `tradeName` | Não | "Nome Fantasia (opcional)" |
| Email Comercial | `companyEmail` | Sim | "empresa@exemplo.com" |
| Telefone Comercial | `companyPhone` | Sim | "(11) 99999-9999" |

> **Nota:** `firstName` / `lastName` continuam obrigatórios e representam o **Representante Legal** (primeiro sócio/admin).

### Etapa 2 — Completar Perfil da Empresa (Tela separada, pós-cadastro)

Acessível via menu "Minha Empresa" após login. Campos adicionais:

| Campo UI | Chave API | Obrigatório | Tabela |
|---|---|---|---|
| Inscrição Estadual | `stateRegistration` | Não | `companies` |
| Inscrição Municipal | `municipalRegistration` | Não | `companies` |
| CEP | `zipCode` | Sim | `company_addresses` |
| Logradouro | `street` | Sim | `company_addresses` |
| Número | `number` | Sim | `company_addresses` |
| Complemento | `complement` | Não | `company_addresses` |
| Bairro | `neighborhood` | Sim | `company_addresses` |
| Cidade | `city` | Sim | `company_addresses` |
| UF | `state` | Sim | `company_addresses` |
| Horário de Funcionamento | `businessHours[]` | Não | `company_business_hours` |
| Emails Adicionais | `emails[]` | Não | `company_emails` |
| Telefones Adicionais | `phones[]` | Não | `company_phones` |

> **Endereço:** O primeiro endereço cadastrado recebe `type = 'headquarters'` e `is_default = true`.
> **Horários:** Interface visual com toggle por dia da semana + campos de hora (apenas se "Aberto" estiver ativo).

---

## Decisões de Arquitetura

- **Empresa ≠ Usuário:** A empresa é uma entidade separada no banco. O CNPJ não substitui o CPF do usuário — ele complementa.
- **Sócio padrão:** O usuário que realiza o cadastro com CNPJ é automaticamente o primeiro `admin` da empresa.
- **Multi-empresa:** Um mesmo usuário (pessoa física) pode ser sócio/admin de várias empresas.
