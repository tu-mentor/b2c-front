
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, User } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LogoSvg from "../../assets/logo.svg";
import { schoolService } from "../../services/school-service";
import { suscriptionService } from "../../services/suscription-service";
import { userService } from "../../services/user-service";
import type { ChildModel, UserModel } from "../../types/auth-types";
import type { School } from "../../types/school-types";
import type { CompanySuscriptionResponse } from "../../types/suscriptions";
import AnimatedAlert, { type AlertType } from "../shared/animated-alert";
import { Button } from "../shared/button";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/card";
import { Checkbox } from "../shared/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../shared/dialog";
import { Input } from "../shared/input";
import { Label } from "../shared/label";
import { Progress } from "../shared/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shared/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shared/tabs";

// Componente para agregar/editar un hijo
interface ChildEditFormProps {
  child: {id: string, childName: string, gender: string, school: string, schoolName: string};
  onSave: (childData: {childName: string, gender: string, school: string, schoolName: string}) => void;
  onCancel: () => void;
  schools: School[];
  sexOptions: {id: string, name: string}[];
}

function ChildEditForm({ child, onSave, onCancel, schools, sexOptions }: ChildEditFormProps) {
  const [childData, setChildData] = useState({
    childName: child.childName,
    gender: child.gender,
    school: child.school,
    schoolName: child.schoolName
  });
  const [filteredSchools, setFilteredSchools] = useState<School[]>(schools);
  const [isSchoolSelectOpen, setIsSchoolSelectOpen] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSchoolSearch = (searchTerm: string) => {
    const filtered = schools.filter((school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
    setIsSchoolSelectOpen(true);
  };

  const handleSchoolSelect = (schoolId: string, schoolName: string) => {
    setChildData(prev => ({ ...prev, school: schoolId, schoolName }));
    setIsSchoolSelectOpen(false);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!childData.childName.trim()) {
      newErrors.childName = "El nombre es requerido";
    } else if (childData.childName.trim().length < 2) {
      newErrors.childName = "El nombre debe tener al menos 2 caracteres";
    }
    
    if (!childData.gender) {
      newErrors.gender = "El género es requerido";
    }
    
    if (!childData.school) {
      newErrors.school = "El colegio es requerido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(childData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
            Nombre del hijo o hija (Requerido)
          </Label>
          <Input
            placeholder="Nombre del hijo o hija"
            value={childData.childName}
            onChange={(e) => setChildData(prev => ({ ...prev, childName: e.target.value }))}
            className={`bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
              errors.childName 
                ? "border-red-500 focus:border-red-500" 
                : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            }`}
          />
          {errors.childName && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
              {errors.childName}
            </p>
          )}
        </div>
        <div className="w-1/3">
          <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
            Género (Requerido)
          </Label>
          <Select
            value={childData.gender}
            onValueChange={(value) => setChildData(prev => ({ ...prev, gender: value }))}
          >
            <SelectTrigger className={`bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
              errors.gender 
                ? "border-red-500 focus:border-red-500" 
                : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            }`}>
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
              {sexOptions.map((option) => (
                <SelectItem key={option.id} value={option.id} className="hover:bg-blue-50 dark:hover:bg-gray-700">
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
              {errors.gender}
            </p>
          )}
        </div>
      </div>
      
      <div>
        <Label className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
          Colegio/Institución (Requerido)
        </Label>
        <div className="relative">
          <Input
            placeholder="Buscar colegio"
            value={childData.schoolName}
            onChange={(e) => {
              handleSchoolSearch(e.target.value);
              setChildData(prev => ({ ...prev, schoolName: e.target.value }));
            }}
            onClick={() => setIsSchoolSelectOpen(true)}
            className={`bg-white/80 dark:bg-gray-800/80 border-2 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
              errors.school 
                ? "border-red-500 focus:border-red-500" 
                : "border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            }`}
          />
          {isSchoolSelectOpen && filteredSchools.length > 0 && (
            <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 mt-1 max-h-60 overflow-auto rounded-xl shadow-lg">
              {filteredSchools.map((school) => (
                <li
                  key={school._id}
                  className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  onClick={() => handleSchoolSelect(school._id, school.name)}
                >
                  {school.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.school && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
            {errors.school}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}

type RegisterFormProps = {
  onFlip: () => void;
};

const countryCodes = [
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+51", country: "Perú", flag: "🇵🇪" },
];

const sexOptions = [
  { id: "0", name: "Femenino" },
  { id: "1", name: "Masculino" },
];

const educationLevels = [
  { id: "5", name: "Prefiero no informar" },
  { id: "1", name: "Básica primaria" },
  { id: "2", name: "Secundaria" },
  { id: "3", name: "Pregrado" },
  { id: "4", name: "Postgrado/Maestria" },
];

export default function RegisterForm({ onFlip }: RegisterFormProps): React.ReactElement {
  const { companyId } = useParams<{ companyId?: string }>();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    trigger,
    setValue,
    setError,
    clearErrors,
  } = useForm<UserModel>({
    mode: "onChange",
    defaultValues: {
      numberOfChildren: 1,
      children: [{ school: "", childName: "", gender: "" }],
      countryCode: "+57",
    },
  });

  const navigate = useNavigate();
  const [progress, setProgress] = useState<number>(0);
  const [childrenList, setChildrenList] = useState<Array<{id: string, childName: string, gender: string, school: string, schoolName: string}>>([]);
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [showAddChildModal, setShowAddChildModal] = useState<boolean>(false);
  const [showEditChildModal, setShowEditChildModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("parent");
  const [showTermsDialog, setShowTermsDialog] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: AlertType } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
  const [selectedSchoolNames, setSelectedSchoolNames] = useState<string[]>([]);
  const watchAllFields = watch();
  const numberOfChildren = watch("numberOfChildren");

  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchoolsByChild, setFilteredSchoolsByChild] = useState<Record<number, School[]>>(
    {}
  );
  const [isSchoolSelectOpen, setIsSchoolSelectOpen] = useState<boolean>(false);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [isRegisterButtonEnabled, setIsRegisterButtonEnabled] = useState(false);
  const [apiError, setApiError] = useState<{ field: string; message: string } | null>(null);

  useEffect(() => {
    const validateUuidAndCheckSubscription = async () => {
      if (companyId === undefined || companyId === "") {
        setIsFormDisabled(false);
      } else if (/^[0-9a-f]{24}$/.test(companyId)) { 
        let response: CompanySuscriptionResponse;
        try {
          response = await suscriptionService.getCompanySuscription(companyId);
          if (response.success) {
            setIsFormDisabled(false);
          } else {
            setAlertInfo({
              message: response.message,
              type: "error",
            });
            setIsFormDisabled(true);
          }
        } catch (error) {
          setAlertInfo({
            message:
              "Error al verificar la suscripción de la empresa. Por favor, inténtelo de nuevo más tarde.",
            type: "error",
          });
          setIsFormDisabled(true);
        }
      } else {
        setAlertInfo({
          message:
            "El link de registro no es válido, por favor comuníquese con quien se lo proporcionó",
          type: "error",
        });
        setIsFormDisabled(true);
      }
    };

    validateUuidAndCheckSubscription();
  }, [companyId]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolsData = await schoolService.getAllSchools();
        if (Array.isArray(schoolsData) && schoolsData.length > 0) {
          setSchools(schoolsData);

          // Initialize filtered schools for each child
          const initialFilteredSchools: Record<number, School[]> = {};
          for (let i = 0; i < numberOfChildren; i++) {
            initialFilteredSchools[i] = schoolsData;
          }
          setFilteredSchoolsByChild(initialFilteredSchools);
        } else {
          console.error("La respuesta de getAllSchools no es un array o está vacía:", schoolsData);
          setAlertInfo({
            message: "Error al cargar la lista de colegios. Por favor, intente de nuevo más tarde.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        setAlertInfo({
          message: "Error al cargar la lista de colegios. Por favor, intente de nuevo más tarde.",
          type: "error",
        });
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    type ParentFields = "firstName" | "lastName" | "whatsapp" | "countryCode" | "educationLevel";
    type OptionalFields = "email";
    type ChildFields = "school" | "childName" | "gender";

    const parentFields: ParentFields[] = [
      "firstName",
      "lastName",
      "whatsapp",
      "countryCode",
      "educationLevel",
    ];
    const optionalFields: OptionalFields[] = ["email"];
    const childFields: ChildFields[] = ["school", "childName", "gender"];

    const filledParentFields = parentFields.filter(
      (field): field is ParentFields => field in watchAllFields && !!watchAllFields[field]
    ).length;

    const filledOptionalFields = optionalFields.filter(
      (field): field is OptionalFields => field in watchAllFields && !!watchAllFields[field]
    ).length;

    const filledChildFields = watchAllFields.children.reduce((acc, child) => {
      return (
        acc +
        childFields.filter(
          (field): field is ChildFields => field in child && !!(child as ChildModel)[field]
        ).length
      );
    }, 0);

    const totalFields = parentFields.length + numberOfChildren * childFields.length + 1;
    const filledFields =
      filledParentFields +
      filledChildFields +
      filledOptionalFields +
      (watchAllFields.acceptTerms ? 1 : 0);

    setProgress((filledFields / totalFields) * 100);
  }, [watchAllFields, numberOfChildren]);

  // Función para agregar un nuevo hijo
  const addChild = () => {
    setShowAddChildModal(true);
  };

  // Función para guardar un nuevo hijo
  const saveNewChild = (childData: {childName: string, gender: string, school: string, schoolName: string}) => {
    const newChild = {
      id: Date.now().toString(),
      ...childData
    };
    setChildrenList([...childrenList, newChild]);
    setShowAddChildModal(false);
  };

  // Función para editar un hijo
  const editChild = (childId: string) => {
    setEditingChild(childId);
    setShowEditChildModal(true);
  };

  // Función para eliminar un hijo
  const removeChild = (childId: string) => {
    setChildrenList(childrenList.filter(child => child.id !== childId));
    if (editingChild === childId) {
      setEditingChild(null);
    }
  };

  // Función para guardar los datos de un hijo
  const saveChild = (childId: string, childData: {childName: string, gender: string, school: string, schoolName: string}) => {
    setChildrenList(childrenList.map(child => 
      child.id === childId ? { ...child, ...childData } : child
    ));
    setEditingChild(null);
    setShowEditChildModal(false);
  };

  // Función para cancelar la edición
  const cancelEdit = () => {
    setEditingChild(null);
    setShowEditChildModal(false);
  };

  useEffect(() => {
    setIsRegisterButtonEnabled(areAllChildrenComplete() && watchAllFields.acceptTerms);
    setApiError(null);
  }, [childrenList, watchAllFields.acceptTerms, activeTab]);

  const handleSchoolSearch = (searchTerm: string) => {
    const filtered = schools.filter((school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchoolsByChild((prev) => ({
      ...prev,
      [editingChild || '']: filtered,
    }));
    setIsSchoolSelectOpen(true);
  };

  const handleSchoolSelect = (schoolId: string, schoolName: string) => {
    if (editingChild) {
      const child = childrenList.find(c => c.id === editingChild);
      if (child) {
        saveChild(editingChild, {
          ...child,
          school: schoolId,
          schoolName: schoolName
        });
      }
    }
    setSelectedSchools([...selectedSchools, schoolId]);
    setIsSchoolSelectOpen(false);
  };

  const handleClearSchool = () => {
    if (editingChild) {
      const child = childrenList.find(c => c.id === editingChild);
      if (child) {
        saveChild(editingChild, {
          ...child,
          school: "",
          schoolName: ""
        });
      }
    }
  };

  const onSubmit = async (data: UserModel): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);
    setShowErrors(false);
    setApiError(null);
    try {
      data.companyId = companyId || "";
      // Convertir childrenList al formato esperado por la API
      data.children = childrenList.map(child => ({
        childName: child.childName,
        gender: child.gender,
        school: child.school
      })) as any; // Usar any temporalmente para evitar conflictos de tipos
      data.numberOfChildren = childrenList.length;
      
      const registerResult = await userService.createUser(data);
      if (registerResult.id) {
        setAlertInfo({
          message:
            "Registro exitoso. Por favor, revise su WhatsApp para obtener la clave temporal de acceso.",
          type: "success",
        });
        setTimeout(() => {
          onFlip();
        }, 3000);
      }
    } catch (error: any) {
      if (error.message) {
        const errorMessage = error.message;
        if (errorMessage.includes("Whatsapp")) {
          setApiError({ field: "whatsapp", message: errorMessage });
          setActiveTab("parent");
        } else if (errorMessage.includes("Email")) {
          setApiError({ field: "email", message: errorMessage });
          setActiveTab("parent");
        }
        setAlertInfo({
          message: errorMessage,
          type: "error",
        });
      } else {
        setAlertInfo({
          message: error.message,
          type: "error",
        });
      }
      setShowErrors(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async (): Promise<void> => {
    setShowErrors(true);
    const isFirstNameValid = watchAllFields.firstName.length >= 2;
    const isLastNameValid = watchAllFields.lastName.length >= 5;
    const isWhatsAppValid = /^[3]\d{9}$/.test(watchAllFields.whatsapp);

    if (!isFirstNameValid) {
      setError("firstName", {
        type: "manual",
        message: "El nombre debe tener al menos 2 caracteres",
      });
    } else {
      clearErrors("firstName");
    }

    if (!isLastNameValid) {
      setError("lastName", {
        type: "manual",
        message: "El apellido debe tener al menos 5 caracteres",
      });
    } else {
      clearErrors("lastName");
    }

    if (!isWhatsAppValid) {
      setError("whatsapp", {
        type: "manual",
        message: "Debe ser un número de 10 dígitos e iniciar con el número 3",
      });
    } else {
      clearErrors("whatsapp");
    }

    if (isParentDataComplete() && isFirstNameValid && isLastNameValid && isWhatsAppValid) {
      setActiveTab("child");
    } else {
      setAlertInfo({
        message:
          "Por favor, complete correctamente todos los datos del padre/madre antes de continuar.",
        type: "error",
      });
    }
  };

  const handleRegister = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    setShowErrors(true);
    setAlertInfo(null);
    
    // Verificar si se aceptaron los términos
    if (!watchAllFields.acceptTerms) {
      setAlertInfo({
        message: "Debes aceptar los términos y condiciones antes de crear tu cuenta.",
        type: "error",
      });
      return;
    }
    
    // Verificar si hay al menos un hijo
    if (childrenList.length === 0) {
      setAlertInfo({
        message: "Debes agregar al menos un hijo antes de crear tu cuenta.",
        type: "error",
      });
      return;
    }
    
    // Verificar si todos los hijos están completos
    if (!areAllChildrenComplete()) {
      setAlertInfo({
        message: "Todos los hijos deben tener sus datos completos antes de crear tu cuenta.",
        type: "error",
      });
      return;
    }
    
    const isValid = await trigger();
    if (isValid) {
      await onSubmit(watchAllFields);
    }
  };

  const isParentDataComplete = (): boolean => {
    const { firstName, lastName, whatsapp, educationLevel } = watchAllFields;
    return !!firstName && !!lastName && !!whatsapp && !!educationLevel;
  };

  const isChildComplete = (child: {childName: string, gender: string, school: string}): boolean => {
    return !!child.childName && !!child.gender && !!child.school;
  };

  const areAllChildrenComplete = () => {
    return childrenList.length > 0 && childrenList.every(isChildComplete);
  };

  // Función para obtener el icono según el género
  const getGenderIcon = () => {
    return <User className="h-3 w-3 text-white" />;
  };

  // Función para truncar el nombre del colegio
  const truncateSchoolName = (schoolName: string, maxLength: number = 25) => {
    if (!schoolName) return "Sin colegio";
    if (schoolName.length <= maxLength) return schoolName;
    return schoolName.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-4">
      {/* Alertas fuera del formulario */}
      {alertInfo && (
        <div className="w-full max-w-2xl mx-auto relative z-50">
          <AnimatedAlert
            message={alertInfo.message}
            type={alertInfo.type}
            onClose={() => setAlertInfo(null)}
            duration={5000}
          />
        </div>
      )}
      
      <Card className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="pb-6 pt-8 text-center">
          <CardTitle className="text-3xl font-bold">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Crear Cuenta
              </span>
              <div className="mt-4">
                <img src={LogoSvg || "/placeholder.svg"} alt="Logo" className="w-48" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      <CardContent className="pl-6 pr-6 relative max-h-[85vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Progreso del registro
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${progress}%`,
                borderRadius: '9999px' 
              }}
            />
          </div>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <fieldset disabled={isFormDisabled}>
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                if (value === "child" && !isParentDataComplete()) {
                  setAlertInfo({
                    message:
                      "Por favor, complete todos los datos del padre/madre antes de continuar.",
                    type: "error",
                  });
                } else {
                  setActiveTab(value);
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <TabsTrigger 
                  value="parent"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-lg transition-all duration-300"
                >
                  Datos del Padre o Madre
                </TabsTrigger>
                <TabsTrigger 
                  value="child" 
                  disabled={!isParentDataComplete()}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  Datos del hijo
                </TabsTrigger>
              </TabsList>
              <TabsContent value="parent">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex space-x-4">
                    <motion.div 
                      className="flex-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Nombre (Requerido)
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Ingrese su nombre"
                        {...register("firstName", {
                          required: "Este campo es requerido",
                        })}
                        className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                          errors.firstName && showErrors ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.firstName && showErrors && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                          {errors.firstName.message}
                        </motion.p>
                      )}
                    </motion.div>
                    <motion.div 
                      className="flex-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                        Apellido (Requerido)
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Ingrese su apellido"
                        {...register("lastName", {
                          required: "Este campo es requerido",
                        })}
                        className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                          errors.lastName && showErrors ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                      {errors.lastName && showErrors && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                          {errors.lastName.message}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Label htmlFor="whatsapp" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      WhatsApp (Requerido)
                    </Label>
                    <div className="flex mb-2">
                      <Controller
                        name="countryCode"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value} disabled>
                            <SelectTrigger className="w-[120px] mr-2 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                              <SelectValue placeholder="Código" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code} className="hover:bg-blue-50 dark:hover:bg-gray-700">
                                  {country.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        id="whatsapp"
                        type="tel"
                        inputMode="numeric"
                        {...register("whatsapp", {
                          required: "WhatsApp es requerido",
                        })}
                        onKeyPress={(e) => {
                          const isNumber = /[0-9]/.test(e.key);
                          if (!isNumber) {
                            e.preventDefault();
                          }
                        }}
                        className={`flex-1 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                          errors.whatsapp || apiError?.field === "whatsapp" ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        placeholder="Número de WhatsApp"
                      />
                    </div>
                    {(errors.whatsapp || apiError?.field === "whatsapp") && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                        {errors.whatsapp?.message || apiError?.message}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      Email (opcional)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@ejemplo.com"
                      {...register("email", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Dirección de correo inválida",
                        },
                      })}
                      className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                        errors.email || apiError?.field === "email" ? "border-red-500 focus:border-red-500" : ""
                      }`}
                    />
                    {(errors.email || apiError?.field === "email") && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                        {errors.email?.message || apiError?.message}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <Label htmlFor="educationLevel" className="text-gray-700 dark:text-gray-300 font-semibold mb-2 block">
                      Nivel de Escolaridad (Requerido)
                    </Label>
                    <Controller
                      name="educationLevel"
                      control={control}
                      rules={{ required: "Este campo es requerido" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                          <SelectTrigger
                            className={`bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${
                              errors.educationLevel && showErrors ? "border-red-500 focus:border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Seleccione nivel" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
                            {educationLevels.map((level) => (
                              <SelectItem key={level.id} value={level.id} className="hover:bg-blue-50 dark:hover:bg-gray-700">
                                {level.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.educationLevel && showErrors && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                        {errors.educationLevel.message}
                      </motion.p>
                    )}
                  </motion.div>
                  <Button
                    onClick={handleContinue}
                    className="w-full"
                    disabled={!isParentDataComplete()}
                  >
                    Continuar
                  </Button>
                </motion.div>
              </TabsContent>
              <TabsContent value="child">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {/* Mensaje informativo y botón - solo se muestra si no hay hijos */}
                  {childrenList.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-center"
                    >
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border-2 border-blue-200 dark:border-gray-600 mb-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                              Datos de los Hijos
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Debes agregar al menos un hijo para crear tu cuenta
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={addChild}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <User className="mr-2 h-5 w-5" />
                        Agregar Hijo
                      </Button>
                    </motion.div>
                  )}

                  {/* Información de hijos agregados */}
                  {childrenList.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                          Hijos Agregados ({childrenList.length})
                        </h3>
                        <Button
                          onClick={addChild}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors duration-300"
                        >
                          <User className="mr-1 h-4 w-4" />
                          Agregar Otro
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {childrenList.map((child) => (
                          <div key={child.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className={`p-1.5 rounded-md flex-shrink-0 ${
                                  child.gender === "0" 
                                    ? "bg-pink-500" 
                                    : child.gender === "1" 
                                      ? "bg-blue-500" 
                                      : "bg-gray-500"
                                }`}>
                                  {getGenderIcon()}
                                </div>
                                <div className="min-w-0 flex-1 overflow-hidden">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                                      {child.childName || "Sin nombre"}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                      {child.gender === "0" ? "F" : child.gender === "1" ? "M" : "N/A"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={child.schoolName || "Sin colegio"}>
                                    {truncateSchoolName(child.schoolName)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                                <Button
                                  onClick={() => editChild(child.id)}
                                  size="sm"
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors duration-300"
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => removeChild(child.id)}
                                  size="sm"
                                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors duration-300"
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}


                  <div className="flex items-center space-x-2">
                    <Controller
                      name="acceptTerms"
                      control={control}
                      rules={{ required: "Debes aceptar los términos y condiciones" }}
                      render={({ field }) => (
                        <Checkbox
                          id="acceptTerms"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              setShowTermsDialog(true);
                            }
                          }}
                        />
                      )}
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      Acepto los términos y condiciones
                    </Label>
                  </div>
                  {errors.acceptTerms && showErrors && (
                    <p className="text-red-500 text-sm mt-1">{errors.acceptTerms.message}</p>
                  )}
                  <div>
                    <Button
                      onClick={handleRegister}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isRegisterButtonEnabled || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>Crear Cuenta</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </fieldset>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <button 
            onClick={onFlip} 
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
          >
            Inicia sesión aquí
          </button>
        </p>
      </CardContent>
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Términos y Condiciones
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Yo, {watchAllFields.firstName} {watchAllFields.lastName}, con correo electrónico{" "}
              {watchAllFields.email || "no proporcionado"} y número de WhatsApp{" "}
              {watchAllFields.countryCode}
              {watchAllFields.whatsapp}, acepto los{" "}
              <a
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-300 hover:underline"
                href="https://www.tu-mentor.com/soluciones/pol%C3%ADtica/"
                target="_blank"
                rel="noreferrer"
              >
                términos y condiciones (click aquí para leerlos en detalle)
              </a>{" "}
              para el uso de este servicio.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowTermsDialog(false)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl"
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para agregar hijo */}
      <Dialog open={showAddChildModal} onOpenChange={setShowAddChildModal}>
        <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 rounded-2xl shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Agregar Nuevo Hijo
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ChildEditForm 
              child={{id: "", childName: "", gender: "", school: "", schoolName: ""}}
              onSave={saveNewChild}
              onCancel={() => setShowAddChildModal(false)}
              schools={schools}
              sexOptions={sexOptions}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal para editar hijo */}
      <Dialog open={showEditChildModal} onOpenChange={setShowEditChildModal}>
        <DialogContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 rounded-2xl shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Editar Hijo
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {editingChild && (
              <ChildEditForm 
                child={childrenList.find(c => c.id === editingChild)!}
                onSave={(childData) => saveChild(editingChild, childData)}
                onCancel={() => setShowEditChildModal(false)}
                schools={schools}
                sexOptions={sexOptions}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
    </div>
  );
}
