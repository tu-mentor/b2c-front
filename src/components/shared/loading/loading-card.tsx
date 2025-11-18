import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

interface LoadingCardProps {
  title?: string;
  message?: string;
  secondaryMessage?: string;
  className?: string;
}

export function LoadingCard({
  title = "Cargando datos",
  message = "Estamos recuperando tus datos desde la base de datos...",
  secondaryMessage = "Esto puede tomar unos segundos...",
  className = "",
}: LoadingCardProps) {
  return (
    <div className={`min-h-[50vh] flex flex-col justify-center items-center py-8 ${className}`}>
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white p-6">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary"></div>
            </div>
            <div className="text-center space-y-3">
              <p className="text-gray-700 dark:text-gray-300">{message}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <motion.div
                  className="bg-primary h-2.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{secondaryMessage}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
