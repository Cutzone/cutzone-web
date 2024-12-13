import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";
import { Timestamp } from "@/common/entities/timestamp";
import SortButton from "@/components/atoms/SortButton";
import { timestampToDate } from "@/utils/timestampToDate";
import { ColumnDef } from "@tanstack/react-table";
import { ptBR } from "date-fns/locale";

// export const appointments = [
//   {
//     id: "0",
//     startDate: "10/10",
//     endDate: "2021-01-01T10:45",
//     service: "Corte",
//     status: "concluido",
//     client: "João da Silva",
//     professional: "Felipe"
//   },
//   {
//     id: "1",
//     startDate: "10/10",
//     endDate: "2021-02-15T15:30",
//     service: "Corte e Barba",
//     status: "cancelado",
//     client: "Maria Santos",
//     professional: "Franklin"
//   },
//   {
//     id: "2",
//     startDate: "13/10",
//     endDate: "2021-03-10T12:00",
//     service: "Barba",
//     status: "agendado",
//     client: "Pedro Oliveira",
//     professional: "Felipe"
//   },
//   {
//     id: "3",
//     startDate: "15/10",
//     endDate: "2021-04-20T17:15",
//     service: "Corte",
//     status: "concluido",
//     client: "Luana Costa",
//     professional: "Franklin"
//   },
//   {
//     id: "4",
//     startDate: "15/10",
//     endDate: "2021-05-05T14:45",
//     service: "Barba",
//     status: "agendado",
//     client: "Rafael Lima",
//     professional: "Felipe"
//   },
//   {
//     id: "5",
//     startDate: "15/10",
//     endDate: "2021-06-30T11:30",
//     service: "Corte",
//     status: "cancelado",
//     client: "Ana Souza",
//     professional: "Franklin"
//   }
// ];

// const Service = (idObj: { id: string }) => {
//   const { data: service, isLoading } = useQuery(["serviceDoc", idObj.id], () =>
//     getServiceDoc(idObj.id, storageGet("uid") as string)
//   );

//   if (isLoading) {
//     return <p>...</p>;
//   }

//   return <p>{service?.name}</p>;
// };

// const Collaborator = (idObj: { id: string }) => {
//   const { data: collaborator, isLoading } = useQuery(
//     ["collaboratorDoc", idObj.id],
//     () => getCollaboratorDoc(idObj.id, storageGet("uid") as string)
//   );

//   if (isLoading) {
//     return <p>...</p>;
//   }

//   return <p>{collaborator?.name}</p>;
// };

// const Client = (idObj: { id: string }) => {
//   const { data: client, isLoading } = useQuery(["clientDoc", idObj.id], () =>
//     getUserDoc(idObj.id)
//   );

//   if (isLoading) {
//     return <p>...</p>;
//   }

//   return <p>{client?.name}</p>;
// };

export const columns: ColumnDef<AppoitmentCompanyEntity>[] = [
  {
    accessorKey: "service",
    header: ({ column }) => <SortButton column={column}>Serviço</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.service?.name}</p>;
    }
  },
  {
    accessorKey: "employee",
    header: ({ column }) => (
      <SortButton column={column}>Funcionário</SortButton>
    ),
    cell: ({ row }) => {
      return <p>{row.original.employee?.name}</p>;
    }
  },
  {
    accessorKey: "client",
    header: ({ column }) => <SortButton column={column}>Cliente</SortButton>,
    cell: ({ row }) => {
      return <p>{row.original.client?.name}</p>;
    }
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => <SortButton column={column}>Data</SortButton>,
    cell: ({ row }) => {
      const date = timestampToDate(row.original.startTime as Timestamp);

      return <p>{date.toLocaleDateString("pt-BR")}</p>;
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortButton column={column}>Status</SortButton>,
    cell: ({ row }) => {
      const status = row.original.status;

      switch (status) {
        case "concluded":
          return (
            <span className="w-12 rounded bg-[#2AC511] px-2 py-1 text-white">
              Concluído
            </span>
          );
        case "canceled":
          return (
            <span className="w-12 rounded bg-[#E01515] px-2 py-1 text-white">
              Cancelado
            </span>
          );
        case "scheduled":
          return (
            <span className="w-12 rounded bg-yellow-500 px-2 py-1 text-white">
              Agendado
            </span>
          );
        case "didNotShow":
          return (
            <span className="w-12 rounded bg-[#E01515] px-2 py-1 text-white">
              Não Compareceu
            </span>
          );
        default:
          return <span className="w-12 rounded px-2 py-1">Reagendado</span>;
      }
    }
  }
];
