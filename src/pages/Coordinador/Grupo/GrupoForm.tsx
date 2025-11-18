import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';

interface GrupoFormState {
  materia_id: number;
  gestion_id: number;
  codigo: string;
  capacidad: number;
  modalidad: string;
  docente_id: number;
  aula_id: number;
}

const GrupoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<GrupoFormState>();

  const [materias, setMaterias] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [topError, setTopError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materiasResponse = await axiosInstance.get('/materias');
        setMaterias(materiasResponse.data);

        const gestionesResponse = await axiosInstance.get('/gestiones');
        setGestiones(gestionesResponse.data);

        const docentesResponse = await axiosInstance.get('/docentes');
        setDocentes(docentesResponse.data);

        const aulasResponse = await axiosInstance.get('/aulas');
        setAulas(aulasResponse.data);

        if (id) {
          const grupoResponse = await axiosInstance.get(`/grupos/${id}`);
          const grupoData = grupoResponse.data;

          setValue('materia_id', grupoData.materia_id);
          setValue('gestion_id', grupoData.gestion_id);
          setValue('codigo', grupoData.codigo);
          setValue('capacidad', grupoData.capacidad);
          setValue('modalidad', grupoData.modalidad);
          setValue('docente_id', grupoData.docente_id);
          setValue('aula_id', grupoData.aula_id);
           // Si ya tiene un docente asignado, establecerlo
        }
      } catch (error) {
        toast.error('Error al cargar los datos');
      }
    };
    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data: GrupoFormState) => {
    try {
      setTopError(''); // Limpiar errores anteriores

      if (id) {
        await axiosInstance.put(`/grupos/${id}`, data);
        toast.success('Grupo actualizado con éxito.');
      } else {
        await axiosInstance.post('/grupos', data);
        toast.success('Grupo creado con éxito.');
      }
      navigate('/administrador/grupos');
    } catch (error: any) {
      console.error('Error completo:', error);

      if (error.response) {
        const { status, data } = error.response;

        // Error 422: Errores de validación
        if (status === 422 && data.errors) {
          setTopError(JSON.stringify(data.errors, null, 2));
          toast.error('Error de validación. Revisa los campos.');
        }
        // Error 500: Error del servidor
        else if (status === 500) {
          const errorMessage = data.message || data.error || 'Error interno del servidor';
          setTopError(`Error del servidor: ${errorMessage}`);
          toast.error('Error en el servidor. Contacta al administrador.');
        }
        // Otros errores con respuesta
        else {
          const errorMsg = data.message || data.error || 'Error desconocido';
          setTopError(errorMsg);
          toast.error(errorMsg);
        }
      } else if (error.request) {
        // Error de red (sin respuesta del servidor)
        setTopError('No se pudo conectar con el servidor');
        toast.error('Error de conexión. Verifica tu internet.');
      } else {
        // Otro tipo de error
        setTopError(error.message || 'Error inesperado');
        toast.error('Error inesperado');
      }
    }
  };
 

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {id ? 'Editar Grupo' : 'Crear Grupo'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        {topError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al procesar la solicitud
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <pre className="whitespace-pre-wrap">{topError}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Materia</label>
          <select
            {...register('materia_id', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-Seleccionar materia-</option>
            {materias.map((materia: any) => (
              <option key={materia.id} value={materia.id}>{materia.nombre}</option>
            ))}
          </select>
          {errors.materia_id && <p className="text-red-600 text-sm">{errors.materia_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gestión</label>
          <select
            {...register('gestion_id', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-Seleccionar gestión-</option>
            {gestiones.map((gestion: any) => (
              <option key={gestion.id} value={gestion.id}>{gestion.periodo}</option>
            ))}
          </select>
          {errors.gestion_id && <p className="text-red-600 text-sm">{errors.gestion_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Código del Grupo</label>
          <input
            type="text"
            {...register('codigo', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.codigo && <p className="text-red-600 text-sm">{errors.codigo.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Capacidad</label>
          <input
            type="number"
            {...register('capacidad', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.capacidad && <p className="text-red-600 text-sm">{errors.capacidad.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Modalidad</label>
          <select
            {...register('modalidad', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-Seleccionar modalidad-</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
          </select>
          {errors.modalidad && <p className="text-red-600 text-sm">{errors.modalidad.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Docente</label>
          <select
            {...register('docente_id', )}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-Seleccionar docente-</option>
            {docentes.map((docente: any) => (
              // Mostrar el nombre completo del docente en lugar de su registro
              <option key={docente.id} value={docente.id}>
                {`${docente.user.nombre} ${docente.user.apellido_paterno} ${docente.user.apellido_materno}`}
              </option>
            ))}
          </select>
          {errors.docente_id && <p className="text-red-600 text-sm">{errors.docente_id.message}</p>}
        </div>


        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Aula</label>
          <select
            {...register('aula_id', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-Seleccionar aula-</option>
            {aulas.map((aula: any) => (
              <option key={aula.id} value={aula.id}>{aula.codigo}</option>
            ))}
          </select>
          {errors.aula_id && <p className="text-red-600 text-sm">{errors.aula_id.message}</p>}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/administrador/grupos')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {id ? 'Guardar cambios' : 'Crear Grupo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrupoForm;