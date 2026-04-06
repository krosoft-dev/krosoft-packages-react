 
import { Input } from "@/components/ui";
import { cn } from "@/helpers/tailwind.helper";
import { SearchIcon, XIcon } from "lucide-react";

interface SearchInputProps {
  searchQuery?: string;
  search?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  className?: string;
}

export const SearchInput = ({
  searchQuery,
  search,
  placeholder = "Rechercher...",
  onSearch,
  onSubmit,
  onClear,
  className,
}: SearchInputProps): React.JSX.Element => {
  const currentValue = searchQuery || search || "";
  const handleClear = (): void => {
    onSearch("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={cn("relative h-fit w-full md:w-64", className)}>
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder={placeholder}
        value={currentValue}
        onChange={e => onSearch(e.target.value)}
        className="pl-8"
        onKeyDown={e => {
          if (e.key === "Enter" && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      {currentValue && (
        <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" type="button">
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
};
