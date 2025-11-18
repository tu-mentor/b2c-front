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
  AdminUser,
  AdminUserListParams,
  AdminUserListResponse,
  UserRole,
} from "../../types/admin-types";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<AdminUserListParams>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: UserRole.USER,
    status: 1,
    emailVerified: false,
    showAlertMessage: true,
  });
  const [hasAdmin, setHasAdmin] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams: AdminUserListParams = {
        ...params,
        search: searchTerm || undefined,
      };
      const response: AdminUserListResponse = await adminService.getUsers(queryParams);
      setUsers(response.users || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10,
        totalPages: response.totalPages || 0,
      });
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error al cargar los usuarios");
      setUsers([]); // Asegurar que users siempre sea un array
      toast.error(err.message || "Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    checkHasAdmin();
  }, [params.page, params.limit]);

  const checkHasAdmin = async () => {
    try {
      const exists = await adminService.hasAdmin();
      setHasAdmin(exists);
    } catch (err) {
      console.error("Error checking admin:", err);
    }
  };

  const handleSearch = () => {
    setParams({ ...params, page: 1, search: searchTerm || undefined });
    fetchUsers();
  };

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      showAlertMessage: user.showAlertMessage,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: UserRole.USER,
      status: 1,
      emailVerified: false,
      showAlertMessage: true,
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      await adminService.updateUser(selectedUser.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        status: formData.status,
        emailVerified: formData.emailVerified,
        showAlertMessage: formData.showAlertMessage,
      });
      toast.success("Usuario actualizado exitosamente");
      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar el usuario");
    }
  };

  const handleSaveCreate = async () => {
    try {
      // Si intenta crear admin pero ya existe uno, prevenir
      if (formData.role === UserRole.ADMIN && hasAdmin) {
        toast.error("Ya existe un administrador. Solo se puede crear uno la primera vez.");
        return;
      }

      const userData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        acceptTerms: true,
      };

      // Solo incluir role si es admin y no existe ninguno
      if (formData.role === UserRole.ADMIN && !hasAdmin) {
        userData.role = UserRole.ADMIN;
      }

      await adminService.createUser(userData);
      toast.success("Usuario creado exitosamente");
      setIsCreateDialogOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: UserRole.USER,
        status: 1,
        emailVerified: false,
        showAlertMessage: true,
      });
      fetchUsers();
      checkHasAdmin();
    } catch (err: any) {
      toast.error(err.message || "Error al crear el usuario");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await adminService.deleteUser(selectedUser.id);
      toast.success("Usuario eliminado exitosamente");
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar el usuario");
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-100 text-purple-800";
      case UserRole.EDITOR:
        return "bg-blue-100 text-blue-800";
      case UserRole.VIEWER:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-100 text-green-800">Activo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactivo</Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios de la plataforma</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Crear Usuario
        </Button>
      </motion.div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Usuarios</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Verificado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!users || users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No se encontraron usuarios
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            {user.emailVerified ? (
                              <Badge className="bg-green-100 text-green-800">Sí</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(user)}
                                className="text-red-600 hover:text-red-700"
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

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Mostrando {users.length} de {pagination.total} usuarios
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setParams({ ...params, page: params.page! - 1 })}
                    disabled={params.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center px-4 text-sm">
                    Página {pagination.page} de {pagination.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setParams({ ...params, page: params.page! + 1 })}
                    disabled={params.page === pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario seleccionado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.USER}>Usuario</SelectItem>
                  <SelectItem value={UserRole.VIEWER}>Visualizador</SelectItem>
                  <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status.toString()}
                onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Activo</SelectItem>
                  <SelectItem value="0">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailVerified"
                checked={formData.emailVerified}
                onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="emailVerified">Email Verificado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showAlertMessage"
                checked={formData.showAlertMessage}
                onChange={(e) => setFormData({ ...formData, showAlertMessage: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="showAlertMessage">Mostrar Mensaje de Alerta</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Usuario</DialogTitle>
            <DialogDescription>
              Crea un nuevo usuario en la plataforma
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="createFirstName">Nombre</Label>
              <Input
                id="createFirstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createLastName">Apellido</Label>
              <Input
                id="createLastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createEmail">Email</Label>
              <Input
                id="createEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createPassword">Contraseña</Label>
              <Input
                id="createPassword"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createRole">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.USER}>Usuario</SelectItem>
                  <SelectItem value={UserRole.VIEWER}>Visualizador</SelectItem>
                  <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
                  {!hasAdmin && (
                    <SelectItem value={UserRole.ADMIN}>
                      Administrador (Solo primera vez)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {!hasAdmin && (
                <p className="text-xs text-yellow-600">
                  ⚠️ Solo puedes crear un administrador la primera vez
                </p>
              )}
              {hasAdmin && formData.role === UserRole.ADMIN && (
                <p className="text-xs text-red-600">
                  ❌ Ya existe un administrador. No se puede crear otro.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCreate}>Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              {selectedUser?.firstName} {selectedUser?.lastName}? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

