// src/routes/AdminRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import ChangePassword from '../pages/CambiarContras';
import VerMisHorarios from '../pages/Docente/Horario/VerMisHorarios.tsx';
import Perfil from '../pages/Perfil.tsx';
const AdminRoutes: React.FC = () => (
    <ProtectedRoute requiredRoles={["Docente"]}>
        <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* RUTA DEL DASHBOARD */}
            <Route path='/cambiar-contra' element={<ChangePassword />} />
            <Route path='/mi-horario' element={<VerMisHorarios />} />
            <Route path='/perfil' element={<Perfil />} />

         

        </Routes>
    </ProtectedRoute>
);

export default AdminRoutes;