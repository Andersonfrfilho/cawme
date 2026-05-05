# AGENTS.md - Cawme OpenCode Session

## Ignored Paths
- `.history/` - Agent history files (auto-generated, never review)

## Run Commands
```
npm start           # expo start --dev-client
npm start:clean   # expo start --dev-client --clear
npm run android    # expo run:android
npm run ios        # expo run:ios
npm run web        # expo start --web
npm run check-locales  # validates i18n strings
```

## Architecture
- **Entry**: Expo Router entry via `app/` directory (`"main": "expo-router/entry"`)
- **Alias**: `@/` maps to `src/`
- **Modules**: `src/modules/<module>/` with types/services/store/hooks/components/screens/locales
- **Shared**: `src/shared/` with constants, utils, hooks, providers, components, locales, services, store
- **App layer**: `app/` only imports from hooks and shared (never services or stores directly)

## Key Conventions (from CLAUDE.md)
- Screens: default export in `<name>.screen.tsx`
- Components: named export `React.FC<Props>` in `<NomeComponente>.component.tsx`
- Services: objects with methods, not classes
- Stores: Zustand with persist + mmkvStorage
- Hooks: return named objects, never arrays
- Locales: register via `registerLocaleModule()`, use `t()` or `useLocale()`
- Theme: import from `@/shared/constants`, never hex directly
- Scale: use `scale`, `verticalScale`, `moderateScale` from `@/shared/utils/scale`

## Design Tokens (theme)
- Primary: `#1A45E8`
- Accent green: `#22C55E`
- Accent yellow: `#F5A623`
- Background: `#F8FAFC`
- Text primary: `#0F172A`

## Testing
- Uses `jest` + `jest-expo` + `@testing-library/react-native` + `msw` + `axios-mock-adapter`
- No test script in package.json
- Check `__tests__/` or `*.test.tsx` for examples

## Stack
- React Native 0.83 + Expo 55
- Expo Router 55
- NativeWind 4
- Zustand + TanStack Query
- React Hook Form + Zod
- TypeScript strict