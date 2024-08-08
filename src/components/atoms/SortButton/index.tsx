import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";

import { SortButtonProps } from "./types";

function SortButton({
  column,
  children,
  tooltip,
  tooltipContent
}: SortButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      onMouseEnter={() => tooltip && setIsOpen(true)}
      onMouseLeave={() => tooltip && setIsOpen(false)}
      className="px-0"
    >
      {tooltip && (
        <TooltipProvider delayDuration={100}>
          <Tooltip onOpenChange={setIsOpen} open={isOpen}>
            <p>{children}</p>
            <TooltipContent>
              <p>{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {tooltip ? "" : children}
      {!column.getIsSorted() && <ArrowUpDown className="ml-1 h-4 w-3" />}
      {column.getIsSorted() === "asc" && <ArrowUp className="ml-1 h-4 w-3" />}
      {column.getIsSorted() === "desc" && (
        <ArrowDown className="ml-1 h-4 w-3" />
      )}
    </Button>
  );
}

export default SortButton;
