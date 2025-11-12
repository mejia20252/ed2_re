// src/config/menuItems.ts
// Sistema Web para la Asignación de Horarios, Aulas, Materias, Grupos y Asistencia Docente
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { 
  faHome, faUsers, faCogs,  
   faEnvelopeOpenText, 
  faClipboardList, faClipboardCheck, 
  faBullhorn, faSignOutAlt, faUser, faBell, faGear, 
  faShieldAlt, faCalendarAlt, faExclamationTriangle, 
  faTasks, faChalkboardTeacher, faDoorOpen, faBook, 
  faUserGraduate, faClock,  faFileAlt, 
  faChartBar, faFilePdf, faFileExcel, 
   faSchool,  faCalendar, 
  faMapMarkedAlt,faHistory, 
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
  to?: string;
  title: string;
  icon?: IconProp;
  action?: 'signout';
  subItems?: MenuItem[];
}

export const menuItemsByRole: Record<string, MenuItem[]> = {
  Administrador: [
    { 
      to: '/administrador/dashboard', 
      title: 'DASHBOARD', 
      icon: faHome 
    },
    {
      title: 'Módulo Seguridad',
      icon: faShieldAlt,
      subItems: [
        { title: 'Cerrar Sesión', icon: faSignOutAlt, action: 'signout' },
         { to: '/administrador/usuarios', title: 'Gestión de Usuarios', icon: faUsers },
        { to: '/administrador/roles', title: 'Roles', icon: faCogs },
      ],
    },

    {
      title: 'Módulo Gestión Académica',
      icon: faSchool,
      subItems: [
        { to: '/administrador/materias', title: 'Gestión de Materias', icon: faBook },
        { to: '/administrador/grupos', title: 'Gestión de Grupos', icon: faLayerGroup },
        { to: '/administrador/aulas', title: 'Gestión de Aulas', icon: faDoorOpen },
        { to: '/administrador/gestiones', title: 'Períodos Académicos', icon: faCalendarAlt },
        { to: '/administrador/docentes', title: 'Gestion Docentes', icon: faUserGraduate },
        { to: '/administrador/reportes', title: 'Reporte Carga Horaria', icon: faClock },

      ],
    },
  ],

  Docente: [
    { 
      to: '/docente/dashboard', 
      title: 'DASHBOARD', 
      icon: faHome 
    },
    
    {
      title: 'Seguridad',
      icon: faUser,
      subItems: [
        { to: '/docente/perfil', title: 'Datos Personales', icon: faUser },
        { to: '/docente/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
        { title: 'Cerrar Sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
    
    {
      title: 'Mi Carga Horaria',
      icon: faClock,
      subItems: [
        { to: '/docente/mi-horario', title: 'Ver Mi Horario', icon: faCalendar },
        { to: '/docente/mis-materias', title: 'Mis Materias Asignadas', icon: faBook },
        { to: '/docente/mis-grupos', title: 'Mis Grupos', icon: faLayerGroup },
        { to: '/docente/mis-aulas', title: 'Aulas Asignadas', icon: faDoorOpen },
        { to: '/docente/carga-semanal', title: 'Carga Horaria Semanal', icon: faCalendarAlt },
      ],
    },
  ],

  Coordinador: [
    { 
      to: '/coordinador/dashboard', 
      title: 'DASHBOARD', 
      icon: faHome 
    },
    
    {
      title: 'Mi Perfil',
      icon: faUser,
      subItems: [
        { to: '/coordinador/perfil', title: 'Datos Personales', icon: faUser },
        { to: '/coordinador/cambiar-contra', title: 'Cambiar Contraseña', icon: faGear },
        { title: 'Cerrar Sesión', icon: faSignOutAlt, action: 'signout' },
      ],
    },
    
    {
      title: 'Supervisión de Horarios',
      icon: faCalendar,
      subItems: [
        { to: '/coordinador/horarios-carrera', title: 'Horarios de la Carrera', icon: faCalendarAlt },
        { to: '/coordinador/horarios-docentes', title: 'Horarios por Docente', icon: faUserGraduate },
        { to: '/coordinador/horarios-grupos', title: 'Horarios por Grupo', icon: faLayerGroup },
        { to: '/coordinador/aulas-ocupacion', title: 'Ocupación de Aulas', icon: faMapMarkedAlt },
        { to: '/coordinador/validar-conflictos', title: 'Revisar Conflictos', icon: faExclamationTriangle },
      ],
    },
    
    {
      title: 'Supervisión de Asistencia',
      icon: faClipboardCheck,
      subItems: [
        { to: '/coordinador/asistencia-docentes', title: 'Asistencia Docentes', icon: faUserGraduate },
        { to: '/coordinador/asistencia-grupos', title: 'Asistencia por Grupo', icon: faLayerGroup },
        { to: '/coordinador/ausencias', title: 'Registro de Ausencias', icon: faExclamationTriangle },
        { to: '/coordinador/historial-completo', title: 'Historial Completo', icon: faHistory },
      ],
    },
    
    {
      title: 'Gestión Académica',
      icon: faSchool,
      subItems: [
        { to: '/coordinador/docentes-carrera', title: 'Docentes de la Carrera', icon: faChalkboardTeacher },
        { to: '/coordinador/materias-carrera', title: 'Materias de la Carrera', icon: faBook },
        { to: '/coordinador/grupos-carrera', title: 'Grupos de la Carrera', icon: faLayerGroup },
        { to: '/coordinador/carga-horaria', title: 'Revisar Carga Horaria', icon: faClock },
      ],
    },
    
    {
      title: 'Reportes y Estadísticas',
      icon: faChartBar,
      subItems: [
        { to: '/coordinador/reportes/asistencia', title: 'Reporte de Asistencias', icon: faClipboardList },
        { to: '/coordinador/reportes/ausencias', title: 'Reporte de Ausencias', icon: faExclamationTriangle },
        { to: '/coordinador/reportes/carga-horaria', title: 'Reporte Carga Horaria', icon: faClock },
        { to: '/coordinador/estadisticas', title: 'Estadísticas de Carrera', icon: faChartBar },
        { to: '/coordinador/reportes/pdf', title: 'Exportar PDF', icon: faFilePdf },
        { to: '/coordinador/reportes/excel', title: 'Exportar Excel', icon: faFileExcel },
      ],
    },
    
    {
      title: 'Comunicación',
      icon: faBullhorn,
      subItems: [
        { to: '/coordinador/comunicados', title: 'Publicar Comunicados', icon: faEnvelopeOpenText },
        { to: '/coordinador/notificaciones', title: 'Enviar Notificaciones', icon: faBell },
        { to: '/coordinador/avisos-carrera', title: 'Avisos de Carrera', icon: faBullhorn },
      ],
    },
    
    {
      title: 'Gestión y Tareas',
      icon: faTasks,
      subItems: [
        { to: '/coordinador/mis-tareas', title: 'Mis Tareas', icon: faClipboardCheck },
        { to: '/coordinador/calendario', title: 'Calendario Académico', icon: faCalendarAlt },
        { to: '/coordinador/solicitudes', title: 'Solicitudes Pendientes', icon: faFileAlt },
      ],
    },
  ],
};