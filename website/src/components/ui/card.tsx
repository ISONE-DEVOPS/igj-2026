import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${
        hover ? "transition-shadow hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>{children}</div>;
}
