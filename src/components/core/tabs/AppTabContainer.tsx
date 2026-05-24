import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AppAction } from "@/types/core/AppAction";
import { ReactNode } from "react";
import { AppTabHeader } from "./AppTabHeader";

export interface AppTabContainerProps {
  titleKey: string;
  descriptionKey?: string;
  actions?: AppAction[];
  className?: string;
  children?: ReactNode;
  isSubTitle?: boolean;
}
export function AppTabContainer({ titleKey, descriptionKey, actions = [], className, children, isSubTitle }: AppTabContainerProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <AppTabHeader titleKey={titleKey} descriptionKey={descriptionKey} actions={actions} className={className} />
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
