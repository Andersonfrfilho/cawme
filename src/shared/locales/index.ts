import { translate } from './locale.store';

export {
  getLocaleObject,
  registerLocaleModule,
  subscribeLocale,
} from './locale.store';

export const t = (key: string): string => translate(key);

export type { LocaleKeys } from './pt-BR';

// Re-export hook
export { default as useLocale } from "./useLocale";
