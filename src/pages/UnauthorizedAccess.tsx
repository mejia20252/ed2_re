// src/pages/UnauthorizedAccess.tsx

import React, { useEffect } from 'react'; // Importa useEffect
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedAccess: React.FC = () => {
  const navigate = useNavigate();
  const { signout, user } = useAuth(); // Obtén el estado del usuario del contexto

  const handleSignout = async () => {
    await signout();
  };

  // Observa el estado del usuario
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="text-center max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Acceso denegado</h1>
        <p className="text-gray-600 mb-6">
          Tu cuenta fue creada, pero aún no tienes un rol asignado.
          Por favor, contacta al administrador para que te asigne un rol.
        </p>

        <button
          onClick={handleSignout}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
           Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;