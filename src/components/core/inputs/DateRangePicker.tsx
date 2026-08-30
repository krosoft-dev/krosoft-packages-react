import { useDateFnsLocale, useKrosoftTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/helpers/tailwind.helper";
import { DateRangeValue } from "@/types/DateRangeValue";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value?: DateRangeValue;
  onChange: (range?: DateRangeValue) => void;
  placeholder?: string;
  className?: string;
}

/** `react-day-picker` reste un détail interne : on convertit vers son `DateRange` pour le calendrier. */
const toCalendarRange = (range?: DateRangeValue): DateRange | undefined => (range ? { from: range.from, to: range.to } : undefined);

export const DateRangePicker = ({ value, onChange, placeholder, className }: DateRangePickerProps) => {
  const { t } = useKrosoftTranslation();
  const locale = useDateFnsLocale();
  const [open, setOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(toCalendarRange(value));

  React.useEffect(() => {
    if (open) {
      setTempRange(toCalendarRange(value));
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
    setTempRange(toCalendarRange(value));
    setOpen(false);
  };

  const handleClearInside = () => {
    setTempRange(undefined);
  };

  const formatRange = (range?: DateRangeValue) => {
    if (!range?.from) return placeholder ?? t("date.pickPeriod");

    if (!range.to || range.from.getTime() === range.to.getTime()) {
      return format(range.from, "dd MMM yyyy", { locale });
    }

    return `${format(range.from, "dd MMM yyyy", { locale })} - ${format(range.to, "dd MMM yyyy", { locale })}`;
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
            resetOnSelect
            defaultMonth={tempRange?.from}
            selected={tempRange}
            onSelect={setTempRange}
            numberOfMonths={2}
            locale={locale}
            className="pointer-events-auto p-3"
          />
          <div className="flex items-center justify-between border-t border-border px-3 py-2">
            <Button variant="ghost" size="sm" onClick={handleClearInside}>
              {t("actions.clear")}
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                {t("actions.cancel")}
              </Button>
              <Button size="sm" onClick={handleApply}>
                {t("actions.apply")}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
