import { formatNumber } from "@krosoft/core/helpers";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../helpers/tailwind.helper";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui";

export interface KpiCardProps {
  titleKey: string;
  value: number;
  valueClassName?: string;
  icon: React.ElementType;
  iconClassName?: string;
  description?: string;
  descriptionClassName?: string;
  onClick?: () => void;
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
}: KpiCardProps): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <Card className={cn(onClick !== undefined ? "hover:border-primary cursor-pointer" : "")} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{t(titleKey)}</CardTitle>
        <Icon className={cn("size-6 text-muted-foreground", iconClassName)} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{formatNumber(value)}</div>
        <p className={cn("text-xs text-muted-foreground", descriptionClassName)}>{description}</p>
      </CardContent>
    </Card>
  );
};
