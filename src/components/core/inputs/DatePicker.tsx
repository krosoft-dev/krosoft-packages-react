import React, { useState, useRef, useEffect } from "react";
import { Button, Calendar } from "@/components/ui";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/helpers/tailwind.helper";

interface DatePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder: string;
}

export const DatePicker = ({ date, onDateChange, placeholder }: DatePickerProps): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer quand on clique en dehors
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent): void => {
      if (containerRef.current !== null && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleToggle = (): void => {
    setOpen(prev => !prev);
  };

  const handleDateSelect = (selectedDate: Date | undefined): void => {
    onDateChange(selectedDate);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        variant="outline"
        type="button"
        onClick={handleToggle}
        className={cn(
          "w-full justify-start text-left font-normal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          open && "ring-2 ring-ring ring-offset-2",
          date === undefined && "text-muted-foreground",
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {date !== undefined ? format(date, "dd/MM/yyyy", { locale: fr }) : <span>{placeholder}</span>}
      </Button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+4px)] z-[100] rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        </div>
      ) : null}
    </div>
  );
};
