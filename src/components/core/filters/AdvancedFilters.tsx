import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/helpers/tailwind.helper";

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export interface FilterSection {
  title: string;
  filters: FilterConfig[];
}

export interface AdvancedFiltersProps {
  sections: FilterSection[];
  appliedFilters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  buttonText?: string;
}

const DatePicker = ({
  date,
  onDateChange,
  placeholder,
}: {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "dd/MM/yyyy", { locale: fr }) : <span>{placeholder}</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar mode="single" selected={date} onSelect={onDateChange} initialFocus className="pointer-events-auto" />
    </PopoverContent>
  </Popover>
);

export function AdvancedFilters({
  sections,
  appliedFilters,
  onFiltersChange,
  isOpen,
  onOpenChange,
  buttonText = "Plus de filtres",
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<Record<string, any>>(appliedFilters);

  useEffect(() => {
    setFilters(appliedFilters);
  }, [appliedFilters]);

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    onFiltersChange(filters);
    onOpenChange(false);
  };

  const clearFilters = () => {
    const emptyFilters = Object.keys(filters).reduce(
      (acc, key) => {
        acc[key] = key.includes("date") ? undefined : "";
        return acc;
      },
      {} as Record<string, any>,
    );
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case "text":
        return <Input placeholder={filter.placeholder} value={filters[filter.key] || ""} onChange={e => updateFilter(filter.key, e.target.value)} />;

      case "number":
        return (
          <Input
            type="number"
            placeholder={filter.placeholder}
            value={filters[filter.key] || ""}
            onChange={e => updateFilter(filter.key, e.target.value)}
            min={filter.min}
            max={filter.max}
          />
        );

      case "select":
        return (
          <Select value={filters[filter.key] || ""} onValueChange={value => updateFilter(filter.key, value)}>
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date":
        return (
          <DatePicker
            date={filters[filter.key]}
            onDateChange={date => updateFilter(filter.key, date)}
            placeholder={filter.placeholder || "Sélectionner une date"}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4" />
          {buttonText}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="flex items-center justify-between">
            Filtres avancés
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
              <X className="size-4" />
              Effacer
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-6">
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="font-medium text-sm text-gray-900">{section.title}</h3>

                {section.filters.map(filter => (
                  <div key={filter.key} className="space-y-2">
                    <Label htmlFor={filter.key}>{filter.label}</Label>
                    {renderFilter(filter)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className="gap-2 p-6 border-t bg-white">
          <Button variant="outline" onClick={clearFilters}>
            Effacer les filtres
          </Button>
          <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600">
            Rechercher
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
