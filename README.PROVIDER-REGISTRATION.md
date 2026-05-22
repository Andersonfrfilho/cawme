# 🚀 Fluxo de Cadastro de Providers (Frontend)

Guia completo do fluxo de onboarding e criação de perfil de providers no Cawme mobile app.

---

## 📋 Visão Geral do Fluxo

O cadastro de providers é dividido em **2 fases principais**:

### **Fase 1: Onboarding (Usuário Base)**
Nova tela/componente: `RegisterScreen` + `VerificationScreen` + `TermsScreen`

```
1. Registro               (email, telefone, documento)
   ↓
2. Upload de Documento   (CPF/CNPJ + arquivo)
   ↓
3. Verificações Obrigatórias
   ├─ Email (código enviado)
   └─ Telefone (código SMS)
   ↓
4. Endereço              (CEP + Geocoding + Mapa)
   ↓
5. Termos de Uso         (checkbox + IP tracking)
   ↓
6. Sucesso               → Login ou Dashboard
```

### **Fase 2: Perfil de Provider**
Nova tela/componente: `ProviderProfileScreen` + `ProviderVerificationScreen`

```
7. Criar Perfil          (serviços, especializações)
   ↓
8. Locais de Trabalho    (endereços onde atua)
   ↓
9. Documentos Adicionais (comprovantes opcionais)
   ↓
10. Submeter para Revisão
    ↓
11. Aguardar Aprovação   (status: PENDING → UNDER_REVIEW → APPROVED/REJECTED)
```

---

## 🎯 Telas Implementadas (Fase 1)

### 1. **RegisterScreen** 
`src/modules/auth/screens/register/register.screen.tsx`

**Responsabilidade:** Formulário de registro com validações em tempo real

**Campos:**
- ✅ Primeiro Nome (required)
- ✅ Sobrenome (required)
- ✅ Email (required, unique check no submit)
- ✅ Telefone (required, unique check no submit)
- ✅ Tipo de Documento (radio: CPF | CNPJ)
- ✅ Documento (required, unique check no submit, mask para CPF/CNPJ)
- ✅ Senha (required, min 8 chars, uppercase + number)
- ✅ Confirmar Senha (required, must match)

**Validação:**
```typescript
// src/modules/auth/screens/register/types.ts
export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'invalid format'),
  documentType: z.enum(['CPF', 'CNPJ']),
  document: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'invalid CPF'),
  password: z.string().min(8).regex(/[A-Z]/, 'needs uppercase').regex(/[0-9]/, 'needs number'),
  passwordConfirmation: z.string(),
}).refine((d) => d.password === d.passwordConfirmation, {
  message: 'passwords do not match',
  path: ['passwordConfirmation'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterScreenParams = { from?: 'welcome' | 'login' };
```

**Hook Usado:**
```typescript
const { register } = useAuth(); // orquestra chamada ao BFF + Keycloak + store
```

**Integração com BFF:**
```typescript
// src/modules/auth/services/onboarding.service.ts
export const OnboardingService = {
  async register(params: RegisterServiceParams): Promise<User> {
    return apiClient.post('/onboarding/register', {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone,
      documentType: params.documentType,
      document: params.document,
      password: params.password,
    });
  },

  async verifyEmail(email: string): Promise<boolean> {
    const { exists } = await apiClient.post('/onboarding/verify/email', { email });
    return exists;
  },

  async verifyPhone(phone: string): Promise<boolean> {
    const { exists } = await apiClient.post('/onboarding/verify/phone', { phone });
    return exists;
  },

  async verifyDocument(document: string): Promise<boolean> {
    const { exists } = await apiClient.post('/onboarding/verify/document', { document });
    return exists;
  },
};
```

---

### 2. **VerificationScreen**
`src/modules/auth/screens/verification/verification.screen.tsx`

**Responsabilidade:** Verificação em 2 abas (Email + Telefone) com códigos

**Estados:**
```typescript
type VerificationTarget = 'email' | 'phone';

interface VerificationStore {
  target: VerificationTarget;           // aba ativa
  emailVerified: boolean;
  phoneVerified: boolean;
  emailCode: string;                    // código digitado
  phoneCode: string;
  codeSentAt: Date | null;
  codeTTL: number;                      // segundos para expirar
  setTarget: (target: VerificationTarget) => void;
  setEmailCode: (code: string) => void;
  setPhoneCode: (code: string) => void;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
}
```

