import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema, type FormState } from '../../../schemas/role';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

type ApiRol = { id: number | string; nombre: string };

const RolesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty, },
  } = useForm<FormState>({
    resolver: zodResolver(roleSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { nombre: '' },
  });

  useEffect(() => {
    const loadRol = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get<ApiRol>(`/roles/${id}/`);
        reset({ nombre: data?.nombre ?? '' });
      } catch (err) {
        setTopError('No se pudo cargar el rol.');
      } finally {
        setLoading(false);
      }
    };
    loadRol();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: FormState) => {
    setTopError('');
    try {
      if (isEdit && id) {
        await axiosInstance.patch(`/roles/${id}/`, values);
      } else {
        await axiosInstance.post(`/roles/`, values);
      }
      navigate('/administrador/roles');
    } catch (error) {
      const ui = toUiError(error);
      if (ui.message) setTopError(ui.message);

      if (ui.fields) {
        (Object.keys(ui.fields) as (keyof FormState)[]).forEach((field) => {
          const msgs = ui.fields?.[field as string];
          const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs ?? '');
          if (field in values) {
            setError(field, { type: 'server', message });
          } else {
            if (message) setTopError((prev) => (prev ? `${prev} ${message}` : message));
          }
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Rol' : 'Nuevo Rol'}</h2>
          <button
            onClick={() => navigate('/administrador/roles')}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Volver a la lista de roles"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {topError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
            {topError}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <p className="text-gray-600">Cargando datos…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                {...register('nombre')}
                placeholder="Ej. Administrador"
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'nombre-err' : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nombre && (
                <p id="nombre-err" className="mt-2 text-sm text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/administrador/roles')}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors duration-200 ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>
            {isDirty && (
              <p className="text-sm text-center text-gray-500 mt-4">Tienes cambios sin guardar.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default RolesForm;