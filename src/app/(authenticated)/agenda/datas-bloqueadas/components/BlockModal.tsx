import Button from "@/components/atoms/Button/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Square, SquareStack } from "lucide-react";
import { DateRange } from "react-day-picker";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button as ButtonShad } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { CollaboratorEntity } from "@/common/entities/collaborator";
import { CloseOutlined } from "@ant-design/icons";
import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlocekdDateEntity } from "@/common/entities/blockedDate";
import {
  createNewBarberShopBlockedDateDoc,
  createNewCollaboratorBlockedDateDoc
} from "@/store/services/blockedDate";
import { storageGet } from "@/store/services/storage";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { AppoitmentCompanyEntity } from "@/common/entities/appointmentCompany";

interface BlockModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  collaborators: CollaboratorEntity[];
  barberShop: BarberShopEntity;
  appointments: AppoitmentCompanyEntity[];
}

const BlockModal = ({
  open,
  onOpenChange,
  collaborators,
  barberShop
}: BlockModalProps) => {
  const [selectedValue, setSelectedValue] = useState("barbershop");
  const [switchValue, setSwitchValue] = useState(false);
  const [allDay, setAllDay] = useState<boolean | "indeterminate">(false);
  const selectedCollaborator = collaborators.find(
    (collaborator) => collaborator.id === selectedValue
  );
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2)
  });
  const [dateSingle, setDateSingle] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("12:00");
  const queryClient = useQueryClient();

  const collaboratorBlockMutation = useMutation(
    async (data: BlocekdDateEntity) => {
      return await createNewCollaboratorBlockedDateDoc(
        data,
        storageGet("uid") as string
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "collaborators",
          storageGet("uid") as string
        ]);
        queryClient.invalidateQueries([
          "blockedDatesCollab",
          storageGet("uid") as string
        ]);
        queryClient.invalidateQueries(["appointments", barberShop.id]);
        onOpenChange(false);
      }
    }
  );

  const barberShopBlockMutation = useMutation(
    async (data: BlocekdDateEntity) => {
      return await createNewBarberShopBlockedDateDoc(
        data,
        storageGet("uid") as string
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "barberShop",
          storageGet("uid") as string
        ]);
        queryClient.invalidateQueries([
          "blockedDates",
          storageGet("uid") as string
        ]);
        queryClient.invalidateQueries(["appointments", barberShop.id]);
        onOpenChange(false);
      }
    }
  );

  const handleSubmit = async () => {
    const data = {
      startDate: switchValue ? date?.from : dateSingle,
      endDate: switchValue ? date?.to : dateSingle,
      collaboratorId: selectedValue === "barbershop" ? null : selectedValue,
      collaboratorName:
        selectedValue === "barbershop" ? null : selectedCollaborator?.name,
      type: selectedValue === "barbershop" ? "barbershop" : "collaborator",
      companyName: barberShop.name,
      createdAt: new Date(),
      startTime: allDay ? null : startTime,
      endTime: allDay ? null : endTime
    };

    if (selectedValue === "barbershop") {
      await barberShopBlockMutation.mutateAsync(data as BlocekdDateEntity);
    } else {
      await collaboratorBlockMutation.mutateAsync(data as BlocekdDateEntity);
    }
  };

  useEffect(() => {
    if (allDay === true) {
      setStartTime("00:00");
      setEndTime("00:00");
    } else if (allDay === false) {
      setStartTime("08:00");
      setEndTime("12:00");
    }
  }, [allDay]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded bg-white shadow"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="mb-1 flex items-center justify-between text-primary-amber">
            Bloquear período de agendamento
            <div
              className="cursor-pointer font-bold text-black"
              onClick={() => onOpenChange(false)}
            >
              <CloseOutlined />
            </div>
          </DialogTitle>
          {/* <DialogDescription className="mb-4">
            
          </DialogDescription> */}
        </DialogHeader>
        <p className="text-sm font-light">
          Selecione para quem o período de agendamento será bloqueado:
        </p>
        <Select
          value={selectedValue}
          onValueChange={(e) => setSelectedValue(e)}
        >
          <SelectTrigger className="w-[180px] rounded  border border-gray-300 bg-gray-50 shadow">
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent className="rounded bg-gray-50">
            <SelectGroup>
              <SelectLabel>Selecione</SelectLabel>
              <SelectItem value="barbershop">Barbearia</SelectItem>
              {collaborators.map((collaborator) => (
                <SelectItem
                  key={collaborator.id}
                  value={collaborator.id as string}
                >
                  {collaborator.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-sm font-light">
          Selecione se o período bloqueado será de um único ou vários dias:
        </p>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full ${
              !switchValue ? "bg-primary-amber" : "bg-transparent"
            }`}
          >
            <Square size={16} strokeWidth={3} />
          </div>
          <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full ${
              switchValue ? "bg-primary-amber" : "bg-transparent"
            }`}
          >
            <SquareStack size={20} />
          </div>
        </div>
        {switchValue && (
          <>
            <p className="text-sm font-light">
              Selecione o início e o fim do período:
            </p>
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <ButtonShad
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start rounded border border-gray-300 bg-gray-50 text-left font-normal shadow",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y", { locale: ptBR })} -{" "}
                          {format(date.to, "LLL dd, y", { locale: ptBR })}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y", { locale: ptBR })
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </ButtonShad>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
        {!switchValue && (
          <>
            <p className="text-sm font-light">Selecione a data:</p>
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <ButtonShad
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start rounded border border-gray-300 bg-gray-50  text-left font-normal shadow",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateSingle ? (
                      format(dateSingle, "PPP", { locale: ptBR })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </ButtonShad>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0">
                  <Calendar
                    mode="single"
                    selected={dateSingle}
                    onSelect={setDateSingle}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
        <div className="ml-1 mt-2 flex items-center gap-1">
          <Checkbox
            className="rounded bg-gray-50"
            checked={allDay}
            onCheckedChange={setAllDay}
          />
          <p className="text-sm font-light">Dia todo</p>
        </div>
        <div>
          <p
            className={`mt-2 text-sm font-light ${
              allDay ? "text-gray-500" : "text-black"
            }`}
          >
            Horário início
          </p>
          <Input
            type="time"
            placeholder="Email"
            className="w-32 rounded border border-gray-300 bg-gray-50 shadow"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={allDay as boolean}
          />
        </div>
        <div>
          <p
            className={`mt-2 text-sm font-light ${
              allDay ? "text-gray-500" : "text-black"
            }`}
          >
            Horário fim
          </p>
          <Input
            type="time"
            placeholder="Email"
            className="w-32 rounded border border-gray-300 bg-gray-50 shadow"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={allDay as boolean}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button
            borderColor="border-gray-400"
            hover="hover:bg-gray-400"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            borderColor="border-primary-amber"
            hover="hover:bg-primary-amber"
            onClick={handleSubmit}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockModal;
