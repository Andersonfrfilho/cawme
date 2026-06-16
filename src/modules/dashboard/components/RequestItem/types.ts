import type { ServiceRequestSummary } from "@/modules/dashboard/types/dashboard.types";

export type RequestItemProps = {
  item: ServiceRequestSummary;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
};
