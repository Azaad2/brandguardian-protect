
import { TrendingUp } from "lucide-react";

interface SalesPerformanceCardProps {
  profile: {
    sales_volume: string;
    wholesale_budget: string;
    feedback_score?: string;
  };
  formatSalesVolume: (volume: string) => string;
  formatWholesaleBudget: (budget: string) => string;
}

const SalesPerformanceCard = ({ profile, formatSalesVolume, formatWholesaleBudget }: SalesPerformanceCardProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Sales Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Monthly Sales Volume</label>
          <p className="text-sm">{formatSalesVolume(profile.sales_volume)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Wholesale Budget</label>
          <p className="text-sm">{formatWholesaleBudget(profile.wholesale_budget)}</p>
        </div>
        {profile.feedback_score && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Feedback Score</label>
            <p className="text-sm">{profile.feedback_score}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPerformanceCard;
