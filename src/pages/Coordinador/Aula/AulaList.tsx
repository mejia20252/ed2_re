import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAulas, deleteAula } from '../../../api/api-aula';
import {type  Aula } from '../../../types/type-aula';
import { toUiError } from '../../../api/error';

const AulaList: React.FC = () => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [topError, setTopError] = useState<string>('');

  useEffect(() => {
    const loadAulas = async () => {
      setLoading(true);
      try {
        const aulasData = await fetchAulas();
        setAulas(aulasData);
      } catch (err) {
        const uiError = toUiError(err);
        setTopError(uiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadAulas();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteAula(id);
      setAulas(aulas.filter(a => a.id !== id));
    } catch (err) {
      const uiError = toUiError(err);
      setTopError(uiError.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lista de Aulas</h1>

        {topError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{topError}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando aulas...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {aulas.map(aula => (
              <div key={aula.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900">Nombre Aula{aula.nombre}</h3>
                  <h3 className="text-xl font-semibold text-gray-900">Codigo {aula.codigo}</h3>
                  <p className="text-gray-600">{aula.ubicacion}</p>
                  <p className="text-lg font-bold text-gray-900">Capacidad: {aula.capacidad}</p>
                  <p className="text-sm text-gray-500">Estado: {aula.estado}</p>
                  <p className="text-sm text-gray-500">Ubicacion: {aula.ubicacion}</p>
                </div>
                <div className="flex justify-between p-4 border-t border-gray-200">
                  <Link to={`/administrador/aulas/${aula.id}/editar`} className="text-blue-600 hover:text-blue-800">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(aula.id)} className="text-red-600 hover:text-red-800">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Link to="/administrador/aulas/new" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            Crear Aula
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AulaList;
