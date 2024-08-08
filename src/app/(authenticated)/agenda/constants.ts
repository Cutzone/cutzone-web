import moment from "moment";

export const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

export const myEventsList = [
  {
    id: 0,
    title: "Corte",
    description: "Franklin",
    start: moment("2023-10-25 20:00").toDate(),
    end: moment("2023-10-25 21:00").toDate(),
    status: "scheduled"
  },
  {
    id: 1,
    title: "Corte e barba",
    description: "Felipe",
    start: moment("2023-10-25 20:00").toDate(),
    end: moment("2023-10-25 21:00").toDate(),
    status: "concluded"
  },
  {
    id: 2,
    title: "Corte",
    description: "Roberto",
    start: moment("2023-10-25 20:00").toDate(),
    end: moment("2023-10-25 21:00").toDate(),
    status: "canceled"
  }
];

export const daySchedule = [
  {
    hour: "08:00",
    appointments: [
      {
        title: "corte",
        start: "08:10",
        end: "08:40",
        professional: "Franklin",
        id: "1"
      }
    ]
  },
  {
    hour: "09:00",
    appointments: []
  },
  {
    hour: "10:00",
    appointments: [
      {
        title: "barba",
        start: "10:15",
        end: "10:45",
        professional: "Felipe",
        id: "2"
      },
      {
        title: "corte e barba",
        start: "10:50",
        end: "11:20",
        professional: "Marcos",
        id: "3"
      }
    ]
  },
  {
    hour: "11:00",
    appointments: []
  },
  {
    hour: "12:00",
    appointments: [
      {
        title: "corte",
        start: "12:10",
        end: "12:40",
        professional: "Franklin",
        id: "4"
      }
    ]
  },
  {
    hour: "13:00",
    appointments: []
  },
  {
    hour: "14:00",
    appointments: [
      {
        title: "barba",
        start: "14:30",
        end: "15:00",
        professional: "Felipe",
        id: "5"
      }
    ]
  },
  {
    hour: "15:00",
    appointments: []
  },
  {
    hour: "16:00",
    appointments: [
      {
        title: "corte e barba",
        start: "16:20",
        end: "16:50",
        professional: "Marcos",
        id: "6"
      }
    ]
  },
  {
    hour: "17:00",
    appointments: []
  },
  {
    hour: "18:00",
    appointments: [
      {
        title: "corte",
        start: "18:05",
        end: "18:35",
        professional: "Franklin",
        id: "7"
      }
    ]
  },
  {
    hour: "19:00",
    appointments: []
  },
  {
    hour: "20:00",
    appointments: [
      {
        title: "barba",
        start: "20:10",
        end: "20:40",
        professional: "Felipe",
        id: "8"
      }
    ]
  }
];
