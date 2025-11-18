// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import ChangePassword from '../pages/CambiarContras';
import VerMisHorarios from '../pages/Docente/Horario/VerMisHorarios.tsx';
import Aula from '../pages/Docente/Aula/Aula.tsx';
import Comunicado from '../pages/Docente/Comunicado/Comunicado.tsx';

import LicenciaForm from '../pages/Docente/Licencia/LicenciaForm.tsx';
import LicenciaList from '../pages/Docente/Licencia/LicenciaList.tsx';

import Perfil from '../pages/Perfil.tsx';
const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Docente"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}
            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/mi-horario' element={<VerMisHorarios />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/aulas' element={<Aula />} />
            <Route path='/comunicados' element={<Comunicado />} />


            <Route path='/licencias' element={<LicenciaList />} />
            <Route path='/licencias/new' element={<LicenciaForm />} />
            <Route path='/licencias/:id/edit' element={<LicenciaForm />} />



        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;