import { ptBR } from './pt-BR';
import type { LocaleKeys } from './pt-BR';

let i18n: LocaleKeys | Record<string, unknown> = ptBR;

const listeners: Array<() => void> = [];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      deepMerge(targetValue, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }
}

export function registerLocaleModule(moduleLocale: Record<string, unknown>) {
  if (!isPlainObject(moduleLocale) || !isPlainObject(i18n)) return;

  deepMerge(i18n, moduleLocale);
  listeners.forEach((listener) => listener());
}

export function subscribeLocale(callback: () => void) {
  listeners.push(callback);

  return () => {
    const index = listeners.indexOf(callback);
    if (index >= 0) listeners.splice(index, 1);
  };
}

export function getLocaleObject() {
  return i18n;
}

export function translate(key: string): string {
  const keys = key.split('.');
  let result: unknown = i18n;

  for (const currentKey of keys) {
    if (!isPlainObject(result) || !(currentKey in result)) return key;
    result = result[currentKey];
  }

  return typeof result === 'string' ? result : key;
}
