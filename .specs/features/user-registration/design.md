# User Registration — Design Document v2

**Feature:** `FEAT-REG-001`

---

## 1. Fluxo de Telas (Mobile)

```
┌─────────────────────────────────────────────────────────────┐
│                     WELCOME SCREEN                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FlatList horizontal (snap)                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Slide 1  │  │ Slide 2  │  │ Slide 3  │          │   │
│  │  │ Ilustração│  │Ilustração│  │Ilustração│          │   │
│  │  │ Headline │  │ Headline │  │ Headline │          │   │
│  │  │ Desc     │  │ Desc     │  │ Desc     │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
│  ● ○ ○  (page dots animados)                                │
│                                                             │
│  ┌────────────────────────────────────────────┐            │
│  │  🛠️  Quero contratar      (primary)        │            │
│  └────────────────────────────────────────────┘            │
│  ┌────────────────────────────────────────────┐            │
│  │  🔧  Quero cadastrar meu serviço (outline) │            │
│  └────────────────────────────────────────────┘            │
│        Já tenho conta  (link)                              │
└─────────────────────────────────────────────────────────────┘
          │                        │                │
          ▼                        ▼                ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│ REGISTER (contractor)│ REGISTER (provider)│ │ LOGIN (exist)│
│ Toggle: ●Cliente   │ │ Toggle: Cliente●  │ │              │
│         ○Prestador │ │         ○Prestador│ │              │
└──────────────────┘  └──────────────────┘  └──────────────┘
          │                        │
          ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     TERMS SCREEN                            │
│  ← Voltar                                                   │
│  Termos de Uso                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ScrollView com texto dos termos                     │   │
│  │  ...                                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ☐ Aceito os Termos de Uso e Política de Privacidade        │
│  ┌────────────────────────────────────────────┐            │
│  │  Finalizar cadastro  (disabled até aceitar)│            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                  REGISTER SUCCESS                           │
│  ✅ Ilustração de email                                     │
│  Verifique seu email                                        │
│  Enviamos um link de confirmação para seu email.            │
│  Verifique sua caixa de entrada para ativar sua conta.      │
│                                                             │
│  ┌────────────────────────────────────────────┐            │
│  │  Ir para o login                           │            │
│  └────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes Mobile — Novos

```
src/modules/auth/
├── components/
│   ├── WelcomeSlides/
│   │   ├── WelcomeSlides.component.tsx   # Named export: React.FC<WelcomeSlidesProps>
│   │   ├── types.ts                      # WelcomeSlidesProps, SlideData
│   │   ├── styles.ts                     # Named export
│   │   └── index.ts
│   ├── WelcomeActions/
│   │   ├── WelcomeActions.component.tsx  # Named export: React.FC<WelcomeActionsProps>
│   │   ├── types.ts                      # WelcomeActionsProps
│   │   ├── styles.ts                     # Named export
│   │   └── index.ts
│   ├── UserTypeToggle/
│   │   ├── UserTypeToggle.component.tsx  # Named export: React.FC<UserTypeToggleProps>
│   │   ├── types.ts                      # UserTypeToggleProps
│   │   ├── styles.ts                     # Named export
│   │   └── index.ts
│   ├── RegisterForm/
│   │   ├── RegisterForm.component.tsx    # Named export (sem campo userType)
│   │   ├── types.ts                      # RegisterFormProps, RegisterFormValues
│   │   ├── styles.ts                     # Named export
│   │   └── index.ts
│   ├── TermsContent/
│   │   ├── TermsContent.component.tsx    # Named export: React.FC<TermsContentProps>
│   │   ├── types.ts
│   │   ├── styles.ts                     # Named export
│   │   └── index.ts
│   └── RegisterSuccess/
│       ├── RegisterSuccess.component.tsx # Named export
│       ├── types.ts
│       ├── styles.ts                     # Named export
│       └── index.ts

├── screens/
│   ├── welcome/
│   │   ├── welcome.screen.tsx            # Default export
│   │   ├── types.ts                      # WelcomeScreenParams
│   │   ├── styles.ts                     # Default export
│   │   └── index.ts
│   ├── register/
│   │   ├── register.screen.tsx           # Default export (redesign)
│   │   ├── types.ts                      # RegisterScreenParams, RegisterFormValues, registerSchema
│   │   ├── styles.ts                     # Default export
│   │   └── index.ts
│   └── terms/
│       ├── terms.screen.tsx              # Default export
│       ├── types.ts                      # TermsScreenParams
│       ├── styles.ts                     # Default export
│       └── index.ts
```

---

## 3. Design Detalhado por Componente

### 3.1 WelcomeSlides

```typescript
// types.ts
type SlideData = {
  id: string;
  illustration: React.ReactNode;  // SVG ou Lottie futuro
  headline: string;
  description: string;
};

type WelcomeSlidesProps = {
  slides: SlideData[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
};
```

**Implementação:**
- FlatList horizontal com `pagingEnabled` + `showsHorizontalScrollIndicator={false}`
- `onScroll` → `useSharedValue` para tracking do offset
- Animated dots: `useAnimatedStyle` com scale/opacity baseado no índice ativo
- Cada slide centralizado: ícone grande + texto abaixo

**Estilo:** Usar `theme.colors.primary.DEFAULT` para destaques, `theme.spacing`, `moderateScale` para fontes.

### 3.2 WelcomeActions

```typescript
type WelcomeActionsProps = {
  onHireService: () => void;       // → Register(contractor)
  onOfferService: () => void;      // → Register(provider)
  onAlreadyHaveAccount: () => void; // → Login
};
```

**Implementação:**
- Botão primary azul: "Quero contratar" com ícone `search-outline`
- Botão outline: "Quero cadastrar meu serviço" com ícone `briefcase-outline`
- Link text: "Já tenho conta"
- Animações: `FadeInUp` stagger (delay 100ms entre cada)

**Estilo:**
```typescript
// Exemplo de medidas seguindo regras do projeto
primaryButton: {
  backgroundColor: theme.colors.primary.DEFAULT,
  height: verticalScale(56),
  borderRadius: theme.radii.xl,  // fixo
  paddingHorizontal: moderateScale(24, 0.5),
  ...theme.shadows.md,
},
primaryButtonText: {
  fontSize: moderateScale(16, 0.3),
  fontWeight: theme.typography.fontWeight.semibold,
  color: theme.palette.neutral[0],
},
outlineButton: {
  height: verticalScale(56),
  borderRadius: theme.radii.xl,  // fixo
  borderWidth: 1.5,
  borderColor: theme.colors.primary.DEFAULT,
  paddingHorizontal: moderateScale(24, 0.5),
},
```

### 3.3 UserTypeToggle

```typescript
type UserTypeToggleProps = {
  selected: "contractor" | "provider";
  onSelect: (type: "contractor" | "provider") => void;
};
```

**Implementação:**
- Dois botões lado a lado com animação de pill deslizante
- `useAnimatedStyle` para mover o indicador com `withSpring`
- Texto ativo: branco. Inativo: cor do texto secundário
- Background do indicador: `theme.colors.primary.DEFAULT`

```
┌──────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  │
│  │ ● Cliente    │  │   Prestador  │  │
│  └──────────────┘  └──────────────┘  │
│  pill animada desliza com spring     │
└──────────────────────────────────────┘
```

### 3.4 RegisterForm (Redesign)

Difere do spec original: **sem campo userType** (movido para UserTypeToggle no topo da tela). Sem checkbox de termos (movido para TermsScreen).

```typescript
type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type RegisterFormProps = {
  control: Control<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  isSubmitting: boolean;
  onSubmit: () => void;
  handleSubmit: UseFormHandleSubmit<RegisterFormValues>;
};
```

**Zod Schema:**
```typescript
const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirmation: z.string(),
}).refine(data => data.password === data.passwordConfirmation, {
  message: "As senhas não conferem",
  path: ["passwordConfirmation"],
});
```

**Campos:**
1. Nome completo — ícone `person-outline`, placeholder "Nome completo"
2. Email — ícone `mail-outline`, keyboardType email, autoCapitalize none
3. Senha — ícone `lock-closed-outline`, secureTextEntry + toggle
4. Confirmar senha — ícone `lock-closed-outline`, secureTextEntry

**Botão:** "Avançar" → navega para TermsScreen

### 3.5 TermsContent + TermsScreen

TermsScreen gerencia o estado do checkbox e botão. TermsContent renderiza o scroll.

```typescript
type TermsContentProps = {
  accepted: boolean;
  onToggleAccept: () => void;
  onSubmit: () => void;
  loading: boolean;
};
```

**Implementação:**
- ScrollView com texto placeholder dos termos
- Checkbox customizado (mesmo estilo do "Lembrar-me" do LoginForm)
- Texto com links: "Termos de Uso" e "Política de Privacidade" (TouchableOpacity com texto colorido)
- Botão "Finalizar cadastro" disabled até `accepted === true`

### 3.6 RegisterSuccess

```typescript
type RegisterSuccessProps = {
  email: string;
  onGoToLogin: () => void;
};
```

Ícone grande de envelope + texto + botão "Ir para login".

---

## 4. Rotas Expo Router

```
app/(auth)/
├── _layout.tsx              # Stack (headerShown: false para todos)
├── index.tsx                # → WelcomeScreen
├── login.tsx                # → LoginScreen (renomear de index para login)
├── register.tsx             # → RegisterScreen
├── terms.tsx                # → TermsScreen
├── success.tsx              # → RegisterSuccessScreen (ou como estado da register)
└── forgot-password/
    └── index.tsx            # → ForgotPasswordScreen (existente)
```

> **Nota:** A tela de sucesso pode ser um estado interno da RegisterScreen em vez de rota separada. Decidir na implementação.

---

## 5. Navegação e Passagem de Dados

```
WelcomeScreen
  onHireService()    → router.push({ pathname: "/register", params: { userType: "contractor" } })
  onOfferService()   → router.push({ pathname: "/register", params: { userType: "provider" } })
  onAlreadyHaveAccount() → router.push("/login")

RegisterScreen
  Recebe userType via useLocalSearchParams()
  onSubmit(values) → router.push({ pathname: "/terms", params: { ...values, userType } })

TermsScreen
  Recebe todos os dados via useLocalSearchParams()
  onSubmit() → KeycloakService.register(params) → navigate("/success") ou atualizar estado

SuccessScreen (ou estado interno)
  onGoToLogin() → router.replace("/login")
```

---

## 6. Estilo — Regras de Scale (Obrigatório)

| Propriedade | Função | Fator |
|---|---|---|
| `width`, `minWidth`, `maxWidth`, `iconSize` | `scale` | — |
| `height` de seção/hero/layout | `verticalScale` | — |
| `height` de componente (botão, input) | `verticalScale` | — |
| `fontSize` | `moderateScale` | `0.3` |
| `padding`, `margin`, `gap` | `moderateScale` | `0.5` |
| `borderRadius`, `borderWidth` | **fixo** — não escalar | — |

```typescript
import { scale, verticalScale, moderateScale } from "@/shared/utils/scale";
import { theme } from "@/shared/constants";

// ✅ Correto
const styles = StyleSheet.create({
  hero: {
    height: verticalScale(260),
  },
  input: {
    height: verticalScale(56),
    borderRadius: theme.radii.md,       // fixo via theme
    fontSize: moderateScale(15, 0.3),
    paddingHorizontal: moderateScale(16, 0.5),
    backgroundColor: theme.colors.background.card,
    borderColor: theme.colors.border.DEFAULT,
    color: theme.colors.text.primary,
  },
  title: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});

// ❌ Errado — NUNCA usar
const bad = StyleSheet.create({
  hero: { height: 260 },                    // número mágico
  input: { fontSize: 15, paddingHorizontal: 16 }, // sem scale
  title: { color: "#0F172A" },             // hex direto
});
```

---

## 7. BFF — Auth Module (Sem Alterações do Design Original)

Mantido igual ao design v1. O BFF não muda com o novo fluxo mobile — ele só recebe `POST /bff/auth/register`.

---

## 8. Kong API Gateway (Sem Alterações do Design Original)

Mantido igual ao design v1.

---

## 9. Keycloak Realm (Sem Alterações do Design Original)

`verifyEmail: true` + SMTP config.
