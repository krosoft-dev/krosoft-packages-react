import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/helpers/tailwind.helper";
import React from "react";
import { useKrosoftTranslation } from "@/i18n";

interface DashboardCardProps {
  titleKey: string;
  icon?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const DashboardCard = ({ titleKey, icon: Icon, className, children }: DashboardCardProps) => {
  const { t } = useKrosoftTranslation();
  return (
    <Card className={cn("bg-gray-50 dark:bg-gray-950", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="mr-2 size-4" />}
          <span>{t(titleKey)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
