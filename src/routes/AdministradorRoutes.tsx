// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AulaForm from '../pages/Administrador/Aula/AulaForm.tsx';
import AulaList from '../pages/Administrador/Aula/AulaList.tsx';
import MateriaForm from '../pages/Administrador/Materia/MateriaForm.tsx';
import MateriaList from '../pages/Administrador/Materia/MateriaList.tsx';
import RolList from '../pages/Administrador/Rol/RolList.tsx';
import RolForm from '../pages/Administrador/Rol/RolForm.tsx';
import UserForm from '../pages/Administrador/User/UserForm.tsx';
import UserList from '../pages/Administrador/User/UserList.tsx';

import GestionForm from '../pages/Administrador/Gestion/GestionForm';

import GestionList from '../pages/Administrador/Gestion/GestionList.tsx';

import DocenteForm from '../pages/Administrador/Docente/DocenteForm.tsx';
import DocenteList from '../pages/Administrador/Docente/DocenteList.tsx';


import GrupoList from '../pages/Administrador/Grupo/GrupoList.tsx';
import GrupoForm from '../pages/Administrador/Grupo/GrupoForm.tsx';




import CargaHorariaForm from '../pages/Administrador/CargaHoraria/CargaHorariaForm.tsx';
import CargaHorariaList from '../pages/Administrador/CargaHoraria/CargaHorariaList.tsx';
import Reportes from '../pages/Administrador/Reporte/Reportes.tsx';


import ChangePassword from '../pages/CambiarContras';
import Perfil from '../pages/Perfil.tsx';
const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Administrador"]}>
        <Routes>
            
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}

            <Route path='/cambiar-contra' element={<ChangePassword />} />

            <Route path='/reportes' element={<Reportes />} />
            <Route path='/perfil' element={<Perfil />} />

            <Route path='/aulas' element={<AulaList />} />
            <Route path='/aulas/new' element={<AulaForm />} />
            <Route path='/aulas/:id/editar' element={<AulaForm />} />


            <Route path='/materias' element={<MateriaList />} />
            <Route path='/materias/new' element={<MateriaForm />} />
            <Route path='/materias/:id/editar' element={<MateriaForm />} />

            <Route path='/roles' element={<RolList />} />
            <Route path='/roles/new' element={<RolForm />} />
            <Route path='/roles/:id/edit' element={<RolForm />} />

            <Route path='/usuarios' element={<UserList />} />
            <Route path='/usuarios/new' element={<UserForm />} />
            <Route path='/usuarios/:id/edit' element={<UserForm />} />

            <Route path='/gestiones' element={<GestionList />} />
            <Route path='/gestiones/new' element={<GestionForm />} />
            <Route path='/gestiones/:id/edit' element={<GestionForm />} />

            <Route path='/docentes' element={<DocenteList />} />
            <Route path='/docentes/new' element={<DocenteForm />} />
            <Route path='/docentes/:id/edit' element={<DocenteForm />} />


            <Route path='/carga_horarias' element={<CargaHorariaList />} />
            <Route path='/carga_horarias/new' element={<CargaHorariaForm />} />
            <Route path='/carga_horarias/:id/edit' element={<CargaHorariaForm />} />
            
            <Route path='/grupos' element={<GrupoList />} />
            <Route path='/grupos/new' element={<GrupoForm />} />
            <Route path='/grupos/:id/edit' element={<GrupoForm />} />

        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;