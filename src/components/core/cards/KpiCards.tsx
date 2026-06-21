import React from "react";
import { KpiCardProps, KpiCard } from "./KpiCard";

interface KpiCardsProps {
  stats: KpiCardProps[];
  isLoading?: boolean;
  error?: string | null;
}

export const KpiCards = ({ stats, isLoading, error }: KpiCardsProps): React.JSX.Element => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {stats.map(stat => (
      <KpiCard
        key={stat.titleKey}
        titleKey={stat.titleKey}
        value={stat.value}
        valueClassName={stat.valueClassName}
        icon={stat.icon}
        iconClassName={stat.iconClassName}
        description={stat.description}
        descriptionClassName={stat.descriptionClassName}
        onClick={stat.onClick}
        isLoading={isLoading}
        error={error}
      />
    ))}
  </div>
);
