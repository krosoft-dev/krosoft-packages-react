import { Card, CardContent, CardTitle } from "@/components/ui/card";
import * as React from "react";

const colorClasses = {
  blue: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white",
  green: "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
  orange: "bg-gradient-to-br from-orange-500 to-yellow-500 text-white",
  red: "bg-gradient-to-br from-red-500 to-pink-500 text-white",
  purple: "bg-gradient-to-br from-purple-500 to-indigo-500 text-white",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
} as const;

export type MetricCardColor = keyof typeof colorClasses;

const iconSizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

export type MetricCardIconSize = keyof typeof iconSizeClasses;

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ElementType;
  iconSize?: MetricCardIconSize;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: MetricCardColor;
  children?: React.ReactNode;
}

const getTrendIcon = (trend?: MetricCardProps["trend"]): string => {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "";
};

const getTrendColor = (trend?: MetricCardProps["trend"]): string => {
  if (trend === "up") return "text-green-600";
  if (trend === "down") return "text-red-600";
  return "text-muted-foreground";
};

export const MetricCard = ({ title, value, unit, subtitle, icon, iconSize = "md", trend, trendValue, color = "blue", children }: MetricCardProps) => {
  const Icon = icon;

  return (
    <Card className="relative overflow-hidden bg-card border shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="flex items-baseline space-x-2 mt-1">
              <div className="text-2xl font-bold text-card-foreground">{typeof value === "number" ? value.toFixed(1) : value}</div>
              {unit && <div className="text-sm text-muted-foreground font-medium">{unit}</div>}
            </div>
            {subtitle && <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>}
            {trend && trendValue && (
              <div className={`flex items-center space-x-1 mt-2 text-xs ${getTrendColor(trend)}`}>
                <span>{getTrendIcon(trend)}</span>
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg ${colorClasses[color]} shadow-lg`}>
            <Icon className={iconSizeClasses[iconSize]} />
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
};
