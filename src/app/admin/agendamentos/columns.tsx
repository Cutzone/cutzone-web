import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";
import { Timestamp } from "@/common/entities/timestamp";
import SortButton from "@/components/atoms/SortButton";
import { timestampToDate } from "@/utils/timestampToDate";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AppoitmentCompanyEntity>[] = [
  {
    accessorKey: "Company",
    header: ({ column }) => <SortButton column={column}>Barbearia</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.company?.name}</p>;
    }
  },
  {
    accessorKey: "service",
    header: ({ column }) => <SortButton column={column}>Serviço</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.service?.name}</p>;
    }
  },
  {
    accessorKey: "service",
    header: ({ column }) => <SortButton column={column}>Preço</SortButton>,
    cell: ({ row }) => {
      return <p>R$ {row.original.service?.price}</p>;
    }
  },
  {
    accessorKey: "employee",
    header: ({ column }) => (
      <SortButton column={column}>Colaborador</SortButton>
    ),
    cell: ({ row }) => {
      return <p>{row.original.employee?.name}</p>;
    }
  },
  {
    accessorKey: "client",
    header: ({ column }) => <SortButton column={column}>Cliente</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.client?.name}</p>;
    }
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <SortButton column={column}>Data do serviço</SortButton>
    ),
    cell: ({ row }) => {
      const date = timestampToDate(row.original.startTime as Timestamp);

      return <p>{date.toLocaleDateString("pt-BR")}</p>;
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortButton column={column}>Status</SortButton>,
    cell: ({ row }) => {
      const status = row.original.status;

      switch (status) {
        case "concluded":
          return (
            <span className="w-12 rounded bg-[#2AC511] px-2 py-1 text-white">
              Concluído
            </span>
          );
        case "canceled":
          return (
            <span className="w-12 rounded bg-[#E01515] px-2 py-1 text-white">
              Cancelado
            </span>
          );
        case "scheduled":
          return (
            <span className="w-12 rounded bg-yellow-500 px-2 py-1 text-white">
              Agendado
            </span>
          );
        case "didNotShow":
          return (
            <span className="w-12 rounded bg-[#E01515] px-2 py-1 text-white">
              Não Compareceu
            </span>
          );
        default:
          return <span className="w-12 rounded px-2 py-1">Reagendado</span>;
      }
    }
  }
];
