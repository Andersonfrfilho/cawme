export type MapPickerScreenParams = {
  initialLatitude?: number;
  initialLongitude?: number;
  initialAddress?: string;
  returnTo?: string;
};

export type MapPickerResult = {
  latitude: number;
  longitude: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  formattedAddress: string;
};
