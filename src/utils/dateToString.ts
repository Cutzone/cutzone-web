import { Timestamp } from "@/common/entities/timestamp";

export const dateToShortString = (dateMs: Timestamp): string => {
  let date = new Date(dateMs.seconds * 1000); // JavaScript usa milissegundos

  // Adicione nanossegundos (convertidos para milissegundos) à dateMs
  date = new Date(date.getTime() + dateMs.nanoseconds / 1000000);

  // Formate a data no formato desejado
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function formatDate(d: any) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  return formatDate(date);
};
