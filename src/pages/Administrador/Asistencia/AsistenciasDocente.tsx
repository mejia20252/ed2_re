import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';

interface Asistencia {
  id: number;
  docente_id: number;
  grupo_id: number;
  estado: string;
  fecha: string;
}

const AsistenciasDocente: React.FC = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamar al endpoint para obtener las asistencias del docente
    const fetchAsistencias = async () => {
      try {
        const { data } = await axiosInstance.get('/asistencias/docente');
        setAsistencias(data); // Ajusta dependiendo de la estructura de la respuesta
      } catch (error) {
        toast.error('Error al cargar las asistencias');
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Asistencias de los Docentes</h2>

      {asistencias.length === 0 ? (
        <div>No hay asistencias registradas</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Grupo</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((asistencia) => (
              <tr key={asistencia.id}>
                <td className="px-4 py-2">{asistencia.fecha}</td>
                <td className="px-4 py-2">{asistencia.estado}</td>
                <td className="px-4 py-2">{asistencia.grupo_id}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => alert('Marcar como corregido o modificar')}
                  >
                    Editar
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

export default AsistenciasDocente;
