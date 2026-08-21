import { useKrosoftTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/helpers/tailwind.helper";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, XIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range?: DateRange) => void;
  placeholder?: string;
  className?: string;
}

export const DateRangePicker = ({ value, onChange, placeholder, className }: DateRangePickerProps) => {
  const { t } = useKrosoftTranslation();
  const [open, setOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value);

  React.useEffect(() => {
    if (open) {
      setTempRange(value);
    }
  }, [open, value]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setOpen(false);
  };

  const handleApply = () => {
    onChange(tempRange);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempRange(value);
    setOpen(false);
  };

  const handleClearInside = () => {
    setTempRange(undefined);
  };

  const formatRange = (range?: DateRange) => {
    if (!range?.from) return placeholder ?? t("date.pickPeriod");

    if (!range.to || range.from.getTime() === range.to.getTime()) {
      return format(range.from, "dd MMM yyyy", { locale: fr });
    }

    return `${format(range.from, "dd MMM yyyy", { locale: fr })} - ${format(range.to, "dd MMM yyyy", { locale: fr })}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id="date" variant="outline" className={cn("w-[300px] justify-start text-left font-normal", !value?.from && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 size-4" />
            {formatRange(value)}
            {value?.from && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("date.clearPeriod")}
                className="ml-auto h-5 w-5 opacity-50 hover:opacity-100"
                onClick={handleClear}
              >
                <XIcon className="size-4" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
          <Calendar
            mode="range"
            defaultMonth={tempRange?.from}
            selected={tempRange}
            onSelect={setTempRange}
            numberOfMonths={2}
            weekStartsOn={1}
            className="pointer-events-auto p-3"
          />
          <div className="flex items-center justify-between border-t border-border px-3 py-2">
            <Button variant="ghost" size="sm" onClick={handleClearInside}>
              Effacer
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Annuler
              </Button>
              <Button size="sm" onClick={handleApply}>
                Appliquer
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
