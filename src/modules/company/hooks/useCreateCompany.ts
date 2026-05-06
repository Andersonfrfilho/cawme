import { useState } from "react";
import { CompanyService } from "../services/company.service";
import type { CompanyFormValues } from "../screens/create-company/types";
import type { CreateCompanyPayload } from "../services/company.service";

export function useCreateCompany() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createCompany(values: CompanyFormValues): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const payload: CreateCompanyPayload = {
        document: values.document.replace(/\D/g, ""),
        companyName: values.companyName,
        tradeName: values.tradeName,
        email: values.email,
        phone: values.phone.replace(/\D/g, ""),
        stateRegistration: values.stateRegistration,
        municipalRegistration: values.municipalRegistration,
        address: {
          zipCode: values.zipCode.replace(/\D/g, ""),
          street: values.street,
          number: values.number,
          complement: values.complement,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state.toUpperCase(),
          type: "headquarters",
          isDefault: true,
        },
        businessHours: values.businessHours?.map((bh) => ({
          dayOfWeek: bh.dayOfWeek,
          isOpen: bh.isOpen,
          openTime: bh.openTime,
          closeTime: bh.closeTime,
        })),
      };

      await CompanyService.createCompany(payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao criar empresa");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return { createCompany, isLoading, error };
}
