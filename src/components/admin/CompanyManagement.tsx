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
  Plus,
  Edit,
  Building2,
  Tag,
  CreditCard,
  RefreshCw,
  Trash2,
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
import { Textarea } from "../shared/textarea";
import { Checkbox } from "../shared/checkbox";

interface Company {
  _id: string;
  name: string;
  uuid?: string;
  characteristics?: any[];
  subscriptions?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface CompanyCharacteristic {
  _id: string;
  name: string;
  value?: string;
}

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [characteristics, setCharacteristics] = useState<CompanyCharacteristic[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCharacteristicsDialogOpen, setIsCharacteristicsDialogOpen] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [isCreateCharacteristicDialogOpen, setIsCreateCharacteristicDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    characteristics: [] as string[],
  });
  const [characteristicFormData, setCharacteristicFormData] = useState({
    name: "",
    value: "",
  });
  const [subscriptionFormData, setSubscriptionFormData] = useState({
    startDate: "",
    endDate: "",
    maxUsers: 10,
    modules: [] as string[],
  });

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getCompanies();
      setCompanies(data || []);
    } catch (err: any) {
      console.error("Error fetching companies:", err);
      setError(err.message || "Error al cargar las empresas");
      toast.error(err.message || "Error al cargar las empresas");
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacteristics = async () => {
    try {
      const data = await adminService.getCompanyCharacteristics();
      setCharacteristics(data || []);
    } catch (err: any) {
      console.error("Error fetching characteristics:", err);
    }
  };

  const fetchModules = async () => {
    try {
      const data = await adminService.getModules();
      setModules(data || []);
    } catch (err: any) {
      console.error("Error fetching modules:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchCharacteristics();
    fetchModules();
  }, []);

  const handleCreateCompany = async () => {
    try {
      await adminService.createCompany(formData);
      toast.success("Empresa creada exitosamente");
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "", characteristics: [] });
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.message || "Error al crear la empresa");
    }
  };

  const handleUpdateCompany = async () => {
    if (!selectedCompany) return;
    try {
      await adminService.updateCompany(selectedCompany._id, formData);
      toast.success("Empresa actualizada exitosamente");
      setIsEditDialogOpen(false);
      setSelectedCompany(null);
      setFormData({ name: "", description: "", characteristics: [] });
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar la empresa");
    }
  };

  const handleCreateCharacteristic = async () => {
    try {
      await adminService.createCompanyCharacteristic(characteristicFormData);
      toast.success("Característica creada exitosamente");
      setIsCreateCharacteristicDialogOpen(false);
      setCharacteristicFormData({ name: "", value: "" });
      fetchCharacteristics();
    } catch (err: any) {
      toast.error(err.message || "Error al crear la característica");
    }
  };

  const handleAssignSubscription = async () => {
    if (!selectedCompany) return;
    try {
      const subscriptionData = {
        userId: selectedCompany._id,
        type: "1", // BTB
        startDate: subscriptionFormData.startDate,
        endDate: subscriptionFormData.endDate,
        btbDetails: {
          maxUsers: subscriptionFormData.maxUsers,
          modules: subscriptionFormData.modules.map((moduleId) => ({ moduleId })),
        },
      };
      await adminService.createSubscription(subscriptionData);
      toast.success("Suscripción asignada exitosamente");
      setIsSubscriptionDialogOpen(false);
      setSubscriptionFormData({ startDate: "", endDate: "", maxUsers: 10, modules: [] });
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.message || "Error al asignar la suscripción");
    }
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name || "",
      description: "",
      characteristics: company.characteristics?.map((c: any) => c._id || c) || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleManageCharacteristics = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name || "",
      description: "",
      characteristics: company.characteristics?.map((c: any) => c._id || c) || [],
    });
    setIsCharacteristicsDialogOpen(true);
  };

  const handleManageSubscription = (company: Company) => {
    setSelectedCompany(company);
    setIsSubscriptionDialogOpen(true);
  };

  const filteredCompanies = companies.filter((company) =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
          Gestión de Empresas
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600">Administra empresas, características y suscripciones</p>
      </motion.div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">Empresas</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Crear Empresa</span>
                <span className="sm:hidden">Crear</span>
              </Button>
              <Button
                variant="outline"
                onClick={fetchCompanies}
                className="hover:bg-gray-100 w-full sm:w-auto"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="whitespace-nowrap">Nombre</TableHead>
                  <TableHead className="whitespace-nowrap">UUID</TableHead>
                  <TableHead className="whitespace-nowrap">Características</TableHead>
                  <TableHead className="whitespace-nowrap">Suscripciones</TableHead>
                  <TableHead className="whitespace-nowrap">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron empresas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => (
                    <TableRow key={company._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell className="text-sm text-gray-500 font-mono">
                        {company.uuid || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {company.characteristics && company.characteristics.length > 0 ? (
                            company.characteristics.slice(0, 2).map((char: any, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {char.name || char}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">Sin características</span>
                          )}
                          {company.characteristics && company.characteristics.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{company.characteristics.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={company.subscriptions && company.subscriptions.length > 0 ? "default" : "secondary"}>
                          {company.subscriptions?.length || 0} suscripción(es)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(company)}
                            className="hover:bg-indigo-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageCharacteristics(company)}
                            className="hover:bg-purple-50"
                            title="Gestionar características"
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageSubscription(company)}
                            className="hover:bg-green-50"
                            title="Asignar suscripción"
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Company Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nueva Empresa</DialogTitle>
            <DialogDescription>
              Completa los datos para crear una nueva empresa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre de la Empresa *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Empresa ABC"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la empresa"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCompany}
              disabled={!formData.name}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Modifica los datos de la empresa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre de la Empresa *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Empresa ABC"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la empresa"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateCompany}
              disabled={!formData.name}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Characteristics Dialog */}
      <Dialog open={isCharacteristicsDialogOpen} onOpenChange={setIsCharacteristicsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestionar Características - {selectedCompany?.name}</DialogTitle>
            <DialogDescription>
              Asigna características a esta empresa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Características Disponibles</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateCharacteristicDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Característica
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4">
              {characteristics.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No hay características disponibles. Crea una nueva.
                </p>
              ) : (
                characteristics.map((char) => (
                  <div key={char._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      checked={formData.characteristics.includes(char._id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            characteristics: [...formData.characteristics, char._id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            characteristics: formData.characteristics.filter((id) => id !== char._id),
                          });
                        }
                      }}
                    />
                    <Label className="flex-1 cursor-pointer">
                      {char.name} {char.value && `(${char.value})`}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCharacteristicsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (!selectedCompany) return;
                try {
                  await adminService.updateCompany(selectedCompany._id, {
                    characteristics: formData.characteristics,
                  });
                  toast.success("Características actualizadas exitosamente");
                  setIsCharacteristicsDialogOpen(false);
                  fetchCompanies();
                } catch (err: any) {
                  toast.error(err.message || "Error al actualizar las características");
                }
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Characteristic Dialog */}
      <Dialog open={isCreateCharacteristicDialogOpen} onOpenChange={setIsCreateCharacteristicDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nueva Característica</DialogTitle>
            <DialogDescription>
              Crea una nueva característica para empresas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="char-name">Nombre *</Label>
              <Input
                id="char-name"
                value={characteristicFormData.name}
                onChange={(e) => setCharacteristicFormData({ ...characteristicFormData, name: e.target.value })}
                placeholder="Ej: Tipo de carrera"
              />
            </div>
            <div>
              <Label htmlFor="char-value">Valor (opcional)</Label>
              <Input
                id="char-value"
                value={characteristicFormData.value}
                onChange={(e) => setCharacteristicFormData({ ...characteristicFormData, value: e.target.value })}
                placeholder="Ej: Profesional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateCharacteristicDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateCharacteristic}
              disabled={!characteristicFormData.name}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Delete Characteristics Management */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-6">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
          <CardTitle className="text-2xl font-bold text-gray-800">Gestionar Características</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {characteristics.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay características disponibles</p>
            ) : (
              characteristics.map((char) => (
                <div key={char._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{char.name}</p>
                    {char.value && <p className="text-sm text-gray-500">{char.value}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        const newName = prompt("Nuevo nombre:", char.name);
                        const newValue = prompt("Nuevo valor (opcional):", char.value || "");
                        if (newName) {
                          try {
                            await adminService.updateCompanyCharacteristic(char._id, {
                              name: newName,
                              value: newValue || undefined,
                            });
                            toast.success("Característica actualizada");
                            fetchCharacteristics();
                          } catch (err: any) {
                            toast.error(err.message || "Error al actualizar");
                          }
                        }
                      }}
                      className="hover:bg-indigo-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        if (confirm(`¿Eliminar la característica "${char.name}"?`)) {
                          try {
                            await adminService.deleteCompanyCharacteristic(char._id);
                            toast.success("Característica eliminada");
                            fetchCharacteristics();
                          } catch (err: any) {
                            toast.error(err.message || "Error al eliminar");
                          }
                        }
                      }}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assign Subscription Dialog */}
      <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asignar Suscripción - {selectedCompany?.name}</DialogTitle>
            <DialogDescription>
              Asigna una suscripción B2B a esta empresa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Fecha de Inicio *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={subscriptionFormData.startDate}
                  onChange={(e) => setSubscriptionFormData({ ...subscriptionFormData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">Fecha de Fin *</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={subscriptionFormData.endDate}
                  onChange={(e) => setSubscriptionFormData({ ...subscriptionFormData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="max-users">Máximo de Usuarios *</Label>
              <Input
                id="max-users"
                type="number"
                min="1"
                value={subscriptionFormData.maxUsers}
                onChange={(e) => setSubscriptionFormData({ ...subscriptionFormData, maxUsers: parseInt(e.target.value) || 10 })}
              />
            </div>
            <div>
              <Label>Módulos *</Label>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                {modules.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No hay módulos disponibles</p>
                ) : (
                  modules.map((module) => (
                    <div key={module._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <Checkbox
                        checked={subscriptionFormData.modules.includes(module._id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSubscriptionFormData({
                              ...subscriptionFormData,
                              modules: [...subscriptionFormData.modules, module._id],
                            });
                          } else {
                            setSubscriptionFormData({
                              ...subscriptionFormData,
                              modules: subscriptionFormData.modules.filter((id) => id !== module._id),
                            });
                          }
                        }}
                      />
                      <Label className="flex-1 cursor-pointer">{module.name}</Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubscriptionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAssignSubscription}
              disabled={!subscriptionFormData.startDate || !subscriptionFormData.endDate || subscriptionFormData.modules.length === 0}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Asignar Suscripción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

