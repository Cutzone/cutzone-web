import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import { Timestamp } from "@/common/entities/timestamp";
import { timestampToDate } from "@/utils/timestampToDate";
import { ColumnDef } from "@tanstack/react-table";
import SortButton from "@/components/atoms/SortButton";
import Link from "next/link";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/confirmationModal";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBarberDocSupension } from "@/store/services/barberShop";
import { successToast } from "@/hooks/useAppToast";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";

function DeleteItem(row: { original: { id: string } }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      return updateBarberDocSupension({
        id: row.original.id,
        suspended: true,
        status: "suspended"
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["barberShops"]);
        successToast("Barbearia suspensa com sucesso!");
        setOpen(false);
      }
    }
  );

  async function deleteItem() {
    await mutation.mutateAsync();
  }

  return (
    <div className="flex justify-center">
      <ConfirmationModal
        onConfirm={deleteItem}
        open={open}
        onOpenChange={setOpen}
        confirmText="Suspender"
        title="Tem certeza que deseja suspender essa barbearia?"
        description="O colaborador não terá acesso a nenhuma das funcionalidades de Cutzone. Essa ação poderá ser desfeita."
      />
      <LockOutlined
        className="cursor-pointer rounded text-lg hover:bg-gray-200"
        onClick={() => setOpen(true)}
      />
    </div>
  );
}

function ActivateItem(row: { original: { id: string } }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      return updateBarberDocSupension({
        id: row.original.id,
        suspended: false,
        status: "approved"
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["barberShops"]);
        successToast("Barbearia reativada com sucesso!");
        setOpen(false);
      }
    }
  );

  async function deleteItem() {
    await mutation.mutateAsync();
  }

  return (
    <div className="flex justify-center">
      <ConfirmationModal
        onConfirm={deleteItem}
        open={open}
        onOpenChange={setOpen}
        confirmText="Reativar"
        title="Tem certeza que deseja reativar o acesso dessa barbearia a plataforma?"
        description="O colaborador poderá ter acesso novamente a todas as funcionalidades de Cutzone. Essa ação poderá ser desfeita."
      />
      <UnlockOutlined
        className="cursor-pointer rounded text-lg hover:bg-gray-200"
        onClick={() => setOpen(true)}
      />
    </div>
  );
}

export const columns: ColumnDef<BarberShopEntity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortButton column={column}>Nome</SortButton>,
    cell: ({ row }) => (
      <Link
        href={`/admin/barbearias/${row.original.id}`}
        className="text-blue-500 underline transition-all hover:text-blue-700"
      >
        {row.original.name}
      </Link>
    )
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortButton column={column}>Email</SortButton>
  },
  {
    accessorKey: "cellphone",
    header: ({ column }) => <SortButton column={column}>Telefone</SortButton>
  },
  {
    accessorKey: "city",
    header: ({ column }) => <SortButton column={column}>Cidade</SortButton>
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortButton column={column}>Criado em</SortButton>,
    cell: ({ row }) => {
      const date = timestampToDate(
        row.original.createdAt as unknown as Timestamp
      );

      return <p>{date.toLocaleDateString()}</p>;
    }
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <p className="px-4 py-2">Ações</p>,
    cell: ({ row }) => {
      const barberShop = row.original;

      return (
        <div className="ml-6 flex items-center">
          {!barberShop.suspended && <DeleteItem {...row} />}
          {barberShop.suspended && <ActivateItem {...row} />}
        </div>
      );
    }
  }
];
