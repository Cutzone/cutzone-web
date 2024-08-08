import { DataTable } from "@/components/ui/dataTable";
import { pending } from "./pending";
import { useEffect, useState } from "react";
import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";
import { isWithinInterval, startOfDay, subDays, subWeeks } from "date-fns";
import { timestampToDate } from "@/utils/timestampToDate";
import { Timestamp } from "@/common/entities/timestamp";
import { servicesValues } from "./constants";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { storageGet } from "@/store/services/storage";
import { DatePicker } from "@/components/atoms/DatePicker/datePicker";

const generatePeriodOptions = () => {
  return [
    "Última semana",
    "Último mês",
    "Últimos 3 meses",
    "Últimos 6 meses",
    "Último ano",
    "Personalizado..."
  ].map((period, index) => (
    <option key={index} value={period}>
      {period}
    </option>
  ));
};

interface PaymentsProps {
  appointments: AppoitmentCompanyEntity[];
}

const Payments = ({ appointments }: PaymentsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("Útimo ano");
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const today = new Date();

  const [customPeriodStart, setCustomPeriodStart] = useState<Date | undefined>(
    subDays(today, 3)
  );
  const [customPeriodEnd, setCustomPeriodEnd] = useState<Date | undefined>(
    today
  );
  const [filteredAppointments, setFilteredAppointments] =
    useState<AppoitmentCompanyEntity[]>(appointments);

  const { data: barbershop } = useBarberShop(storageGet("uid") as string);

  function filterLastWeekAppointments() {
    const now = new Date();
    const oneWeekAgo = subWeeks(startOfDay(now), 1);

    return appointments.filter((appointment) =>
      isWithinInterval(timestampToDate(appointment.startTime as Timestamp), {
        start: oneWeekAgo,
        end: now
      })
    );
  }

  function filterLastMonthAppointments() {
    return appointments.filter((appointment) =>
      isWithinInterval(timestampToDate(appointment.startTime as Timestamp), {
        start: subWeeks(startOfDay(new Date()), 4),
        end: new Date()
      })
    );
  }

  function filterLast3MonthsAppointments() {
    return appointments.filter((appointment) =>
      isWithinInterval(timestampToDate(appointment.startTime as Timestamp), {
        start: subWeeks(startOfDay(new Date()), 12),
        end: new Date()
      })
    );
  }

  function filterLast6MonthsAppointments() {
    return appointments.filter((appointment) =>
      isWithinInterval(timestampToDate(appointment.startTime as Timestamp), {
        start: subWeeks(startOfDay(new Date()), 24),
        end: new Date()
      })
    );
  }

  console.log(appointments);
  function filterLastYearAppointments() {
    return appointments.filter((appointment) =>
      isWithinInterval(timestampToDate(appointment.startTime as Timestamp), {
        start: subWeeks(startOfDay(new Date()), 52),
        end: new Date()
      })
    );
  }

  useEffect(() => {
    if (isCustomSelected) {
      const filtered = appointments.filter((appointment) =>
        isWithinInterval(timestampToDate(appointment.startTime as Timestamp), {
          start: customPeriodStart as Date,
          end: customPeriodEnd as Date
        })
      );
      setFilteredAppointments(filtered);
    }
  }, [isCustomSelected, customPeriodStart, customPeriodEnd, appointments]);

  useEffect(() => {
    switch (selectedPeriod) {
      case "Última semana":
        setFilteredAppointments(filterLastWeekAppointments());
        break;
      case "Último mês":
        setFilteredAppointments(filterLastMonthAppointments());
        break;
      case "Últimos 3 meses":
        setFilteredAppointments(filterLast3MonthsAppointments());
        break;
      case "Últimos 6 meses":
        setFilteredAppointments(filterLast6MonthsAppointments());
        break;
      case "Último ano":
        setFilteredAppointments(filterLastYearAppointments());
        break;
      case "Personalizado...":
        setIsCustomSelected(true);
        break;
      default:
        setFilteredAppointments(appointments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, appointments]);

  function calculatePayments(type: "corte" | "barba" | "sobrancelha") {
    if (!barbershop) return 0;

    const value = servicesValues[barbershop.tier as string][type];

    console.log(value);

    let total = 0;

    const filteredByCategory = filteredAppointments.filter(
      (appointment) => appointment.service?.category[0] === type
    );

    console.log(filteredAppointments);

    filteredByCategory.forEach(() => {
      total += value * 0.7;
    });

    return total;
  }

  const pendingTableData: {
    category: string;
    value: number;
  }[] = [
    {
      category: "Corte",
      value: calculatePayments("corte")
    },
    {
      category: "Barba",
      value: calculatePayments("barba")
    },
    {
      category: "Sobrancelha",
      value: calculatePayments("sobrancelha")
    },
    {
      category: "Total",
      value:
        calculatePayments("corte") +
        calculatePayments("barba") +
        calculatePayments("sobrancelha")
    }
  ];

  return (
    <div>
      <h3 className=" text-xl font-bold">Recebimentos</h3>
      <div className="mb-3 mt-7 flex items-center gap-2">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {generatePeriodOptions()}
        </select>
        {selectedPeriod === "Personalizado..." && (
          <>
            <DatePicker
              date={customPeriodStart}
              setDate={setCustomPeriodStart}
            />
            <DatePicker date={customPeriodEnd} setDate={setCustomPeriodEnd} />
          </>
        )}
      </div>
      <DataTable columns={pending} data={pendingTableData || []} />
    </div>
  );
};

export default Payments;
