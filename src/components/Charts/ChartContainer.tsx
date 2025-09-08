import React from "react";
import { Skeleton } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ChartContainerProps {
  title: string;
  loading: boolean;
  children: React.ReactNode;
  tooltip?: string;
  fullHeight?: boolean;
  className?: string;
  actionButtons?: React.ReactNode;
  error?: string | null;
}

const ChartContainer = ({
  title,
  loading,
  children,
  tooltip,
  fullHeight = false,
  className = "",
  actionButtons,
  error,

}: ChartContainerProps) => (
  <div className={`${fullHeight ? "h-full" : "h-[400px]"} ${className}`}>
    <Skeleton loading={loading} className="h-full rounded-xl">
      <div className={`
        bg-white p-4 rounded-xl border border-gray-200 
        hover:shadow-md transition-all duration-200 h-full flex flex-col
        ${error ? "border-red-300 bg-red-50" : ""}
        group/chart-container
      `}>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-${compact ? '2' : '4'}">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-semibold text-gray-800`}>
              {title}
            </h3>
            {tooltip && (
              <Tooltip.Provider delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Mais informações"
                    >
                      <Icon.Info className="w-4 h-4" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="max-w-xs p-3 text-sm bg-gray-800 text-white rounded-lg shadow-xl z-50"
                      sideOffset={5}
                    >
                      {tooltip}
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </div>

          {actionButtons && (
            <div className="flex gap-2 opacity-0 group-hover/chart-container:opacity-100 transition-opacity">
              {actionButtons}
            </div>
          )}
        </div>

        {/* Content Area */}
        {error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-red-100 p-3 rounded-full mb-3">
              <Icon.ExclamationMark className="w-6 h-6 text-red-500" />
            </div>
            <p className="font-medium text-red-600 mb-1">Erro ao carregar dados</p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className={`flex-1 pt-1`}>
            {children}
          </div>
        )}


      </div>
    </Skeleton>
  </div>
);

export default ChartContainer;