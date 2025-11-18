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
    setIsApproveDialogOpen(true);
  };

  const handleRejectClick = (request: PurchaseRequest) => {
    setSelectedRequest(request);
    setNotes("");
    setIsRejectDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      await adminService.approvePurchaseRequest(selectedRequest._id, notes || undefined);
      toast.success("Solicitud aprobada exitosamente");
      setIsApproveDialogOpen(false);
      setSelectedRequest(null);
      setNotes("");
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
      className="p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-800">Solicitudes de Compra/Renovación</h1>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Solicitudes</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={fetchRequests} variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4 flex-wrap gap-2">
            <Select
              value={params.status}
              onValueChange={(value) => setParams({ ...params, page: 1, status: value })}
            >
              <SelectTrigger className="w-[180px]">
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.userName}</div>
                          <div className="text-sm text-gray-500">{request.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.companyName || "N/A"}</TableCell>
                      <TableCell>{request.moduleName || "N/A"}</TableCell>
                      <TableCell>{getTypeBadge(request.type)}</TableCell>
                      <TableCell>{request.months} {request.months === 1 ? "mes" : "meses"}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
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
              <div className="flex items-center justify-between mt-4">
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Anterior
                </Button>
                <span className="text-sm text-gray-700">
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas aprobar esta solicitud? Se creará una suscripción activa para el usuario.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium">Usuario: {selectedRequest.userName}</p>
                <p className="text-sm">Módulo: {selectedRequest.moduleName}</p>
                <p className="text-sm">Duración: {selectedRequest.months} {selectedRequest.months === 1 ? "mes" : "meses"}</p>
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

