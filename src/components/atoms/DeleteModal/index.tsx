import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  fn: () => void;
  type?: string;
  trigger?: boolean;
}

export default function DeleteModal({
  children,
  open,
  setOpen,
  fn,
  type,
  trigger
}: DeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="border-none bg-white">
        <DialogHeader>
          {type === "block" ? (
            <DialogTitle>
              Tem certeza que deseja bloquear o usuário?
            </DialogTitle>
          ) : (
            <DialogTitle>Tem certeza que deseja excluir?</DialogTitle>
          )}
        </DialogHeader>

        <DialogFooter>
          <Button
            type="submit"
            onClick={() => setOpen(false)}
            className="rounded-full bg-gray-300 text-black hover:bg-gray-500"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={() => fn()}
            className="rounded-full bg-red-500 hover:bg-red-700"
          >
            {type === "block" ? "Bloquear" : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
