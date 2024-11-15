import React, { useState } from "react";
import { EllipsisOutlined, StarFilled } from "@ant-design/icons";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CollaboratorEntity } from "@/common/entities/collaborator";
import { deleteCollaboratorDoc } from "@/store/services/collaborators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storageGet } from "@/store/services/storage";
import DeleteModal from "@/components/atoms/DeleteModal";
import CollaboratorModal from "./collaboratorModal";

interface CollaboratorCardProps {
  collaborator: CollaboratorEntity;
}

const CollaboratorCard = ({ collaborator }: CollaboratorCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [downloadURL] = useState(collaborator.photo);
  const queryClient = useQueryClient();

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
