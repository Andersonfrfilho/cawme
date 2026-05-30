/**
 * Detecta se o app está rodando em ambiente de teste E2E.
 * Usado para bypass de chamadas de API reais durante testes Maestro.
 */
export const isTestEnvironment = (): boolean => {
  try {
    return (globalThis as any).__e2e__ === true || process.env.E2E_TEST === "true";
  } catch {
    return false;
  }
};
