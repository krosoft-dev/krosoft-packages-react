import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

const colorClasses = {
  blue: "from-blue-500 to-cyan-500",
  green: "from-green-500 to-emerald-500",
  orange: "from-orange-500 to-yellow-500",
  red: "from-red-500 to-pink-500",
  purple: "from-purple-500 to-indigo-500",
} as const;

export type MetricCardColor = keyof typeof colorClasses;

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: MetricCardColor;
  children?: React.ReactNode;
}

const getTrendIcon = (trend?: MetricCardProps["trend"]) => {
  if (trend === "up") return "↗";
  if (trend === "down") return "↘";
  return "→";
};

const getTrendColor = (trend?: MetricCardProps["trend"]) => {
  if (trend === "up") return "text-green-600";
  if (trend === "down") return "text-red-600";
  return "text-muted-foreground";
};

export const MetricCard = ({ title, value, unit, icon: Icon, trend, trendValue, color = "blue", children }: MetricCardProps) => {
  return (
    <Card className="relative overflow-hidden bg-card border shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-white/5" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="size-4 text-white" />
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-card-foreground">{typeof value === "number" ? value.toFixed(1) : value}</div>
          {unit && <div className="text-sm text-muted-foreground font-medium">{unit}</div>}
        </div>

        {trend && trendValue && (
          <div className={`flex items-center space-x-1 mt-2 text-xs ${getTrendColor(trend)}`}>
            <span>{getTrendIcon(trend)}</span>
            <span>{trendValue}</span>
          </div>
        )}

        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
};
