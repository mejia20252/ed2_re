import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';

interface MateriaFormState {
  nombre: string;
  codigo: string;
  creditos: number;
  hps: number;
}

const MateriaForm: React.FC = () => {
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
    formState: { errors, isSubmitting }
  } = useForm<MateriaFormState>({
    defaultValues: {
      nombre: '',
      codigo: '',
      creditos: 0,
      hps: 0,
    },
  });

  useEffect(() => {
    const loadMateria = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      setTopError('');
      try {
        // CORREGIDO: Se quitó la barra diagonal (/) al final
        const { data } = await axiosInstance.get(`/materias/${id}`);
        reset({
          nombre: data.nombre,
          codigo: data.codigo,
          creditos: data.creditos,
          hps: data.hps,
        });
      } catch (err) {
        const uiError = toUiError(err);
        setTopError(uiError.message || 'No se pudo cargar los datos de la materia.');
        toast.error('Error al cargar la materia');
      } finally {
        setLoading(false);
      }
    };
    loadMateria();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: MateriaFormState) => {
    setTopError('');

    // Validación manual básica
    if (!values.nombre.trim()) {
      setError('nombre', { message: 'El nombre es obligatorio' });
      return;
    }
    if (!values.codigo.trim()) {
      setError('codigo', { message: 'El código es obligatorio' });
      return;
    }
    if (values.creditos < 0) {
      setError('creditos', { message: 'Los créditos no pueden ser negativos' });
      return;
    }
    if (values.hps < 0) {
      setError('hps', { message: 'Las horas por semana no pueden ser negativas' });
      return;
    }

    try {
      if (isEdit && id) {
        // CORREGIDO: Se quitó la barra diagonal (/) al final
        await axiosInstance.put(`/materias/${id}`, values);
        toast.success('Materia actualizada correctamente');
      } else {
        // CORREGIDO: Se quitó la barra diagonal (/) al final
        await axiosInstance.post('/materias', values);
        toast.success('Materia creada correctamente');
      }
      navigate('/administrador/materias');
    } catch (error) {
      const uiError = toUiError(error);
      
      if (uiError.message) {
        setTopError(uiError.message);
      }

      // Manejo de errores de validación del servidor
      if (uiError.fields) {
        Object.keys(uiError.fields).forEach((field) => {
          const message = uiError.fields?.[field];
          setError(field as keyof MateriaFormState, {
            type: 'server',
            message: Array.isArray(message) ? message.join(' ') : String(message),
          });
        });
      }

      toast.error('Error al guardar la materia');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Materia' : 'Nueva Materia'}
          </h2>
          <button
            onClick={() => navigate('/administrador/materias')}
            className="text-gray-500 hover:text-gray-700"
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
          <div className="flex justify-center items-center min-h-[250px] text-gray-600">
            Cargando datos de la materia...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la materia
              </label>
              <input
                id="nombre"
                type="text"
                {...register('nombre', {
                  required: 'El nombre es obligatorio',
                  minLength: { value: 1, message: 'El nombre es obligatorio' }
                })}
                placeholder="Ej. Cálculo I"
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nombre && (
                <p className="mt-2 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* Código */}
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                id="codigo"
                type="text"
                {...register('codigo', {
                  required: 'El código es obligatorio',
                  minLength: { value: 1, message: 'El código es obligatorio' }
                })}
                placeholder="Ej. MAT-101"
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.codigo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.codigo && (
                <p className="mt-2 text-sm text-red-600">{errors.codigo.message}</p>
              )}
            </div>

            {/* Grid para Créditos y HPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Créditos */}
              <div>
                <label htmlFor="creditos" className="block text-sm font-medium text-gray-700 mb-1">
                  Créditos
                </label>
                <input
                  id="creditos"
                  type="number"
                  {...register('creditos', {
                    valueAsNumber: true,
                    required: 'Los créditos son obligatorios',
                    min: { value: 0, message: 'Los créditos no pueden ser negativos' }
                  })}
                  placeholder="Ej. 5"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.creditos ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.creditos && (
                  <p className="mt-2 text-sm text-red-600">{errors.creditos.message}</p>
                )}
              </div>

              {/* HPS (Horas por Semana) */}
              <div>
                <label htmlFor="hps" className="block text-sm font-medium text-gray-700 mb-1">
                  Horas por Semana (HPS)
                </label>
                <input
                  id="hps"
                  type="number"
                  {...register('hps', {
                    valueAsNumber: true,
                    required: 'Las horas por semana son obligatorias',
                    min: { value: 0, message: 'Las horas por semana no pueden ser negativas' }
                  })}
                  placeholder="Ej. 6"
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.hps ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hps && (
                  <p className="mt-2 text-sm text-red-600">{errors.hps.message}</p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/administrador/materias')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  'Guardando...'
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MateriaForm;

