import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Licencia {
  id: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  motivo: string;
}

const LicenciaList: React.FC = () => {
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLicencias = async () => {
      try {
        const { data } = await axiosInstance.get('/licencias');
        setLicencias(data.data); // Ajusta dependiendo de la estructura de la respuesta
      } catch (error) {
        toast.error('Error al cargar las licencias');
      } finally {
        setLoading(false);
      }
    };
    fetchLicencias();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/docente/licencias/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta licencia?')) {
      try {
        await axiosInstance.delete(`/licencias/${id}`);
        setLicencias((prev) => prev.filter((licencia) => licencia.id !== id));
        toast.success('Licencia eliminada correctamente');
      } catch (error) {
        toast.error('Error al eliminar la licencia');
      }
    }
  };

  const filteredLicencias = licencias.filter(
    (licencia) =>
      licencia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      licencia.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Licencias</h2>

      {/* Botón Nuevo para crear una nueva licencia */}
      <button
        onClick={() => navigate('/docente/licencias/new')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4"
      >
        Nueva Licencia
      </button>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por tipo o estado"
          className="p-2 border rounded-md"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Fechas</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Motivo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicencias.map((licencia) => (
              <tr key={licencia.id}>
                <td className="px-4 py-2">{licencia.tipo}</td>
                <td className="px-4 py-2">{`${licencia.fecha_inicio} - ${licencia.fecha_fin}`}</td>
                <td className="px-4 py-2">{licencia.estado}</td>
                <td className="px-4 py-2">{licencia.motivo}</td>
                <td className="px-4 py-2">
                  {/* Botón Editar */}
                  <button
                    onClick={() => handleEdit(licencia.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => handleDelete(licencia.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LicenciaList;
