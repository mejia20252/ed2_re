import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { aulaSchema, type AulaFormState } from '../../../schemas/schema-aula';
import { toUiError } from '../../../api/error';
import axiosInstance from '../../../app/axiosInstance';

const AulaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = useMemo(() => Boolean(id), [id]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<AulaFormState>({
    resolver: zodResolver(aulaSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: { nombre: '', capacidad: 0, ubicacion: '', estado: 'Disponible' ,codigo: ''},
  });

  useEffect(() => {
    const loadAula = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/aulas/${id}/`);
        reset({
          nombre: data.nombre,
          capacidad: data.capacidad,
          ubicacion: data.ubicacion,
          estado: data.estado,
          codigo: data.codigo,
        });
      } catch (err) {
        setTopError('No se pudo cargar los datos del aula.');
      } finally {
        setLoading(false);
      }
    };
    loadAula();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: AulaFormState) => {
    setTopError('');
    console.log('lo que se eesta nviand a labad ede datos ', values);

    try {
      if (isEdit && id) {
        await axiosInstance.put(`/aulas/${id}/`, values);
      } else {
        await axiosInstance.post('/aulas/', values);
      }
      navigate('/administrador/aulas');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.message) setTopError(uiError.message);
      if (uiError.fields) {
        Object.keys(uiError.fields).forEach((field) => {
          const message = uiError.fields?.[field];
          setError(field as keyof AulaFormState, {
            type: 'server',
            message: Array.isArray(message) ? message.join(' ') : String(message),
          });
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Aula' : 'Nuevo Aula'}</h2>
          <button onClick={() => navigate('/administrador/aulas')} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {topError && <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">{topError}</div>}

        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">Cargando datos...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}

            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del aula</label>
              <input
                id="nombre"
                type="text"
                {...register('nombre')}
                placeholder="Ej. Aula 101"
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nombre && <p className="mt-2 text-sm text-red-600">{errors.nombre.message}</p>}
            </div>

            {/* Capacidad */}
            <div>
              <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
              <input
                id="capacidad"
                type="number"
                {...register('capacidad', { valueAsNumber: true })}
                placeholder="Ej. 30"
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.capacidad ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.capacidad && <p className="mt-2 text-sm text-red-600">{errors.capacidad.message}</p>}
            </div>

            {/* Ubicación */}
            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                id="ubicacion"
                type="text"
                {...register('ubicacion')}
                placeholder="Ej. Edificio A"
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.ubicacion ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ubicacion && <p className="mt-2 text-sm text-red-600">{errors.ubicacion.message}</p>}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                id="estado"
                {...register('estado')}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.estado ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="Disponible">Disponible</option>
                <option value="Ocupada">Ocupada</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
              {errors.estado && <p className="mt-2 text-sm text-red-600">{errors.estado.message}</p>}
            </div>
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">Código del aula</label>
              <input
                id="codigo"
                type="text"
                {...register('codigo')} // 👈 Registrar el campo
                placeholder="Ej. B-201"
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.codigo ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.codigo && <p className="mt-2 text-sm text-red-600">{errors.codigo.message}</p>}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/administrador/aulas')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md bg-blue-600 hover:bg-blue-700 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Guardando...' : <><FontAwesomeIcon icon={faSave} className="mr-2" />Guardar</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AulaForm;
