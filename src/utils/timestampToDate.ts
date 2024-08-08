import { Timestamp } from "@/common/entities/timestamp";

export const timestampToDate = (data: Timestamp): Date => {
  return new Date(data.seconds * 1000);
};
