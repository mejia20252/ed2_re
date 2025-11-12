import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';

import { toUiError } from '../../../api/error';
interface Gestion {
  id: number;
  year: string;
  periodo: string;
  inicio: string;
  fin: string;

  
  estado: string;
}

const GestionList: React.FC = () => {
  const navigate = useNavigate();
  const [gestiones, setGestiones] = useState<Gestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadGestiones();
  }, []);

  const loadGestiones = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get<Gestion[]>('/gestiones');
      setGestiones(data);
    } catch (err) {
      const uiError = toUiError(err);
      setError(uiError.message || 'Error al cargar las gestiones');
      toast.error('No se pudieron cargar las gestiones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number,) => {
    if (!window.confirm(`¿Está seguro de eliminar la gestión "?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/gestiones/${id}`);
      toast.success('Gestión eliminada correctamente');
      setGestiones(gestiones.filter((gestion) => gestion.id !== id));
    } catch (err) {
      const uiError = toUiError(err);
      toast.error(uiError.message || 'Error al eliminar la gestión');
    }
  };

  const filteredGestiones = gestiones.filter(
  (gestion) =>
    (gestion.periodo && gestion.periodo.toLowerCase().includes(searchTerm.toLowerCase()))
);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Gestión de Gestiones</h1>
          <button
            onClick={() => navigate('/administrador/gestiones/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nueva Gestión
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o periodo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700">{error}</div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-600">Cargando gestiones...</div>
        ) : filteredGestiones.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{searchTerm ? 'No se encontraron gestiones' : 'No hay gestiones registradas'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGestiones.map((gestion) => (
                  <tr key={gestion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{gestion.periodo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{gestion.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{gestion.estado}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button onClick={() => navigate(`/administrador/gestiones/${gestion.id}/edit`)} className="text-blue-600 hover:text-blue-800 mr-4">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDelete(gestion.id)} className="text-red-600 hover:text-red-800">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredGestiones.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando {filteredGestiones.length} de {gestiones.length} gestiones
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionList;
