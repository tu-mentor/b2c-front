
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Lock, LogIn, Mail, Sparkles, Video } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import LogoSvg from "../../assets/logo.svg";
import { login, saveToken, saveUseId } from "../../services/auth-service";
import type { LoginCredentials } from "../../types/auth-types";
import { Button } from "../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card";
import VideoPopup from "../shared/guide/video-popup";
import { Input } from "../shared/input";
import { Label } from "../shared/label";

type LoginFormProps = {
  onFlip: () => void;
  onPasswordResetFlip: () => void;
};

export default function LoginForm({ onFlip, onPasswordResetFlip }: LoginFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [videoData, setVideoData] = useState({
    src: "/guides/Registro.mp4", // Updated path to match your project structure
    title: "",
    description: "",
  });
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const response = await login(data);
      saveUseId(response.user.id);
      saveToken(response.access_token);
      navigate("/home");
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const openVideoGuide = () => {
    setVideoData({
      src: "/guides/Registro.mp4",
      title: "Guía de Registro",
      description: "Este video muestra paso a paso cómo registrarse en nuestra plataforma.",
    });
    setShowVideoPopup(true);
  };

  const closeVideoGuide = () => {
    setShowVideoPopup(false);
  };

  return (
    <>
      <div className="mb-8 relative z-10 flex flex-col items-center justify-start w-full">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
          <img src={LogoSvg || "/placeholder.svg"} alt="Logo" className="relative w-72 md:w-80" />
        </div>
      </div>
      
      <div>
        <Card className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-3xl font-bold text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bienvenido de Vuelta
                </span>
              </div>
            </CardTitle>
          </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center mb-6">
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-all duration-300 rounded-xl"
              onClick={openVideoGuide}
            >
              <Video className="w-4 h-4" />
              Ver guía de registro
            </Button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                Correo Electrónico
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  className="pl-10 w-full bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                  {...register("email", { 
                    required: "El correo electrónico es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo electrónico inválido"
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                Contraseña
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300">
                  <Lock className="w-5 h-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  className="pl-10 pr-10 w-full bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                  {...register("password", { required: "La contraseña es requerida" })}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onPasswordResetFlip}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {loginError && (
              <p className="text-red-500 text-sm text-center">
                {loginError}
              </p>
            )}
            <div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn className="h-5 w-5" />
                    <span>Iniciar Sesión</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <button 
              onClick={onFlip} 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {showVideoPopup && (
          <VideoPopup
            onClose={closeVideoGuide}
            videoSrc={videoData.src}
            title={videoData.title}
            description={videoData.description}
          />
        )}
      </AnimatePresence>
    </>
  );
}
