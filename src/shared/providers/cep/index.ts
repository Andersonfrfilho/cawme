export type { CepProvider, CepResult } from './cep.types';

import { ViaCepProvider } from './implementations/viacep-provider';

export const cepProvider = ViaCepProvider.getInstance();
