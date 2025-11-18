import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";
import { Card } from "./card";

interface PageContainerProps {
  title: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showHeader?: boolean;
  icon?: ReactNode;
}

export function PageContainer({
  title,
  description,
  breadcrumbItems,
  children,
  headerClassName,
  contentClassName,
  showHeader = true,
  icon,
}: PageContainerProps) {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex flex-col space-y-2">
            <Breadcrumb items={breadcrumbItems} />
            {showHeader && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={headerClassName}
              >
                <div className="flex items-center space-x-3">
                  {icon && (
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {icon}
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-primary dark:text-white">
                      {title}
                    </h1>
                    {description && (
                      <p className="text-muted-foreground mt-1">{description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={contentClassName}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 