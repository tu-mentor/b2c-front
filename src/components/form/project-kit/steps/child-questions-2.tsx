import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { childService } from "../../../../services/child-service";
import { ChildModel } from "../../../../types/auth-types";
import { Alert, AlertDescription, AlertTitle } from "../../../shared/alert";
import { Button } from "../../../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
import { Label } from "../../../shared/label";
import { RadioGroup, RadioGroupItem } from "../../../shared/radio-group";

interface ChildQuestionsProps {
  children: ChildModel[];
  onComplete: (results: Record<string, Record<string, string>>) => void;
  initialAnswers: Record<string, Record<string, string>>;
}

const options = [
  { value: "1", label: "Sí", icon: Check },
  { value: "0", label: "No", icon: X },
];

export function ChildQuestions2({ children, onComplete, initialAnswers }: ChildQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>(initialAnswers);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (childId: string, questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [questionId]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const allQuestionsAnswered = children.every(
      (child) => Object.keys(answers[child.id] || {}).length === 1
    );

    if (allQuestionsAnswered) {
      setError(null);

      try {
        // Call the updateChildKit service for each child
        for (const child of children) {
          const childAnswers = answers[child.id];
          await childService.updateChildKit(child.id, {
            financeCareer: childAnswers["financeCareer"] === "1",
          });
        }

        onComplete(answers);
      } catch (error) {
        setError("Hubo un error al guardar las respuestas. Por favor, inténtalo de nuevo.");
      }
    } else {
      setError("Por favor, contesta todas las preguntas para continuar.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center">
          Financiamiento Universitario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center text-sm"
        >
          Por favor, responde la siguiente pregunta para cada niño.
        </motion.p>
        <AnimatePresence>
          {children.map((child) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">{child.childName}</h3>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm">¿Deseas - Necesitas financiar tu carrera universitaria?</p>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(child.id, "financeCareer", value)}
                  value={answers[child.id]?.["financeCareer"] || ""}
                  className="flex space-x-2"
                >
                  {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <RadioGroupItem
                        value={option.value}
                        id={`${child.id}-${option.value}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`${child.id}-${option.value}`}
                        className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ${
                          answers[child.id]?.["financeCareer"] === option.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80"
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive" className="mt-4 mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button onClick={handleSubmit} className="w-full mt-4 text-sm py-2">
            Continuar
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
