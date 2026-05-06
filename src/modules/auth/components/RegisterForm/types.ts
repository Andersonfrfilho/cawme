import { Control, FieldErrors } from "react-hook-form";

export type DocumentType = "cpf" | "cnpj" | "rg" | "passport";

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: DocumentType;
  document: string;
  password: string;
  passwordConfirmation: string;
};

export type RegisterFormProps = {
  control: Control<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: RegisterFormValues) => void;
  handleSubmit: (callback: (values: RegisterFormValues) => void) => () => void;
};
