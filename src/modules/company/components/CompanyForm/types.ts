import { Control, FieldErrors } from "react-hook-form";
import type { CompanyFormValues, WizardStep } from "../../screens/create-company/types";

export type CompanyFormProps = {
  control: Control<CompanyFormValues>;
  errors: FieldErrors<CompanyFormValues>;
  step: WizardStep;
};
