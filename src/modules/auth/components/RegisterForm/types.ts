import { Control, FieldErrors } from "react-hook-form";

export type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
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
