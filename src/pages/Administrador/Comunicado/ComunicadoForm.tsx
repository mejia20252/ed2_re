import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';

interface ComunicadoFormInputs {
  titulo: string;
  contenido: string;
  fecha: string;       // yyyy-mm-dd
  archivo?: FileList;  // input file devuelve FileList
}

const ComunicadoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // si existe id -> modo edición

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ComunicadoFormInputs>();

  const [topError, setTopError] = useState('');
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si hay id, cargar datos del comunicado para editar
    const fetchComunicado = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/comunicados/${id}`);
        const comunicado = data.data; // porque en el controlador retornas ['data' => $comunicado]

        setValue('titulo', comunicado.titulo);
        setValue('contenido', comunicado.contenido);
        setValue('fecha', comunicado.fecha); // asumimos formato 'YYYY-MM-DD'

        // Si quieres mostrar un link al archivo existente (si GCS es público o devuelves URL)
        if (comunicado.archivo) {
          // aquí podrías tener ya la URL pública, o construirla según tu config de GCS
          setExistingFileUrl(comunicado.archivo);
        }
      } catch (error) {
        toast.error('Error al cargar el comunicado');
      } finally {
        setLoading(false);
      }
    };

    fetchComunicado();
  }, [id, setValue]);

  const onSubmit = async (data: ComunicadoFormInputs) => {
    try {
      setTopError('');
      setLoading(true);

      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('contenido', data.contenido);
      formData.append('fecha', data.fecha);

      if (data.archivo && data.archivo.length > 0) {
        formData.append('archivo', data.archivo[0]);
      }

      if (id) {
        // Actualizar comunicado
        await axiosInstance.put(`/comunicados/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Comunicado actualizado con éxito.');
      } else {
        // Crear comunicado
        await axiosInstance.post('/comunicados', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Comunicado creado con éxito.');
      }

      navigate('/administrador/comunicados');
    } catch (error: any) {
      console.error('Error completo:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          setTopError(JSON.stringify(data.errors, null, 2));
          toast.error('Error de validación. Revisa los campos.');
        } else {
          const errorMsg = data.message || data.error || 'Error desconocido';
          setTopError(errorMsg);
          toast.error(errorMsg);
        }
      } else if (error.request) {
        setTopError('No se pudo conectar con el servidor');
        toast.error('Error de conexión. Verifica tu internet.');
      } else {
        setTopError(error.message || 'Error inesperado');
        toast.error('Error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {id ? 'Editar Comunicado' : 'Crear Comunicado'}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg space-y-4"
      >
        {topError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
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

        {/* Título */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            {...register('titulo', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.titulo && (
            <p className="text-red-600 text-sm">{errors.titulo.message}</p>
          )}
        </div>

        {/* Contenido */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Contenido
          </label>
          <textarea
            {...register('contenido', { required: 'Este campo es obligatorio' })}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.contenido && (
            <p className="text-red-600 text-sm">{errors.contenido.message}</p>
          )}
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <input
            type="date"
            {...register('fecha', { required: 'Este campo es obligatorio' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {errors.fecha && (
            <p className="text-red-600 text-sm">{errors.fecha.message}</p>
          )}
        </div>

        {/* Archivo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Archivo (opcional)
          </label>
          <input
            type="file"
            {...register('archivo')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {existingFileUrl && (
            <p className="text-xs text-gray-600 mt-1">
              Archivo actual:{' '}
              <a
                href={existingFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Ver archivo
              </a>
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate('/administrador/comunicados')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? 'Guardando...'
              : id
              ? 'Guardar cambios'
              : 'Crear comunicado'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComunicadoForm;
