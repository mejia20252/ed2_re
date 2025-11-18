import { useState, useEffect } from 'react';
import axiosInstance from '../../../app/axiosInstance';  // Asegúrate de que el path sea correcto
import { toast } from 'react-toastify';

// Define la interfaz para los datos de asistencia
interface Asistencia {
  grupo: string;
  horario: {
    dia: string;
    hora_inicio: string;
    hora_fin: string;
  };
  docente_id: number;
  estado: string;
  fecha: string;
}

const AsistenciasDocentes = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // Cambié el tipo a string | null

  useEffect(() => {
    const fetchAsistencias = async () => {
      setLoading(true);
      setError(null);
      try {
        // Realizamos la solicitud GET usando el axiosInstance
        const response = await axiosInstance.get('/asistencias-grupo-horario');
        setAsistencias(response.data); // Asignamos los datos de las asistencias a la variable de estado
      } catch (err) {
        setError('Error al obtener las asistencias');
        toast.error('Error al obtener las asistencias'); // Mostramos un mensaje de error
      } finally {
        setLoading(false); // Terminamos el estado de carga
      }
    };

    fetchAsistencias(); // Llamamos a la función para obtener los datos
  }, []);

  // Si estamos cargando los datos, mostramos un mensaje de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si ocurre un error, mostramos un mensaje de error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Asistencias de Docentes</h1>
      
      {asistencias.length === 0 ? (
        <div>No se encontraron asistencias.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Grupo</th>
              <th className="px-4 py-2 border">Horario</th>
              <th className="px-4 py-2 border">Docente</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((asistencia, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{asistencia.grupo}</td>
                <td className="px-4 py-2 border">{`${asistencia.horario.dia} - ${asistencia.horario.hora_inicio} a ${asistencia.horario.hora_fin}`}</td>
                <td className="px-4 py-2 border">{asistencia.docente_id}</td>
                <td className="px-4 py-2 border">{asistencia.estado}</td>
                <td className="px-4 py-2 border">{asistencia.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AsistenciasDocentes;
