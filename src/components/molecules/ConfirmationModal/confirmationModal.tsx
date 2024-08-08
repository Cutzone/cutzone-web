import { Title } from "@radix-ui/react-dialog";

import Button from "@/components/atoms/Button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const ConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  confirmText,
  description
}: {
  open: boolean;
  onOpenChange: any;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  description: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-60 rounded bg-white shadow"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="mb-2 text-xl">{title}</DialogTitle>
          <DialogDescription className="mb-4 leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div>
          <DialogFooter>
            <Button
              borderColor="border-gray-400"
              hover="hover:bg-gray-400"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              borderColor="border-primary-amber"
              hover="hover:bg-primary-amber"
              type="submit"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
