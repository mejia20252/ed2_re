import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../app/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faClock, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

interface Horario {
  id?: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

// Orden y formato de díaks/horas
const DIAS_ORDEN = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const hhmm = (t?: string) => (t ? t.slice(0, 5) : '');
const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);



interface HorarioFormState {
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

const GrupoList: React.FC = () => {
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [horarioAEditar, setHorarioAEditar] = useState<Horario | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [topError, setTopError] = useState('');

  // Estados para el modal de agregar/editar horario
  const [showModalHorario, setShowModalHorario] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<number | null>(null);
  const [grupoHorariosExpandido, setGrupoHorariosExpandido] = useState<number | null>(null);

  const {
    register: registerHorario,
    handleSubmit: handleSubmitHorario,
    formState: { errors: errorsHorario },
    reset: resetHorario,
    setValue
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
        const backendError = error.response.data.errors.horario?.[0];
        if (backendError) {
          toast.error(backendError);
        }
      } else {
        toast.error('Error al cargar los grupos');
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
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors;
        setTopError(JSON.stringify(backendErrors, null, 2));
        toast.error('Error al borrar el grupo');
      } else {
        toast.error('Error inesperado al eliminar el grupo');
      }
    }
  };

  // Abrir modal para agregar o editar horario
  const abrirModalHorario = (grupoId: number, horario?: Horario) => {
    setGrupoSeleccionado(grupoId);
    
    if (horario) {
      // Modo edición: cargar datos del horario
      setHorarioAEditar(horario);
      setValue('dia', horario.dia);
      setValue('hora_inicio', horario.hora_inicio);
      setValue('hora_fin', horario.hora_fin);
    } else {
      // Modo creación: limpiar formulario
      setHorarioAEditar(null);
      resetHorario();
    }
    
    setShowModalHorario(true);
  };

  // Cerrar modal
  const cerrarModalHorario = () => {
    setShowModalHorario(false);
    setGrupoSeleccionado(null);
    setHorarioAEditar(null);
    resetHorario();
  };

  const onSubmitHorario = async (data: HorarioFormState) => {
    try {
      if (!grupoSeleccionado) {
        toast.error('No hay un grupo seleccionado');
        return;
      }

      // Formatear las horas a H:i (sin segundos)
      const formatearHora = (hora: string) => hora.slice(0, 5);
      
      const payload = {
        grupo_id: grupoSeleccionado,
        dia: data.dia,
        hora_inicio: formatearHora(data.hora_inicio),
        hora_fin: formatearHora(data.hora_fin),
      };

      if (horarioAEditar && horarioAEditar.id) {
        // Editar horario existente
        await axiosInstance.put(`/grupo_horarios/${horarioAEditar.id}`, payload);
        toast.success('Horario editado con éxito');
      } else {
        // Crear nuevo horario
        await axiosInstance.post('/grupo_horarios', payload);
        toast.success('Horario agregado con éxito');
      }

      loadGrupos();
      cerrarModalHorario();
    } catch (error: any) {
      if (error.response && error.response.data) {
        const backendError = error.response.data.errors?.horario?.[0];
        if (backendError) {
          toast.error(backendError);
        } else {
          toast.error(`Error: ${JSON.stringify(error.response.data, null, 2)}`);
        }
      } else {
        toast.error('Error al procesar el horario');
      }
    }
  };

  // Eliminar horario
  const eliminarHorario = async (horarioId: number) => {
    if (!window.confirm('¿Está seguro de eliminar este horario?')) return;
    
    try {
      await axiosInstance.delete(`/grupo_horarios/${horarioId}`);
      toast.success('Horario eliminado correctamente');
      loadGrupos();
    } catch (error: any) {
      toast.error('Error al eliminar el horario');
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
                  <React.Fragment key={g.id}>
                    <tr className="hover:bg-gray-50">
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
                      <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-1">
                          {g.horarios && g.horarios.length > 0 ? (
                            <>
                              <button
                                onClick={() => setGrupoHorariosExpandido(grupoHorariosExpandido === g.id ? null : g.id)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                {grupoHorariosExpandido === g.id ? 'Ocultar' : `Ver ${g.horarios.length} horario(s)`}
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">Sin horarios</span>
                          )}
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
                            <span className="text-xs font-medium">Agregar Horario</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Fila expandible con lista de horarios */}
                    {grupoHorariosExpandido === g.id && g.horarios && g.horarios.length > 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 md:px-6 py-3 bg-gray-50">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Horarios del grupo:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {g.horarios
                                .slice()
                                .sort((a: Horario, b: Horario) => DIAS_ORDEN.indexOf(a.dia) - DIAS_ORDEN.indexOf(b.dia))
                                .map((h: Horario) => (
                                  <div
                                    key={h.id}
                                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                                  >
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">
                                        {capitalizar(h.dia)}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {hhmm(h.hora_inicio)} - {hhmm(h.hora_fin)}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => abrirModalHorario(g.id, h)}
                                        className="text-blue-600 hover:text-blue-800 p-1"
                                        title="Editar horario"
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </button>
                                      <button
                                        onClick={() => eliminarHorario(h.id!)}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title="Eliminar horario"
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

      {/* MODAL PARA ASIGNAR/EDITAR HORARIO */}
      {showModalHorario && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {horarioAEditar ? 'Editar Horario' : 'Asignar Horario'}
              </h3>
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
                  <option value="domingo">Domingo</option>
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
                  {horarioAEditar ? 'Guardar Cambios' : 'Asignar Horario'}
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