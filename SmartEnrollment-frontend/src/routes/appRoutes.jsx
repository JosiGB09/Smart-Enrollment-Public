import { LuHouse, LuUser, LuBarcode, LuGraduationCap, LuUserCheck, LuBook } from "react-icons/lu";
import Home from "../views/home";
import Reports from "../views/reports";

import UsuarioForm from "../views/users/AddUser";
import UsuarioList from "../views/users/ListUser";
import UsuarioEditForm from "../views/users/EditUser";

import EstudianteForm from "../views/students/AddStudent";
import EstudiantesList from "../views/students/ListStudent";
import EstudianteEditForm from "../views/students/EditStudent";

import EncargadosList from "../views/guardian/ListGuardian";
import EncargadoForm from "../views/guardian/AddGuardian";
import EncargadoEditForm from "../views/guardian/EditGuardina";

import AddGrade from "../views/grades/AddGrade";
import ListGrades from "../views/grades/ListGrades";
import EditGrade from "../views/grades/EditGrade";

import ListSections from "../views/sections/ListSections";
import AddSection from "../views/sections/AddSection";
import EditSection from "../views/sections/EditSection";

export const appRoutes = [
  {
    path: "/dashboard",
    element: <Home />,
    label: "Inicio",
    icon: LuHouse,
    showInMenu: true,
    roles: ["ADMINISTRADOR", "DIRECCION", "PROFESOR", "USUARIO"],
  },
  {
    path: "/usuarios",
    element: <UsuarioList />,
    label: "Usuarios",
    icon: LuUser,
    showInMenu: true,
    roles: ["ADMINISTRADOR"],
  },
  {
    path: "/usuarios/agregar",
    element: <UsuarioForm />,
    showInMenu: false,
    roles: ["ADMINISTRADOR"],
  },
  {
    path: "/usuarios/editar/:id",
    element: <UsuarioEditForm />,
    showInMenu: false,
    roles: ["ADMINISTRADOR"],
  },
  {
    path: "/grades",
    element: <ListGrades />,
    label: "Grados",
    icon: LuBook,
    showInMenu: true,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/grades/add",
    element: <AddGrade />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/grades/edit/:id",
    element: <EditGrade />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/grades/:gradoId/sections",
    element: <ListSections />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/grades/:gradoId/sections/add",
    element: <AddSection />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/grades/:gradoId/sections/edit/:id",
    element: <EditSection />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/reportes",
    element: <Reports />,
    label: "Matricula",
    icon: LuBarcode,
    showInMenu: true,
    roles: ["ADMINISTRADOR", "DIRECCION", "PROFESOR"],
  },
  {
    path: "/estudiantes/listar",
    element: <EstudiantesList />,
    label: "Estudiante",
    icon: LuGraduationCap,
    showInMenu: true,
    roles: ["ADMINISTRADOR", "DIRECCION", "PROFESOR"],
  },
  {
    path: "/estudiantes/agregar",
    element: <EstudianteForm />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/estudiantes/editar/:id",
    element: <EstudianteEditForm />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/encargados/listar",
    element: <EncargadosList />,
    label: "Encargado",
    icon: LuUserCheck,
    showInMenu: true,
    roles: ["ADMINISTRADOR", "DIRECCION", "PROFESOR"],
  },
  {
    path: "/encargados/agregar",
    element: <EncargadoForm />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
  {
    path: "/encargados/editar/:id",
    element: <EncargadoEditForm />,
    showInMenu: false,
    roles: ["ADMINISTRADOR", "DIRECCION"],
  },
];