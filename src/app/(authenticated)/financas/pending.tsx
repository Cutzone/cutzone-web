import { ColumnDef } from "@tanstack/react-table";

export const pending: ColumnDef<{ category: string; value: number }>[] = [
  {
    accessorKey: "category",
    header: "Categoria"
  },
  {
    accessorKey: "value",
    header: "Valor a receber",
    cell: ({ row }) => {
      return <p>R$ {row.original.value}</p>;
    }
  }
];
