import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";
import { CollaboratorEntity } from "@/common/entities/collaborator";
import firebaseApp from "@/config/firebase";
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { getCollaboratorDoc } from "./collaborators";
import { getServiceDoc } from "./services";
import { getUser } from "./user";
import { BarberServicesEntity } from "@/common/entities/barberServicesEntity";
import { getUserDoc } from "./barberShop";
import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import { ca } from "date-fns/locale";
import { isAfter, isBefore, isEqual, isSameDay } from "date-fns";
import { timestampToDate } from "@/utils/timestampToDate";
import { Timestamp } from "@/common/entities/timestamp";
import { timestampToTime } from "@/utils/timestampToTime";

const db = getFirestore(firebaseApp);
const tableName = "appointments";

export const getAllAppointments = async (barberShopId: string) => {
  const barberShopRef = doc(db, "companies", barberShopId);
  const appointmentsRef = collection(barberShopRef, tableName);
  const q = query(appointmentsRef);
  const querySnapshot = await getDocs(q);
  const appointments: AppoitmentCompanyEntity[] = [];

  for (const doc of querySnapshot.docs) {
    const client = await getUser(doc.data().idClient);
    const collaborator = await getCollaboratorDoc(
      doc.data().idEmployee,
      barberShopId
    );
    const service = await getServiceDoc(doc.data().idService, barberShopId);

    appointments.push({
      id: doc.id,
      companyId: barberShopId,
      ...(doc.data() as any),
      client: {
        ...client,
        id: doc.data().idClient
      } as DocumentData,
      employee: {
        ...collaborator,
        id: doc.data().idEmployee
      } as CollaboratorEntity,
      service: {
        ...service,
        id: doc.data().idService
      } as BarberServicesEntity
    });
  }

  return appointments;
};

export const getAllPlataformAppointments = async () => {
  const companyCollectionRef = collection(db, "companies");
  const querySnapshot = await getDocs(companyCollectionRef);
  const allApointments: AppoitmentCompanyEntity[] = [];

  for (const companyDoc of querySnapshot.docs) {
    const appointmentsRef = collection(companyDoc.ref, "appointments");
    const appointmentsQuerySnapshot = await getDocs(appointmentsRef);

    // appointmentsQuerySnapshot.forEach((appointmentDoc) => {
    //   allApointments.push({
    //     id: appointmentDoc.id,
    //     ...appointmentDoc.data()
    //   } as AppoitmentCompanyEntity);
    // });
    for (const appointmentDoc of appointmentsQuerySnapshot.docs) {
      const client = await getUser(appointmentDoc.data().idClient);
      const collaborator = await getCollaboratorDoc(
        appointmentDoc.data().idEmployee,
        companyDoc.id
      );
      const service = await getServiceDoc(
        appointmentDoc.data().idService,
        companyDoc.id
      );
      const company = await getUserDoc(companyDoc.id);

      allApointments.push({
        id: appointmentDoc.id,
        ...(appointmentDoc.data() as any),
        client: {
          ...client,
          id: appointmentDoc.data().idClient
        } as DocumentData,
        employee: {
          ...collaborator,
          id: appointmentDoc.data().idEmployee
        } as CollaboratorEntity,
        service: {
          ...service,
          id: appointmentDoc.data().idService
        } as BarberServicesEntity,
        company: { ...company, id: companyDoc.id } as BarberShopEntity
      });
    }
  }

  return allApointments;
};

export const updateAppointmentStatus = async ({
  id,
  bsid,
  status
}: {
  id: string;
  bsid: string;
  status: string;
}) => {
  try {
    const barberRef = doc(db, "companies", bsid);
    const docRef = doc(barberRef, tableName, id);
    const res = await updateDoc(docRef, {
      status
    });
    console.log(res);
    return { error: null };
  } catch (error: any) {
    console.log(error);
    console.log(id, bsid, status);
    return { error: error.message };
  }
};

function isTimeBetween(
  time: string,
  startTime: string,
  endTime: string
): boolean {
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  console.log(time, startTime, endTime);

  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  console.log(timeMinutes, startMinutes, endMinutes);

  if (startMinutes < endMinutes) {
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  } else if (startMinutes > endMinutes) {
    // Para cobrir o caso de meia-noite
    return timeMinutes >= startMinutes || timeMinutes < endMinutes;
  } else {
    // Se startTime e endTime são iguais
    return timeMinutes === startMinutes;
  }
}

// export const cancelAppointments = async ({
//   bsid,
//   collaboratorId,
//   type,
//   startDate,
//   endDate,
//   startTime,
//   endTime
// }: {
//   bsid: string;
//   collaboratorId: string | null;
//   type: string;
//   startDate: Date;
//   endDate: Date;
//   startTime: string | null;
//   endTime: string | null;
// }) => {
//   try {
//     const barberRef = doc(db, "companies", bsid);
//     const appointmentsRef = collection(barberRef, tableName);
//     const q = query(appointmentsRef);
//     const querySnapshot = await getDocs(q);
//     for (const doc of querySnapshot.docs) {
//       console.log(collaboratorId);
//       console.log(doc.data().idEmployee);
//       if (type === "collaborator" && doc.data().idEmployee !== collaboratorId)
//         continue;
//       console.log(timestampToDate(doc.data().startTime));
//       console.log(isSameDay(timestampToDate(doc.data().startTime), startDate));
//       if (
//         (isAfter(timestampToDate(doc.data().startTime), startDate) &&
//           isBefore(timestampToDate(doc.data().endTime), endDate)) ||
//         isSameDay(timestampToDate(doc.data().startTime), startDate)
//       ) {
//         console.log("b");
//         if (startTime && endTime) {
//           if (
//             isTimeBetween(
//               timestampToTime(doc.data().startTime),
//               startTime,
//               endTime
//             )
//           ) {
//             await updateDoc(doc.ref, {
//               status: "canceled"
//             });
//           }
//         } else {
//           await updateDoc(doc.ref, {
//             status: "canceled"
//           });
//         }
//       }
//     }
//     return { error: null };
//   } catch (error: any) {
//     console.log(error);
//     return { error: error.message };
//   }
// };

