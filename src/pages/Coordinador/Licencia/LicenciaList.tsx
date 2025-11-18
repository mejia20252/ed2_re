import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';

interface Licencia {
  id: number;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  motivo: string;
}

const LicenciaListAdmin: React.FC = () => {
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLicencias = async () => {
      try {
        const { data } = await axiosInstance.get('/licencias/todas');
        setLicencias(data.data); // Ajusta dependiendo de la estructura de la respuesta
      } catch (error) {
        toast.error('Error al cargar las licencias');
      } finally {
        setLoading(false);
      }
    };
    fetchLicencias();
  }, []);

  const handleUpdateEstado = async (id: number, estado: string) => {
    try {
      await axiosInstance.put(`/licencias/${id}/estado`, { estado });
      toast.success('Estado de la licencia actualizado');
      // Actualizar la lista de licencias para reflejar los cambios
      setLicencias(licencias.map((licencia) =>
        licencia.id === id ? { ...licencia, estado } : licencia
      ));
    } catch (error: any) {
      console.error('Error completo:', error);

      if (error.response) {
        const { status, data } = error.response;

        // Error 422: Errores de validación
        if (status === 422 && data.errors) {
          toast.error('Error de validación. Revisa los campos.');
        }
        // Error 500: Error del servidor
        else if (status === 500) {
          const errorMessage = data.message || data.error || 'Error interno del servidor';
          toast.error('', errorMessage);
        }
        // Otros errores con respuesta
        else {
          const errorMsg = data.message || data.error || 'Error desconocido';
          toast.error(errorMsg);
        }
      } else if (error.request) {
        // Error de red (sin respuesta del servidor)
        toast.error('Error de conexión. Verifica tu internet.');
      } else {
        // Otro tipo de error
        toast.error('Error inesperado');
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
      <h2 className="text-2xl font-bold mb-4">Licencias (Administradores)</h2>

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
                  {/* Botones para cambiar el estado de la licencia */}
                  {licencia.estado === 'pendiente' && (
                    <>
                      <button
                        onClick={() => handleUpdateEstado(licencia.id, 'aprobada')}
                        className="text-green-600 hover:text-green-800"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleUpdateEstado(licencia.id, 'rechazada')}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {licencia.estado !== 'pendiente' && (
                    <span className="text-gray-500">Estado {licencia.estado}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LicenciaListAdmin;
