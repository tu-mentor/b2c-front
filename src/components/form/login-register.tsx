import React, { useState, useEffect, useRef, lazy } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import RegisterForm from "./register-form";
import LogoSvg from "../../assets/logo.svg";
import PasswordResetForm from "./reset-password-request";
import LoginForm from "./login";

type FlippableAuthFormProps = {
  initialSide?: "login" | "register" | "reset";
};

export default function FlippableAuthForm({ initialSide = "login" }: FlippableAuthFormProps) {
  const { side = initialSide, companyId } = useParams<{ side?: string; companyId?: string }>();
  const [currentForm, setCurrentForm] = useState<"login" | "register" | "reset">(
    side as "login" | "register" | "reset"
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const path = pathSegments.pop();

    // Si hay un companyId en la ruta o si estamos en la ruta /register/:companyId
    if (companyId || (pathSegments.includes("register") && path !== "register")) {
      setCurrentForm("register");
    } else if (path === "register" || path === "reset") {
      setCurrentForm(path);
    } else {
      setCurrentForm("login");
    }
  }, [location, companyId]);

  const flipCard = (newSide: "login" | "register" | "reset") => {
    setCurrentForm(newSide);
    navigate(`/auth/${newSide === "login" ? "" : newSide}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Clean geometric lines */}
        <div className="absolute top-16 left-8 w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent dark:via-blue-500/40" />
        <div className="absolute top-28 left-8 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent dark:via-indigo-500/40" />
        <div className="absolute bottom-16 right-8 w-40 h-0.5 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent dark:via-purple-500/40" />
        <div className="absolute bottom-28 right-8 w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent dark:via-cyan-500/40" />
        
        {/* Vertical lines */}
        <div className="absolute top-16 left-8 w-0.5 h-40 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent dark:via-blue-500/40" />
        <div className="absolute top-28 left-8 w-0.5 h-32 bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent dark:via-indigo-500/40" />
        <div className="absolute bottom-16 right-8 w-0.5 h-40 bg-gradient-to-b from-transparent via-purple-400/40 to-transparent dark:via-purple-500/40" />
        <div className="absolute bottom-28 right-8 w-0.5 h-32 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent dark:via-cyan-500/40" />
        
        {/* Diagonal accent lines */}
        <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-blue-400/30 to-transparent transform rotate-45 origin-left" />
        <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-indigo-400/30 to-transparent transform -rotate-45 origin-right" />
        <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-purple-400/30 to-transparent transform -rotate-45 origin-left" />
        <div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-cyan-400/30 to-transparent transform rotate-45 origin-right" />
        
        {/* Corner accents - clean lines only */}
        <div className="absolute top-8 left-8 w-16 h-px bg-blue-300/60 dark:bg-blue-600/60" />
        <div className="absolute top-8 left-8 w-px h-16 bg-blue-300/60 dark:bg-blue-600/60" />
        
        <div className="absolute top-8 right-8 w-16 h-px bg-indigo-300/60 dark:bg-indigo-600/60" />
        <div className="absolute top-8 right-8 w-px h-16 bg-indigo-300/60 dark:bg-indigo-600/60" />
        
        <div className="absolute bottom-8 left-8 w-16 h-px bg-purple-300/60 dark:bg-purple-600/60" />
        <div className="absolute bottom-8 left-8 w-px h-16 bg-purple-300/60 dark:bg-purple-600/60" />
        
        <div className="absolute bottom-8 right-8 w-16 h-px bg-cyan-300/60 dark:bg-cyan-600/60" />
        <div className="absolute bottom-8 right-8 w-px h-16 bg-cyan-300/60 dark:bg-cyan-600/60" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        
        {/* Small clean dots */}
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-blue-400/40 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-400/50 rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400/40 rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-400/40 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-pink-400/40 rounded-full" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-rose-400/40 rounded-full" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-start w-full pt-8 px-4">
        <div className="w-full max-w-md perspective">
          <motion.div
            className="relative w-full"
            initial={false}
            animate={{
              rotateY: currentForm === "login" ? 0 : currentForm === "register" ? 180 : 90,
            }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className={`absolute w-full backface-hidden ${
                currentForm !== "login" ? "invisible" : ""
              }`}
            >
              <LoginForm
                onFlip={() => flipCard("register")}
                onPasswordResetFlip={() => flipCard("reset")}
              />
            </div>
            <div
              className={`absolute w-full backface-hidden ${
                currentForm !== "register" ? "invisible" : ""
              }`}
              style={{ transform: "rotateY(180deg)" }}
            >
              <RegisterForm onFlip={() => flipCard("login")} />
            </div>
            <div
              className={`absolute w-full backface-hidden ${
                currentForm !== "reset" ? "invisible" : ""
              }`}
              style={{ transform: "rotateY(90deg)" }}
            >
              <PasswordResetForm onFlip={() => flipCard("login")} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
