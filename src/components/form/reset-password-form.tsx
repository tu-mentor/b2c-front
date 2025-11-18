import { motion } from "framer-motion";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/auth-service";
import { Button } from "../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card";
import { Input } from "../shared/input";
import { Label } from "../shared/label";
import LogoSvg from "../../assets/logo.svg";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>();

  const password = watch("password");

  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
  }, [token, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      await resetPassword(token, data.password);
      setResetSuccess(true);
      setTimeout(() => navigate("/auth/login"), 3000);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div className="relative z-10 flex flex-col items-center justify-start w-full pt-10 px-4">
        <div className="mb-8">
          <img src={LogoSvg} alt="Logo" className="w-80" />
        </div>
        <Card className="w-full max-w-md mx-auto rounded-lg overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-center text-gray-600">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center space-x-2"
              >
                <Lock className="w-6 h-6" />
                <span>Restablecer Contraseña</span>
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!resetSuccess ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="password">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingrese su nueva contraseña"
                      {...register("password", {
                        required: "La contraseña es requerida",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe tener al menos 8 caracteres",
                        },
                      })}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme su nueva contraseña"
                      {...register("confirmPassword", {
                        required: "Por favor, confirme su contraseña",
                        validate: (value) => value === password || "Las contraseñas no coinciden",
                      })}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Cambiar Contraseña"}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-green-600 mb-4">
                  ¡Contraseña cambiada exitosamente! Serás redirigido al inicio de sesión en unos
                  segundos.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
