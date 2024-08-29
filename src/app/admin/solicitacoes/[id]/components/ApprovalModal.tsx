import Button from "@/components/atoms/Button/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { successToast } from "@/hooks/useAppToast";
import { updateBarberDocApproved } from "@/store/services/barberShop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ApprovalModal = ({
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
  const [tierValue, setTierValue] = useState<string>("STANDARD");
  const [checkboxValue, setCheckboxValue] = useState<string>("");

  const mutation = useMutation(
    async () => {
      return await updateBarberDocApproved({
        id: id as string,
        aproved: true,
        aprovedAt: new Date(),
        tier: tierValue,
        status: "approved"
      });
    },
    {
      onSuccess: () => {
        onOpenChange(false);
        successToast("Solicitação aceita com sucesso!");
        router.push("/admin/solicitacoes");
        queryClient.invalidateQueries(["barberShops"]);
        queryClient.invalidateQueries(["barberShop", id as string]);
      }
    }
  );

  // const options = [
  //   { value: "STANDARD", label: "De Cria" },
  //   { value: "BASIC", label: "Chavoso" },
  //   { value: "PREMIUM", label: "Jogador Caro" }
  // ];

  // const handleCheckboxChange = (value: string) => {
  //   setTierValue((currentSelectedOptions) => {
  //     if (currentSelectedOptions.includes(value)) {
  //       return currentSelectedOptions.filter((option) => option !== value);
  //     } else {
  //       return [...currentSelectedOptions, value];
  //     }
  //   });
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-60 rounded bg-white shadow"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="mb-1">Aceitar solicitação</DialogTitle>
          {/* <DialogDescription className="mb-4">
            Tem certeza que deseja aceitar a solicitação da barbearia?
          </DialogDescription> */}
        </DialogHeader>
        <p className="">Selecione o tier da barbearia:</p>
        <Select value={tierValue} onValueChange={(e) => setTierValue(e)}>
          <SelectTrigger className="w-[180px] rounded  border border-gray-300 bg-gray-50 shadow">
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent className="rounded bg-gray-50">
            <SelectGroup>
              <SelectLabel>Tier</SelectLabel>
              <SelectItem value="BASISC">Cria</SelectItem>
              <SelectItem value="STANDARD">Chavoso</SelectItem>
              <SelectItem value="PREMIUM">Jogador</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <div className="flex flex-col gap-1">
          {options.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                checked={tierValue.includes(option.value)}
                onCheckedChange={() => handleCheckboxChange(option.value)}
              />
              <p>{option.label}</p>
            </div>
          ))}
        </div> */}
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
            onClick={async () => {
              await mutation.mutateAsync();
            }}
          >
            Aceitar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalModal;
