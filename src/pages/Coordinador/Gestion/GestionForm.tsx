import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';

import { toUiError } from '../../../api/error';
import { faArrowLeft, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface GestionFormState {
  year: string;
  periodo: string;
  inicio: string;
  fin: string;
  estado: string;
}

const GestionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id ? true : false;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [topError, setTopError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<GestionFormState>({
    defaultValues: {
      year: '',
      periodo: '',
      inicio: '',
      fin: '',
      estado: 'cerrado', // Valor por defecto
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      axiosInstance.get(`/gestiones/${id}`)
        .then(({ data }) => {
          reset(data);
        })
        .catch((error) => {
          const uiError = toUiError(error);
          setTopError(uiError.message || 'Error al cargar los datos de la gestión');
          toast.error('Error al cargar los datos');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (values: GestionFormState) => {
    setTopError('');

    try {
      if (isEdit && id) {
        await axiosInstance.put(`/gestiones/${id}`, values);
        toast.success('Gestión actualizada correctamente');
      } else {
        await axiosInstance.post('/gestiones', values);
        toast.success('Gestión creada correctamente');
      }
      navigate('/administrador/gestiones');
    } catch (error) {
      const uiError = toUiError(error);
      if (uiError.message) setTopError(uiError.message);
      toast.error('Error al guardar la gestión');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Editar Gestión' : 'Nueva Gestión'}</h2>
          <button onClick={() => navigate('/administrador/gestiones')} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {topError && <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">{topError}</div>}

        {loading ? (
          <div className="flex justify-center items-center min-h-[250px] text-gray-600">Cargando datos de la gestión...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           

            {/* Año */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <input
                id="year"
                type="text"
                {...register('year', { required: 'El año es obligatorio' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.year ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.year && <p className="text-red-600 text-sm">{errors.year.message}</p>}
            </div>

            {/* Periodo */}
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
              <input
                id="periodo"
                type="text"
                {...register('periodo', { required: 'El periodo es obligatorio' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.periodo ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.periodo && <p className="text-red-600 text-sm">{errors.periodo.message}</p>}
            </div>

            {/* Fechas */}
            <div>
              <label htmlFor="inicio" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
              <input
                id="inicio"
                type="date"
                {...register('inicio', { required: 'La fecha de inicio es obligatoria' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.inicio ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.inicio && <p className="text-red-600 text-sm">{errors.inicio.message}</p>}
            </div>

            <div>
              <label htmlFor="fin" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
              <input
                id="fin"
                type="date"
                {...register('fin', { required: 'La fecha de fin es obligatoria' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.fin ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.fin && <p className="text-red-600 text-sm">{errors.fin.message}</p>}
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                id="estado"
                {...register('estado', { required: 'El estado es obligatorio' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.estado ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="abierto">Abierto</option>
                <option value="cerrado">Cerrado</option>
                <option value="en curso">En curso</option>
              </select>
              {errors.estado && <p className="text-red-600 text-sm">{errors.estado.message}</p>}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/administrador/gestiones')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Guardando...' : <><FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GestionForm;
