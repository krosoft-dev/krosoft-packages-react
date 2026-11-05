import React from "react";
import { useKrosoftTranslation } from "@/i18n";
import { cn } from "@/helpers/tailwind.helper";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui";
import { KpiCardValue } from "./KpiCardValue";

export interface KpiCardProps {
  titleKey: string;
  value: number | string | Date;
  valueClassName?: string;
  icon: React.ElementType;
  iconClassName?: string;
  description?: string;
  descriptionClassName?: string;
  onClick?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const KpiCard = ({
  titleKey,
  value,
  valueClassName,
  icon: Icon,
  iconClassName,
  description,
  descriptionClassName,
  onClick,
  isLoading,
  error,
}: KpiCardProps): React.ReactElement => {
  const { t } = useKrosoftTranslation();

  return (
    <Card className={cn(onClick !== undefined ? "hover:border-primary cursor-pointer" : "")} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t(titleKey)}</CardTitle>
        <Icon className={cn("size-6 text-muted-foreground", iconClassName)} />
      </CardHeader>
      <CardContent>
        <KpiCardValue
          value={value}
          valueClassName={valueClassName}
          description={description}
          descriptionClassName={descriptionClassName}
          isLoading={isLoading}
          error={error}
        />
      </CardContent>
    </Card>
  );
};
