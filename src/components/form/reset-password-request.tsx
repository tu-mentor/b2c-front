import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "../shared/button"
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card"
import { Input } from "../shared/input"
import { Label } from "../shared/label"
import { requestPasswordReset } from "../../services/auth-service"

type PasswordResetFormProps = {
  onFlip: () => void
}

type PasswordResetFormData = {
  whatsapp: string
  childName: string
}

export default function PasswordResetForm({ onFlip }: PasswordResetFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>()

  const onSubmit = async (data: PasswordResetFormData) => {
    setIsLoading(true)
    setError(null)
    try {
      await requestPasswordReset(data.whatsapp, data.childName)
      setResetSent(true)
    } catch (err: any) {
      setError(err instanceof Error ? err.message : err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center transform -scale-x-100">
      <Card className="w-full max-w-md mx-auto rounded-lg overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-center text-gray-600">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center space-x-2 transform scale-x-100"
            >
              <Mail className="w-6 h-6" />
              <span>Restablecer Contraseña</span>
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="transform scale-x-100">
            {!resetSent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="whatsapp">Número de Whatsapp registrado</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="Ingrese su número de Whatsapp"
                    {...register("whatsapp", {
                      required: "El número de Whatsapp es requerido",
                    })}
                    className={errors.whatsapp ? "border-red-500" : ""}
                  />
                  {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>}
                </div>
                <div>
                  <Label htmlFor="childName">Nombre de uno de sus hijos registrado en la plataforma</Label>
                  <Input
                    id="childName"
                    type="text"
                    placeholder="Ingrese el nombre de uno de sus hijos"
                    {...register("childName", {
                      required: "El nombre de uno de sus hijos es requerido",
                    })}
                    className={errors.childName ? "border-red-500" : ""}
                  />
                  {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar Enlace de Restablecimiento"}
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
                  ¡Enlace de restablecimiento enviado! Por favor, revise su WhatsApp.
                </p>
              </motion.div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-center text-sm text-gray-600"
            >
              <button
                onClick={onFlip}
                className="text-blue-500 hover:underline font-semibold flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a iniciar de Sesión
              </button>
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

