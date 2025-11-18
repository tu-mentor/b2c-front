import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2, XCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import LogoSvg from "../../assets/logo.svg";
import { userService } from "../../services/user-service";
import AnimatedAlert, { type AlertType } from "../shared/animated-alert";
import { Button } from "../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card";
import { Input } from "../shared/input";
import { Label } from "../shared/label";

type EmailVerificationProps = {
  email: string;
  onVerified: () => void;
  onBack: () => void;
};

export default function EmailVerification({ email, onVerified, onBack }: EmailVerificationProps): React.ReactElement {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: AlertType } | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setAlertInfo({
        message: "Por favor, ingresa el código de 6 dígitos",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setAlertInfo(null);

    try {
      await userService.verifyEmail(email, verificationCode);
      setIsVerified(true);
      setAlertInfo({
        message: "¡Correo electrónico verificado exitosamente!",
        type: "success",
      });
      setTimeout(() => {
        onVerified();
      }, 2000);
    } catch (error: any) {
      setAlertInfo({
        message: error.message || "Error al verificar el código. Por favor, inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setAlertInfo(null);

    try {
      await userService.resendVerificationCode(email);
      setAlertInfo({
        message: "Código de verificación reenviado. Por favor, revisa tu correo electrónico.",
        type: "success",
      });
    } catch (error: any) {
      setAlertInfo({
        message: error.message || "Error al reenviar el código. Por favor, inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(value);
  };

  if (isVerified) {
    return (
      <div className="space-y-4">
        <Card className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              ¡Correo Verificado!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Tu correo electrónico ha sido verificado exitosamente. Redirigiendo...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alertInfo && (
        <div className="w-full max-w-2xl mx-auto relative z-50">
          <AnimatedAlert
            message={alertInfo.message}
            type={alertInfo.type}
            onClose={() => setAlertInfo(null)}
            duration={5000}
          />
        </div>
      )}

      <Card className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="pb-6 pt-8 text-center">
          <CardTitle className="text-3xl font-bold">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Verifica tu Correo
              </span>
              <div className="mt-4">
                <img src={LogoSvg || "/placeholder.svg"} alt="Logo" className="w-48" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pl-6 pr-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                Hemos enviado un código de verificación de 6 dígitos a:
              </p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Por favor, ingresa el código que recibiste en tu correo electrónico.
              </p>
            </div>

            <div className="space-y-4">
              <Label htmlFor="verificationCode" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block text-center">
                Código de Verificación
              </Label>
              <Input
                id="verificationCode"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={verificationCode}
                onChange={handleCodeChange}
                maxLength={6}
                className="text-center text-3xl tracking-widest font-mono bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                El código expira en 15 minutos
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleVerify}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Verificar Código</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={handleResendCode}
                variant="outline"
                className="w-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                disabled={isResending}
              >
                {isResending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Reenviando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Reenviar Código</span>
                  </div>
                )}
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={onBack}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 hover:underline"
              >
                Volver al registro
              </button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

