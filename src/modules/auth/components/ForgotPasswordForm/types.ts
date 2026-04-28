import { Control, FieldErrors } from "react-hook-form";

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ForgotPasswordFormProps {
  control: Control<ForgotPasswordFormValues>;
  errors: FieldErrors<ForgotPasswordFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: ForgotPasswordFormValues) => void;
  handleSubmit: any;
}
