import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card";
import { Button } from "../shared/button";
import { Input } from "../shared/input";
import { Label } from "../shared/label";
import { adminService } from "../../services/admin-service";
import { Settings, Save, RefreshCw, Plus, Trash2 } from "lucide-react";
import LoadingSpinner from "../shared/spinner/loading-spinner";
import { Alert, AlertDescription } from "../shared/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shared/select";
import { Checkbox } from "../shared/checkbox";

interface Module {
  _id: string;
  name: string;
  identifier: number;
  description?: string;
}

interface DefaultModuleConfig {
  moduleId: string;
  durationMonths: number;
}

interface ResultsOptions {
  aiAnalysis: boolean;
  employmentData: boolean;
  compareCosts: boolean;
}

interface VocationalModuleOptions {
  instructions: boolean;
  holland: boolean;
  chaside: boolean;
  results: boolean;
  resultsOptions?: ResultsOptions;
}

interface B2CDefaults {
  _id?: string;
  defaultModules: DefaultModuleConfig[];
  vocationalModuleOptions: VocationalModuleOptions;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function B2CDefaultsManagement() {
  const [defaults, setDefaults] = useState<B2CDefaults | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [defaultsData, modulesData] = await Promise.all([
        adminService.getB2CDefaults(),
        adminService.getModules(),
      ]);
      setDefaults(defaultsData || {
        defaultModules: [],
        vocationalModuleOptions: {
          instructions: true,
          holland: true,
          chaside: true,
          results: true,
          resultsOptions: {
            aiAnalysis: true,
            employmentData: true,
            compareCosts: true,
          },
        },
        isActive: true,
      });
      setModules(modulesData || []);
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err.message || "Error al cargar la configuración");
      // Crear configuración por defecto si no existe
      setDefaults({
        defaultModules: [],
        vocationalModuleOptions: {
          instructions: true,
          holland: true,
          chaside: true,
          results: true,
        },
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = () => {
    if (!defaults) return;
    setDefaults({
      ...defaults,
      defaultModules: [
        ...(defaults.defaultModules || []),
        { moduleId: "", durationMonths: 6 },
      ],
    });
  };

  const handleRemoveModule = (index: number) => {
    if (!defaults || !defaults.defaultModules) return;
    setDefaults({
      ...defaults,
      defaultModules: defaults.defaultModules.filter((_, i) => i !== index),
    });
  };

  const handleModuleChange = (index: number, field: keyof DefaultModuleConfig, value: string | number) => {
    if (!defaults || !defaults.defaultModules) return;
    const updated = [...defaults.defaultModules];
    updated[index] = { ...updated[index], [field]: value };
    setDefaults({ ...defaults, defaultModules: updated });
  };

  const handleVocationalOptionChange = (option: keyof VocationalModuleOptions, value: boolean) => {
    if (!defaults) return;
    setDefaults({
      ...defaults,
      vocationalModuleOptions: {
        ...(defaults.vocationalModuleOptions || {
          instructions: true,
          holland: true,
          chaside: true,
          results: true,
        }),
        [option]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!defaults) return;

    // Validar que todos los módulos tengan moduleId
    const hasInvalidModules = (defaults.defaultModules || []).some(
      (m) => !m.moduleId || m.durationMonths <= 0
    );

    if (hasInvalidModules) {
      toast.error("Por favor, complete todos los campos de los módulos");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (defaults._id) {
        await adminService.updateB2CDefaults(defaults);
        toast.success("Configuración actualizada exitosamente");
      } else {
        await adminService.createB2CDefaults(defaults);
        toast.success("Configuración creada exitosamente");
      }

      setSuccess("Configuración guardada exitosamente");
      await loadData();
    } catch (err: any) {
      console.error("Error saving defaults:", err);
      const errorMessage = err.message || "Error al guardar la configuración";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const getModuleName = (moduleId: string) => {
    const module = modules.find((m) => m._id === moduleId);
    return module ? module.name : "Módulo no encontrado";
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configuración B2C</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Define los valores por defecto para usuarios B2C al registrarse
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={loadData} disabled={loading} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </motion.div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {defaults && (
        <div className="grid gap-6">
          {/* Módulos por defecto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Módulos por Defecto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Define qué módulos tendrán acceso los usuarios B2C al registrarse y por cuánto tiempo.
              </p>

              {(defaults.defaultModules || []).map((moduleConfig, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={`module-${index}`}>Módulo</Label>
                    <Select
                      value={moduleConfig.moduleId}
                      onValueChange={(value) =>
                        handleModuleChange(index, "moduleId", value)
                      }
                    >
                      <SelectTrigger id={`module-${index}`} className="w-full">
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

                  <div className="w-full sm:w-32 md:w-48">
                    <Label htmlFor={`duration-${index}`}>Duración (meses)</Label>
                    <Input
                      id={`duration-${index}`}
                      type="number"
                      min="1"
                      value={moduleConfig.durationMonths}
                      onChange={(e) =>
                        handleModuleChange(
                          index,
                          "durationMonths",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveModule(index)}
                    className="text-red-600 hover:text-red-700 self-end sm:self-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}

              <Button
                variant="outline"
                onClick={handleAddModule}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Módulo
              </Button>
            </CardContent>
          </Card>

          {/* Opciones del módulo de Orientación Vocacional */}
          <Card>
            <CardHeader>
              <CardTitle>Opciones del Módulo de Orientación Vocacional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Define qué opciones del módulo de Orientación Vocacional tendrán acceso los usuarios B2C.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="instructions"
                    checked={defaults.vocationalModuleOptions?.instructions ?? true}
                    onCheckedChange={(checked) =>
                      handleVocationalOptionChange("instructions", checked as boolean)
                    }
                  />
                  <Label htmlFor="instructions" className="cursor-pointer">
                    Instrucciones
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="holland"
                    checked={defaults.vocationalModuleOptions?.holland ?? true}
                    onCheckedChange={(checked) =>
                      handleVocationalOptionChange("holland", checked as boolean)
                    }
                  />
                  <Label htmlFor="holland" className="cursor-pointer">
                    Prueba Holland
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="chaside"
                    checked={defaults.vocationalModuleOptions?.chaside ?? true}
                    onCheckedChange={(checked) =>
                      handleVocationalOptionChange("chaside", checked as boolean)
                    }
                  />
                  <Label htmlFor="chaside" className="cursor-pointer">
                    Prueba CHASIDE
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="results"
                    checked={defaults.vocationalModuleOptions?.results ?? true}
                    onCheckedChange={(checked) =>
                      handleVocationalOptionChange("results", checked as boolean)
                    }
                  />
                  <Label htmlFor="results" className="cursor-pointer">
                    Resultados
                  </Label>
                </div>
              </div>

              {/* Opciones dentro de Resultados */}
              {defaults.vocationalModuleOptions?.results && (
                <div className="ml-6 mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Opciones dentro de Resultados:
                  </p>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="aiAnalysis"
                      checked={defaults.vocationalModuleOptions?.resultsOptions?.aiAnalysis ?? true}
                      onCheckedChange={(checked) => {
                        if (!defaults) return;
                        setDefaults({
                          ...defaults,
                          vocationalModuleOptions: {
                            ...(defaults.vocationalModuleOptions || {
                              instructions: true,
                              holland: true,
                              chaside: true,
                              results: true,
                            }),
                            resultsOptions: {
                              ...(defaults.vocationalModuleOptions?.resultsOptions || {
                                aiAnalysis: true,
                                employmentData: true,
                                compareCosts: true,
                              }),
                              aiAnalysis: checked as boolean,
                            },
                          },
                        });
                      }}
                    />
                    <Label htmlFor="aiAnalysis" className="cursor-pointer">
                      Análisis con IA
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="employmentData"
                      checked={defaults.vocationalModuleOptions?.resultsOptions?.employmentData ?? true}
                      onCheckedChange={(checked) => {
                        if (!defaults) return;
                        setDefaults({
                          ...defaults,
                          vocationalModuleOptions: {
                            ...(defaults.vocationalModuleOptions || {
                              instructions: true,
                              holland: true,
                              chaside: true,
                              results: true,
                            }),
                            resultsOptions: {
                              ...(defaults.vocationalModuleOptions?.resultsOptions || {
                                aiAnalysis: true,
                                employmentData: true,
                                compareCosts: true,
                              }),
                              employmentData: checked as boolean,
                            },
                          },
                        });
                      }}
                    />
                    <Label htmlFor="employmentData" className="cursor-pointer">
                      Datos de Empleo
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="compareCosts"
                      checked={defaults.vocationalModuleOptions?.resultsOptions?.compareCosts ?? true}
                      onCheckedChange={(checked) => {
                        if (!defaults) return;
                        setDefaults({
                          ...defaults,
                          vocationalModuleOptions: {
                            ...(defaults.vocationalModuleOptions || {
                              instructions: true,
                              holland: true,
                              chaside: true,
                              results: true,
                            }),
                            resultsOptions: {
                              ...(defaults.vocationalModuleOptions?.resultsOptions || {
                                aiAnalysis: true,
                                employmentData: true,
                                compareCosts: true,
                              }),
                              compareCosts: checked as boolean,
                            },
                          },
                        });
                      }}
                    />
                    <Label htmlFor="compareCosts" className="cursor-pointer">
                      Comparar costos
                    </Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen */}
          {defaults && defaults.defaultModules && defaults.defaultModules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Configuración</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Módulos configurados:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {defaults.defaultModules.map((moduleConfig, index) => (
                      <li key={index}>
                        {getModuleName(moduleConfig.moduleId)} -{" "}
                        {moduleConfig.durationMonths} mes(es)
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

