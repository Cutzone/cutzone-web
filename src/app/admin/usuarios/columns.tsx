import { UserEntity } from "@/common/entities/user";
import { Timestamp } from "@/common/entities/timestamp";
import { timestampToDate } from "@/utils/timestampToDate";
import { ColumnDef } from "@tanstack/react-table";
import SortButton from "@/components/atoms/SortButton";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/confirmationModal";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserDocSupension } from "@/store/services/user";
import { successToast } from "@/hooks/useAppToast";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";

function DeleteItem(row: { original: { id: string } }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      return updateUserDocSupension({
        id: row.original.id,
        suspended: true
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["users"]);
        successToast("Usuário suspenso com sucesso!");
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
        title="Tem certeza que deseja suspender esse usuário?"
        description="O usuário não terá acesso a nenhuma das funcionalidades de Cutzone. Essa ação poderá ser desfeita."
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
      return updateUserDocSupension({
        id: row.original.id,
        suspended: false
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["users"]);
        successToast("Usuário reativado com sucesso!");
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
        title="Tem certeza que deseja reativar o acesso desse usuário a plataforma?"
        description="O usuário poderá ter acesso novamente a todas as funcionalidades de Cutzone. Essa ação poderá ser desfeita."
      />
      <UnlockOutlined
        className="cursor-pointer rounded text-lg hover:bg-gray-200"
        onClick={() => setOpen(true)}
      />
    </div>
  );
}

export const columns: ColumnDef<UserEntity>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortButton column={column}>Nome</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.name}</p>;
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortButton column={column}>Email</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.email}</p>;
    }
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <SortButton column={column}>Telefone</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.phone}</p>;
    }
  },
  {
    accessorKey: "cpf",
    header: ({ column }) => <SortButton column={column}>CPF</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.cpf}</p>;
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
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <p className="px-4 py-2">Ações</p>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="ml-6 flex items-center">
          {!user.suspended && <DeleteItem {...row} />}
          {user.suspended && <ActivateItem {...row} />}
        </div>
      );
    }
  }
];
