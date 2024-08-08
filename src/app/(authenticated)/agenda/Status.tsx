import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";
import { Timestamp } from "@/common/entities/timestamp";
import { timestampToDate } from "@/utils/timestampToDate";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { isSameDay } from "date-fns";
import React from "react";

const Status = ({
  appointments
}: {
  appointments: AppoitmentCompanyEntity[];
}) => {
  const concluded = appointments.filter((appointment) => {
    return (
      appointment.status === "concluded" &&
      isSameDay(new Date(), timestampToDate(appointment.startTime as Timestamp))
    );
  });
  const scheduled = appointments.filter((appointment) => {
    return (
      appointment.status === "scheduled" &&
      isSameDay(new Date(), timestampToDate(appointment.startTime as Timestamp))
    );
  });
  const canceled = appointments.filter((appointment) => {
    return (
      appointment.status === "canceled" &&
      isSameDay(new Date(), timestampToDate(appointment.startTime as Timestamp))
    );
  });
  const didNotShow = appointments.filter((appointment) => {
    return (
      appointment.status === "didNotShow" &&
      isSameDay(new Date(), timestampToDate(appointment.startTime as Timestamp))
    );
  });

  return (
    <div className="mt-8 rounded-xl border border-primary-light-gray px-6 py-4">
      <h3 className="mb-6 font-bold">Status do dia</h3>
      <div className="grid grid-cols-1 gap-6 text-white md:grid-cols-2 lg:grid-cols-4">
        <div className="flex justify-center rounded bg-[#EAA800] px-4 py-4">
          <p className="flex items-center gap-1">
            <div className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-white"></div>
            <span className="text-xl font-bold">{scheduled.length}</span>{" "}
            Agendados
          </p>
        </div>
        <div className="flex justify-center rounded bg-[#2AC511] px-4 py-4">
          <p className="flex items-center gap-1">
            <div className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <CheckOutlined style={{ color: "#2AC511" }} />
            </div>
            <span className="text-xl font-bold">{concluded.length}</span>{" "}
            Concluídos
          </p>
        </div>
        <div className="flex justify-center rounded bg-[#2AC511] px-4 py-4">
          <p className="flex items-center gap-1">
            <div className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <CloseOutlined style={{ color: "#2AC511" }} />
            </div>
            <span className="text-xl font-bold">{didNotShow.length}</span> Não
            compareceu
          </p>
        </div>
        <div className="flex justify-center rounded bg-[#E01515] px-4 py-4">
          <p className="flex items-center gap-1">
            <div className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <CloseOutlined style={{ color: "#E01515" }} />
            </div>
            <span className="text-xl font-bold">{canceled.length}</span>{" "}
            Cancelados
          </p>
        </div>
        <div className="flex justify-center rounded px-4 py-4 text-black">
          <p>
            <span className="text-xl font-bold"> 0</span> Reagendados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Status;
