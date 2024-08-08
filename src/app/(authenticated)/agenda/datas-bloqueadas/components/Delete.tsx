import {
  deleteBarberShopBlockedDateDoc,
  deleteCollaboratorBlockedDateDoc
} from "@/store/services/blockedDate";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import { storageGet } from "@/store/services/storage";
import Button from "@/components/atoms/Button/button";

interface DeleteProps {
  type: "barbershop" | "collaborator";
  colaboratorId: string | null;
  docId: string;
}

const Delete = ({ type, colaboratorId, docId }: DeleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutationCollaborator = useMutation(
    async (colaboratorId: string) => {
      return await deleteCollaboratorBlockedDateDoc(
        colaboratorId,
        storageGet("uid") as string,
        docId
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "blockedDatesCollab",
          storageGet("uid") as string
        ]);
        setIsOpen(false);
      }
    }
  );

  const mutationBarberShop = useMutation(
    async () => {
      return await deleteBarberShopBlockedDateDoc(
        docId,
        storageGet("uid") as string
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "blockedDates",
          storageGet("uid") as string
        ]);
        setIsOpen(false);
      }
    }
  );

  const handleClick = async () => {
    if (type === "collaborator" && colaboratorId) {
      await mutationCollaborator.mutateAsync(colaboratorId);
    } else if (type === "barbershop") {
      await mutationBarberShop.mutateAsync();
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {
          <DialogTrigger asChild>
            <DeleteOutlined className="text-lg" />
          </DialogTrigger>
        }
        <DialogContent className="border-none bg-white">
          <DialogHeader>
            <DialogTitle className="mb-1 flex items-center justify-between">
              Tem certeza que desbloquer essa data?
              <div
                className="cursor-pointer font-bold text-black"
                onClick={() => setIsOpen(false)}
              >
                <CloseOutlined />
              </div>
            </DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <Button
              borderColor="border-gray-400"
              hover="hover:bg-gray-400"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              hover="hover:bg-primary-amber"
              borderColor="border-primary-amber"
              onClick={handleClick}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Delete;
