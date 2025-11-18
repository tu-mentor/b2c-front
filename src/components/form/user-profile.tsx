
import { Eye, EyeOff, Loader2, Lock, User, Shield, Key, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userService } from "../../services/user-service";
import { Avatar, AvatarFallback } from "../shared/avatar";
import { Button } from "../shared/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shared/card";
import { Input } from "../shared/input";
import { Label } from "../shared/label";
import { Separator } from "../shared/separator";
import { useToast } from "../shared/use-toast";
import { Badge } from "../shared/badge";
import { Alert, AlertDescription } from "../shared/alert";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  selectedChildren: string;
  children: { id: string; childName: string }[];
}

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserProfile({ userData }: { userData: UserData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { showToast, ToastComponent } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordChangeForm>();

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (newPassword) {
      let strength = 0;
      if (newPassword.length >= 8) strength += 25;
      if (/[a-z]/.test(newPassword)) strength += 25;
      if (/[A-Z]/.test(newPassword)) strength += 25;
      if (/[0-9]/.test(newPassword)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [newPassword]);

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 25) return "Débil";
    if (strength <= 50) return "Regular";
    if (strength <= 75) return "Buena";
    return "Excelente";
  };

  const onSubmit = async (data: PasswordChangeForm) => {
    setIsLoading(true);
    try {
      const response = await userService.updatePassword({
        id: userData.id,
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.statusCode === 200 || response.statusCode === undefined) {
        showToast("Contraseña actualizada con éxito", "success");
        reset();
      } else {
        showToast(response.message, "error");
      }
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reset();
  }, [userData.selectedChildren, reset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl"
    >
      {ToastComponent}
      
      <div className="space-y-8">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200 dark:border-blue-700">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-white dark:border-gray-800 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-bold">
                      {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {userData.firstName} {userData.lastName}
                  </CardTitle>
                  <CardDescription className="text-blue-600 dark:text-blue-400 text-base">
                    <User className="inline w-4 h-4 mr-1" />
                    Perfil de Usuario
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Password Change Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-200 dark:border-green-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-green-800 dark:text-green-200">
                    Cambiar Contraseña
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400">
                    Actualiza tu contraseña para mantener tu cuenta segura
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Contraseña Actual
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      {...register("currentPassword", { required: "Este campo es requerido" })}
                      className={`pr-10 ${errors.currentPassword ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.currentPassword.message}</span>
                    </div>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nueva Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...register("newPassword", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe tener al menos 8 caracteres",
                        },
                      })}
                      className={`pr-10 ${errors.newPassword ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                      placeholder="Ingresa tu nueva contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Fortaleza de la contraseña:</span>
                        <span className={`font-medium ${getPasswordStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
                          {getPasswordStrengthText(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {errors.newPassword && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.newPassword.message}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Confirmar Nueva Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Este campo es requerido",
                        validate: (value) =>
                          value === watch("newPassword") || "Las contraseñas no coinciden",
                      })}
                      className={`pr-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-500"}`}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirmPassword.message}</span>
                    </div>
                  )}
                </div>

                {/* Security Tips */}
                <Alert className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                  <Key className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <strong>Consejos de seguridad:</strong> Usa una contraseña de al menos 8 caracteres que incluya mayúsculas, minúsculas, números y símbolos para mayor seguridad.
                  </AlertDescription>
                </Alert>
              </form>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200 dark:border-green-700">
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando contraseña...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Actualizar Contraseña
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