**Fluxo:**
1. User clica "Enviar Código" na aba Email
   - POST `/onboarding/verification/send` → `{ target: "email", destination: email }`
   - Exibe TTL (ex: 5 minutos)
   - Foco no input de código
   
2. User digita código (6 dígitos)
   - Real-time: desabilita botão "Verificar" se incompleto
   
3. User clica "Verificar"
   - POST `/onboarding/verification/verify` → `{ target: "email", code: "123456" }`
   - Se OK: marca como verified, desabilita aba Email, foca Phone
   - Se erro: mostra toast, limpa input
   
4. Repete para Phone
   
5. Ambos verificados → Botão "Continuar" ativo
   - Navega para `AddressScreen` ou `TermsScreen`

**Hook Usado:**
```typescript
const { sendCode, verifyCode } = useVerification();
```

**Integração com BFF:**
```typescript
// src/modules/auth/services/verification.service.ts
export const VerificationService = {
  async sendCode(params: SendCodeParams): Promise<{ expiresIn: number }> {
    const { expiresIn } = await apiClient.post('/onboarding/verification/send', {
      target: params.target === 'phone' ? 'sms' : 'email',
      destination: params.destination,
    });
    return { expiresIn }; // segundos
  },

  async verifyCode(params: VerifyCodeParams): Promise<{ verified: true }> {
    const result = await apiClient.post('/onboarding/verification/verify', {
      target: params.target === 'phone' ? 'sms' : 'email',
      code: params.code,
    });
    return result;
  },
};
```

**Tipagem:**
```typescript
// src/modules/auth/screens/verification/types.ts
export type VerificationTarget = 'email' | 'phone';

export interface VerificationScreenParams {
  email: string;
  phone: string;
  onVerificationComplete?: () => void;
}

export const verificationSchema = z.object({
  code: z.string().length(6, 'must be 6 digits').regex(/^\d+$/, 'only numbers'),
});

export type VerificationFormValues = z.infer<typeof verificationSchema>;
```

---

### 3. **AddressScreen** (Opcional)
`src/modules/auth/screens/address/address.screen.tsx`

**Responsabilidade:** Captura endereço completo com geocoding

**Campos:**
- CEP (formatado: 12345-678)
- Logradouro
- Número
- Complemento (opcional)
- Bairro
- Cidade
- UF

**Integração:**
```typescript
// src/modules/auth/services/onboarding.service.ts
async saveAddress(params: SaveAddressParams): Promise<{ addressId: string }> {
  return apiClient.post('/onboarding/address', {
    cep: params.cep,
    street: params.street,
    number: params.number,
    complement: params.complement,
    district: params.district,
    city: params.city,
    state: params.state,
    latitude: params.latitude,
    longitude: params.longitude, // vem do mapa picker
  });
},
```

Quando user digita CEP:
1. POST `/onboarding/cep/{cep}` → retorna via ViaCEP
2. Preenche logradouro, bairro, cidade, UF automaticamente
3. Oferece mapa picker para confirmar coordenadas

---

### 4. **TermsScreen**
`src/modules/auth/screens/terms/terms.screen.tsx`

**Responsabilidade:** Exibição dos Termos de Uso e aceitação com rastreamento de IP

**Campos:**
- WebView com Termos de Uso (scrollável, read-only)
- Checkbox: "Aceito os Termos de Uso e Política de Privacidade"
- Botão "Continuar" (desabilitado até aceitar)

**Integração:**
```typescript
async acceptTerms(params: AcceptTermsParams): Promise<void> {
  return apiClient.post('/onboarding/register/terms', {
    accepted: true,
    ipAddress: await getDeviceIpAddress(), // captura de rede
    userAgent: Constants.deviceName,
  });
},
```

---

### 5. **RegisterSuccessScreen**
`src/modules/auth/screens/register-success/register-success.screen.tsx`

**Responsabilidade:** Feedback visual de sucesso, oferece próximos passos

**Fluxo:**
```
Parabéns! Seu cadastro foi realizado com sucesso.
Você pode agora:
  [ Login ]        → volta para login
  [ Criar Perfil ] → abre flow de provider
  [ Inicio ]       → vai para dashboard (se já logado)
```

---

## 🏗️ Arquitetura da Camada Onboarding

