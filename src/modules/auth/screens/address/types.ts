export type AddressScreenParams = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  document: string;
  documentType: string;
  password: string;
  keycloakId: string;
};

export type AddressFormValues = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude?: string;
  longitude?: string;
};
