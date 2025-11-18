import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';

interface LicenciaFormState {
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string;
}

const LicenciaForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LicenciaFormState>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Cargar licencia para editar
      const fetchLicencia = async () => {
        try {
          const { data } = await axiosInstance.get(`/licencias/${id}`);
          setValue('tipo', data.tipo);
          setValue('fecha_inicio', data.fecha_inicio);
          setValue('fecha_fin', data.fecha_fin);
          setValue('motivo', data.motivo);
        } catch (error) {
          toast.error('Error al cargar la licencia');
        }
      };
      fetchLicencia();
    }
  }, [id, setValue]);

  const onSubmit = async (data: LicenciaFormState) => {
    try {
      if (id) {
        // Actualizar licencia
        await axiosInstance.put(`/licencias/${id}`, data);
        toast.success('Licencia actualizada');
      } else {
        // Crear nueva licencia
        await axiosInstance.post('/licencias', data);
        toast.success('Licencia solicitada');
      }
      navigate('/docente/licencias');
    } catch (error) {
      toast.error('Error al enviar la solicitud');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Licencia' : 'Solicitar Licencia'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Licencia</label>
          <select
            {...register('tipo', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="maternidad">Maternidad</option>
            <option value="enfermedad">Enfermedad</option>
            <option value="personal">Personal</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipo && <p className="text-red-600 text-sm">{errors.tipo.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
          <input
            type="date"
            {...register('fecha_inicio', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.fecha_inicio && <p className="text-red-600 text-sm">{errors.fecha_inicio.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
          <input
            type="date"
            {...register('fecha_fin', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.fecha_fin && <p className="text-red-600 text-sm">{errors.fecha_fin.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Motivo</label>
          <textarea
            {...register('motivo')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {id ? 'Actualizar Licencia' : 'Solicitar Licencia'}
        </button>
      </form>
    </div>
  );
};

export default LicenciaForm;