```
src/modules/auth/
├── screens/
│   ├── register/
│   │   ├── index.ts
│   │   ├── register.screen.tsx       ← formulário
│   │   ├── styles.ts
│   │   └── types.ts                  ← RegisterFormValues, schema
│   ├── verification/
│   │   ├── index.ts
│   │   ├── verification.screen.tsx   ← 2 abas
│   │   ├── styles.ts
│   │   └── types.ts
│   ├── address/
│   ├── terms/
│   └── register-success/
├── components/
│   ├── RegisterForm/                 ← componente reutilizável
│   ├── VerificationTabs/
│   └── DocumentUploadWidget/
├── services/
│   ├── onboarding.service.ts         ← POST /onboarding/*
│   └── verification.service.ts       ← POST /verification/*
├── store/
│   ├── auth.store.ts                 ← user, isSignedIn
│   └── verification.store.ts         ← emailVerified, phoneVerified
├── hooks/
│   ├── useAuth.ts                    ← login, logout, register
│   └── useVerification.ts            ← sendCode, verifyCode
└── locales.ts                        ← strings (registerTitle, etc)
```

---

## 📤 Upload de Documentos (Fase 1)

Durante o registro, o user pode fazer upload de documento obrigatório.

**Fluxo:**
```typescript
const { uploadDocument } = useDocuments();

const handleDocumentPick = async (documentType: 'CPF' | 'CNPJ') => {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images' });
  if (!result.cancelled) {
    const { documentId, url } = await uploadDocument({
      file: result.assets[0].uri,
      documentType,
    });
    // Mostrar preview + "Enviado com sucesso"
  }
};
```

**Integração com BFF:**
```typescript
// src/modules/document/services/document.service.ts
export const DocumentService = {
  async upload(params: DocumentUploadParams): Promise<DocumentUploadResult> {
    const formData = new FormData();
    formData.append('file', {
      uri: params.file,
      type: 'image/jpeg',
      name: `${params.documentType}_${Date.now()}.jpg`,
    });
    formData.append('documentType', params.documentType);

    const { documentId, url, message } = await apiClient.post(
      '/onboarding/documents/upload',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return { documentId, url, message };
  },

  async delete(documentId: string): Promise<void> {
    return apiClient.delete(`/documents/${documentId}`);
  },
};
```

**Tipos:**
```typescript
export interface DocumentUploadParams {
  file: string;                        // URI do arquivo
  documentType: 'CPF' | 'CNPJ' | 'RG' | 'COMPROVANTE_RESIDENCIA';
}

export interface DocumentUploadResult {
  documentId: string;
  url: string;                         // URL assinado (TTL: 15min)
  message: string;
}
```

---

## 🧪 Fluxo de Verificação de Campos

**On-Submit, não Real-Time:**

```typescript
// ✅ Correto: verificar apenas no submit
const handleSubmit = async (formData: RegisterFormValues) => {
  showLoading();
  try {
    // Verificar email
    const emailExists = await verifyEmail(formData.email);
    if (emailExists) {
      setError('email', 'E-mail já cadastrado');
      return;
    }

    // Verificar telefone
    const phoneExists = await verifyPhone(formData.phone);
    if (phoneExists) {
      setError('phone', 'Telefone já cadastrado');
      return;
    }

    // Verificar documento
    const docExists = await verifyDocument(formData.document);
    if (docExists) {
      setError('document', 'Documento já cadastrado');
      return;
    }

    // Tudo OK: registrar
    await register(formData);
    router.replace('/verification');
  } finally {
    hideLoading();
  }
};

// ❌ Errado: fazer request a cada keystroke
useEffect(() => {
  const timer = setTimeout(() => {
    verifyEmailWithDebounce(email);
  }, 500);
  return () => clearTimeout(timer);
}, [email]);
```

---

## 🔄 Estado Global (Zustand)

### `useAuthStore`
```typescript
// src/modules/auth/store/auth.store.ts
interface AuthStore {
  user: User | null;
  isSignedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;

  setUser: (user: User) => void;
  setTokens: (access: string, refresh: string) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isSignedIn: false,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user, isSignedIn: !!user }),
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      logout: () => set({ user: null, isSignedIn: false, accessToken: null, refreshToken: null }),
      clearError: () => set({}),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage.asStateStorage()),
    }
  )
);
```

