import { Timestamp } from "./timestamp";

export interface BlocekdDateEntity {
  id: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  createdAt: Date | Timestamp;
  type: "collaborator" | "barbershop";
  collaboratorId: string | null;
  collaboratorName: string | null;
  companyName: string;
  startTime: string | null;
  endTime: string | null;
}
