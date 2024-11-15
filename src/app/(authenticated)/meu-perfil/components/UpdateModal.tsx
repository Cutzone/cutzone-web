/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/atoms/Button/button";
import Input from "@/components/atoms/Input/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { updateUser } from "@/store/services/user";
import updateUserFormSchema from "@/validations/updateUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UpdateUserFormValidationData = z.infer<typeof updateUserFormSchema>;

const UpdateModal = ({
  open,
  onOpenChange,
  curName,
  userId
}: {
  open: boolean;
  onOpenChange: any;
  curName: string;
  userId: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (data: UpdateUserFormValidationData) => {
      const res = updateUser({ ...data, id: userId });
      return res;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["profile", userId]);
        onOpenChange(false);
      }
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdateUserFormValidationData>({
    criteriaMode: "all",
    mode: "all",
    resolver: zodResolver(updateUserFormSchema),
    values: {
      name: curName || ""
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-60 rounded bg-white shadow"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="mb-4">Alterar nome</DialogTitle>
          <Input
            bgColor="bg-white"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Nome completo"
            placeholder="Insira o nome"
            formRegister={register}
            formErrors={errors}
            name="name"
          />
          <DialogFooter>
            <Button
              borderColor="border-gray-400"
              hover="hover:bg-gray-400"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              borderColor="border-primary-amber"
              hover="hover:bg-primary-amber"
              onClick={handleSubmit(async (data) => {
                await mutation.mutateAsync(data);
              })}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateModal;
