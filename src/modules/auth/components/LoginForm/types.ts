import { Control, FieldErrors } from "react-hook-form";
import { LoginFormValues } from "../../screens/login/types";

export interface LoginFormProps {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isSubmitting: boolean;
  onSubmit: (values: LoginFormValues) => void;
  handleSubmit: any;
  onForgotPassword: () => void;
  onRegister: () => void;
  onContinueAsGuest: () => void;
  rememberMe: boolean;
  onToggleRememberMe: () => void;
}
