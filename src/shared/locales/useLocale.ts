import { useEffect, useState } from "react";
import { getLocaleObject, subscribeLocale } from './locale.store';

// Hook que retorna o objeto de locales atual. Re-renderiza quando
// `registerLocaleModule` é chamado e o objeto global é atualizado.
export default function useLocale<T = any>(): T {
  const [locale, setLocale] = useState(() => getLocaleObject() as T);

  useEffect(() => {
    const unsub = subscribeLocale(() => {
      // copiar referência atualizada para forçar re-render
      setLocale({ ...(getLocaleObject() as any) });
    });

    return () => unsub();
  }, []);

  return locale;
}
