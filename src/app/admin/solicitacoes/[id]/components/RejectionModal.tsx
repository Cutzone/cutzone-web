import Button from "@/components/atoms/Button/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { successToast } from "@/hooks/useAppToast";
import { updateBarberDocRejected } from "@/store/services/barberShop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RejectionModal = ({
  open,
  onOpenChange,
  id
}: {
  open: boolean;
  onOpenChange: any;
  id: string;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [reason, setReason] = useState("");

  const mutation = useMutation(
    async (reason: string) => {
      return await updateBarberDocRejected({
        id: id as string,
        rejected: true,
        rejectedAt: new Date(),
        reason,
        status: "rejected"
      });
    },
    {
      onSuccess: () => {
        onOpenChange(false);
        successToast("A Solicitação da barbearia foi rejeitada.");
        router.push("/admin/solicitacoes");
        queryClient.invalidateQueries(["barberShops"]);
        queryClient.invalidateQueries(["barberShop", id as string]);
      }
    }
  );

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    await mutation.mutateAsync(reason);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-60 rounded bg-white shadow"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Rejeitar solicitação</DialogTitle>
          <DialogDescription className="mb-4">
            Tem certeza que deseja aceitar a solicitação da barbearia? Essa ação
            não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <label className="mb-2 font-medium text-primary-amber">
            Motivo da rejeição
          </label>
          <textarea
            className="mb-4 h-32 w-full resize-none rounded border p-2 text-sm"
            placeholder="Escreva aqui o motivo..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              borderColor="border-gray-400"
              hover="hover:bg-gray-400"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              borderColor="border-primary-amber"
              hover="hover:bg-primary-amber"
              type="submit"
            >
              Rejeitar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionModal;
