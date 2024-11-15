import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CloseOutlined, UserOutlined } from "@ant-design/icons";
import UploadMainImage from "@/components/molecules/UploadMainImage";
import { CollaboratorEntity } from "@/common/entities/collaborator";
import collaboratorFormSchema from "@/validations/collaborator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/atoms/Input/input";
import Button from "@/components/atoms/Button/button";
import {
  createNewCollaboratorDoc,
  updateCollaboratorDoc
} from "@/store/services/collaborators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storageGet } from "@/store/services/storage";

type collaboratorForm = z.infer<typeof collaboratorFormSchema>;

interface CollaboratorModalProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogOpen: boolean;
  collaborator?: CollaboratorEntity;
  type: "edit" | "create" | "view";
  url: string;
}

const CollaboratorModal = ({
  setIsDialogOpen,
  isDialogOpen,
  collaborator,
  type,
  url
}: CollaboratorModalProps) => {
  const [downloadURL, setDownloadURL] = useState(url);
  const [mainImageError, setMainImageError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<collaboratorForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(collaboratorFormSchema),
    values:
      (type === "edit" || type === "view") && collaborator
        ? {
            name: collaborator.name,
            age: collaborator.age,
            email: collaborator.email,
            pix: collaborator.pix,
            profession: collaborator.profession
          }
        : {
            name: "",
            age: "" as unknown as number,
            email: "",
            pix: "" as unknown as number,
            profession: ""
          }
  });

  const queryClient = useQueryClient();

  const mutationEdit = useMutation(
    (formData: collaboratorForm) => {
      return updateCollaboratorDoc(
        { ...formData, photo: downloadURL },
        collaborator?.id as string,
        storageGet("uid") as string
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "collaborators",
          storageGet("uid") as string
        ]);
        await queryClient.invalidateQueries([
          "appointments",
          storageGet("uid") as string
        ]);
        setIsDialogOpen(false);
      }
    }
  );

  const mutationCreate = useMutation(
    (formData: collaboratorForm) => {
      return createNewCollaboratorDoc(
        { ...formData, photo: downloadURL },
        storageGet("uid") as string
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["collaborators"]);
        setIsDialogOpen(false);
      }
    }
  );

  const handleFormSubmit = async (data: collaboratorForm) => {
    if (type === "create") {
      if (downloadURL === "") {
        setMainImageError("Insira uma imagem principal");
        return;
      }

      await mutationCreate.mutateAsync(data);
    } else {
      await mutationEdit.mutateAsync(data);
    }
  };

  const isView = type === "view";

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogContent
        className="w-80 rounded-xl bg-white shadow"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <p className="">
              {isView ? "Visualizar colaborador" : "Editar colaborador"}
            </p>
            <div
              className="cursor-pointer font-bold"
              onClick={() => setIsDialogOpen(false)}
            >
              <CloseOutlined />
            </div>
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col"
          onSubmit={
            isView ? (e) => e.preventDefault() : handleSubmit(handleFormSubmit)
          }
        >
          <UploadMainImage
            downloadURL={downloadURL}
            setDownloadURL={setDownloadURL}
            mainImageError={mainImageError}
            setMainImageError={setMainImageError}
            size="small"
            rounded
          >
            <UserOutlined style={{ fontSize: "28px" }} />
          </UploadMainImage>
          <Input
            bgColor="bg-white"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Nome completo"
            placeholder="Insira o nome do funcionário"
            formRegister={register}
            name="name"
            formErrors={errors}
            disabled={isView}
          />
          <div className="flex flex-1 items-center gap-2">
            <Input
              label="Idade"
              placeholder="25"
              mask="999"
              formRegister={register}
              name="age"
              formErrors={errors}
              bgColor="bg-white"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              disabled={isView}
            />
          </div>
          <Input
            label="Email"
            placeholder="a@b.com"
            formRegister={register}
            name="email"
            formErrors={errors}
            bgColor="bg-white"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            disabled={isView}
          />
          <div className="flex flex-1 items-center gap-2">
            <Input
              label="Pix"
              placeholder="Chave pix"
              formRegister={register}
              name="pix"
              formErrors={errors}
              bgColor="bg-white"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
              disabled={isView}
            />
          </div>
          <Input
            label="Profissão"
            placeholder="Barbeiro"
            formRegister={register}
            name="profession"
            formErrors={errors}
            bgColor="bg-white"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            disabled={isView}
          />
          {!isView && (
            <div className="flex justify-center">
              <Button
                borderColor="border-[#B7864B]"
                textColor="text-black"
                hover="hover:bg-white bg-[#B7864B]"
                type="submit"
              >
                Salvar
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollaboratorModal;
