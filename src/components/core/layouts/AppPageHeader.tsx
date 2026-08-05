import { Button } from "@/components/ui";
import { AppActions } from "@/components/core/layouts/AppActions";
import { AppTitle } from "@/components/core/layouts/AppTitle";
import { useDocumentTitle } from "@/hooks/ui/useDocumentTitle";
import { AppAction } from "@/types/AppAction";
import { ArrowLeftIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

export interface AppPageHeaderProps {
  icon?: React.ElementType;
  titleKey: string;
  descriptionKey?: string;
  actions?: AppAction[];
  onBack?: (() => void) | null;
  renderPreActions?: () => React.JSX.Element;
  className?: string;
}

export function AppPageHeader({
  icon: Icon,
  titleKey,
  descriptionKey,
  actions,
  onBack,
  renderPreActions,
  className,
}: AppPageHeaderProps): React.JSX.Element {
  const { t } = useTranslation();

  useDocumentTitle(t(titleKey));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        )}
        {Icon && (
          <div className="size-12 bg-blue-100 rounded-control flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        )}
        <AppTitle titleKey={titleKey} descriptionKey={descriptionKey} />
      </div>
      <div className="flex items-center gap-4">
        {renderPreActions && renderPreActions()}
        <AppActions actions={actions} className={className} />
      </div>
    </div>
  );
}
