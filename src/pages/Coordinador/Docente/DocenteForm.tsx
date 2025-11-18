import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';
import { faTimes } from '@fortawesome/free-solid-svg-icons';  // Importar íconos de ojo

interface DocenteFormState {
    registro: string;
    especialidad: string | null;
    user_id: number | null;
}

const DocenteForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = useMemo(() => Boolean(id), [id]);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [topError, setTopError] = useState('');
    const [usuariosDocentes, setUsuariosDocentes] = useState<any[]>([]); // Almacenar la lista de usuarios docentes
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<DocenteFormState>({
        defaultValues: {
            registro: '',
            especialidad: null,
            user_id: null,
        },
    });

    // Cargar la lista de docentes al montar el componente
    useEffect(() => {
        const loadUsuariosDocentes = async () => {
            setLoading(true);
            setTopError('');
            try {
                const { data } = await axiosInstance.get('/usuarios/docentes/');
                setUsuariosDocentes(data); // Almacenar los docentes
            } catch (err) {
                const uiError = toUiError(err);
                setTopError(uiError.message || 'No se pudo cargar los usuarios docentes.');
                toast.error('Error al cargar los docentes');
            } finally {
                setLoading(false);
            }
        };
        loadUsuariosDocentes();
    }, []);

    useEffect(() => {
        const loadDocente = async () => {
            if (!isEdit || !id) return;
            setLoading(true);
            setTopError('');
            try {
                const { data } = await axiosInstance.get(`/docentes/${id}`);
                reset({
                    registro: data.registro,
                    especialidad: data.especialidad,
                    user_id: data.user_id,
                });
            } catch (err) {
                const uiError = toUiError(err);
                setTopError(uiError.message || 'No se pudo cargar el docente.');
                toast.error('Error al cargar el docente');
            } finally {
                setLoading(false);
            }
        };
        loadDocente();
    }, [id, isEdit, reset]);

    const onSubmit = async (values: DocenteFormState) => {
        setTopError('');

        // Validar que todos los campos sean correctos
        if (!values.registro.trim()) {
            setError('registro', { message: 'El registro es obligatorio' });
            return;
        }

        if (!values.user_id) {
            setError('user_id', { message: 'El ID de usuario es obligatorio' });
            return;
        }

        try {
            if (isEdit && id) {
                await axiosInstance.put(`/docentes/${id}`, values);
                toast.success('Docente actualizado correctamente');
            } else {
                await axiosInstance.post('/docentes', values);
                toast.success('Docente creado correctamente');
            }
            navigate('/administrador/docentes');
        } catch (error) {
            const uiError = toUiError(error);

            if (uiError.message) setTopError(uiError.message);

            if (uiError.fields) {
                Object.keys(uiError.fields).forEach((field) => {
                    const message = uiError.fields?.[field];
                    setError(field as keyof DocenteFormState, {
                        type: 'server',
                        message: Array.isArray(message) ? message.join(' ') : String(message),
                    });
                });
            }

            toast.error('Error al guardar el docente');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Editar Docente' : 'Nuevo Docente'}
                    </h2>
                    <button onClick={() => navigate('/administrador/docentes')} className="text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>

                {topError && (
                    <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700 text-sm">
                        {topError}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center min-h-[250px] text-gray-600">
                        Cargando datos del docente...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Registro */}
                        <div>
                            <label htmlFor="registro" className="block text-sm font-medium text-gray-700 mb-1">
                                Registro
                            </label>
                            <input
                                id="registro"
                                type="text"
                                {...register('registro', { required: 'El registro es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.registro ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.registro && <p className="text-red-600 text-sm">{errors.registro.message}</p>}
                        </div>
                        
                        {/* Especialidad */}
                        <div>
                            <label htmlFor="especialidad" className="block text-sm font-medium text-gray-700 mb-1">
                                Especialidad
                            </label>
                            <input
                                id="especialidad"
                                type="text"
                                {...register('especialidad')}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.especialidad ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.especialidad && <p className="text-red-600 text-sm">{errors.especialidad.message}</p>}
                        </div>

                        {/* ID de Usuario (select) */}
                        <div>
                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                                ID de Usuario
                            </label>
                            <select
                                id="user_id"
                                {...register('user_id', { required: 'El ID de usuario es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.user_id ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Selecciona un docente</option>
                                {usuariosDocentes.map((docente) => (
                                    <option key={docente.id} value={docente.id}>
                                        {docente.nombre} - {docente.username}
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <p className="text-red-600 text-sm">{errors.user_id.message}</p>}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/administrador/docentes')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DocenteForm;
