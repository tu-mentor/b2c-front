import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/shared/card";
import { LoadingCard } from "@/components/shared/loading/loading-card";
import { PageContainer } from "@/components/shared/page-container";
import { GraduationCap, Brain } from "lucide-react";

export default function StrongVocationalTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const breadcrumbItems = [
    {
      label: "Orientación Vocacional",
      href: "/vocational-guidance",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: "Prueba Strong",
      icon: <Brain className="h-4 w-4" />,
    },
  ];

  if (isLoading) {
    return (
      <PageContainer
        title="Cargando tu test Strong"
        description="Estamos recuperando tus datos desde la base de datos..."
        breadcrumbItems={breadcrumbItems}
      >
        <LoadingCard />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={showResults ? "Resultados de tu Test Vocacional Strong" : "Descubre tus intereses profesionales"}
      description={!showResults ? "Esta herramienta te ayudará a identificar tus intereses y preferencias profesionales para encontrar la carrera que mejor se adapte a ti." : undefined}
      breadcrumbItems={breadcrumbItems}
      icon={<Brain className="h-6 w-6" />}
    >
      <Card className="w-full mx-auto bg-white dark:bg-gray-800 overflow-hidden border-0 shadow-lg font-asap">
        <CardContent className="p-4 md:p-6 text-center container max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ... rest of the existing content ... */}
          </AnimatePresence>
        </CardContent>
      </Card>
    </PageContainer>
  );
} 