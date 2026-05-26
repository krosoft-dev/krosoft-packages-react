import { AppAction } from "@/types/AppAction";
import { useTranslation } from "react-i18next";
import { AppActions } from "./AppActions";

export interface AppSubTitleProps {
  titleKey: string;
  actions?: AppAction[];
  className?: string;
}

export function AppSubTitle({ titleKey, actions, className }: AppSubTitleProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h2 className="text-lg font-semibold">{t(titleKey)}</h2>
      <AppActions actions={actions} className={className} />
    </div>
  );
}
