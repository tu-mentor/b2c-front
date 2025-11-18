import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../utils/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)}>
      <Link
        to="/"
        className="flex items-center text-primary hover:text-primary/80 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
          {item.href ? (
            <Link
              to={item.href}
              className={cn(
                "text-muted-foreground hover:text-primary transition-colors",
                "flex items-center gap-1"
              )}
            >
              {item.icon && <span className="h-4 w-4">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="text-primary font-medium flex items-center gap-1">
              {item.icon && <span className="h-4 w-4">{item.icon}</span>}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
} 