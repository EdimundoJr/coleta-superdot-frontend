import React from "react";
import { Skeleton } from "@radix-ui/themes";

interface ChartContainerProps {
  title: string;
  loading: boolean;
  children: React.ReactNode;
}

const ChartContainer = ({ title, loading, children }: ChartContainerProps) => (
  <Skeleton loading={loading} className="h-[400px]">
    <div className="bg-white p-6 rounded-xl border border-gray-100  card-container">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  </Skeleton>
);

export default ChartContainer;