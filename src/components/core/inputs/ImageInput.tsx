import { Button } from "@/components/ui";
import { useNotifications } from "@/hooks/ui/useNotifications";
import { cn } from "@/helpers/tailwind.helper";
import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { forwardRef, useRef } from "react";

interface ImageInputProps {
  value?: string;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
  hint?: string;
}

export const ImageInput = forwardRef<HTMLDivElement, ImageInputProps>(
  ({ value, onChange, accept = "image/jpeg,image/png,image/webp", maxSizeMB = 2, disabled = false, className = "", hint = "JPG, PNG, WEBP" }, ref) => {
    const { showError } = useNotifications();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validation du type MIME
      const acceptedTypes = accept.split(",").map(t => t.trim());
      if (!acceptedTypes.includes(file.type)) {
        showError("Erreur", `Seuls les fichiers ${hint} sont acceptés`);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      // Validation de la taille
      if (file.size > maxSizeMB * 1024 * 1024) {
        showError("Erreur", `Le fichier ne doit pas dépasser ${maxSizeMB}MB`);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      onChange(file);
      if (inputRef.current) inputRef.current.value = "";
    };

    const handleRemove = () => {
      onChange(null);
    };

    return (
      <div ref={ref} className={className}>
        {value ? (
          <div className="relative w-32 h-32 rounded-surface overflow-hidden border-2 border-border">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            {!disabled && (
              <Button type="button" variant="destructive" size="sm" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={handleRemove}>
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : disabled ? (
          <div className={cn("flex flex-col items-center justify-center w-full h-32", "border-2 border-dashed border-border rounded-surface", "bg-muted/30")}>
            <ImageIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <span className="text-sm text-muted-foreground/50">Aucune image</span>
          </div>
        ) : (
          <label
            className={cn(
              "flex flex-col items-center justify-center w-full h-32",
              "border-2 border-dashed border-border rounded-surface",
              "cursor-pointer hover:bg-muted/50 transition-colors",
            )}
          >
            <UploadIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Cliquer pour uploader</span>
            <span className="text-xs text-muted-foreground mt-1">
              {hint} (max {maxSizeMB}MB)
            </span>
            <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleFileSelect} />
          </label>
        )}
      </div>
    );
  },
);

ImageInput.displayName = "ImageInput";
