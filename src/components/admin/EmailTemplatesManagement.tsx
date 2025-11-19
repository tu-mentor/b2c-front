import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card";
import { Button } from "../shared/button";
import { Label } from "../shared/label";
import { Textarea } from "../shared/textarea";
import { adminService } from "../../services/admin-service";
import { toast } from "react-hot-toast";
import { Save, RefreshCw, Mail, Lock } from "lucide-react";
import LoadingSpinner from "../shared/spinner/loading-spinner";
import { Alert, AlertDescription } from "../shared/alert";
import { AlertCircle } from "lucide-react";

interface EmailTemplate {
  _id?: string;
  type: string;
  subject: string;
  body: string;
  paymentMethod?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function EmailTemplatesManagement() {
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getPurchaseRequestTemplate();
      setTemplate(data || {
        type: "purchase_request",
        subject: "Solicitud de Compra Recibida - Tu-Mentor",
        body: "",
        paymentMethod: "Por favor, realiza el pago mediante transferencia bancaria o el método de pago acordado. Envía el comprobante al WhatsApp 318 4446939 o al email info@tu-mentor.com.",
        isActive: true,
      });
    } catch (err: any) {
      console.error("Error loading template:", err);
      setError(err.message || "Error al cargar la plantilla");
      // Plantilla por defecto
      setTemplate({
        type: "purchase_request",
        subject: "Solicitud de Compra Recibida - Tu-Mentor",
        body: "",
        paymentMethod: "Por favor, realiza el pago mediante transferencia bancaria o el método de pago acordado. Envía el comprobante al WhatsApp 318 4446939 o al email info@tu-mentor.com.",
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!template) return;

    if (!template.paymentMethod || template.paymentMethod.trim() === "") {
      toast.error("Por favor, complete el método de pago");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Solo actualizar el método de pago
      await adminService.updateEmailTemplate("purchase_request", {
        paymentMethod: template.paymentMethod,
      });
      toast.success("Método de pago actualizado exitosamente");
      await loadTemplate();
    } catch (err: any) {
      console.error("Error saving template:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error al guardar el método de pago";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Plantillas de Correo
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600">
          Administra las plantillas de correo que se envían a los usuarios
        </p>
      </motion.div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {template && (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Plantilla de Solicitud de Compra
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadTemplate}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Actualizar</span>
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-6">
            {/* Vista previa de la plantilla (solo lectura) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Vista Previa de la Plantilla</Label>
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Asunto:</p>
                  <p className="text-sm text-gray-600">{template.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Contenido del correo:</p>
                  <div className="bg-white border border-gray-200 rounded p-4 text-sm text-gray-600 space-y-2">
                    <p>Hola <strong>{'{{userName}}'}</strong>,</p>
                    <p>Hemos recibido tu solicitud de compra para el módulo <strong>{'{{moduleName}}'}</strong>.</p>
                    <div className="bg-gray-100 p-3 rounded mt-3">
                      <p className="font-semibold mb-2">Detalles de tu Solicitud:</p>
                      <p>• Módulo: {'{{moduleName}}'}</p>
                      <p>• Tipo: {'{{requestType}}'}</p>
                      <p>• Fecha: {'{{requestDate}}'}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded mt-3">
                      <p className="font-semibold mb-2">Información de Pago:</p>
                      <p className="text-gray-700">{template.paymentMethod || "Método de pago no configurado"}</p>
                      <p className="text-sm mt-2">Una vez recibido el pago, tu solicitud será revisada y procesada por nuestro equipo administrativo.</p>
                    </div>
                    <p className="mt-3">Recibirás una notificación cuando tu solicitud sea procesada.</p>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <p className="mt-4">Saludos,<br />El equipo de Tu-Mentor</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                La plantilla está predefinida. Solo puedes editar el método de pago a continuación.
              </p>
            </div>

            {/* Campo editable: Método de Pago */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-base font-semibold">
                Método de Pago <span className="text-indigo-600">(Editable)</span>
              </Label>
              <Textarea
                id="paymentMethod"
                value={template.paymentMethod || ""}
                onChange={(e) => setTemplate({ ...template, paymentMethod: e.target.value })}
                placeholder="Instrucciones de pago que se mostrarán al usuario..."
                className="w-full min-h-[120px] text-base"
                rows={6}
              />
              <p className="text-xs text-gray-500">
                Este texto aparecerá en la sección "Información de Pago" del correo que se envía a los usuarios cuando realizan una solicitud de compra.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

