import { KpiCards, KpiCardProps, SkeletonCards } from "../cards";
import { ErrorState } from "../states";

interface KpiCardsLayoutProps {
  stats: KpiCardProps[];
  isLoading: boolean;
  error: Error | null;
}

export const KpiCardsLayout = ({ stats, isLoading, error }: KpiCardsLayoutProps): React.JSX.Element => {
  if (isLoading) return <SkeletonCards count={4} />;
  if (error) return <ErrorState message={error.message} />;
  return <KpiCards stats={stats} />;
};
