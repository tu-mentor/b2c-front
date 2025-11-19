import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card";
import { Button } from "../shared/button";
import { Input } from "../shared/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shared/table";
import { adminService } from "../../services/admin-service";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  ShoppingCart,
} from "lucide-react";
import LoadingSpinner from "../shared/spinner/loading-spinner";
import { Alert, AlertDescription } from "../shared/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "../shared/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shared/dialog";
import { Label } from "../shared/label";
import { Textarea } from "../shared/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shared/select";
import { toast } from "react-hot-toast";

interface PurchaseRequest {
  _id: string;
  userId: any;
  moduleId: any;
  type: "purchase" | "renewal";
  status: "pending" | "approved" | "rejected" | "completed";
  months: number;
  userEmail: string;
  userName: string;
  moduleName: string;
  companyName: string;
  notes?: string;
  reviewedBy?: any;
  reviewedAt?: string;
  createdSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseRequestsResponse {
  requests: PurchaseRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function PurchaseRequestsManagement() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    status: "all",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [approveFormData, setApproveFormData] = useState({
    startDate: "",
    endDate: "",
    status: "1", // ACTIVE por defecto
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PurchaseRequestsResponse = await adminService.getPurchaseRequests(
        params.status !== "all" ? params.status : undefined,
        params.page,
        params.limit
      );
      setRequests(response.requests || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        totalPages: response.totalPages || 0,
      });
    } catch (err: any) {
      console.error("Error fetching purchase requests:", err);
      setError(err.message || "Error al cargar las solicitudes");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [params.page, params.limit, params.status]);

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewDetails = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  const handleApproveClick = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setNotes("");
    
    // Calcular fechas por defecto basadas en los meses solicitados
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    
    if (request.months > 0) {
      endDate.setMonth(endDate.getMonth() + request.months);
    } else {
      // Si es 0 meses (opciones específicas), usar 6 meses por defecto
      endDate.setMonth(endDate.getMonth() + 6);
    }
    
    setApproveFormData({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: "1", // ACTIVE por defecto
    });
    
    setIsApproveDialogOpen(true);
  };

  const handleRejectClick = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setNotes("");
    setIsRejectDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    if (!approveFormData.startDate || !approveFormData.endDate) {
      toast.error("Por favor, completa las fechas de inicio y fin");
      return;
    }

