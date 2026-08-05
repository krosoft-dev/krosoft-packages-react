import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/helpers/tailwind.helper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col gap-2 relative sm:flex-row",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1 absolute h-7 w-full z-10",
        button_previous: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", "absolute left-1"),
        button_next: cn(buttonVariants({ variant: "outline" }), "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100", "absolute right-1"),
        weekdays: "flex justify-center",
        weekday: "text-muted-foreground rounded-control w-9 font-normal text-[0.8rem] text-center flex items-center justify-center",
        week: "flex w-full mt-2",
        day: cn(
          "group relative size-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected].day-range-end)]:rounded-r-control",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-control",
          "last:[&:has([aria-selected])]:rounded-r-control",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
        ),
        day_button: cn(buttonVariants({ variant: "ghost" }), "size-9 p-0 font-normal aria-selected:opacity-100"),
        range_start: "day-range-start rounded-l-control",
        range_end: "day-range-end rounded-r-control",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="size-4" {...props} />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
