// src/pages/ChangePassword.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../app/axiosInstance';
import { toUiError } from '../api/error';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

type FormState = {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
};
export type ChangePasswordPayload = {
  current_password?: string;
  new_password: string;
  confirm_new_password: string;
};

export async function changePassword(userId: number, payload: ChangePasswordPayload): Promise<void> {
  await axiosInstance.post(`/usuarios/${userId}/set-password/`, payload, {
    validateStatus: (s) => s >= 200 && s < 300,
  });
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user: authUser, signout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState<FormState>({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const myId = useMemo(() => authUser?.id ?? null, [authUser]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      const { [e.target.name]: _removed, ...rest } = fieldErrors;
      setFieldErrors(rest);
    }
  };

  const validate = (): string | null => {
    if (!form.current_password || form.current_password.length < 1) {
      return 'Debes ingresar tu contraseña actual.';
    }
    if (!form.new_password || form.new_password.length < 6) {
      return 'La nueva contraseña debe tener al menos 6 caracteres.';
    }
    if (form.new_password === form.current_password) {
      return 'La nueva contraseña no puede ser igual a la actual.';
    }
    if (form.new_password !== form.confirm_new_password) {
      return 'La confirmación no coincide.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const clientError = validate();
    if (clientError) {
      setError(clientError);
      return;
    }
    if (!myId) {
      setError('No se pudo identificar al usuario.');
      return;
    }

    try {
      setLoading(true);
      await changePassword(myId, {
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_new_password: form.confirm_new_password,
      });
      setSuccess('Contraseña actualizada. Vuelve a iniciar sesión.');
      setTimeout(() => {
        signout?.();
        navigate('/login');
      }, 1500);
    } catch (error) {
      const ui = toUiError(error);
      setError(ui.message || 'No se pudo cambiar la contraseña.');
      setFieldErrors(ui.fields ?? {});
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (name: keyof FormState) =>
    fieldErrors?.[name]?.length ? (
      <p className="mt-1 text-sm text-red-600">{fieldErrors[name].join(' ')}</p>
    ) : null;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-xl md:p-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Atrás
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Cambiar Contraseña
          </h1>
        </div>
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-center text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-center text-green-700 bg-green-100 rounded-md">
              {success}
            </div>
          )}
          <div>
            <label
              className="block mb-1 text-sm font-medium text-gray-700"
              htmlFor="current_password"
            >
              Contraseña actual
            </label>
            <div className="relative">
              <input
                id="current_password"
                name="current_password"
                type={showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                className="block w-full px-4 py-2 text-gray-900 transition-colors border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={form.current_password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                aria-label={showCurrent ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                title={showCurrent ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <FontAwesomeIcon icon={showCurrent ? faEyeSlash : faEye} />
              </button>
            </div>
            {renderFieldError('current_password')}
          </div>
          <div>
            <label
              className="block mb-1 text-sm font-medium text-gray-700"
              htmlFor="new_password"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="new_password"
                name="new_password"
                type={showNew ? 'text' : 'password'}
                autoComplete="new-password"
                className="block w-full px-4 py-2 text-gray-900 transition-colors border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={form.new_password}
                onChange={onChange}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                aria-label={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                title={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} />
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres.</p>
            {renderFieldError('new_password')}
          </div>
          <div>
            <label
              className="block mb-1 text-sm font-medium text-gray-700"
              htmlFor="confirm_new_password"
            >
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                id="confirm_new_password"
                name="confirm_new_password"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                className="block w-full px-4 py-2 text-gray-900 transition-colors border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={form.confirm_new_password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                title={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
              </button>
            </div>
            {renderFieldError('confirm_new_password')}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}