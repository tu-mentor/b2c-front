
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, User } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LogoSvg from "../../assets/logo.svg";
import { suscriptionService } from "../../services/suscription-service";
import { userService } from "../../services/user-service";
import { adminService } from "../../services/admin-service";
import type { UserModel } from "../../types/auth-types";
import EmailVerification from "./email-verification";
import type { CompanySuscriptionResponse } from "../../types/suscriptions";
import AnimatedAlert, { type AlertType } from "../shared/animated-alert";
import { Button } from "../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card";
import { Checkbox } from "../shared/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../shared/dialog";
import { Input } from "../shared/input";
import { Label } from "../shared/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shared/select";

type RegisterFormProps = {
  onFlip: () => void;
};

const countryCodes = [
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+51", country: "Perú", flag: "🇵🇪" },
];

export default function RegisterForm({ onFlip }: RegisterFormProps): React.ReactElement {
  const { companyId } = useParams<{ companyId?: string }>();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    trigger,
    setValue,
    setError,
    clearErrors,
  } = useForm<UserModel & { confirmPassword?: string }>({
    mode: "onChange",
    defaultValues: {
      countryCode: "+57",
    },
  });

  const navigate = useNavigate();
  const [showTermsDialog, setShowTermsDialog] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: AlertType } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [hasAdmin, setHasAdmin] = useState<boolean>(true);
  const [isFirstExecution, setIsFirstExecution] = useState<boolean>(false);
  const [createAsAdmin, setCreateAsAdmin] = useState<boolean>(false);
  const watchAllFields = watch();

  const [apiError, setApiError] = useState<{ field: string; message: string } | null>(null);

  useEffect(() => {
    const validateUuidAndCheckSubscription = async () => {
      if (companyId === undefined || companyId === "") {
        setIsFormDisabled(false);
      } else if (/^[0-9a-f]{24}$/.test(companyId)) { 
        let response: CompanySuscriptionResponse;
        try {
          response = await suscriptionService.getCompanySuscription(companyId);
          if (response.success) {
            setIsFormDisabled(false);
          } else {
            setAlertInfo({
              message: response.message,
              type: "error",
            });
            setIsFormDisabled(true);
          }
        } catch (error) {
          setAlertInfo({
            message:
              "Error al verificar la suscripción de la empresa. Por favor, inténtelo de nuevo más tarde.",
            type: "error",
          });
          setIsFormDisabled(true);
        }
      } else {
        setAlertInfo({
          message:
            "El link de registro no es válido, por favor comuníquese con quien se lo proporcionó",
          type: "error",
        });
        setIsFormDisabled(true);
      }
    };

    const checkIfFirstExecution = async () => {
      try {
        const exists = await adminService.hasAdmin();
        setHasAdmin(exists);
        setIsFirstExecution(!exists);
      } catch (error) {
        console.error("Error checking admin:", error);
        // Si hay error, asumimos que existe admin por seguridad
        setHasAdmin(true);
        setIsFirstExecution(false);
      }
    };

    validateUuidAndCheckSubscription();
    checkIfFirstExecution();
  }, [companyId]);

  const onSubmit = async (data: UserModel & { confirmPassword?: string }): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    setShowErrors(false);
    setApiError(null);
    try {
      // Excluir confirmPassword antes de enviar al backend
      const { confirmPassword, countryCode, whatsapp, ...restData } = data;
      const userData: any = { ...restData };
      
      // Solo incluir companyId si tiene un valor válido
      if (companyId && companyId.trim() !== "") {
        userData.companyId = companyId;
      }
      
      // Solo incluir countryCode y whatsapp si whatsapp tiene un valor válido
      if (whatsapp && whatsapp.trim() !== "") {
        userData.whatsapp = whatsapp;
        userData.countryCode = countryCode;
      }

      // Si es la primera ejecución y el usuario quiere crear admin, incluir el rol
      if (isFirstExecution && createAsAdmin) {
        userData.role = "admin";
      }
      
      const registerResult = await userService.createUser(userData);
      if (registerResult.id) {
        setRegisteredEmail(data.email);
        setShowVerification(true);
      }
    } catch (error: any) {
      if (error.message) {
        const errorMessage = error.message;
        if (errorMessage.includes("Whatsapp")) {
          setApiError({ field: "whatsapp", message: errorMessage });
        } else if (errorMessage.includes("Email")) {
          setApiError({ field: "email", message: errorMessage });
        }
        setAlertInfo({
          message: errorMessage,
          type: "error",
        });
      } else {
        setAlertInfo({
          message: error.message,
          type: "error",
        });
      }
      setShowErrors(true);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    setShowErrors(true);
    setAlertInfo(null);
    
    // Verificar si se aceptaron los términos
    if (!watchAllFields.acceptTerms) {
      setAlertInfo({
        message: "Debes aceptar los términos y condiciones antes de crear tu cuenta.",
        type: "error",
      });
      return;
    }
    
    
    const isValid = await trigger();
    if (isValid) {
      await onSubmit(watchAllFields);
    }
  };


  if (showVerification) {
    return (
      <EmailVerification
        email={registeredEmail}
        onVerified={() => {
          setAlertInfo({
            message: "¡Correo verificado exitosamente! Ahora puedes iniciar sesión.",
            type: "success",
          });
          setTimeout(() => {
            onFlip();
          }, 2000);
        }}
        onBack={() => setShowVerification(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Alertas fuera del formulario */}
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
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Crear Cuenta
              </span>
              <div className="mt-4">
                <img src={LogoSvg || "/placeholder.svg"} alt="Logo" className="w-48" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      <CardContent className="pl-6 pr-6 relative max-h-[85vh] overflow-y-auto">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <fieldset disabled={isFormDisabled}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex space-x-4">
                    <motion.div 
                      className="flex-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Nombre (Requerido)
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Ingrese su nombre"
                        {...register("firstName", {
                          required: "Este campo es requerido",
                        })}
                        className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                          errors.firstName && showErrors ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.firstName && showErrors && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </motion.div>
                    <motion.div 
                      className="flex-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Apellido (Requerido)
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Ingrese su apellido"
                        {...register("lastName", {
                          required: "Este campo es requerido",
                        })}
                        className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                          errors.lastName && showErrors ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.lastName && showErrors && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Label htmlFor="whatsapp" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      WhatsApp (Opcional)
                    </Label>
                    <div className="flex mb-2">
                      <Controller
                        name="countryCode"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value} disabled>
                            <SelectTrigger className="w-[120px] mr-2 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                              <SelectValue placeholder="Código" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code} className="hover:bg-blue-50 dark:hover:bg-gray-700">
                                  {country.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        id="whatsapp"
                        type="tel"
                        inputMode="numeric"
                        {...register("whatsapp")}
                        onKeyPress={(e) => {
                          const isNumber = /[0-9]/.test(e.key);
                          if (!isNumber) {
                            e.preventDefault();
                          }
                        }}
                        className={`flex-1 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                          errors.whatsapp || apiError?.field === "whatsapp" ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        placeholder="Número de WhatsApp"
                      />
                    </div>
                    {(errors.whatsapp || apiError?.field === "whatsapp") && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                        {errors.whatsapp?.message || apiError?.message}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      Email (Requerido)
                    </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@ejemplo.com"
                        {...register("email", {
                          required: "El email es requerido",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Dirección de correo inválida",
                          },
                        })}
                      className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                        errors.email || apiError?.field === "email" ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    {(errors.email || apiError?.field === "email") && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                        {errors.email?.message || apiError?.message}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.85 }}
                  >
                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      Contraseña (Requerido)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      {...register("password", {
                        required: "La contraseña es requerida",
                        minLength: {
                          value: 8,
                          message: "La contraseña debe tener al menos 8 caracteres",
                        },
                      })}
                      className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                        errors.password || apiError?.field === "password" ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    {(errors.password || apiError?.field === "password") && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                        {errors.password?.message || apiError?.message}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.87 }}
                  >
                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      Confirmar Contraseña (Requerido)
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme su contraseña"
                      {...register("confirmPassword", {
                        required: "Debe confirmar la contraseña",
                        validate: (value) => {
                          const password = watchAllFields.password;
                          return value === password || "Las contraseñas no coinciden";
                        },
                      })}
                      className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                        errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    {errors.confirmPassword && showErrors && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </motion.div>
                  {isFirstExecution && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">🎉</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                            ¡Primera ejecución del sistema!
                          </h3>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                            Este es el primer usuario que se registra. Puedes crear este usuario como administrador del sistema.
                          </p>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="createAsAdmin"
                              checked={createAsAdmin}
                              onCheckedChange={(checked) => setCreateAsAdmin(checked === true)}
                            />
                            <Label htmlFor="createAsAdmin" className="text-sm font-medium text-yellow-800 dark:text-yellow-200 cursor-pointer">
                              Crear este usuario como Administrador
                            </Label>
                          </div>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                            ⚠️ Solo puedes crear un administrador la primera vez. Después de esto, todos los usuarios serán usuarios normales.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="acceptTerms"
                      control={control}
                      rules={{ required: "Debes aceptar los términos y condiciones" }}
                      render={({ field }) => (
                        <Checkbox
                          id="acceptTerms"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              setShowTermsDialog(true);
                            }
                          }}
                        />
                      )}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      Acepto los términos y condiciones
                    </Label>
                  </div>
                  {errors.acceptTerms && showErrors && (
                    <p className="text-red-500 text-sm mt-1">{errors.acceptTerms.message}</p>
                  )}
                  <div>
                    <Button
                      onClick={handleRegister}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>Crear Cuenta</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
            </motion.div>
          </fieldset>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <button 
            onClick={onFlip} 
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
          >
            Inicia sesión aquí
          </button>
        </p>
      </CardContent>
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Términos y Condiciones
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Yo, {watchAllFields.firstName} {watchAllFields.lastName}, con correo electrónico{" "}
              {watchAllFields.email || "no proporcionado"} y número de WhatsApp{" "}
              {watchAllFields.countryCode}
              {watchAllFields.whatsapp}, acepto los{" "}
              <a
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                href="https://www.tu-mentor.com/soluciones/pol%C3%ADtica/"
                target="_blank"
                rel="noreferrer"
              >
                términos y condiciones (click aquí para leerlos en detalle)
              </a>{" "}
              para el uso de este servicio.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowTermsDialog(false)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </Card>
    </div>
  );
}
