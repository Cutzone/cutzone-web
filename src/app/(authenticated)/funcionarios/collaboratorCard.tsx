import React, { useState } from "react";
import {
  CloseOutlined,
  EllipsisOutlined,
  StarFilled,
  UserOutlined
} from "@ant-design/icons";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import collaboratorFormSchema from "@/validations/collaborator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/atoms/Input/input";
import Button from "@/components/atoms/Button/button";
import { CollaboratorEntity } from "@/common/entities/collaborator";
import UploadMainImage from "@/components/molecules/UploadMainImage";
import {
  deleteCollaboratorDoc,
  updateCollaboratorDoc
} from "@/store/services/collaborators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storageGet } from "@/store/services/storage";
import { BarberServicesEntity } from "@/common/entities/barberServicesEntity";
import { set } from "date-fns";
import DeleteModal from "@/components/atoms/DeleteModal";
import CollaboratorModal from "./collaboratorModal";

type collaboratorForm = z.infer<typeof collaboratorFormSchema>;
interface CollaboratorCardProps {
  collaborator: CollaboratorEntity;
}

const CollaboratorCard = ({ collaborator }: CollaboratorCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [downloadURL, setDownloadURL] = useState(collaborator.photo);
  const [mainImageError, setMainImageError] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: collaboratorForm) => {
      return updateCollaboratorDoc(
        { ...formData, photo: downloadURL },
        collaborator.id as string,
        storageGet("uid") as string
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "collaborators",
          storageGet("uid") as string
        ]);
        setIsDialogOpen(false);
      }
    }
  );

  const mutationDelete = useMutation(
    () => {
      return deleteCollaboratorDoc(
        collaborator.id as string,
        storageGet("uid") as string
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          "collaborators",
          storageGet("uid") as string
        ]);
        setIsDeleteOpen(false);
      }
    }
  );

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<collaboratorForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(collaboratorFormSchema),
    values: {
      name: collaborator.name,
      age: collaborator.age,
      email: collaborator.email,
      pix: collaborator.pix,
      profession: collaborator.profession
    }
  });

  const handleFormSubmit = async (data: collaboratorForm) => {
    await mutation.mutateAsync(data);
  };

  const deleteCollaborator = async () => {
    await mutationDelete.mutateAsync();
  };

  const [modalType, setModalType] = useState<"edit" | "create" | "view">(
    "edit"
  );

  return (
    <>
      <div className="flex h-72 w-64 flex-col items-center gap-2 rounded-xl bg-white p-4 py-4 shadow-lg">
        <div className="self-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisOutlined className="cursor-pointer text-2xl text-primary-amber" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="rounded bg-white">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setModalType("edit");
                  setIsDialogOpen(true);
                }}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary-light-gray" />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsDeleteOpen(true)}
              >
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="flex w-full cursor-pointer flex-col items-center justify-center"
          onClick={() => {
            setModalType("view");
            setIsDialogOpen(true);
          }}
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-full">
            <Image
              src={collaborator.photo as string}
              fill
              alt="collaborator"
              objectFit="cover"
            />
          </div>
          <p className="text-lg font-bold text-primary-amber">
            {collaborator.name}
          </p>
          <p className="mb-2">{collaborator.profession}</p>
          <p className="flex items-center gap-1 text-xl font-bold">
            4.8 <StarFilled style={{ color: "#FFCB45" }} />
          </p>
        </div>
      </div>
      <CollaboratorModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        collaborator={collaborator}
        type={modalType}
        url={downloadURL}
      />
      <DeleteModal
        fn={deleteCollaborator}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        trigger={false}
      ></DeleteModal>
    </>
  );
};

export default CollaboratorCard;
