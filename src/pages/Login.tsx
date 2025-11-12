// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toUiError } from '../api/error';

const Login: React.FC = () => {
  const { signin, user, signout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para alternar visibilidad
  const [topError, setTopError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopError('');
    setFormErrors({});

    if (isLoading) return; // Prevenir múltiples envíos

    setIsLoading(true);

    try {
      if (user) await signout();

      const me = await signin(username, password);
        console.log('role is',me.rol.nombre)

      if (!me.rol) {
        navigate('/unauthorized', { replace: true });
        return;
      }

      switch (me.rol.nombre) {
        case 'Administrador':
          navigate('/administrador', { replace: true });
          break;
        case 'Coordinador':
          navigate('/cordinador', { replace: true });
          break;
        case 'Docente':
          navigate('/docente', { replace: true });
          break;
        default:
          navigate('/sinrol', { replace: true });
      }
    } catch (err) {
      const { message, fields } = toUiError(err);
      setTopError(message);
      if (fields) setFormErrors(fields);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Iniciar Sesión
        </h2>
        {topError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm text-center">
            {topError}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              placeholder="Ingresa tu usuario"
              disabled={isLoading}
            />
            {formErrors.username?.map((m, i) => (
              <p key={i} className="text-red-600 text-xs mt-1">
                {m}
              </p>
            ))}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} // Cambia el tipo basado en showPassword
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 pr-10" // Añade padding a la derecha
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  // Icono de ojo tachado (ocultar)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.988 5.504C5.244 4.316 6.826 3.708 8.683 3.708c2.937 0 5.432 1.956 7.425 4.908M21 12c-2.008 3.012-4.492 4.992-7.391 4.992-1.85 0-3.427-.608-4.673-1.78M3 12h.008M21 12h-.008"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.467 15.698C10.741 16.712 12 17.292 12 17.292s2.544-1.253 4.148-3.006m-7.228-7.228A.75.75 0 0110.5 8.25V9h1.5l2.25 2.25m-4.5-5.25v2.25"
                    />
                  </svg>
                ) : (
                  // Icono de ojo (mostrar)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {formErrors.password?.map((m, i) => (
              <p key={i} className="text-red-600 text-xs mt-1">
                {m}
              </p>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-2.5 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Iniciando sesión.....
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;