    if (new Date(approveFormData.startDate) >= new Date(approveFormData.endDate)) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    try {
      await adminService.approvePurchaseRequest(
        selectedRequest._id,
        notes || undefined,
        approveFormData.startDate,
        approveFormData.endDate,
        approveFormData.status
      );
      toast.success("Solicitud aprobada exitosamente");
      setIsApproveDialogOpen(false);
      setSelectedRequest(null);
      setNotes("");
      setApproveFormData({ startDate: "", endDate: "", status: "1" });
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "Error al aprobar la solicitud");
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      await adminService.rejectPurchaseRequest(selectedRequest._id, notes || undefined);
      toast.success("Solicitud rechazada exitosamente");
      setIsRejectDialogOpen(false);
      setSelectedRequest(null);
      setNotes("");
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "Error al rechazar la solicitud");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
      case "approved":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Aprobada</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rechazada</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "purchase":
        return <Badge className="bg-blue-500">Compra</Badge>;
      case "renewal":
        return <Badge className="bg-purple-500">Renovación</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-4 md:space-y-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Solicitudes de Compra/Renovación</h1>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Lista de Solicitudes</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={fetchRequests} variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
            <Select
              value={params.status}
              onValueChange={(value) => setParams({ ...params, page: 1, status: value })}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="approved">Aprobada</SelectItem>
                <SelectItem value="rejected">Rechazada</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : !requests || requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay solicitudes disponibles
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Usuario</TableHead>
                      <TableHead className="whitespace-nowrap">Empresa</TableHead>
                      <TableHead className="whitespace-nowrap">Módulo</TableHead>
                      <TableHead className="whitespace-nowrap">Tipo</TableHead>
                      <TableHead className="whitespace-nowrap">Duración</TableHead>
                      <TableHead className="whitespace-nowrap">Estado</TableHead>
                      <TableHead className="whitespace-nowrap">Fecha</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell className="whitespace-nowrap">
                        <div>
                          <div className="font-medium">{request.userName}</div>
                          <div className="text-sm text-gray-500 truncate max-w-[150px]">{request.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{request.companyName || "N/A"}</TableCell>
                      <TableCell className="whitespace-nowrap">{request.moduleName || "N/A"}</TableCell>
                      <TableCell className="whitespace-nowrap">{getTypeBadge(request.type)}</TableCell>
                      <TableCell className="whitespace-nowrap">{request.months} {request.months === 1 ? "mes" : "meses"}</TableCell>
                      <TableCell className="whitespace-nowrap">{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(request.createdAt)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleApproveClick(request)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleRejectClick(request)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
                </Button>
                <span className="text-xs sm:text-sm text-gray-700 text-center">
                  Página {pagination.page} de {pagination.totalPages} ({pagination.total} total)
                </span>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  variant="outline"
                >
                  Siguiente <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalles */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
            <DialogDescription>
              Información completa de la solicitud de {selectedRequest?.type === "purchase" ? "compra" : "renovación"}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Usuario</Label>
                  <p className="text-sm font-medium">{selectedRequest.userName}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.userEmail}</p>
                </div>
                <div>
                  <Label>Empresa</Label>
                  <p className="text-sm">{selectedRequest.companyName || "N/A"}</p>
                </div>
                <div>
                  <Label>Módulo</Label>
                  <p className="text-sm">{selectedRequest.moduleName}</p>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <div className="mt-1">{getTypeBadge(selectedRequest.type)}</div>
                </div>
                <div>
                  <Label>Duración</Label>
                  <p className="text-sm">{selectedRequest.months} {selectedRequest.months === 1 ? "mes" : "meses"}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <Label>Fecha de Solicitud</Label>
                  <p className="text-sm">{formatDate(selectedRequest.createdAt)}</p>
                </div>
                {selectedRequest.reviewedAt && (
                  <div>
                    <Label>Fecha de Revisión</Label>
                    <p className="text-sm">{formatDate(selectedRequest.reviewedAt)}</p>
                  </div>
                )}
              </div>
              {selectedRequest.notes && (
                <div>
                  <Label>Notas</Label>
                  <p className="text-sm text-gray-700 mt-1">{selectedRequest.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Aprobar */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud</DialogTitle>
            <DialogDescription>
              Configura la suscripción que se creará al aprobar esta solicitud.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium">Usuario: {selectedRequest.userName}</p>
                <p className="text-sm">Módulo: {selectedRequest.moduleName}</p>
                <p className="text-sm">Duración solicitada: {selectedRequest.months} {selectedRequest.months === 1 ? "mes" : "meses"}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="approve-start-date">Fecha de Inicio *</Label>
                  <Input
                    id="approve-start-date"
                    type="date"
                    value={approveFormData.startDate}
                    onChange={(e) => setApproveFormData({ ...approveFormData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approve-end-date">Fecha de Fin *</Label>
                  <Input
                    id="approve-end-date"
                    type="date"
                    value={approveFormData.endDate}
                    onChange={(e) => setApproveFormData({ ...approveFormData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approve-status">Estado de la Suscripción *</Label>
                <Select
                  value={approveFormData.status}
                  onValueChange={(value) => setApproveFormData({ ...approveFormData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Pendiente</SelectItem>
                    <SelectItem value="1">Activa</SelectItem>
                    <SelectItem value="2">Cancelada</SelectItem>
                    <SelectItem value="3">Expirada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approve-notes">Notas (opcional)</Label>
                <Textarea
                  id="approve-notes"
                  placeholder="Agregar notas sobre la aprobación..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Aprobar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Rechazar */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas rechazar esta solicitud? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium">Usuario: {selectedRequest.userName}</p>
                <p className="text-sm">Módulo: {selectedRequest.moduleName}</p>
                <p className="text-sm">Duración: {selectedRequest.months} {selectedRequest.months === 1 ? "mes" : "meses"}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reject-notes">Motivo del rechazo (opcional)</Label>
                <Textarea
                  id="reject-notes"
                  placeholder="Agregar motivo del rechazo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReject} variant="destructive">
              <XCircle className="w-4 h-4 mr-2" />
              Rechazar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

