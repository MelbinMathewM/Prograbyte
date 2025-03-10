import * as React from "react";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Separator: React.FC<SeparatorProps> = ({ className, ...props }) => {
  return <div className={`border-b border-gray-300 ${className}`} {...props} />;
};
