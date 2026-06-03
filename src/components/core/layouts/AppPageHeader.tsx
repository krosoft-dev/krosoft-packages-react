import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppActions } from "./AppActions";
import { AppTitle } from "./AppTitle";
import { useDocumentTitle } from "@/hooks/ui/useDocumentTitle";
import { AppAction } from "@/types/AppAction";

export interface AppPageHeaderProps {
  icon?: React.ElementType;
  titleKey: string;
  descriptionKey?: string;
  actions?: AppAction[];
  backTo?: string | null;
  renderPreActions?: () => React.JSX.Element;
  className?: string;
  appTitle?: string;
}

export function AppPageHeader({
  icon: Icon,
  titleKey,
  descriptionKey,
  actions,
  backTo,
  renderPreActions,
  className,
  appTitle,
}: AppPageHeaderProps): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useDocumentTitle(t(titleKey), appTitle);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {backTo && (
          <Button variant="ghost" size="icon" onClick={() => navigate(backTo)} className="rounded-2xl">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        )}
        {Icon && (
          <div className="size-12 bg-blue-100 rounded-lg flex items-center justify-center">
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
