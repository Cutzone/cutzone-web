import { Calendar, View, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@common/styles/rbcStylesOverride.css";
import { myEventsList } from "./constants";
import { useCallback } from "react";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }: any) => (
  <div>
    <strong className="text-sm">
      {event.title}{" "}
      <span className="text-xs">{`<${event.collaboratorName}>`}</span>
    </strong>
  </div>
);

const eventStyleGetter = ({ event, start, end, isSelected }: any) => {
  const backgroundColor = "#B7864B";
  const style = {
    backgroundColor,
    borderRadius: "10px",
    opacity: 1,
    border: "1px solid black",
    width: "100%"
  };
  return {
    style
  };
};

const dayStyleGetter = (date: any) => {
  const today = moment().startOf("day");
  if (moment(date).isSame(today, "day")) {
    return {
      style: {
        backgroundColor: "rgba(251, 227, 189, 0.5)"
      }
    };
  } else {
    return {};
  }
};

interface CalendarComponentProps {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  setSelectedEvent: (event: any) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  events: any[];
}

function CalendarComponent({
  view,
  setView,
  date,
  setDate,
  setSelectedEvent,
  setIsDialogOpen,
  events
}: CalendarComponentProps) {
  const onSelectEvent = useCallback(
    (event: any) => {
      setSelectedEvent(event);
      setIsDialogOpen(true);
    },
    [setSelectedEvent, setIsDialogOpen]
  );

  return (
    <Calendar
      dayLayoutAlgorithm={"no-overlap"}
      localizer={localizer}
      events={events}
      view={view}
      onView={setView}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "78vh", border: "none", borderRadius: "10px" }}
      components={{
        event: CustomEvent
      }}
      min={moment("2023-10-25 08:00").toDate()}
      max={moment("2023-10-25 21:00").toDate()}
      dayPropGetter={dayStyleGetter}
      eventPropGetter={eventStyleGetter}
      messages={{
        next: "Próximo",
        previous: "Anterior",
        today: "Hoje",
        month: "Mês",
        week: "Semana",
        day: "Dia",
        date: "Data",
        time: "Hora",
        event: "Agendamento",
        showMore: (total) => `+${total} mais`
      }}
      onSelectEvent={(e) => onSelectEvent(e)}
      toolbar={false}
      date={date}
      onNavigate={setDate}
    />
  );
}

export default CalendarComponent;