### `useVerificationStore`
```typescript
// src/modules/auth/store/verification.store.ts
interface VerificationStore {
  target: 'email' | 'phone';
  emailVerified: boolean;
  phoneVerified: boolean;
  emailCode: string;
  phoneCode: string;
  codeSentAt: Date | null;
  codeTTL: number;

  setTarget: (target: 'email' | 'phone') => void;
  setEmailCode: (code: string) => void;
  setPhoneCode: (code: string) => void;
  setEmailVerified: (verified: boolean) => void;
  setPhoneVerified: (verified: boolean) => void;
  resetTTL: () => void;
}

export const useVerificationStore = create<VerificationStore>((set) => ({
  target: 'email',
  emailVerified: false,
  phoneVerified: false,
  emailCode: '',
  phoneCode: '',
  codeSentAt: null,
  codeTTL: 300,

  setTarget: (target) => set({ target }),
  setEmailCode: (code) => set({ emailCode: code }),
  setPhoneCode: (code) => set({ phoneCode: code }),
  setEmailVerified: (verified) => set({ emailVerified: verified }),
  setPhoneVerified: (verified) => set({ phoneVerified: verified }),
  resetTTL: () => set({ codeSentAt: new Date(), codeTTL: 300 }),
}));
```

---

## 🪝 Hooks de Orquestração

### `useAuth`
```typescript
// src/modules/auth/hooks/useAuth.ts
export function useAuth() {
  const { setUser, setTokens } = useAuthStore();
  const { showLoading, hideLoading } = useLoading();

  async function login(params: LoginServiceParams) {
    showLoading();
    try {
      const { user, accessToken, refreshToken } = await KeycloakService.login(params);
      setUser(user);
      setTokens(accessToken, refreshToken);
      router.replace('/(app)/home');
    } finally {
      hideLoading();
    }
  }

  async function register(params: RegisterServiceParams) {
    showLoading();
    try {
      const newUser = await OnboardingService.register(params);
      setUser(newUser);
      router.replace('/verification');
    } finally {
      hideLoading();
    }
  }

  return { login, register, logout };
}
```

### `useVerification`
```typescript
// src/modules/auth/hooks/useVerification.ts
export function useVerification() {
  const { setEmailVerified, setPhoneVerified, resetTTL } = useVerificationStore();
  const { showLoading, hideLoading } = useLoading();

  async function sendCode(target: 'email' | 'phone', destination: string) {
    try {
      const { expiresIn } = await VerificationService.sendCode({
        target,
        destination,
      });
      resetTTL();
      // Iniciar countdown de expiração
      startCountdown(expiresIn);
    } catch (error) {
      showError(`Falha ao enviar código: ${error.message}`);
    }
  }

  async function verifyCode(target: 'email' | 'phone', code: string) {
    showLoading();
    try {
      await VerificationService.verifyCode({ target, code });
      if (target === 'email') setEmailVerified(true);
      if (target === 'phone') setPhoneVerified(true);
    } finally {
      hideLoading();
    }
  }

  return { sendCode, verifyCode };
}
```

---

## 🎯 Checklist de Implementação (Fase 1)

### Telas Base
- [ ] `RegisterScreen` com formulário React Hook Form + Zod
- [ ] `VerificationScreen` com 2 abas + countdown
- [ ] `AddressScreen` com CEP lookup + mapa
- [ ] `TermsScreen` com WebView + checkbox
- [ ] `RegisterSuccessScreen` com botões de próximos passos

### Services & Integração com BFF
- [ ] `OnboardingService.register()`
- [ ] `VerificationService.sendCode()` / `verifyCode()`
- [ ] `OnboardingService.saveAddress()`
- [ ] `DocumentService.upload()`
- [ ] Tratamento de erros (email exists, phone exists, invalid code)

### Estado Global (Zustand)
- [ ] `useAuthStore` com user + tokens
- [ ] `useVerificationStore` com emailVerified + phoneVerified + TTL
- [ ] Persistência em MMKV Storage

### Hooks de Orquestração
- [ ] `useAuth()` → login, register
- [ ] `useVerification()` → sendCode, verifyCode
- [ ] `useLoading()` → showLoading, hideLoading

### Locales
- [ ] `auth/locales.ts` com todas as strings
- [ ] Update `src/shared/locales/pt-BR.ts` com as novas keys
- [ ] Test `npm run check-locales`

### Routing
- [ ] Configurar rotas no `app/auth/` (register, verification, address, terms)
- [ ] Usar `router.replace()` após termos aceitos
- [ ] Usar `router.push()` para navegação forward

