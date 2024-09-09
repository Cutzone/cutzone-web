import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CloseOutlined } from "@ant-design/icons";
import Button from "@/components/atoms/Button/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAppointmentStatus,
  getAppointmentByClientId,
  updateClientAppointment,
  updateClientAppointmentStatus
} from "@/store/services/appointments";
import { updateUserAppointmentStatus } from "@/store/services/user";
import { isEqual } from "date-fns";
import { increment } from "firebase/firestore";

interface ModalProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  selectedEvent: any;
}

interface StatusModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type: "confirm" | "cancel" | "didNotShow";
  appointmentId: string;
  bsid: string;
  selectedEvent: any;
}

const StatusModal = ({
  isOpen,
  setIsOpen,
  type,
  appointmentId,
  bsid,
  selectedEvent
}: StatusModalProps) => {
  const queryClient = useQueryClient();

  const mutationConfirm = useMutation(
    () => {
      updateUserAppointmentStatus({
        companyId: selectedEvent.bsid,
        serviceId: selectedEvent.serviceId,
        userId: selectedEvent.clientId,
        employeeId: selectedEvent.employeeId,
        startTime: selectedEvent.start,
        status: "concluded"
      });
      return updateAppointmentStatus({
        id: selectedEvent.id,
        status: "concluded",
        bsid: selectedEvent.bsid
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["appointments"]);
        setIsOpen(false);
      }
    }
  );

  const mutationCancel = useMutation(
    async () => {
      const res = await getAppointmentByClientId(selectedEvent);

      const categoryService = selectedEvent?.service?.category[0];
      const clientId = selectedEvent?.clientId;
      const clientAppointmentId = res?.id;

      let field;

      if (categoryService === "sobrancelha") {
        field = {
          sobrancelhaCredit: increment(1)
        };
      } else if (categoryService === "barba") {
        field = {
          barbaCredit: increment(1)
        };
      } else if (categoryService === "corte") {
        field = {
          corteCredit: increment(1)
        };
      }

      await updateClientAppointment(clientId, clientAppointmentId ?? "", field);

      await updateAppointmentStatus({
        id: appointmentId,
        status: "canceled",
        bsid: selectedEvent.bsid
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["appointments"]);
        setIsOpen(false);
      }
    }
  );

  const mutationAbsence = useMutation(
    () => {
      updateUserAppointmentStatus({
        companyId: selectedEvent.bsid,
        serviceId: selectedEvent.serviceId,
        userId: selectedEvent.clientId,
        employeeId: selectedEvent.employeeId,
        startTime: selectedEvent.start,
        status: "canceled"
      });
      return updateAppointmentStatus({
        id: selectedEvent.id,
        status: "didNotShow",
        bsid: selectedEvent.bsid
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["appointments"]);
        setIsOpen(false);
      }
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="rounded border-none bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <h3 className="text-lg text-primary-amber">
              Tem certeza que deseja{" "}
              {type === "confirm" ? "concluir" : "cancelar"} o agendamento?
            </h3>
            <div
              className="cursor-pointer font-bold"
              onClick={() => setIsOpen(false)}
            >
              <CloseOutlined />
            </div>
          </DialogTitle>
          <DialogDescription>
            Essa ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div></div>
        <DialogFooter>
          <Button
            borderColor="border-red-500/90 text-sm"
            textColor="text-black"
            hover="hover:bg-red-500/90"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            borderColor="border-[#B7864B] text-sm"
            textColor="text-black"
            hover="hover:bg-[#B7864B]"
            type="submit"
            onClick={async () => {
              if (type === "confirm") {
                await mutationConfirm.mutateAsync();
              } else if (type === "cancel") {
                await mutationCancel.mutateAsync();
              } else if (type === "didNotShow") {
                await mutationAbsence.mutateAsync();
              }
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Modal = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedEvent
}: ModalProps) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isAbsenceOpen, setIsAbsenceOpen] = useState(false);
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-none bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <h1 className="text-primary-amber">Detalhes do agendamento</h1>
              <div
                className="cursor-pointer font-bold"
                onClick={() => setIsDialogOpen(false)}
              >
                <CloseOutlined />
              </div>
            </DialogTitle>
          </DialogHeader>
          <div>
            <h1>
              <span className="text-lg font-bold">Serviço:</span>{" "}
              {selectedEvent?.title}
            </h1>
            <h2>
              <span className="text-lg font-bold">Profissional:</span>{" "}
              {selectedEvent?.collaboratorName}
            </h2>
            <h2>
              <span className="text-lg font-bold">Cliente:</span>{" "}
              {selectedEvent?.clientName}
            </h2>
            <h3>
              <span className="text-lg font-bold">Data:</span>{" "}
              {selectedEvent?.start.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}{" "}
            </h3>
            <h3>
              <span className="text-lg font-bold">Horário:</span>{" "}
              {selectedEvent?.start.toLocaleString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
              })}{" "}
              -{" "}
              {selectedEvent?.end.toLocaleString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </h3>
            <h3>
              <span className="text-lg font-bold">Status:</span>{" "}
              {selectedEvent?.status === "scheduled" && (
                <span className="w-12 rounded bg-yellow-500 px-1 py-[2px] text-white">
                  Agendado
                </span>
              )}
              {selectedEvent?.status === "canceled" && (
                <span className="w-12 rounded bg-[#E01515] px-1 py-[2px] text-white">
                  Cancelado
                </span>
              )}
              {selectedEvent?.status === "concluded" && (
                <span className="w-12 rounded bg-[#2AC511] px-1 py-[2px] text-white">
                  Concluído
                </span>
              )}
              {selectedEvent?.status === "didNotShow" && (
                <span className="w-12 rounded bg-gray-500 px-1 py-[2px] text-white">
                  Cliente não compareceu
                </span>
              )}
            </h3>
          </div>
          {selectedEvent?.status === "scheduled" && (
            <DialogFooter>
              <Button
                borderColor="border-gray-500/90 text-sm"
                textColor="text-black"
                hover="hover:bg-gray-500/90"
                onClick={() => {
                  setIsAbsenceOpen(true);
                  setIsDialogOpen(false);
                }}
              >
                Cliente não compareceu
              </Button>
              <Button
                borderColor="border-red-500/90 text-sm"
                textColor="text-black"
                hover="hover:bg-red-500/90"
                onClick={() => {
                  setIsCancelOpen(true);
                  setIsDialogOpen(false);
                }}
              >
                Cancelar agendamento
              </Button>
              <Button
                borderColor="border-[#B7864B] text-sm"
                textColor="text-black"
                hover="hover:bg-[#B7864B]"
                onClick={() => {
                  setIsConfirmationOpen(true);
                  setIsDialogOpen(false);
                }}
              >
                Concluir agendamento
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      <StatusModal
        isOpen={isCancelOpen}
        setIsOpen={setIsCancelOpen}
        type="cancel"
        appointmentId={selectedEvent?.id}
        bsid={selectedEvent?.bsid}
        selectedEvent={selectedEvent}
      />
      <StatusModal
        isOpen={isConfirmationOpen}
        setIsOpen={setIsConfirmationOpen}
        type="confirm"
        appointmentId={selectedEvent?.id}
        bsid={selectedEvent?.bsid}
        selectedEvent={selectedEvent}
      />
      <StatusModal
        isOpen={isAbsenceOpen}
        setIsOpen={setIsAbsenceOpen}
        type="didNotShow"
        appointmentId={selectedEvent?.id}
        bsid={selectedEvent?.bsid}
        selectedEvent={selectedEvent}
      />
    </>
  );
};

export default Modal;
