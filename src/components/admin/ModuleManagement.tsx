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
  Package,
  RefreshCw,
} from "lucide-react";
import LoadingSpinner from "../shared/spinner/loading-spinner";
import { Alert, AlertDescription } from "../shared/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../shared/dialog";
import { Label } from "../shared/label";
import { toast } from "react-hot-toast";
import { Textarea } from "../shared/textarea";

interface Module {
  _id: string;
  name: string;
  identifier: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    identifier: "",
    description: "",
  });

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getModules();
      setModules(data || []);
    } catch (err: any) {
      console.error("Error fetching modules:", err);
      setError(err.message || "Error al cargar los módulos");
      toast.error(err.message || "Error al cargar los módulos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleCreateModule = async () => {
    try {
      if (!formData.identifier || isNaN(Number(formData.identifier))) {
        toast.error("El identificador debe ser un número válido");
        return;
      }
      await adminService.createModule({
        name: formData.name,
        identifier: Number(formData.identifier),
        description: formData.description || undefined,
      });
      toast.success("Módulo creado exitosamente");
      setIsCreateDialogOpen(false);
      setFormData({ name: "", identifier: "", description: "" });
      fetchModules();
    } catch (err: any) {
      toast.error(err.message || "Error al crear el módulo");
    }
  };

  const handleUpdateModule = async () => {
    if (!selectedModule) return;
    try {
      const updateData: any = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.identifier && !isNaN(Number(formData.identifier))) {
        updateData.identifier = Number(formData.identifier);
      }
      if (formData.description !== undefined) updateData.description = formData.description;
      
      await adminService.updateModule(selectedModule._id, updateData);
      toast.success("Módulo actualizado exitosamente");
      setIsEditDialogOpen(false);
      setSelectedModule(null);
      setFormData({ name: "", identifier: "", description: "" });
      fetchModules();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar el módulo");
    }
  };

  const handleEdit = (module: Module) => {
    setSelectedModule(module);
    setFormData({
      name: module.name || "",
      identifier: module.identifier?.toString() || "",
      description: module.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const filteredModules = modules.filter((module) =>
    module.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.identifier?.toString().includes(searchTerm)
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
          Gestión de Módulos
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600">Administra los módulos disponibles en la plataforma</p>
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
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">Módulos</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar módulos..."
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
                <span className="hidden sm:inline">Crear Módulo</span>
                <span className="sm:hidden">Crear</span>
              </Button>
              <Button
                variant="outline"
                onClick={fetchModules}
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
                  <TableHead className="whitespace-nowrap">Identificador</TableHead>
                  <TableHead className="whitespace-nowrap">Descripción</TableHead>
                  <TableHead className="whitespace-nowrap">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      No se encontraron módulos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModules.map((module) => (
                    <TableRow key={module._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{module.name}</TableCell>
                      <TableCell className="text-sm text-gray-500 font-mono">
                        {module.identifier}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {module.description || "Sin descripción"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(module)}
                          className="hover:bg-indigo-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Module Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Módulo</DialogTitle>
            <DialogDescription>
              Completa los datos para crear un nuevo módulo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Módulo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Orientación Vocacional"
              />
            </div>
            <div>
              <Label htmlFor="identifier">Identificador *</Label>
              <Input
                id="identifier"
                type="number"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="Ej: 1"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del módulo"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateModule}
              disabled={!formData.name || !formData.identifier}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Módulo</DialogTitle>
            <DialogDescription>
              Modifica los datos del módulo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre del Módulo *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Orientación Vocacional"
              />
            </div>
            <div>
              <Label htmlFor="edit-identifier">Identificador *</Label>
              <Input
                id="edit-identifier"
                type="number"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="Ej: 1"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del módulo"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateModule}
              disabled={!formData.name || !formData.identifier}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

