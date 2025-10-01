import React from "react";

const LoadingSkeleton = ({ rows = 3 }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-2 w-24 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
