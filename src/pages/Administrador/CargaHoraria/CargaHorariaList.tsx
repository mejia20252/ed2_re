import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const CargaHorariaList: React.FC = () => {
  const navigate = useNavigate();
  const [cargasHorarias, setCargasHorarias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCargasHorarias();
  }, []);

  const loadCargasHorarias = async () => {
    try {
      const { data } = await axiosInstance.get('/carga_horarias');
      setCargasHorarias(data);
    } catch (err) {
      toast.error('Error al cargar las cargas horarias');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`¿Está seguro de eliminar esta carga horaria?`)) return;
    try {
      await axiosInstance.delete(`/carga_horarias/${id}`);
      setCargasHorarias(cargasHorarias.filter((carga) => carga.id !== id));
      toast.success('Carga horaria eliminada correctamente');
    } catch (err) {
      toast.error('Error al eliminar la carga horaria');
    }
  };

  const filteredCargasHorarias = cargasHorarias.filter(
    (carga) =>
      carga.docente_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carga.grupo_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carga.aula_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Listado de Cargas Horarias</h1>
        <button
          onClick={() => navigate('/administrador/carga_horarias/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          <FontAwesomeIcon icon={faEdit} /> Nueva Carga Horaria
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por docente, grupo o aula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Docente</th>
              <th>Grupo</th>
              <th>Aula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCargasHorarias.map((carga) => (
              <tr key={carga.id}>
                <td>{carga.docente_id}</td>
                <td>{carga.grupo_id}</td>
                <td>{carga.aula_id}</td>
                <td>
                  <button
                    onClick={() => navigate(`/administrador/carga_horarias/${carga.id}/edit`)}
                    className="mr-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(carga.id)}>
                    <FontAwesomeIcon icon={faTrash} />
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

export default CargaHorariaList;
