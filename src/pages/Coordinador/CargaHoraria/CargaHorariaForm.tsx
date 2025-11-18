import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';
import { toUiError } from '../../../api/error';

interface CargaHorariaFormState {
  docente_id: number | null;
  grupo_id: number | null;
  aula_id: number | null;
  hora_inicio: string;
  hora_fin: string;
  dia: string;
}

const CargaHorariaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [aulas, setAulas] = useState<any[]>([]);
  const [topError, setTopError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CargaHorariaFormState>({
    defaultValues: {
      docente_id: null,
      grupo_id: null,
      aula_id: null,
      hora_inicio: '',
      hora_fin: '',
      dia: '',
    }
  });

  // Cargar los docentes, grupos y aulas
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [docentesData, gruposData, aulasData] = await Promise.all([
          axiosInstance.get('/docentes'),
          axiosInstance.get('/grupos'),
          axiosInstance.get('/aulas'),
        ]);
        
        setDocentes(docentesData.data);
        setGrupos(gruposData.data);
        setAulas(aulasData.data);
      } catch (err) {
        setTopError('Error al cargar los datos.');
        toast.error('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Cargar una carga horaria para editar
  useEffect(() => {
    if (!isEdit || !id) return;
    const loadCargaHoraria = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/carga_horarias/${id}`);
        reset({
          docente_id: data.docente_id,
          grupo_id: data.grupo_id,
          aula_id: data.aula_id,
          hora_inicio: data.hora_inicio,
          hora_fin: data.hora_fin,
          dia: data.dia,
        });
      } catch (err) {
        setTopError('No se pudo cargar la carga horaria.');
        toast.error('Error al cargar la carga horaria.');
      } finally {
        setLoading(false);
      }
    };

    loadCargaHoraria();
  }, [id, isEdit, reset]);

  const onSubmit = async (values: CargaHorariaFormState) => {
    setTopError('');

    try {
      if (isEdit && id) {
        await axiosInstance.put(`/carga_horarias/${id}`, values);
        toast.success('Carga horaria actualizada correctamente');
      } else {
        await axiosInstance.post('/carga_horarias', values);
        toast.success('Carga horaria creada correctamente');
      }
      navigate('/administrador/carga_horarias');
    } catch (err) {
      const uiError = toUiError(err);
      setTopError(uiError.message || 'Error al guardar la carga horaria');
      toast.error('Error al guardar la carga horaria');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Carga Horaria' : 'Nueva Carga Horaria'}
          </h2>
        </div>

        {topError && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
            {topError}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[250px] text-gray-600">
            Cargando datos...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Docente */}
            <div>
              <label htmlFor="docente_id" className="block text-sm font-medium text-gray-700 mb-1">
                Docente
              </label>
              <select
                id="docente_id"
                {...register('docente_id', { required: 'El docente es obligatorio' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.docente_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecciona un docente</option>
                {docentes.map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {docente.registro} - {docente.user.nombre}
                  </option>
                ))}
              </select>
              {errors.docente_id && <p className="text-red-600 text-sm">{errors.docente_id.message}</p>}
            </div>

            {/* Grupo */}
            <div>
              <label htmlFor="grupo_id" className="block text-sm font-medium text-gray-700 mb-1">
                Grupo
              </label>
              <select
                id="grupo_id"
                {...register('grupo_id', { required: 'El grupo es obligatorio' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.grupo_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecciona un grupo</option>
                {grupos.map((grupo) => (
                  <option key={grupo.id} value={grupo.id}>
                    {grupo.codigo}
                  </option>
                ))}
              </select>
              {errors.grupo_id && <p className="text-red-600 text-sm">{errors.grupo_id.message}</p>}
            </div>

            {/* Aula */}
            <div>
              <label htmlFor="aula_id" className="block text-sm font-medium text-gray-700 mb-1">
                Aula
              </label>
              <select
                id="aula_id"
                {...register('aula_id', { required: 'El aula es obligatoria' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.aula_id ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecciona un aula</option>
                {aulas.map((aula) => (
                  <option key={aula.id} value={aula.id}>
                    {aula.nombre}
                  </option>
                ))}
              </select>
              {errors.aula_id && <p className="text-red-600 text-sm">{errors.aula_id.message}</p>}
            </div>

            {/* Hora de inicio */}
            <div>
              <label htmlFor="hora_inicio" className="block text-sm font-medium text-gray-700 mb-1">
                Hora de inicio
              </label>
              <input
                id="hora_inicio"
                type="time"
                {...register('hora_inicio', { required: 'La hora de inicio es obligatoria' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.hora_inicio ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.hora_inicio && <p className="text-red-600 text-sm">{errors.hora_inicio.message}</p>}
            </div>

            {/* Hora de fin */}
            <div>
              <label htmlFor="hora_fin" className="block text-sm font-medium text-gray-700 mb-1">
                Hora de fin
              </label>
              <input
                id="hora_fin"
                type="time"
                {...register('hora_fin', { required: 'La hora de fin es obligatoria' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.hora_fin ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.hora_fin && <p className="text-red-600 text-sm">{errors.hora_fin.message}</p>}
            </div>

            {/* Día */}
            <div>
              <label htmlFor="dia" className="block text-sm font-medium text-gray-700 mb-1">
                Día
              </label>
              <select
                id="dia"
                {...register('dia', { required: 'El día es obligatorio' })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.dia ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Selecciona un día</option>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miércoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
              </select>
              {errors.dia && <p className="text-red-600 text-sm">{errors.dia.message}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/administrador/carga_horarias')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CargaHorariaForm;
