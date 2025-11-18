import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash ,faSearch} from '@fortawesome/free-solid-svg-icons';

const ComunicadoList: React.FC = () => {
  const navigate = useNavigate();
  const [comunicados, setComunicados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadComunicados();
  }, []);

  const loadComunicados = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/comunicados');
      setComunicados(data.data);
    } catch (error) {
      toast.error('Error al cargar los comunicados');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar este comunicado?')) return;
    try {
      await axiosInstance.delete(`/comunicados/${id}`);
      setComunicados((prev) => prev.filter((comunicado) => comunicado.id !== id));
      toast.success('Comunicado eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el comunicado');
    }
  };

  const filteredComunicados = comunicados.filter(
    (comunicado) =>
      comunicado.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comunicado.contenido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Listado de Comunicados</h1>
          <button
            onClick={() => navigate('/administrador/comunicados/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nuevo Comunicado
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por título o contenido"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table / Loading / Empty */}
        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-600">
            Cargando...
          </div>
        ) : filteredComunicados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No se encontraron comunicados con ese criterio' : 'No hay comunicados registrados'}
          </div>
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
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComunicados.map((comunicado) => (
                  <tr key={comunicado.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{comunicado.titulo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{comunicado.contenido.slice(0, 50)}...</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{comunicado.fecha}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/administrador/comunicados/${comunicado.id}/edit`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(comunicado.id)}
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

        {/* Mostrar la cantidad de comunicados */}
        {!loading && filteredComunicados.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando {filteredComunicados.length} de {comunicados.length} comunicados
          </div>
        )}
      </div>
    </div>
  );
};

export default ComunicadoList;
