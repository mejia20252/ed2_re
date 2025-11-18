// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';

import AulaForm from '../pages/Coordinador/Aula/AulaForm.tsx';
import AulaList from '../pages/Coordinador/Aula/AulaList.tsx';
import MateriaForm from '../pages/Coordinador/Materia/MateriaForm.tsx';
import MateriaList from '../pages/Coordinador/Materia/MateriaList.tsx';

import UserForm from '../pages/Coordinador/User/UserForm.tsx';
import UserList from '../pages/Coordinador/User/UserList.tsx';

import GestionForm from '../pages/Coordinador/Gestion/GestionForm';

import GestionList from '../pages/Coordinador/Gestion/GestionList.tsx';

import DocenteForm from '../pages/Coordinador/Docente/DocenteForm.tsx';
import DocenteList from '../pages/Coordinador/Docente/DocenteList.tsx';

import LicenciaForm from '../pages/Coordinador/Licencia/LicenciaForm.tsx';
import LicenciaList from '../pages/Coordinador/Licencia/LicenciaList.tsx';

import ComunicadoList from '../pages/Coordinador/Comunicado/ComunicadoList.tsx';

import ComunicadoForm from '../pages/Coordinador/Comunicado/ComunicadoForm.tsx';



import CargaHorariaForm from '../pages/Coordinador/CargaHoraria/CargaHorariaForm.tsx';
import CargaHorariaList from '../pages/Coordinador/CargaHoraria/CargaHorariaList.tsx';
import Reportes from '../pages/Coordinador/Reporte/Reportes.tsx';


import ChangePassword from '../pages/CambiarContras';
import Perfil from '../pages/Perfil.tsx';
const CoordinadorRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Coordinador"]}>
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

            
            <Route path='/comunicados' element={<ComunicadoList />} />
            <Route path='/comunicados/new' element={<ComunicadoForm />} />
            <Route path='/comunicados/:id/edit' element={<ComunicadoForm />} />
            
            <Route path='/licencias' element={<LicenciaList />} />
            <Route path='/licencias/new' element={<LicenciaForm />} />
            <Route path='/licencias/:id/edit' element={<LicenciaForm />} />


        </Routes>
    </ProtectedRoute>
);
export default CoordinadorRoutes;
