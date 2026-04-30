import { Control, FieldErrors } from "react-hook-form";

export type RegisterFormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  document: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  serviceTags: string[];
};

export type RegisterFormProps = {
  control: Control<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: RegisterFormValues) => void;
  handleSubmit: (callback: (values: RegisterFormValues) => void) => () => void;
  userType: "contractor" | "provider";
};
