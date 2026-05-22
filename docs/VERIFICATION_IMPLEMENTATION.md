# Real-Time Field Verification - Implementation Complete

## ✅ Completed

### 1. Hook Implementation

**File**: `src/modules/auth/hooks/useFieldVerification.ts`

Features:

- ✅ 500ms debounce to prevent excessive API calls
- ✅ AbortController cancels stale requests when user types quickly
- ✅ Field mapping: `cpf` → `document` (API expects "document")
- ✅ Minimum length validation before API call:
  - Email: 5 chars
  - Phone: 10 digits
  - CPF: 11 digits
- ✅ Handles all error scenarios:
  - `409`: Field already registered (shows inline error + forgot password button)
  - `429`: Rate limit (handled silently, stops verification)
  - `400/422`: Invalid format (shows validation error)
  - Generic errors: Graceful fallback

### 2. Screen Integration

**File**: `src/modules/auth/screens/register/register.screen.tsx`

Features:

- ✅ Watches field changes with `watch()`
- ✅ Triggers verification on each field change
- ✅ Restores state when returning from `/terms` screen
- ✅ Merges server errors with verification results
- ✅ Blocks navigation if field unavailable

### 3. UI Components

**File**: `src/modules/auth/components/RegisterForm/RegisterForm.component.tsx`

Features:

- ✅ Loading indicators while verifying:
  - "Verificando e-mail..."
  - "Verificando telefone..."
  - "Verificando CPF..."
- ✅ Inline error messages for unavailable fields
- ✅ "Esqueci minha senha" button when email exists (409)
- ✅ Visual feedback with icons

### 4. E2E Tests

**Files**:

- `.maestro/flows/register-verification-flow.yaml` - Full registration flow
- `.maestro/flows/stress-verification-test.yaml` - Rate limit testing

## 📋 API Endpoints (BFF → API)

| Field | Endpoint | Body | API Target |
|-------|----------|------|------------|
| Email | `POST /bff/onboarding/verify/email` | `{ email }` | `POST /v1/auth/verify/email` |
| Phone | `POST /bff/onboarding/verify/phone` | `{ phone }` | `POST /v1/auth/verify/phone` |
| Document | `POST /bff/onboarding/verify/document` | `{ document }` | `POST /v1/auth/verify/document` |

### Field Mapping (useFieldVerification.ts)

```typescript
const apiFieldMap: Record<string, string> = {
  email: 'email',
  phone: 'phone',
  document: 'document',  // CPF, CNPJ, RG, Passport
};
```

O mobile envia `document` (não `cpf`). A API infere o tipo pelo número de dígitos (11=CPF, 14=CNPJ).

### Registration

```json
POST /bff/onboarding/register
{
  "email": "user@example.com",
  "firstName": "João",
  "lastName": "Silva",
  "phone": "16999999999",
  "password": "***",
  "cpf": "12345678900"    // ← usar "cpf" ou "cnpj"
}
```

O CPF/CNPJ é automaticamente salvo como `UserDocument` com `status: "PENDING"`.

### Document Verification (Photo Upload)

> ⚙️ **Feature flag:** `documentPhotoVerification` (desabilitada por padrão)

Quando ativa, o usuário deve enviar foto do documento após o cadastro:

| Método | Path | Descrição |
|--------|------|-----------|
| POST | `/bff/onboarding/documents/upload` | Upload de foto (multipart) |
| GET | `/v1/users/me/documents` | Listar documentos do usuário |
| PUT | `/v1/documents/:id/approve` | Admin aprova |
| PUT | `/v1/documents/:id/reject` | Admin rejeita |

### Document Status

| Status | Significado |
|--------|-------------|
| `PENDING` | Documento cadastrado, aguardando foto |
| `VERIFIED` | Documento verificado (aprovado) |
| `REJECTED` | Documento rejeitado |

### Response Format

```json
// 200 - Available
{ "valid": true, "available": true }

// 409 - Already Registered
{ "message": "Email already registered" }

// 429 - Rate Limit
{ "message": "Too many requests" }

// 400 - Invalid Format
{ "message": "Invalid email format" }
```

### Feature Flags

```json
GET /bff/app-config → {
  "features": {
    "chatEnabled": true,
    "notificationsEnabled": true,
    "reviewsEnabled": true,
    "providerSearchEnabled": true,
    "documentPhotoVerification": false   // ← toggle quando implementar upload
  }
}
```

## 🎯 User Flow

1. User types email → 500ms debounce → API verifica (Keycloak + DB)
2. User types phone → 500ms debounce → API verifica (DB)
3. User types document → 500ms debounce → API verifica (DB)
4. If available → No error shown, user can continue
5. If exists (409) → Shows inline error + "Esqueci minha senha" button
6. If rate limited (429) → Silently stops, no error shown
7. User cannot advance to `/terms` if field unavailable
8. **Registration**: CPF/CNPJ saved as UserDocument (status: PENDING)
9. **After registration**: User can upload document photo (if feature flag enabled)

### Verification After Registration

Se usuário optar por "Verificar depois":
- Conta criada com status `PENDING`
- Login verifica `GET /v1/users/me/documents` + status
- Redireciona para verificação se email/phone não verificados

## 🔒 Rate Limiting

Backend implements:

- 5 requests/minute per field
- 10 requests/minute per session

Frontend handles:

- Debounce reduces API calls
- AbortController cancels stale requests
- Graceful 429 handling

## 🧪 Testing

### Run E2E Tests

```bash
# Full registration flow
maestro test .maestro/flows/register-verification-flow.yaml

# Stress test (rate limiting)
maestro test .maestro/flows/stress-verification-test.yaml

# All tests
npm run test:e2e
```

### Manual Testing Checklist

- [ ] Type email slowly → Should verify after 500ms
- [ ] Type email quickly → Should cancel previous requests
- [ ] Enter existing email → Should show error + forgot password button
- [ ] Enter invalid email → Should show format error
- [ ] Spam email field → Should rate limit after 5 requests
- [ ] Try to advance with existing email → Should block navigation

## 📊 Monitoring

### Logs (DEV only)

```bash
# Set log level
EXPO_PUBLIC_LOG_LEVEL=debug
```

### Metrics to Track (Backend)

- Verification success rate
- Rate limit trigger frequency
- Average response time
- Error distribution by type

## 🚀 Next Steps

1. **Test with real backend** - Deploy and verify integration
2. **Add analytics** - Track verification events
3. **Performance monitoring** - Add Sentry breadcrumbs
4. **Accessibility** - Add screen reader support for errors
5. **Unit tests** - Configure Jest and add hook tests

## 📝 Related Documentation

- `kubernetes/flows/API-VERIFICATION-ROUTES.md` - API specification
- `docs/LOGGER.md` - Logging system
- `docs/README_TESTING.md` - Testing guide
