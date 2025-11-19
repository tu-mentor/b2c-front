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
  Trash2,
  Shield,
  RefreshCw,
  UserPlus,
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
import { toast } from "react-hot-toast";
import { Textarea } from "../shared/textarea";
import { Checkbox } from "../shared/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shared/select";

interface CustomRole {
  _id: string;
  name: string;
  description?: string;
  permissions: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const AVAILABLE_PERMISSIONS = [
  { value: "view_users", label: "Ver Usuarios" },
  { value: "create_users", label: "Crear Usuarios" },
  { value: "edit_users", label: "Editar Usuarios" },
  { value: "delete_users", label: "Eliminar Usuarios" },
  { value: "view_stats", label: "Ver Estadísticas" },
  { value: "view_subscriptions", label: "Ver Suscripciones" },
  { value: "edit_subscriptions", label: "Editar Suscripciones" },
  { value: "view_companies", label: "Ver Empresas" },
  { value: "edit_companies", label: "Editar Empresas" },
  { value: "view_roles", label: "Ver Roles" },
  { value: "create_roles", label: "Crear Roles" },
  { value: "edit_roles", label: "Editar Roles" },
  { value: "delete_roles", label: "Eliminar Roles" },
];

export default function CustomRolesManagement() {
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isActive: true,
  });
  const [selectedUserId, setSelectedUserId] = useState("");

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getCustomRoles();
      setRoles(data || []);
    } catch (err: any) {
      console.error("Error fetching roles:", err);
      setError(err.message || "Error al cargar los roles");
      toast.error(err.message || "Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers({ limit: 1000 });
      setUsers(response.users || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const handleCreateRole = async () => {
    try {
      await adminService.createCustomRole(formData);
      toast.success("Rol creado exitosamente");
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "", permissions: [], isActive: true });
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || "Error al crear el rol");
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;
    try {
      await adminService.updateCustomRole(selectedRole._id, formData);
      toast.success("Rol actualizado exitosamente");
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      setFormData({ name: "", description: "", permissions: [], isActive: true });
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar el rol");
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    try {
      await adminService.deleteCustomRole(selectedRole._id);
      toast.success("Rol eliminado exitosamente");
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar el rol");
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRole || !selectedUserId) return;
    try {
      await adminService.assignCustomRoleToUser(selectedUserId, selectedRole._id);
      toast.success("Rol asignado exitosamente");
      setIsAssignDialogOpen(false);
      setSelectedUserId("");
    } catch (err: any) {
      toast.error(err.message || "Error al asignar el rol");
    }
  };

  const handleEdit = (role: CustomRole) => {
    setSelectedRole(role);
    setFormData({
      name: role.name || "",
      description: role.description || "",
      permissions: role.permissions || [],
      isActive: role.isActive !== false,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (role: CustomRole) => {
    setSelectedRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleAssign = (role: CustomRole) => {
    setSelectedRole(role);
    setIsAssignDialogOpen(true);
  };

  const filteredRoles = roles.filter((role) =>
    role.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          Gestión de Roles Personalizados
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600">Administra roles y permisos personalizados</p>
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
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-800">Roles Personalizados</CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar roles..."
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
                <span className="hidden sm:inline">Crear Rol</span>
                <span className="sm:hidden">Crear</span>
              </Button>
              <Button
                variant="outline"
                onClick={fetchRoles}
                className="hover:bg-gray-100"
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
                  <TableHead className="whitespace-nowrap">Descripción</TableHead>
                  <TableHead className="whitespace-nowrap">Permisos</TableHead>
                  <TableHead className="whitespace-nowrap">Estado</TableHead>
                  <TableHead className="whitespace-nowrap">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron roles
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium whitespace-nowrap">{role.name}</TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-[200px] truncate">
                        {role.description || "Sin descripción"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions?.slice(0, 3).map((perm, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {AVAILABLE_PERMISSIONS.find((p) => p.value === perm)?.label || perm}
                            </Badge>
                          ))}
                          {role.permissions && role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={role.isActive !== false ? "default" : "secondary"}>
                          {role.isActive !== false ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(role)}
                            className="hover:bg-indigo-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssign(role)}
                            className="hover:bg-green-50"
                            title="Asignar a usuario"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(role)}
                            className="hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription>
              Completa los datos para crear un nuevo rol personalizado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Rol *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Editor de Contenido"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del rol"
                rows={3}
              />
            </div>
            <div>
              <Label>Permisos *</Label>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.value} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      checked={formData.permissions.includes(permission.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            permissions: [...formData.permissions, permission.value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            permissions: formData.permissions.filter((p) => p !== permission.value),
                          });
                        }
                      }}
                    />
                    <Label className="flex-1 cursor-pointer">{permission.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">Rol activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRole}
              disabled={!formData.name || formData.permissions.length === 0}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Rol</DialogTitle>
            <DialogDescription>
              Modifica los datos del rol
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre del Rol *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Editor de Contenido"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del rol"
                rows={3}
              />
            </div>
            <div>
              <Label>Permisos *</Label>
              <div className="space-y-2 mt-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.value} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                    <Checkbox
                      checked={formData.permissions.includes(permission.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            permissions: [...formData.permissions, permission.value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            permissions: formData.permissions.filter((p) => p !== permission.value),
                          });
                        }
                      }}
                    />
                    <Label className="flex-1 cursor-pointer">{permission.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="edit-isActive" className="cursor-pointer">Rol activo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateRole}
              disabled={!formData.name || formData.permissions.length === 0}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Rol</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el rol "{selectedRole?.name}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteRole}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Rol - {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Selecciona un usuario para asignarle este rol
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-select">Usuario</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un usuario" />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedUserId}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              Asignar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

