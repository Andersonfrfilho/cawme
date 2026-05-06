import { z } from "zod";

function validateCNPJ(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sizes = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * sizes[i];
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit > 9) firstDigit = 0;
  if (parseInt(digits[12]) !== firstDigit) return false;

  sizes = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * sizes[i];
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit > 9) secondDigit = 0;
  if (parseInt(digits[13]) !== secondDigit) return false;

  return true;
}

export const businessHourSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isOpen: z.boolean(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

export const companySchema = z
  .object({
    document: z.string().refine(validateCNPJ, "companyDocumentInvalid"),
    companyName: z.string().min(3, "companyNameRequired"),
    tradeName: z.string().optional(),
    email: z.string().email("companyEmailInvalid"),
    phone: z.string().min(10, "companyPhoneRequired"),
    stateRegistration: z.string().optional(),
    municipalRegistration: z.string().optional(),
    zipCode: z.string().min(8, "companyZipCodeRequired"),
    street: z.string().min(3, "companyStreetRequired"),
    number: z.string().min(1, "companyNumberRequired"),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "companyNeighborhoodRequired"),
    city: z.string().min(2, "companyCityRequired"),
    state: z.string().length(2, "companyStateRequired"),
    businessHours: z.array(businessHourSchema).optional(),
  })
  .refine(
    (data) => {
      if (!data.businessHours) return true;
      for (const bh of data.businessHours) {
        if (bh.isOpen && (!bh.openTime || !bh.closeTime)) {
          return false;
        }
      }
      return true;
    },
    { message: "companyBusinessHoursInvalid", path: ["businessHours"] },
  );

export type CompanyFormValues = z.infer<typeof companySchema>;
export type BusinessHour = z.infer<typeof businessHourSchema>;

export type WizardStep = "basic" | "address" | "hours" | "review";
