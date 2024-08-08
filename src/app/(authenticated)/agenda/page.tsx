"use client";

import { useEffect, useState } from "react";

import { View } from "react-big-calendar";
import CalendarComponent from "./Calendar";
import Status from "./Status";
import Toolbar from "./Toolbar";
import Modal from "./Modal";
import { storageGet } from "@/store/services/storage";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { useRouter } from "next/navigation";
import useAllAppointments from "@/hooks/queries/useAllAppointments";
import { getCollaboratorDoc } from "@/store/services/collaborators";
import { getServiceDoc } from "@/store/services/services";
import { useQuery } from "@tanstack/react-query";
import { dateToShortString } from "@/utils/dateToString";
import moment from "moment";
import { Timestamp } from "@/common/entities/timestamp";
import { StopOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function Agenda() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const route = useRouter();
  const [events, setEvents] = useState<any[]>([]);

  const { data: barberData, isLoading } = useBarberShop(
    storageGet("uid") as string
  );
  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    isFetching,
    dataUpdatedAt,
    refetch
  } = useAllAppointments(storageGet("uid") as string);

  useEffect(() => {
    if (!isLoadingAppointments && appointments && appointments.length > 0) {
      setEvents([]);
      console.log(appointments);
      for (const a in appointments) {
        setEvents((prev) => [
          ...prev,
          {
            title: appointments[a].service?.name,
            clientName: appointments[a].client?.name,
            collaboratorName: appointments[a].employee?.name,
            start: moment(
              dateToShortString(
                appointments[a].startTime as unknown as Timestamp
              )
            ).toDate(),
            end: moment(
              dateToShortString(appointments[a].endTime as unknown as Timestamp)
            ).toDate(),
            status: appointments[a].status,
            id: appointments[a].id,
            bsid: appointments[a].companyId,
            serviceId: appointments[a].service?.id,
            employeeId: appointments[a].employee?.id,
            clientId: appointments[a].client?.id
          }
        ]);
      }
    }
  }, [appointments, isLoadingAppointments]);

  useEffect(() => {
    if (barberData?.flags?.includes(false) || barberData?.suspended) {
      route.replace("/gerenciamento");
    }
  }, [barberData, route]);

  return (
    <div>
      <Toolbar
        date={date}
        setDate={setDate}
        view={view}
        setView={setView}
        refetch={refetch}
        isFetching={isFetching}
        dataUpdatedAt={dataUpdatedAt}
      />

      <button>
        <Link
          className="mb-4 mt-2 flex items-center gap-2 rounded border border-primary-amber px-2 py-1 transition-all hover:border-black hover:bg-primary-amber hover:text-white"
          href="/agenda/datas-bloqueadas"
        >
          Datas bloqueadas <StopOutlined />
        </Link>
      </button>

      <CalendarComponent
        date={date}
        setDate={setDate}
        view={view}
        setView={setView}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedEvent={setSelectedEvent}
        events={events}
      />

      {!isLoadingAppointments && <Status appointments={appointments || []} />}

      <Modal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedEvent={selectedEvent}
      />
    </div>
  );
}
