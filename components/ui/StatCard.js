import { TrendingUp } from "lucide-react";

export default function StatCard({ title, value, icon: Icon, color, trend, trendText, stats }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.loading ? <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div> : value}
                </div>
                {trend && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trend > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {trendText}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
