import { Timestamp } from "@/common/entities/timestamp";
import { timestampToDate } from "@/utils/timestampToDate";
import { ColumnDef } from "@tanstack/react-table";
import SortButton from "@/components/atoms/SortButton";
import { BlocekdDateEntity } from "@/common/entities/blockedDate";
import Delete from "./components/Delete";

export const columns: ColumnDef<BlocekdDateEntity>[] = [
  // {
  //   accessorKey: "companyName",
  //   header: ({ column }) => <SortButton column={column}>Barbearia</SortButton>
  // },
  {
    accessorKey: "type",
    header: ({ column }) => <SortButton column={column}>Tipo</SortButton>,
    cell: ({ row }) => {
      const type = row.original.type;
      return <p>{type === "barbershop" ? "Barbearia" : "Colaborador"}</p>;
    }
  },
  {
    accessorKey: "collaboratorName",
    header: ({ column }) => (
      <SortButton column={column}>Nome do colaborador</SortButton>
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <p>{type === "barbershop" ? "---" : row.original.collaboratorName}</p>
      );
    }
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <SortButton column={column}>Data de início</SortButton>
    ),
    cell: ({ row }) => {
      const date = timestampToDate(
        row.original.startDate as unknown as Timestamp
      );

      return <p>{date.toLocaleDateString("pt-BR")}</p>;
    }
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <SortButton column={column}>Data de fim</SortButton>
    ),
    cell: ({ row }) => {
      const date = timestampToDate(
        row.original.endDate as unknown as Timestamp
      );

      return <p>{date.toLocaleDateString("pt-BR")}</p>;
    }
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <SortButton column={column}>Horário de início</SortButton>
    ),
    cell: ({ row }) => {
      const time = row.original.startTime;

      return <p>{time || "Dia todo"}</p>;
    }
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => (
      <SortButton column={column}>Horário de fim</SortButton>
    ),
    cell: ({ row }) => {
      const time = row.original.endTime;

      return <p>{time || "Dia todo"}</p>;
    }
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <p className=""></p>,
    cell: ({ row }) => {
      const type = row.original.type;
      const docId = row.original.id;
      const colaboratorId = row.original.collaboratorId;
      return <Delete type={type} docId={docId} colaboratorId={colaboratorId} />;
    }
  }
];
