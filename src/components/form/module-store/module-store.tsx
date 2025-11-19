import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../shared/card";
import { Button } from "../../shared/button";
import { Badge } from "../../shared/badge";
import { ShoppingCart, CheckCircle2, XCircle, Clock, CreditCard } from "lucide-react";
import { suscriptionService, AvailableModule } from "../../../services/suscription-service";
import { toast } from "react-hot-toast";
import { getUserInfo, getUserId } from "../../../services/auth-service";
import LoadingSpinner from "../../shared/spinner/loading-spinner";
import { modules } from "../../../constants/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shared/dialog";
import { Label } from "../../shared/label";
import { Input } from "../../shared/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/select";

interface PurchaseRequest {
  _id: string;
  moduleId: any;
  type: string;
  status: string;
  months: number;
  moduleName: string;
  notes?: string;
  reviewedAt?: string;
  createdAt: string;
}

export default function ModuleStore() {
  const [availableModules, setAvailableModules] = useState<AvailableModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingModuleId, setPurchasingModuleId] = useState<string | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<AvailableModule | null>(null);
  const [purchaseMonths, setPurchaseMonths] = useState<number>(6);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [myPurchaseRequests, setMyPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  useEffect(() => {
    const fetchAvailableModules = async () => {
      try {
        setLoading(true);
        const userId = getUserId();
        if (!userId) {
          toast.error("No se pudo obtener el ID del usuario");
          return;
        }

        const [modulesResponse, requestsResponse] = await Promise.all([
          suscriptionService.getAvailableModulesForPurchase(userId),
          suscriptionService.getMyPurchaseRequests(userId).catch(() => ({ requests: [] })),
        ]);

        setAvailableModules(modulesResponse.modules);
        setMyPurchaseRequests(requestsResponse.requests || []);
      } catch (error: any) {
        console.error("Error fetching available modules:", error);
        if (error.response?.status === 400) {
          toast.error("Esta funcionalidad está disponible solo para usuarios B2B");
        } else {
          toast.error("Error al cargar los módulos disponibles");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableModules();
  }, []);

  const getRequestStatusForModule = (moduleId: string): PurchaseRequest | null => {
    return myPurchaseRequests.find(req => {
      const reqModuleId = req.moduleId?._id || req.moduleId;
      return reqModuleId === moduleId;
    }) || null;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Aprobada</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rechazada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handlePurchaseClick = (module: AvailableModule) => {
    const request = getRequestStatusForModule(module._id);
    if (request && request.status === "pending") {
      toast.error("Ya tienes una solicitud pendiente para este módulo");
      return;
    }
    if (!module.canPurchase) {
      toast.error("Ya tienes acceso a este módulo");
      return;
    }
    setSelectedModule(module);
    setPurchaseMonths(6);
    setIsPurchaseDialogOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedModule) return;

    try {
      setIsProcessingPurchase(true);
      const userId = getUserId();
      if (!userId) {
        toast.error("No se pudo obtener el ID del usuario");
        return;
      }

      // TODO: Aquí se integrará con la pasarela de pagos
      // Por ahora, procesamos la compra directamente
      const purchaseData = {
        moduleId: selectedModule._id,
        months: purchaseMonths,
        // paymentMethod: "credit_card", // Se agregará cuando se integre la pasarela
        // paymentProvider: "stripe", // Se agregará cuando se integre la pasarela
        // paymentIntentId: "pi_xxx", // Se agregará cuando se integre la pasarela
        // transactionId: "txn_xxx", // Se agregará cuando se integre la pasarela
      };

      const response = await suscriptionService.purchaseModule(userId, purchaseData);

      if (response.success) {
        toast.success(response.message || "Solicitud de compra/renovación enviada exitosamente. Será revisada por el administrador.");
        setIsPurchaseDialogOpen(false);
        setSelectedModule(null);
        
        // Recargar módulos disponibles y solicitudes
        const [updatedModulesResponse, updatedRequestsResponse] = await Promise.all([
          suscriptionService.getAvailableModulesForPurchase(userId),
          suscriptionService.getMyPurchaseRequests(userId).catch(() => ({ requests: [] })),
        ]);
        
        setAvailableModules(updatedModulesResponse.modules);
        setMyPurchaseRequests(updatedRequestsResponse.requests || []);
      }
    } catch (error: any) {
      console.error("Error purchasing module:", error);
      toast.error(error.response?.data?.message || "Error al procesar la compra");
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const getModuleIcon = (moduleId: string) => {
    const module = modules.find((m) => m.identifier === moduleId);
    return module?.icon || ShoppingCart;
  };

  const getModuleTitle = (moduleId: string) => {
    const module = modules.find((m) => m.identifier === moduleId);
    return module?.title || "Módulo";
  };

  const formatPrice = (months: number) => {
    // TODO: Implementar lógica de precios real
    // Por ahora, precio base de $50 USD por mes
    const pricePerMonth = 50;
    const totalPrice = pricePerMonth * months;
    return `$${totalPrice.toFixed(2)} USD`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            Tienda de Módulos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compra módulos adicionales para ampliar tu acceso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableModules.map((module, index) => {
            const ModuleIcon = getModuleIcon(module._id);
            const moduleTitle = getModuleTitle(module._id);

            return (
              <motion.div
                key={module._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`overflow-hidden transition-all duration-300 border-2 ${
                    module.hasAccess
                      ? "border-green-200 dark:border-green-700 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/20"
                      : module.canPurchase
                      ? "hover:shadow-2xl hover:scale-105 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20"
                      : "opacity-70 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
                  }`}
                >
                  <CardHeader
                    className={`pb-3 ${
                      module.hasAccess
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                        : module.canPurchase
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                        : "bg-gray-100/50 dark:bg-gray-800/50"
                    }`}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            module.hasAccess
                              ? "bg-green-500 text-white"
                              : module.canPurchase
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          <ModuleIcon className="w-5 h-5" />
                        </div>
                        <span
                          className={
                            module.hasAccess
                              ? "text-green-800 dark:text-green-200"
                              : module.canPurchase
                              ? "text-blue-800 dark:text-blue-200"
                              : "text-gray-600 dark:text-gray-400"
                          }
                        >
                          {moduleTitle}
                        </span>
                      </div>
                      {module.hasAccess && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Disponible
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p
                      className={`text-sm ${
                        module.hasAccess
                          ? "text-gray-700 dark:text-gray-300"
                          : module.canPurchase
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-500 dark:text-gray-500"
                      }`}
                    >
                      {module.description}
                    </p>
                    {module.canPurchase && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Precio base:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {formatPrice(6)} / 6 meses
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter
                    className={`p-4 ${
                      module.hasAccess
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                        : module.canPurchase
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                        : "bg-gray-100/50 dark:bg-gray-800/50"
                    }`}
                  >
                    {(() => {
                      const request = getRequestStatusForModule(module._id);
                      const hasPendingRequest = request && request.status === "pending";
                      
                      return (
                        <div className="w-full space-y-2">
                          {request && (
                            <div className="mb-2">
                              {getStatusBadge(request.status)}
                              {request.status === "rejected" && request.notes && (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{request.notes}</p>
                              )}
                            </div>
                          )}
                          <Button
                            variant={module.hasAccess ? "outline" : module.canPurchase && !hasPendingRequest ? "default" : "outline"}
                            className={`w-full ${
                              module.hasAccess
                                ? "border-green-500 text-green-700 hover:bg-green-50 dark:text-green-400"
                                : hasPendingRequest
                                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                : module.canPurchase
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                            onClick={() => handlePurchaseClick(module)}
                            disabled={!module.canPurchase && !module.hasAccess || hasPendingRequest}
                          >
                            {module.hasAccess ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Tienes Acceso
                              </>
                            ) : hasPendingRequest ? (
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                Solicitud Pendiente
                              </>
                            ) : module.canPurchase ? (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Comprar
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                No Disponible
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })()}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Dialog de Confirmación de Compra */}
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Confirmar Compra de Módulo</DialogTitle>
              <DialogDescription>
                Estás a punto de comprar acceso al módulo:{" "}
                <strong>{selectedModule?.name}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="months">Duración de la Suscripción</Label>
                <Select
                  value={purchaseMonths.toString()}
                  onValueChange={(value) => setPurchaseMonths(parseInt(value, 10))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mes</SelectItem>
                    <SelectItem value="3">3 meses</SelectItem>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total a pagar:
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(purchaseMonths)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  * El pago se procesará cuando se integre la pasarela de pagos
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    <strong>Nota:</strong> Por ahora, la compra se activará inmediatamente sin procesar pago.
                    La integración con la pasarela de pagos se implementará próximamente.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPurchaseDialogOpen(false)}
                disabled={isProcessingPurchase}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmPurchase}
                disabled={isProcessingPurchase}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessingPurchase ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirmar Compra
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

