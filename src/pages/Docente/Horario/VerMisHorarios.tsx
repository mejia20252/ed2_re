import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import axiosInstance from '../../../app/axiosInstance';
import { toast } from 'react-toastify';

const VerMisHorarios = () => {
  const { user, loading } = useAuth();
  const [horarios, setHorarios] = useState<any>([]);
  const [loadingHorarios, setLoadingHorarios] = useState<boolean>(false);
  const [asistencia, setAsistencia] = useState<any>({});
  const [asistenciasRegistradas, setAsistenciasRegistradas] = useState<any>({});

  useEffect(() => {
    const fetchHorarios = async () => {
      if (user) {
        setLoadingHorarios(true);
        try {
          const response = await axiosInstance.get(`/docentes/horarios/`);

          const weekDays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
          const organizedHorarios: any = {};

          weekDays.forEach(day => {
            organizedHorarios[day] = [];
          });

          response.data.grupos.forEach((grupo: any) => {
            grupo.horarios.forEach((horario: any) => {
              const { dia, hora_inicio, hora_fin } = horario;

              organizedHorarios[dia].push({
                hora_inicio,
                hora_fin,
                aula: grupo.aula_id,
                grupo_id: grupo.id,
                grupo_horario_id: horario.id,
                materia_codigo: grupo.codigo
              });
            });
          });

          setHorarios(organizedHorarios);
        } catch (error) {
          toast.error('Error al obtener los horarios.');
          console.error(error);
        } finally {
          setLoadingHorarios(false);
        }
      }
    };

    if (user) {
      fetchHorarios();
    }
  }, [user]);

  // Verificar asistencias ya registradas para hoy
  useEffect(() => {
    const fetchAsistenciasHoy = async () => {
      if (user) {
        try {
          const fechaHoy = new Date().toISOString().split('T')[0];
          const response = await axiosInstance.get(`/docentes/asistencias?fecha=${fechaHoy}`);
          
          // Organizar asistencias por grupo_horario_id para fácil acceso
          const asistenciasMap: any = {};
          response.data.forEach((asistencia: any) => {
            asistenciasMap[asistencia.grupo_horario_id] = asistencia;
          });
          
          setAsistenciasRegistradas(asistenciasMap);
        } catch (error) {
          console.error('Error al obtener asistencias:', error);
        }
      }
    };

    if (user && Object.keys(horarios).length > 0) {
      fetchAsistenciasHoy();
    }
  }, [user, horarios]);

  const handleAsistenciaChange = (grupoId: string, estado: string) => {
    setAsistencia((prevState: any) => ({
      ...prevState,
      [grupoId]: estado,
    }));
  };

  const handleEnviarAsistencia = async (grupoId: string, grupoHorarioId: number) => {
    const estado = asistencia[grupoId];
    if (!estado) {
      toast.warning('Debes seleccionar un estado de asistencia.');
      return;
    }

    try {
      const response = await axiosInstance.post(`/asistencia-docente/${grupoHorarioId}`, {
        estado: estado,
      });
      
      toast.success(response.data.success || 'Asistencia registrada correctamente');
      
      // Actualizar el estado de asistencias registradas
      setAsistenciasRegistradas((prev: any) => ({
        ...prev,
        [grupoHorarioId]: {
          grupo_horario_id: grupoHorarioId,
          estado: estado,
          fecha: new Date().toISOString().split('T')[0]
        }
      }));
      
      // Limpiar el estado de asistencia después de enviar
      setAsistencia((prevState: any) => {
        const newState = { ...prevState };
        delete newState[grupoId];
        return newState;
      });
    } catch (error: any) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Error al registrar la asistencia.');
      }
      console.error(error);
    }
  };

  const getDiaActual = () => {
    const dias = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const hoy = new Date();
    return dias[hoy.getDay()];
  };

  const puedeMarcarAsistencia = (dia: string, hora_inicio: string, hora_fin: string) => {
    const now = new Date();
    const diaActual = getDiaActual();
    
    if (dia.toLowerCase() !== diaActual.toLowerCase()) {
      return {
        puede: false,
        motivo: 'No es el día de esta clase'
      };
    }

    const currentDate = now.toISOString().split('T')[0];
    const horaInicioClase = new Date(`${currentDate}T${hora_inicio}`);
    const horaFinClase = new Date(`${currentDate}T${hora_fin}`);

    if (now < horaInicioClase) {
      return {
        puede: false,
        motivo: 'La clase aún no ha comenzado'
      };
    }

    if (now > horaFinClase) {
      return {
        puede: false,
        motivo: 'La clase ya finalizó'
      };
    }

    return {
      puede: true,
      motivo: 'Puede marcar asistencia'
    };
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'presente':
        return 'bg-green-500 text-white';
      case 'ausente':
        return 'bg-red-500 text-white';
      case 'justificado':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading || loadingHorarios) {
    return <div className="flex justify-center items-center h-64">
      <div className="text-lg">Cargando...</div>
    </div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Horarios</h1>
      
      <div className="mb-4 p-3 bg-blue-100 rounded-lg">
        <p className="font-semibold">
          Hoy es: <span className="capitalize">{getDiaActual()}</span>
        </p>
        <p className="text-sm text-gray-600">
          Hora actual: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {Object.keys(horarios).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"].map((day) => (
            <div key={day} className="p-4 border rounded-lg shadow-lg bg-white">
              <h2 className="font-semibold text-xl mb-2 capitalize">{day}</h2>
              {horarios[day].length > 0 ? (
                horarios[day].map((horario: any, index: number) => {
                  const validacion = puedeMarcarAsistencia(day, horario.hora_inicio, horario.hora_fin);
                  const esHoyYEnHorario = validacion.puede;
                  const asistenciaRegistrada = asistenciasRegistradas[horario.grupo_horario_id];
                  const yaRegistrada = !!asistenciaRegistrada;

                  return (
                    <div 
                      key={index} 
                      className={`p-3 rounded mb-3 ${
                        yaRegistrada 
                          ? 'bg-blue-50 border-2 border-blue-300' 
                          : esHoyYEnHorario 
                            ? 'bg-green-50 border-2 border-green-300' 
                            : 'bg-gray-100'
                      }`}
                    >
                      <h3 className="font-medium text-lg">{horario.materia_codigo}</h3>
                      <p><strong>Hora:</strong> {horario.hora_inicio} - {horario.hora_fin}</p>
                      <p><strong>Aula:</strong> {horario.aula}</p>

                      {/* Mostrar si ya está registrada */}
                      {yaRegistrada ? (
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">Asistencia registrada:</span>
                            <span className={`px-3 py-1 rounded text-sm font-medium ${getEstadoBadgeColor(asistenciaRegistrada.estado)}`}>
                              {asistenciaRegistrada.estado.charAt(0).toUpperCase() + asistenciaRegistrada.estado.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-green-600 mt-2 font-medium">
                            ✓ Asistencia confirmada para hoy
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Mensaje de estado */}
                          {!validacion.puede && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              {validacion.motivo}
                            </p>
                          )}

                          {/* Formulario de asistencia - Solo si puede marcar */}
                          {esHoyYEnHorario && (
                            <div className="mt-3">
                              <div className="flex flex-wrap gap-2 mb-2">
                                <button
                                  onClick={() => handleAsistenciaChange(horario.grupo_id, 'presente')}
                                  className={`px-3 py-1 rounded text-white ${
                                    asistencia[horario.grupo_id] === 'presente' 
                                      ? 'bg-green-600' 
                                      : 'bg-green-400 hover:bg-green-500'
                                  }`}
                                >
                                  Presente
                                </button>
                                <button
                                  onClick={() => handleAsistenciaChange(horario.grupo_id, 'ausente')}
                                  className={`px-3 py-1 rounded text-white ${
                                    asistencia[horario.grupo_id] === 'ausente' 
                                      ? 'bg-red-600' 
                                      : 'bg-red-400 hover:bg-red-500'
                                  }`}
                                >
                                  Ausente
                                </button>
                                <button
                                  onClick={() => handleAsistenciaChange(horario.grupo_id, 'justificado')}
                                  className={`px-3 py-1 rounded text-white ${
                                    asistencia[horario.grupo_id] === 'justificado' 
                                      ? 'bg-yellow-600' 
                                      : 'bg-yellow-400 hover:bg-yellow-500'
                                  }`}
                                >
                                  Justificado
                                </button>
                              </div>

                              <button
                                onClick={() => handleEnviarAsistencia(horario.grupo_id, horario.grupo_horario_id)}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={!asistencia[horario.grupo_id]}
                              >
                                Enviar Asistencia
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">Sin clases este día</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tienes horarios asignados.
        </div>
      )}
    </div>
  );
};

export default VerMisHorarios;