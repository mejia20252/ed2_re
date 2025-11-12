import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';

interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  hps: number;
}

const MateriaList: React.FC = () => {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadMaterias();
  }, []);

  const loadMaterias = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get<Materia[]>('/materias/');
      setMaterias(data);
    } catch (err) {
      const uiError = toUiError(err);
      setError(uiError.message || 'Error al cargar las materias');
      toast.error('No se pudieron cargar las materias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Está seguro de eliminar la materia "${nombre}"?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/materias/${id}/`);
      toast.success('Materia eliminada correctamente');
      setMaterias(materias.filter(m => m.id !== id));
    } catch (err) {
      const uiError = toUiError(err);
      toast.error(uiError.message || 'Error al eliminar la materia');
    }
  };

  const filteredMaterias = materias.filter(materia =>
    materia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    materia.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Gestión de Materias
          </h1>
          <button
            onClick={() => navigate('/administrador/materias/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nueva Materia
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600">Cargando materias...</div>
          </div>
        ) : filteredMaterias.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No se encontraron materias con ese criterio' : 'No hay materias registradas'}
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créditos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HPS
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaterias.map((materia) => (
                  <tr key={materia.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {materia.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {materia.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {materia.creditos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {materia.hps}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/administrador/materias/${materia.id}/editar`)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                        title="Editar"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(materia.id, materia.nombre)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        {!loading && filteredMaterias.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando {filteredMaterias.length} de {materias.length} materias
          </div>
        )}
      </div>
    </div>
  );
};

export default MateriaList;