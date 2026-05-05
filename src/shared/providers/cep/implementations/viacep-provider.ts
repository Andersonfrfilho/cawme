import axios from 'axios';
import type { CepProvider, CepResult } from '../cep.types';

export class ViaCepProvider implements CepProvider {
  private static instance: ViaCepProvider;

  private constructor() {}

  static getInstance(): ViaCepProvider {
    if (!ViaCepProvider.instance) {
      ViaCepProvider.instance = new ViaCepProvider();
    }
    return ViaCepProvider.instance;
  }

  async search(cep: string): Promise<CepResult | null> {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return null;

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${digits}/json/`);
      if (response.data.erro) return null;
      return response.data as CepResult;
    } catch {
      return null;
    }
  }
}
