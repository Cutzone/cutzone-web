import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import { Timestamp } from "@/common/entities/timestamp";
import { timestampToDate } from "@/utils/timestampToDate";
import { ColumnDef } from "@tanstack/react-table";
import SortButton from "@/components/atoms/SortButton";
import Link from "next/link";

export const columns: ColumnDef<BarberShopEntity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortButton column={column}>Nome</SortButton>,
    cell: ({ row }) => (
      <Link href={`/admin/barbearias/${row.original.id}`}>
        {row.original.name}
      </Link>
    )
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortButton column={column}>Email</SortButton>
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortButton column={column}>Status</SortButton>,
    cell: ({ row }) => {
      const bs = row.original;
      let status = <p></p>;

      if (bs.status === "creating") {
        status = (
          <p className="w-fit rounded bg-[#15d9e0] px-2 py-[2px] text-sm font-medium">
            Em criação
          </p>
        );
      } else if (bs.status === "awaiting approval") {
        status = (
          <p className="w-fit rounded bg-[#EAA800] px-2 py-[2px] text-sm font-medium">
            Aguardando aprovação
          </p>
        );
      } else if (bs.status === "approved") {
        status = (
          <p className="w-fit rounded bg-[#2AC511] px-2 py-[2px] text-sm font-medium">
            Aprovado
          </p>
        );
      } else if (bs.status === "rejected") {
        status = (
          <p className="w-fit rounded bg-[#E01515] px-2 py-[2px] text-sm font-medium">
            Rejeitado
          </p>
        );
      } else if (bs.status === "suspended") {
        status = (
          <p className="w-fit rounded bg-[#ff5739] px-2 py-[2px] text-sm font-medium">
            Suspensa
          </p>
        );
      }

      return status;
    }
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortButton column={column}>Criado em</SortButton>,
    cell: ({ row }) => {
      const date = timestampToDate(
        row.original.createdAt as unknown as Timestamp
      );

      return <p>{date.toLocaleDateString("pt-BR")}</p>;
    }
  }
];
