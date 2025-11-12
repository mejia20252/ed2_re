import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faClock } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

// Orden y formato de días/horas
const DIAS_ORDEN = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const hhmm = (t?: string) => (t ? t.slice(0, 5) : '');
const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const abreviarDia = (dia: string) => {
  if (!dia) return '';
  const map: Record<string, string> = {
    lunes: 'Lun', martes: 'Mar', miércoles: 'Mié', jueves: 'Jue', viernes: 'Vie', sábado: 'Sáb', domingo: 'Dom',
  };
  return map[dia] ?? capitalizar(dia.slice(0, 3));
};

const horariosComoChips = (horarios: any[] = []) =>
  horarios
    .slice()
    .sort((a, b) => DIAS_ORDEN.indexOf(a.dia) - DIAS_ORDEN.indexOf(b.dia))
    .map(h => `${abreviarDia(h.dia)} ${hhmm(h.hora_inicio)}–${hhmm(h.hora_fin)}`);

interface HorarioFormState {
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

const GrupoList: React.FC = () => {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [topError, setTopError] = useState('');

  // Estados para el modal de agregar horario
  const [showModalHorario, setShowModalHorario] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(null);

  const {
    register: registerHorario,
    handleSubmit: handleSubmitHorario,
    formState: { errors: errorsHorario },
    reset: resetHorario
  } = useForm<HorarioFormState>();

  useEffect(() => {
    loadGrupos();
  }, []);

  const loadGrupos = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/grupos');
      setGrupos(data);
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        // Acceder a los errores del backend y mostrarlos con toast
        const backendError = error.response.data.errors.horario?.[0];
        if (backendError) {
          toast.error(backendError);  // Mostrar el mensaje de error
        }
      } else {
        toast.error('Error al agregar el horario');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar el grupo?')) return;
    try {
      await axiosInstance.delete(`/grupos/${id}`);
      setGrupos((prev) => prev.filter((g) => g.id !== id));
      toast.success('Grupo eliminado correctamente');
    }
    catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        setTopError(JSON.stringify(backendErrors, null, 2));
        toast.error('Error al borar el grupo');

      } else {
        toast.error('Error inesperado al crear el grupo');

      }
    }
  };

  // Abrir modal para agregar horario
  const abrirModalHorario = (grupoId: number) => {
    setGrupoSeleccionado(grupoId);
    setShowModalHorario(true);
    resetHorario();
  };

  // Cerrar modal
  const cerrarModalHorario = () => {
    setShowModalHorario(false);
    setGrupoSeleccionado(null);
    resetHorario();
  };

const onSubmitHorario = async (data: HorarioFormState) => {
  try {
    if (!grupoSeleccionado) {
      toast.error('No hay un grupo seleccionado');
      return;
    }

    // Intentar agregar el horario
    await axiosInstance.post('/grupo_horarios', {
      grupo_id: grupoSeleccionado,
      dia: data.dia,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
    });

    toast.success('Horario agregado con éxito');
    resetHorario();
    cerrarModalHorario();

    // Recargar la lista de grupos para ver el nuevo horario
    loadGrupos();

  } catch (error: any) {
    if (error.response && error.response.data) {
      // Mostrar el error completo en el toast
      toast.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`); // Mostrar todo el JSON de error

      // Si el error tiene mensajes específicos (como 'horario'), mostrarlo
      const backendError = error.response.data.errors?.horario?.[0];
      if (backendError) {
        toast.error(backendError); // Mostrar el mensaje específico
      }
    } else {
      toast.error('Error al agregar el horario');
    }
  }
};


  const filteredGrupos = grupos.filter(
    (g) =>
      (g.codigo ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.modalidad ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Listado de Grupos</h1>
          <button
            onClick={() => navigate('/administrador/grupos/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Nuevo Grupo
          </button>
        </div>
        
        {topError && <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">{topError}</div>}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar por código o modalidad"
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
        ) : filteredGrupos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No se encontraron grupos con ese criterio' : 'No hay grupos registrados'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materia
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Docente
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aula
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gestión
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horarios
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrupos.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-900 whitespace-nowrap">
                      {g.codigo}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 whitespace-nowrap">
                      {g.materia?.nombre}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 whitespace-nowrap">
                      {g.docente?.registro}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 whitespace-nowrap">
                      {g.aula?.codigo}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 whitespace-nowrap">
                      {g.gestion?.periodo}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {horariosComoChips(g.horarios).map((txt: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {txt}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 md:px-6 py-3 md:py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => navigate(`/administrador/grupos/${g.id}/edit`)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Editar"
                          title="Editar"
                        >

                          editar
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Eliminar"
                          title="Eliminar"
                        >
                          borrar
                        </button>
                        <button
                          onClick={() => abrirModalHorario(g.id)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1"
                          aria-label="Asignar horario"
                          title="Asignar horario"
                        >
                          <FontAwesomeIcon icon={faClock} />
                          <span className="text-xs font-medium">Asignar Horario</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredGrupos.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando {filteredGrupos.length} de {grupos.length} grupos
          </div>
        )}
      </div>

      {/* MODAL PARA ASIGNAR HORARIO */}
      {showModalHorario && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Asignar Horario</h3>
              <button
                onClick={cerrarModalHorario}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitHorario(onSubmitHorario)} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Día</label>
                <select
                  {...registerHorario('dia', { required: 'Este campo es obligatorio' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">-Seleccionar día-</option>
                  <option value="lunes">Lunes</option>
                  <option value="martes">Martes</option>
                  <option value="miércoles">Miércoles</option>
                  <option value="jueves">Jueves</option>
                  <option value="viernes">Viernes</option>
                  <option value="sábado">Sábado</option>
                </select>
                {errorsHorario.dia && (
                  <p className="text-red-600 text-sm">{errorsHorario.dia.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hora de Inicio
                  </label>
                  <input
                    type="time"
                    {...registerHorario('hora_inicio', { required: 'Este campo es obligatorio' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  {errorsHorario.hora_inicio && (
                    <p className="text-red-600 text-sm">{errorsHorario.hora_inicio.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hora de Fin
                  </label>
                  <input
                    type="time"
                    {...registerHorario('hora_fin', { required: 'Este campo es obligatorio' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  {errorsHorario.hora_fin && (
                    <p className="text-red-600 text-sm">{errorsHorario.hora_fin.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={cerrarModalHorario}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Asignar Horario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrupoList;