# Cawme — Regras do Projeto

## Stack
- React Native 0.83 + Expo 55 + Expo Router
- NativeWind 4 (Tailwind para RN)
- Zustand (estado global), TanStack Query (server state)
- React Hook Form + Zod (formulários)
- TypeScript strict

---

## Estrutura de Pastas

```
src/
  shared/
    constants/        # colors.ts, theme.ts — paleta e métricas do design system
    types/            # tipos globais compartilhados entre módulos
    utils/            # funções utilitárias sem domínio de negócio (scale.ts, jwt.ts)
    hooks/            # hooks compartilhados (ex: useLoading, useErrorHandler)
    providers/        # infraestrutura transversal — sempre singleton
      cache/
        cache.types.ts
        index.ts
        implementations/
          mmkv-storage.ts
    components/       # UI components reutilizáveis sem lógica de negócio
    locales/          # sistema de i18n
    services/         # api-client.ts e serviços compartilhados
    store/            # ui.store.ts, error.store.ts
  modules/
    <modulo>/
      types/          # tipos do módulo (*.types.ts)
      services/       # chamadas de API e integrações externas (*.service.ts)
      store/          # zustand store (*.store.ts)
      hooks/          # hooks que combinam store + query + services (use*.ts)
      components/     # componentes específicos do módulo
      screens/        # telas do módulo
      locales.ts      # registro de strings do módulo
app/                  # rotas Expo Router (apenas layouts e index files que exportam screens)
```

**Regra:** `app/` só pode importar de `src/modules/<modulo>/hooks` e `src/shared/`.
Nunca importar services ou stores diretamente em `app/`.

---

## Regras de Telas (Screens)

Toda tela vive em um subdiretório com nome da rota dentro de `screens/`:

```
screens/
  login/
    index.ts                 # export { default } from './login.screen'
    login.screen.tsx         # implementação — default export
    styles.ts                # StyleSheet — default export
    types.ts                 # LoginScreenParams, LoginFormValues, loginSchema
```

- Arquivo de implementação: `<name>.screen.tsx` — **sempre default export**
- `index.ts` apenas re-exporta o default
- Estilos sempre em `styles.ts` — **default export**
- Tipos da tela (params, form values, schema) em `types.ts`

```typescript
// ✅ screen — default export
export default function LoginScreen(_: LoginScreenParams) { ... }

// ✅ styles.ts — default export
const styles = StyleSheet.create({ ... });
export default styles;

// ✅ index.ts — re-export
export { default } from './login.screen';
```

---

## Regras de Componentes

Componentes do módulo vivem em `components/<NomeComponente>/`:

```
components/
  LoginForm/
    LoginForm.component.tsx  # implementação — named export com React.FC
    styles.ts                # named export
    types.ts                 # LoginFormProps
    index.ts                 # export * from './LoginForm.component'
```

- Arquivo de implementação: `<NomeComponente>.component.tsx`
- **Named export** com `React.FC<Props>`:

```typescript
// ✅ componente — named export
export const LoginForm: React.FC<LoginFormProps> = ({ ... }) => { ... };

// ✅ styles.ts de componente — named export
export const styles = StyleSheet.create({ ... });

// ✅ index.ts
export * from './LoginForm.component';
export * from './types';
```

> **Diferença de exportação:** telas usam `default export`, componentes usam `named export`.

---

## Internacionalização e Textos (Locales)

Cada módulo registra suas strings em `locales.ts`:

```typescript
// src/modules/auth/locales.ts
import { registerLocaleModule } from '@/shared/locales';

export const authLocale = {
  auth: {
    loginTitle: 'Cawme',
    loginButton: 'Entrar',
  },
};

registerLocaleModule(authLocale);
export default authLocale;
```

O arquivo central `src/shared/locales/register-all-modules.ts` importa todos os módulos:

```typescript
import '@/modules/auth/locales';
import '@/modules/home/locales';
// ...
```

### Dois padrões válidos para acessar traduções

**`t()` — para componentes sem re-render em troca de idioma:**
```typescript
import { t } from '@/shared/locales';
<Text>{t('auth.loginButton')}</Text>
```

**`useLocale()` — para componentes que precisam reagir a troca de idioma:**
```typescript
import { useLocale, LocaleKeys } from '@/shared/locales';
const { auth: { loginButton } } = useLocale<LocaleKeys>();
<Text>{loginButton}</Text>
```

- NUNCA usar strings literais diretamente nos componentes/telas
- Todos os textos devem estar em arquivos de locale

---

## Constantes e Valores Mágicos

- NUNCA usar strings ou números soltos (magic values)
- Valores fixos devem ser exportados como constantes em arquivos dedicados

---

## Loading Global

- O projeto possui um sistema de loading global via Zustand
- Usar o hook `useLoading` para ativar/desativar o loading em processos assíncronos

---

## Nomenclatura de Tipos

### Funções/hooks com mais de 1 parâmetro: usar tipos nomeados

```typescript
// ✅ correto
type SendMessageParams = { roomId: string; content: string; };
type SendMessageResult = { messageId: string; sentAt: string; };
async function sendMessage(params: SendMessageParams): Promise<SendMessageResult> { ... }

// ❌ errado
async function sendMessage(roomId: string, content: string) { ... }
```

### Padrão de nomenclatura
| Artefato | Padrão | Exemplo |
|---|---|---|
| Tipo de params | `NomeFuncaoParams` | `FetchChatParams` |
| Tipo de retorno | `NomeFuncaoResult` | `FetchChatResult` |
| Tipo de store state | `NomeStore` | `ChatStore` |
| Tipo de API response | `NomeResponse` | `ChatResponse` |
| Tipo de request body | `NomeRequest` | `SendMessageRequest` |
| Props de componente | `NomeComponentProps` | `LoginFormProps` |
| Params de tela | `NomeScreenParams` | `LoginScreenParams` |

### Nomenclatura geral
- NUNCA usar abreviações ou diminutivos — sempre nomes declarativos completos
- ❌ `btn`, `cfg`, `img`, `err`, `val`, `res`, `req`
- ✅ `button`, `config`, `image`, `error`, `value`, `response`, `request`

---

## Camadas e Responsabilidades

### `types/` — somente tipos, sem lógica

### `services/` — acesso a dados, sem estado
Services são **objetos com métodos**, não classes:

```typescript
// ✅ objeto com métodos
export const KeycloakService = {
  async login(params: LoginServiceParams): Promise<LoginServiceResult> { ... },
  async logout(): Promise<void> { ... },
};

// ❌ não usar classe para services
export class KeycloakService { ... }
```

### `store/` — estado global com Zustand
Stores persistidos usam o middleware `persist` com `mmkvStorage`:

```typescript
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isSignedIn: false,
      setUser: (user) => set({ user, isSignedIn: !!user }),
      logout: () => set({ user: null, isSignedIn: false }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage.asStateStorage()),
    },
  ),
);
```

### `hooks/` — orquestração (query + store + service)
```typescript
export function useAuth() {
  const { setUser } = useAuthStore();
  const { showLoading, hideLoading } = useLoading();

  async function login(params: LoginServiceParams): Promise<void> {
    showLoading();
    try {
      const user = await KeycloakService.login(params);
      setUser(user);
      router.replace('/(app)/home');
    } finally {
      hideLoading();
    }
  }

  return { login, logout };  // objeto nomeado, nunca array
}
```

### `components/` — UI pura, recebe dados via props
Sem chamadas de API, sem acesso direto ao store.

---

## Customização de Header (navegação)

Para injetar botões ou opções no header de uma tela, usar `useLayoutEffect` + `navigation.setOptions`:

```typescript
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
          <Ionicons name="log-out-outline" size={22} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);
}
```

---

## Providers (`shared/providers/`)

Todo provider é singleton com `static getInstance()`:

```typescript
class MmkvStorage implements CacheProvider {
  private static instance: MmkvStorage;
  private constructor() { ... }

  static getInstance(): MmkvStorage {
    if (!MmkvStorage.instance) MmkvStorage.instance = new MmkvStorage();
    return MmkvStorage.instance;
  }
}

export const mmkvStorage = MmkvStorage.getInstance();
```

Importar sempre pelo index do provider:
```typescript
// ✅
import { mmkvStorage } from '@/shared/providers/cache';
// ❌
import { mmkvStorage } from '@/shared/providers/cache/implementations/mmkv-storage';
```

---

## Design System

Importar sempre via `theme` de `@/shared/constants`:

```typescript
import { theme } from '@/shared/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.DEFAULT,
    padding: theme.spacing[4],
    borderRadius: theme.radii.md,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});
```

- NUNCA usar valores hex ou números mágicos em StyleSheet
- NUNCA importar `colors` ou `palette` diretamente — sempre via `theme.colors` e `theme.palette`

Paleta principal:
- **Primary**: `#1A45E8` (azul royal)
- **Accent green**: `#22C55E`
- **Accent yellow**: `#F5A623`
- **Background**: `#F8FAFC`
- **Text primary**: `#0F172A`

---

## Escala Responsiva (Scale)

Toda medida numérica em `StyleSheet` deve usar as funções de `@/shared/utils/scale`:

```typescript
import { scale, verticalScale, moderateScale } from '@/shared/utils/scale';
```

| Propriedade | Função | Fator |
|---|---|---|
| `width`, `minWidth`, `maxWidth`, `iconSize` | `scale` | — |
| `height` de seção / hero / layout | `verticalScale` | — |
| `height` de componente (botão, input) | `verticalScale` | — |
| `fontSize` | `moderateScale` | `0.3` |
| `padding`, `margin`, `gap` | `moderateScale` | `0.5` |
| `borderRadius`, `borderWidth` | **fixo** — não escalar | — |

```typescript
// ✅ correto
const styles = StyleSheet.create({
  hero: {
    height: verticalScale(240),
    paddingHorizontal: moderateScale(28, 0.5),
  },
  input: {
    height: verticalScale(56),
    borderRadius: 14,                       // fixo
    fontSize: moderateScale(15, 0.3),
    paddingHorizontal: moderateScale(16, 0.5),
  },
});

// ❌ errado
const styles = StyleSheet.create({
  hero: { height: 240 },
  input: { height: 56, fontSize: 15 },
});
```

Base de design: **390 × 844px** (iPhone 14).

---

## Regras Gerais

- TypeScript strict — sem `any`, sem type assertions desnecessárias
- Sem comentários que explicam o que o código faz — só o porquê quando não-óbvio
- Sem features para requisitos hipotéticos futuros
- Validação só em boundaries: input do usuário, respostas de API externa
- Sem error handling para cenários que não podem acontecer
- Preferir composição a herança
- Hooks retornam objetos nomeados, nunca arrays (exceto `useState`)

---

## Imports

Usar path alias `@/` mapeado para `src/`:
```typescript
import { theme } from '@/shared/constants';
import { scale, verticalScale, moderateScale } from '@/shared/utils/scale';
import { useAuth } from '@/modules/auth/hooks/useAuth';
```

Nunca import relativo que suba mais de 2 níveis (`../../..`).
