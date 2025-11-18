import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../app/axiosInstance'; // Asegúrate de tener la configuración de axios correcta
import { toast } from 'react-toastify';

// Definir la interfaz para los comunicados
interface Comunicado {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string; // o Date, dependiendo de tu preferencia
  archivo?: string | null; // Si el archivo es opcional
}

const ComunicadoList: React.FC = () => {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]); // Usamos el tipo Comunicado[]
  const [loading, setLoading] = useState(true);

  // Cargar los comunicados cuando el componente se monta
  useEffect(() => {
    const loadComunicados = async () => {
      try {
        const response = await axiosInstance.get('/comunicados'); // Asegúrate que esta ruta esté configurada correctamente en tu backend
        setComunicados(response.data.data); // Asumimos que los datos están dentro de la propiedad 'data'
      } catch (error) {
        toast.error('Error al cargar los comunicados');
      } finally {
        setLoading(false);
      }
    };

    loadComunicados();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-600">
        Cargando...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Listado de Comunicados</h1>
        </div>

        {/* Si no hay comunicados */}
        {comunicados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay comunicados registrados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contenido
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comunicados.map((comunicado) => (
                  <tr key={comunicado.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{comunicado.titulo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{comunicado.contenido.slice(0, 50)}...</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{comunicado.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComunicadoList;
