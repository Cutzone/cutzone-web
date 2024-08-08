import { StarFilled } from "@ant-design/icons";
import Image from "next/image";

import { CollaboratorEntity } from "@/common/entities/collaborator";

interface CollaboratorCardProps {
  collaborator: CollaboratorEntity;
}

const CollaboratorCard = ({ collaborator }: CollaboratorCardProps) => {
  return (
    <>
      <div className="flex h-60 w-64 flex-col items-center gap-2 rounded-xl bg-white p-4 py-4 shadow-lg">
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
    </>
  );
};

export default CollaboratorCard;
