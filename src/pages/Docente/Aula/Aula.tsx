import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const AulaList: React.FC = () => {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [topError, setTopError] = useState('');

  useEffect(() => {
    loadAulas();
  }, []);

  const loadAulas = async () => {
     setTopError(''); 
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/aulas');
      setAulas(data);
    } catch (error) {
      toast.error('Error al cargar las aulas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta aula?')) return;
    try {
      await axiosInstance.delete(`/aulas/${id}`);
      setAulas((prev) => prev.filter((a) => a.id !== id));
      toast.success('Aula eliminada correctamente');
    } catch (error) {
      toast.error('Error inesperado al eliminar el aula');
    }
  };

  const filteredAulas = aulas.filter(
    (a) => a.codigo.toLowerCase().includes('') || a.nombre.toLowerCase().includes('')
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Listado de Aulas</h1>
          <button
            onClick={() => navigate('/administrador/aulas/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nueva Aula
          </button>
        </div>

        {topError && <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">{topError}</div>}

        {/* Tabla de Aulas */}
        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-600">Cargando...</div>
        ) : filteredAulas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay aulas registradas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAulas.map((aula) => (
                  <tr key={aula.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{aula.codigo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{aula.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{aula.capacidad}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{aula.ubicacion}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{aula.estado}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/administrador/aulas/${aula.id}/edit`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(aula.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mostrar la cantidad de aulas */}
        {!loading && filteredAulas.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando {filteredAulas.length} de {aulas.length} aulas
          </div>
        )}
      </div>
    </div>
  );
};

export default AulaList;
