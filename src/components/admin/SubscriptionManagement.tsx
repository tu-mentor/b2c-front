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
  Edit,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CreditCard,
  Calendar,
  Users,
  Plus,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shared/select";
import { toast } from "react-hot-toast";

interface Subscription {
  _id: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  btcDetails?: {
    module?: {
      name: string;
    };
  };
  btbDetails?: {
    maxUsers: number;
    currentUsers: number;
  };
  users?: Array<{
    email: string;
    firstName: string;
    lastName: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionListResponse {
  subscriptions: Subscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    status: "all",
    type: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });
  const [createFormData, setCreateFormData] = useState({
    userId: "",
    type: "0", // B2C por defecto
    status: "0", // Pendiente por defecto
    startDate: "",
    endDate: "",
    module: "", // Para B2C
    maxUsers: "", // Para B2B
    selectedModules: [] as string[], // Para B2B - módulos seleccionados
  });

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams: any = {
        page: params.page,
        limit: params.limit,
      };
      if (params.status && params.status !== "all") queryParams.status = params.status;
      if (params.type && params.type !== "all") queryParams.type = params.type;

      const response: SubscriptionListResponse = await adminService.getSubscriptions(queryParams);
      setSubscriptions(response.subscriptions);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      console.error("Error fetching subscriptions:", err);
      setError(err.message || "Error al cargar las suscripciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [params.page, params.limit, params.status, params.type, params.search]);

  const handleEmailSearch = () => {
    setParams({ ...params, page: 1, search: emailSearchTerm });
  };

  useEffect(() => {
    const fetchUsersAndModules = async () => {
      try {
        const [usersResponse, modulesResponse] = await Promise.all([
          adminService.getUsers({ page: 1, limit: 1000 }),
          adminService.getModules(),
        ]);
        setUsers(usersResponse.users || []);
        setModules(modulesResponse || []);
      } catch (err) {
        console.error("Error fetching users or modules:", err);
      }
    };
    fetchUsersAndModules();
  }, []);

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleCreateClick = () => {
    setCreateFormData({
      userId: "",
      type: "0",
      status: "0",
      startDate: "",
      endDate: "",
      module: "",
      maxUsers: "",
      selectedModules: [],
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      status: subscription.status,
      startDate: subscription.startDate ? new Date(subscription.startDate).toISOString().split('T')[0] : "",
      endDate: subscription.endDate ? new Date(subscription.endDate).toISOString().split('T')[0] : "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveCreate = async () => {
    try {
      const subscriptionData: any = {
        userId: createFormData.userId,
        type: createFormData.type,
        status: createFormData.status,
        startDate: new Date(createFormData.startDate),
        endDate: new Date(createFormData.endDate),
      };

      if (createFormData.type === "0") {
        // B2C
        if (!createFormData.module) {
          toast.error("Debe seleccionar un módulo para suscripciones B2C");
          return;
        }
        subscriptionData.btcDetails = {
          module: createFormData.module,
        };
      } else {
        // B2B
        if (!createFormData.maxUsers) {
          toast.error("Debe especificar el número máximo de usuarios para suscripciones B2B");
          return;
        }
        // Construir array de módulos para B2B
        const b2bModules = createFormData.selectedModules.map((moduleId) => ({
          moduleId: moduleId,
          // Las fechas por módulo son opcionales, se pueden agregar en el futuro
        }));
        
        subscriptionData.btbDetails = {
          maxUsers: parseInt(createFormData.maxUsers, 10),
          currentUsers: 0,
          modules: b2bModules.length > 0 ? b2bModules : undefined, // Si no hay módulos, se puede crear sin ellos
        };
      }

      await adminService.createSubscription(subscriptionData);
      toast.success("Suscripción creada exitosamente");
      setIsCreateDialogOpen(false);
      fetchSubscriptions();
    } catch (err: any) {
      toast.error(err.message || "Error al crear la suscripción");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedSubscription) return;

    try {
      const updateData: any = {
        status: formData.status,
      };

      if (formData.startDate) {
        updateData.startDate = new Date(formData.startDate);
      }

      if (formData.endDate) {
        updateData.endDate = new Date(formData.endDate);
      }

      await adminService.updateSubscription(selectedSubscription._id, updateData);
      toast.success("Suscripción actualizada exitosamente");
      setIsEditDialogOpen(false);
      fetchSubscriptions();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar la suscripción");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "1":
        return <Badge className="bg-green-500">Activa</Badge>;
      case "0":
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case "2":
        return <Badge variant="destructive">Cancelada</Badge>;
      case "3":
        return <Badge variant="outline">Expirada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "0":
        return <Badge className="bg-blue-500">B2C</Badge>;
      case "1":
        return <Badge className="bg-purple-500">B2B</Badge>;
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
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 space-y-4 md:space-y-6"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestión de Suscripciones</h1>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Lista de Suscripciones</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={handleCreateClick} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> 
              <span className="hidden sm:inline">Crear Suscripción</span>
              <span className="sm:hidden">Crear</span>
            </Button>
            <Button onClick={fetchSubscriptions} variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
            <Input
              placeholder="Buscar por correo electrónico..."
              value={emailSearchTerm}
              onChange={(e) => setEmailSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEmailSearch();
                }
              }}
              className="w-full sm:max-w-sm"
            />
            <Button onClick={handleEmailSearch} className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
            {params.search && (
              <Button
                variant="outline"
                onClick={() => {
                  setEmailSearchTerm("");
                  setParams({ ...params, page: 1, search: "" });
                }}
              >
                Limpiar
              </Button>
            )}
            <Select
              value={params.status}
              onValueChange={(value) => setParams({ ...params, page: 1, status: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="1">Activa</SelectItem>
                <SelectItem value="0">Pendiente</SelectItem>
                <SelectItem value="2">Cancelada</SelectItem>
                <SelectItem value="3">Expirada</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={params.type}
              onValueChange={(value) => setParams({ ...params, page: 1, type: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="0">B2C</SelectItem>
                <SelectItem value="1">B2B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">ID</TableHead>
                    <TableHead className="whitespace-nowrap">Usuario</TableHead>
                    <TableHead className="whitespace-nowrap">Tipo</TableHead>
                    <TableHead className="whitespace-nowrap">Estado</TableHead>
                    <TableHead className="whitespace-nowrap">Módulo</TableHead>
                    <TableHead className="whitespace-nowrap">Fecha Inicio</TableHead>
                    <TableHead className="whitespace-nowrap">Fecha Fin</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription, index) => (
                    <TableRow key={subscription._id || `subscription-${index}`}>
                      <TableCell className="font-mono text-xs">
                        {subscription._id ? `${subscription._id.toString().substring(0, 8)}...` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {subscription.users && subscription.users.length > 0 ? (
                          <div className="space-y-1">
                            {subscription.users.map((user, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="font-medium">{user.firstName} {user.lastName}</div>
                                <div className="text-gray-500 text-xs">{user.email}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{getTypeBadge(subscription.type)}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>
                        {subscription.btcDetails?.module?.name || 
                         (subscription.btbDetails ? `B2B (${subscription.btbDetails.currentUsers}/${subscription.btbDetails.maxUsers} usuarios)` : "N/A")}
                      </TableCell>
                      <TableCell>{formatDate(subscription.startDate)}</TableCell>
                      <TableCell>{formatDate(subscription.endDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(subscription)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
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

      {/* Edit Subscription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Suscripción</DialogTitle>
            <DialogDescription>
              Realiza cambios en la información de la suscripción.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Subscription Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Suscripción</DialogTitle>
            <DialogDescription>
              Crea una nueva suscripción para un usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userId">Usuario</Label>
              <Select
                value={createFormData.userId}
                onValueChange={(value) => setCreateFormData({ ...createFormData, userId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Suscripción</Label>
              <Select
                value={createFormData.type}
                onValueChange={(value) => setCreateFormData({ ...createFormData, type: value, module: "", maxUsers: "", selectedModules: [] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">B2C</SelectItem>
                  <SelectItem value="1">B2B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={createFormData.status}
                onValueChange={(value) => setCreateFormData({ ...createFormData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Pendiente</SelectItem>
                  <SelectItem value="1">Activa</SelectItem>
                  <SelectItem value="2">Cancelada</SelectItem>
                  <SelectItem value="3">Expirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createFormData.type === "0" && (
              <div className="space-y-2">
                <Label htmlFor="module">Módulo (B2C)</Label>
                <Select
                  value={createFormData.module}
                  onValueChange={(value) => setCreateFormData({ ...createFormData, module: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module._id} value={module._id}>
                        {module.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {createFormData.type === "1" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">Máximo de Usuarios (B2B)</Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    min="1"
                    value={createFormData.maxUsers}
                    onChange={(e) => setCreateFormData({ ...createFormData, maxUsers: e.target.value })}
                    placeholder="Ej: 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Módulos (B2B) - Seleccione uno o más</Label>
                  <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                    {modules.length === 0 ? (
                      <p className="text-sm text-gray-500">Cargando módulos...</p>
                    ) : (
                      modules.map((module) => (
                        <div key={module._id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`module-${module._id}`}
                            checked={createFormData.selectedModules.includes(module._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCreateFormData({
                                  ...createFormData,
                                  selectedModules: [...createFormData.selectedModules, module._id],
                                });
                              } else {
                                setCreateFormData({
                                  ...createFormData,
                                  selectedModules: createFormData.selectedModules.filter((id) => id !== module._id),
                                });
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`module-${module._id}`}
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            {module.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  {createFormData.selectedModules.length === 0 && (
                    <p className="text-xs text-gray-500">
                      Si no selecciona módulos, la suscripción se creará sin módulos específicos
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="createStartDate">Fecha de Inicio</Label>
              <Input
                id="createStartDate"
                type="date"
                value={createFormData.startDate}
                onChange={(e) => setCreateFormData({ ...createFormData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createEndDate">Fecha de Fin</Label>
              <Input
                id="createEndDate"
                type="date"
                value={createFormData.endDate}
                onChange={(e) => setCreateFormData({ ...createFormData, endDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCreate}>Crear Suscripción</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

