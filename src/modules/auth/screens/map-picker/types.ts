export type MapPickerScreenParams = {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
};

export type MapPickerResult = {
  lat: number;
  lng: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  formattedAddress: string;
};
