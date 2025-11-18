import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Check, FileSpreadsheet, Globe, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../../shared/alert";
import { Button } from "../../../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/card";
import { Label } from "../../../shared/label";
import { RadioGroup, RadioGroupItem } from "../../../shared/radio-group";

interface Question {
  id: string;
  text: string;
  icon: React.ElementType;
}

interface QuestionsProps {
  userId: string;
  onComplete: (results: Record<string, Record<string, string>>) => void;
  initialAnswers: Record<string, Record<string, string>>;
}

const questions: Question[] = [
  { id: "english", text: "¿Deseas Aprender y/o Mejorar tu Nivel de Inglés?", icon: Globe },
  { id: "japanese", text: "¿Deseas Aprender y/o Mejorar tu Nivel de Japonés?", icon: BookOpen },
  { id: "excel", text: "¿Deseas Aprender y/o Mejorar tu Nivel de Excel?", icon: FileSpreadsheet },
];

const options = [
  { value: "1", label: "Sí", icon: Check },
  { value: "0", label: "No", icon: X },
];

export function Questions1({ userId, onComplete, initialAnswers }: QuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers[userId] || {});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAnswers(initialAnswers[userId] || {});
  }, [initialAnswers, userId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    const allQuestionsAnswered = questions.every((question) => answers[question.id]);

    if (allQuestionsAnswered) {
      setError(null);
      // Los datos se guardan a través del kit-progress
      onComplete({ [userId]: answers });
    } else {
      setError("Por favor, contesta todas las preguntas para continuar.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center">Evaluación de Intereses</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center text-sm"
        >
          Gracias por completar el primer paso. Por favor contesta las siguientes preguntas para
          continuar.
        </motion.p>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            {questions.map((question) => (
              <div key={question.id} className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-grow">
                  <question.icon className="w-5 h-5 text-primary" />
                  <p className="text-sm">{question.text}</p>
                </div>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                  value={answers[question.id] || ""}
                  className="flex space-x-2"
                >
                  {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <RadioGroupItem
                        value={option.value}
                        id={`${userId}-${question.id}-${option.value}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`${userId}-${question.id}-${option.value}`}
                        className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ${
                          answers[question.id] === option.value
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
            ))}
          </motion.div>
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

