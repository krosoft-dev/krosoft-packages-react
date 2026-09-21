import { cn } from "@/helpers/tailwind.helper";
import { useKrosoftTranslation } from "@/i18n";
import { Loader2, LucideIcon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  /** Titre principal. Par défaut « Glissez-déposez vos fichiers ici ». */
  title?: string;
  /** Sous-titre. Par défaut « ou cliquez pour parcourir ». */
  hint?: string;
  /** Ligne de formats / restrictions (ex : « PDF, images · max 20 Mo »). */
  formats?: string;
  uploading?: boolean;
  uploadingLabel?: string;
  icon?: LucideIcon;
  className?: string;
}

/**
 * Zone de dépôt de fichiers : cliquable + glisser-déposer, pastille ronde
 * colorée. Possède son propre input caché. Les libellés (titre, sous-titre)
 * ont des valeurs i18n par défaut ; `formats` et `accept` sont fournis par
 * l'appelant selon le cas (images, documents…).
 */
export const FileDropzone = ({ onFiles, accept, multiple = true, title, hint, formats, uploading = false, uploadingLabel, icon: Icon = UploadIcon, className }: FileDropzoneProps) => {
  const { t } = useKrosoftTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const emit = (files: FileList | null) => {
    const list = Array.from(files ?? []);
    if (list.length > 0) {
      onFiles(list);
    }
  };

  const stateClasses = () => {
    if (uploading) {
      return "pointer-events-none border-border bg-muted/30 opacity-50";
    }
    if (dragOver) {
      return "border-primary/50 bg-primary/[0.06]";
    }
    return "border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/[0.03]";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={e => {
          emit(e.target.files);
          if (inputRef.current) {
            inputRef.current.value = "";
          }
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => {
          if (uploading) {
            return;
          }
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          setDragOver(true);
        }}
        onDragLeave={() => {
          setDragOver(false);
        }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          if (uploading) {
            return;
          }
          emit(e.dataTransfer.files);
        }}
        className={cn(
          "group flex min-h-52 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          stateClasses(),
          className,
        )}
      >
        {uploading ? (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" /> {uploadingLabel ?? t("dropzone.uploading")}
          </span>
        ) : (
          <>
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-200 group-hover:scale-110">
              <Icon className="size-6" strokeWidth={1.5} />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{title ?? t("dropzone.title")}</p>
              <p className="text-xs text-muted-foreground">{hint ?? t("dropzone.hint")}</p>
              {formats && <p className="mt-4 text-[11px] text-muted-foreground">{formats}</p>}
            </div>
          </>
        )}
      </button>
    </>
  );
};
