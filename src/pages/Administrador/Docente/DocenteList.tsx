import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';

interface Docente {
  id: number;
  registro: string;
  especialidad: string | null;
  user_id: number;
}

const DocenteList: React.FC = () => {
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocentes();
  }, []);

  const loadDocentes = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get<Docente[]>('/docentes');
      setDocentes(data);
    } catch (err) {
      const uiError = toUiError(err);
      setError(uiError.message || 'Error al cargar los docentes');
      toast.error('No se pudieron cargar los docentes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, registro: string) => {
    if (!window.confirm(`¿Está seguro de eliminar el docente con registro "${registro}"?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/docentes/${id}`);
      toast.success('Docente eliminado correctamente');
      setDocentes(docentes.filter((docente) => docente.id !== id));
    } catch (err) {
      const uiError = toUiError(err);
      toast.error(uiError.message || 'Error al eliminar el docente');
    }
  };

  const handleCrearHorarios = async (docenteId: number) => {
    try {
      await axiosInstance.post(`/docentes/${docenteId}/crear-horarios`);
      toast.success('Horarios creados correctamente');
    } catch (err) {
      const uiError = toUiError(err);
      toast.error(uiError.message || 'Error al crear los horarios');
    }
  };

  const filteredDocentes = docentes.filter((docente) => {
    const registro = docente.registro || ''; // Usamos un valor por defecto si es undefined
    const especialidad = docente.especialidad || ''; // Lo mismo para especialidad

    return (
      registro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Gestión de Docentes</h1>
          <button
            onClick={() => navigate('/administrador/docentes/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nuevo Docente
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por registro o especialidad..."
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
          <div className="flex justify-center items-center py-12 text-gray-600">Cargando docentes...</div>
        ) : filteredDocentes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{searchTerm ? 'No se encontraron docentes con ese criterio' : 'No hay docentes registrados'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID de Usuario</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocentes.map((docente) => (
                  <tr key={docente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{docente.registro}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{docente.especialidad || 'No especificada'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{docente.user_id}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button onClick={() => navigate(`/administrador/docentes/${docente.id}/edit`)} className="text-blue-600 hover:text-blue-800 mr-4">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleDelete(docente.id, docente.registro)} className="text-red-600 hover:text-red-800 mr-4">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button onClick={() => handleCrearHorarios(docente.id)} className="text-green-600 hover:text-green-800">
                        Crear Horarios {(docente.id)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredDocentes.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando {filteredDocentes.length} de {docentes.length} docentes
          </div>
        )}
      </div>
    </div>
  );
};

export default DocenteList;
