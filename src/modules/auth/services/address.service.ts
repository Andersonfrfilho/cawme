import { apiClient } from "@/shared/services/api-client";

export type AddressSuggestion = {
  fullAddress: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postcode: string;
  latitude: number;
  longitude: number;
};

export type AutocompleteResponse = {
  suggestions: AddressSuggestion[];
};

const MOCK_SUGGESTIONS: AddressSuggestion[] = [
  {
    fullAddress: "Rua Augusta, 1500, Consolação, São Paulo, SP, 01304-001",
    street: "Rua Augusta",
    number: "1500",
    neighborhood: "Consolação",
    city: "São Paulo",
    state: "SP",
    postcode: "01304-001",
    latitude: -23.5558,
    longitude: -46.6558,
  },
  {
    fullAddress: "Avenida Paulista, 1000, Bela Vista, São Paulo, SP, 01310-100",
    street: "Avenida Paulista",
    number: "1000",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    postcode: "01310-100",
    latitude: -23.5631,
    longitude: -46.6543,
  },
  {
    fullAddress: "Rua Oscar Freire, 900, Cerqueira César, São Paulo, SP, 01426-001",
    street: "Rua Oscar Freire",
    number: "900",
    neighborhood: "Cerqueira César",
    city: "São Paulo",
    state: "SP",
    postcode: "01426-001",
    latitude: -23.5616,
    longitude: -46.6714,
  },
  {
    fullAddress: "Rua das Flores, 250, Centro, Curitiba, PR, 80010-010",
    street: "Rua das Flores",
    number: "250",
    neighborhood: "Centro",
    city: "Curitiba",
    state: "PR",
    postcode: "80010-010",
    latitude: -25.4295,
    longitude: -49.2718,
  },
  {
    fullAddress: "Avenida Beira Mar, 100, Centro, Florianópolis, SC, 88010-000",
    street: "Avenida Beira Mar",
    number: "100",
    neighborhood: "Centro",
    city: "Florianópolis",
    state: "SC",
    postcode: "88010-000",
    latitude: -27.5969,
    longitude: -48.5495,
  },
];

export type SaveAddressParams = {
  keycloakId: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude?: string;
  longitude?: string;
};

export type SaveAddressResult = {
  addressId: string;
};

export const AddressService = {
  async autocomplete(query: string): Promise<AddressSuggestion[]> {
    if (query.trim().length < 3) return [];
    try {
      const response = await apiClient.get<AutocompleteResponse>("/bff/address/autocomplete", {
        params: { q: query },
      });
      return response.data.suggestions;
    } catch {
      const lower = query.toLowerCase();
      return MOCK_SUGGESTIONS.filter(
        (suggestion) =>
          suggestion.fullAddress.toLowerCase().includes(lower) ||
          suggestion.street.toLowerCase().includes(lower) ||
          suggestion.city.toLowerCase().includes(lower),
      );
    }
  },

  async saveAddress(params: SaveAddressParams): Promise<SaveAddressResult> {
    const response = await apiClient.post<{ addressId: string }>("/bff/onboarding/address", {
      keycloakId: params.keycloakId,
      cep: params.cep,
      street: params.street,
      number: params.number,
      complement: params.complement,
      neighborhood: params.neighborhood,
      city: params.city,
      state: params.state,
      latitude: params.latitude,
      longitude: params.longitude,
    });
    return { addressId: response.addressId };
  },
};