export const cancelAppointmentsBarbershop = async ({
  bsid,
  collaboratorId,
  type,
  startDate,
  endDate,
  startTime,
  endTime
}: {
  bsid: string;
  collaboratorId: string | null;
  type: string;
  startDate: Date;
  endDate: Date;
  startTime: string | null;
  endTime: string | null;
}) => {
  try {
    const barberRef = doc(db, "companies", bsid);
    const appointmentsRef = collection(barberRef, tableName);
    if (type === "barbershop") {
      const q = query(appointmentsRef, where("startTime", ">=", startDate));
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        console.log(doc.data());
        if (
          (isAfter(timestampToDate(doc.data().startTime), startDate) &&
            isBefore(timestampToDate(doc.data().endTime), endDate)) ||
          isSameDay(timestampToDate(doc.data().startTime), startDate) ||
          isSameDay(timestampToDate(doc.data().endTime), endDate)
        ) {
          if (startTime && endTime) {
            console.log(
              isTimeBetween(
                timestampToTime(doc.data().startTime),
                startTime,
                endTime
              )
            );
            if (
              isTimeBetween(
                timestampToTime(doc.data().startTime),
                startTime,
                endTime
              ) ||
              isTimeBetween(
                timestampToTime(doc.data().endTime),
                startTime,
                endTime
              )
            ) {
              await updateDoc(doc.ref, {
                status: "canceled"
              });
            }
          } else {
            await updateDoc(doc.ref, {
              status: "canceled"
            });
          }
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
};

export const cancelAppointmentsCollaborators = async ({
  bsid,
  collaboratorId,
  type,
  startDate,
  endDate,
  startTime,
  endTime
}: {
  bsid: string;
  collaboratorId: string | null;
  type: string;
  startDate: Date;
  endDate: Date;
  startTime: string | null;
  endTime: string | null;
}) => {
  try {
    console.log(123);
    const barberRef = doc(db, "companies", bsid);
    const appointmentsRef = collection(barberRef, tableName);
    if (type === "collaborator") {
      console.log(collaboratorId);
      const q = query(
        appointmentsRef,
        where("idEmployee", "==", collaboratorId)
      );
      const querySnapshot = await getDocs(q);
      for (const doc of querySnapshot.docs) {
        if (
          (isAfter(timestampToDate(doc.data().startTime), startDate) &&
            isBefore(timestampToDate(doc.data().endTime), endDate)) ||
          isSameDay(timestampToDate(doc.data().startTime), startDate) ||
          isSameDay(timestampToDate(doc.data().endTime), endDate)
        ) {
          console.log("b");
          if (startTime && endTime) {
            console.log("c");
            if (
              isTimeBetween(
                timestampToTime(doc.data().startTime),
                startTime,
                endTime
              )
            ) {
              await updateDoc(doc.ref, {
                status: "canceled"
              });
            }
          } else {
            await updateDoc(doc.ref, {
              status: "canceled"
            });
          }
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
};

export const getAppointmentByClientId = async (selectedEvent: any) => {
  try {
    const usersRef = doc(db, "users", selectedEvent.clientId);
    const appointmentsRef = collection(usersRef, tableName);

    const querySnapshot = await getDocs(appointmentsRef);

    const appointments = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime.toDate(),
      id: doc.id
    })) as {
      endTime: Date;
      id: string;
      startTime: Date;
      status: string;
      idCompany: string;
      idEmployee: string;
      idService: string;
    }[];

    const appointment = appointments.find(
      (item) =>
        isEqual(item?.startTime, selectedEvent?.start) &&
        isEqual(item?.endTime, selectedEvent?.end) &&
        item.idEmployee === selectedEvent.collaboratorId &&
        item.status === "scheduled" &&
        item.idCompany === selectedEvent.bsid
    );

    return appointment ?? null;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const updateClientAppointment = async (
  clientId: string,
  appointmentId: string,
  fields: any
) => {
  try {
    const usersRef = doc(db, "users", clientId);
    const appointmentsRef = doc(usersRef, "appointments", appointmentId);

    await updateDoc(usersRef, {
      ...fields
    });

    await updateDoc(appointmentsRef, {
      status: "canceled"
    });

    return true;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const updateClientAppointmentStatus = async (
  clientId: string,
  appointmentId: string,
  status: string
) => {
  try {
    const usersRef = doc(db, "users", clientId);
    const appointmentsRef = doc(usersRef, "appointments", appointmentId);

    await updateDoc(appointmentsRef, {
      status
    });

    return true;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
