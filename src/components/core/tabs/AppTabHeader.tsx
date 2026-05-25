import { AppAction } from "@/types/AppAction";
import { AppActions } from "../layouts/AppActions";
import { AppTitle } from "../layouts/AppTitle";

export interface AppTabHeaderProps {
  titleKey: string;
  descriptionKey?: string;
  actions?: AppAction[];
  className?: string;
}

export function AppTabHeader({ titleKey, descriptionKey, actions = [], className }: AppTabHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <AppTitle titleKey={titleKey} descriptionKey={descriptionKey} isSubTitle />
      <AppActions actions={actions} className={className} />
    </div>
  );
}
