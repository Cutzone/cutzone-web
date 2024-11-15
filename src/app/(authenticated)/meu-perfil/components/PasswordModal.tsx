/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/atoms/Button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import useAuth from "@/hooks/useAuth";

const PasswordModal = ({
  open,
  onOpenChange,
  email
}: {
  open: boolean;
  onOpenChange: any;
  email: string;
}) => {
  const { forgotPassword } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-60 rounded bg-white shadow"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="">Deseja refinir sua senha?</DialogTitle>
          <DialogDescription className="pb-4 pt-1">
            Nós enviaremos um email para {email} com instruções para redefinição
          </DialogDescription>
          <DialogFooter>
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
              onClick={() => {
                forgotPassword(email);
                onOpenChange(false);
              }}
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordModal;