### UI/UX
- [ ] Design System: usar `theme.colors`, `scale()`, `verticalScale()`
- [ ] Loading global durante requests
- [ ] Toast/Snackbar para sucesso e erros
- [ ] Desabilitar botões durante operações assíncronas

### Testes (E2E com Maestro)
- [ ] `test:e2e` → `register-flow.yaml` deve percorrer todas as telas
- [ ] Verificar validação de campo obrigatório
- [ ] Verificar envio de código + verificação de código
- [ ] Verificar sucesso + navegação

---

## 📱 Exemplo Completo: RegisterScreen

```typescript
// src/modules/auth/screens/register/register.screen.tsx
import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { RegisterForm } from '../../components/RegisterForm';
import { registerSchema, RegisterFormValues, RegisterScreenParams } from './types';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '@/shared/hooks/useLoading';
import { t } from '@/shared/locales';
import { theme } from '@/shared/constants';
import { verticalScale, moderateScale, scale } from '@/shared/utils/scale';
import styles from './styles';

export default function RegisterScreen(_: RegisterScreenParams) {
  const router = useRouter();
  const { register } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      documentType: 'CPF',
      document: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const handleRegister = useCallback(
    async (formData: RegisterFormValues) => {
      showLoading();
      try {
        await register(formData);
        router.replace('/verification');
      } catch (error) {
        if (error.response?.status === 409) {
          // Conflito: email, phone ou documento já existe
          const field = error.response.data.field; // 'email' | 'phone' | 'document'
          setError(field as any, {
            message: error.response.data.message,
          });
        }
      } finally {
        hideLoading();
      }
    },
    [register, router, showLoading, hideLoading, setError]
  );

  return (
    <View style={styles.container}>
      <RegisterForm
        control={control}
        errors={errors}
        isValid={isValid}
        onSubmit={handleSubmit(handleRegister)}
      />
    </View>
  );
}
```

---

## 🔒 Segurança

### Sensibilidade de Dados
- ✅ Email, telefone: verificados no submit (não em tempo real)
- ✅ Documento: enviado uma única vez, não reutilizado
- ✅ Senha: validada localmente (min 8, uppercase + number)
- ✅ Tokens (access + refresh): armazenados em `Expo Secure Store`, nunca em localStorage
- ✅ Termos: rastreado com IP real + User-Agent do device

### Header de Segurança
```typescript
// src/shared/services/api-client.ts
const apiClient = axios.create({
  baseURL: 'https://api.cawme.com',
  headers: {
    'X-Client-Version': Constants.appVersion,
    'X-Device-Id': deviceId, // gerado na primeira execução
  },
});

// Request interceptor: adicionar token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
```

---

## 🐛 Troubleshooting

### "E-mail já cadastrado" aparece para email novo
- [ ] Confirmar que o BFF está retornando status 409 com field `email`
- [ ] Testar diretamente: `POST /onboarding/verify/email` com email novo deve retornar `{ exists: false }`

### Código de verificação expira antes de digitar
- [ ] TTL configurado para 5 min — aumentar se necessário
- [ ] Countdown deve ser visível: "Código expira em 4:32"
- [ ] Oferecer botão "Reenviar Código" após expiração

### Upload de documento falha
- [ ] Confirmar que MinIO está acessível
- [ ] Verificar tamanho máximo (padrão: 10MB)
- [ ] Testar formData multipart com Postman/cURL

### Estado de verificação não persiste após reload
- [ ] `useVerificationStore` não é persistido (por design)
- [ ] Ao voltar para verification screen após background, resetar state
- [ ] User pode reenviar código ou voltar ao registro

### Mapa picker não aparece
- [ ] Verificar permissões: `Permissions.LOCATION` deve estar granted
- [ ] Testar com device real (simulador às vezes não renderiza maps)

---

## 📞 Contatos & Recursos

**Backend (API):** `domestic-backend-api`
- Onboarding: `/src/modules/onboarding`
- Provider: `/src/modules/provider`

**BFF:** `domestic-backend-bff`
- Onboarding: `/src/modules/onboarding`
- Agregação de dados

**Design System:** Confira `src/shared/constants/theme.ts` para paleta, tipografia e spacing

**Testes E2E:** `/maestro/flows/register-flow.yaml`

---

## 🔗 Referências

- [CLAUDE.md](./CLAUDE.md) — Regras do projeto Cawme
- [Expo Router Docs](https://docs.expo.dev/router)
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [NativeWind](https://www.nativewind.dev)

