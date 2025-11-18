import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';
import { fetchRoles } from '../../../api/rol';  // Importar la función fetchRoles
import { faArrowLeft, faSave, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';  // Importar íconos de ojo
interface UserFormState {
    nombre: string;
    username: string;
    email: string;
    apellido_paterno: string;
    apellido_materno: string;
    sexo: string;
    direccion: string;
    fecha_nacimiento: string;
    password: string;  // Nuevo campo para la contraseña
    confirmPassword?: string;
    rol: number | null;
}

const UserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = useMemo(() => Boolean(id), [id]);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [topError, setTopError] = useState('');
    const [roles, setRoles] = useState<any[]>([]);  // Estado para almacenar los roles
    const [showPassword, setShowPassword] = useState(false);  // Estado para mostrar/ocultar la contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // Estado para mostrar/ocultar la confirmación de contraseña

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<UserFormState>({
        defaultValues: {
            nombre: '',
            username: '',
            email: '',
            apellido_paterno: '',
            apellido_materno: '',
            sexo: '',
            direccion: '',
            fecha_nacimiento: '',
            rol: null,
            password: '', // Valor por defecto para la contraseña
            confirmPassword: ''
        },
    });

    // Cargar roles desde la API al montar el componente
    useEffect(() => {
        const loadRoles = async () => {
            try {
                const fetchedRoles = await fetchRoles();  // Usar la función fetchRoles para obtener los roles
                setRoles(fetchedRoles);  // Guardar los roles en el estado
            } catch (error) {
                toast.error('Error al cargar los roles');
            }
        };
        loadRoles();
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            if (!isEdit || !id) return;
            setLoading(true);
            setTopError('');
            try {
                const { data } = await axiosInstance.get(`/usuarios/${id}`);
                reset({
                    nombre: data.nombre,
                    username: data.username,
                    email: data.email,
                    apellido_paterno: data.apellido_paterno,
                    apellido_materno: data.apellido_materno,
                    sexo: data.sexo,
                    direccion: data.direccion,
                    fecha_nacimiento: data.fecha_nacimiento,
                    rol: data.rol?.id || null,
                    password: '', // Resetea el campo de contraseña cuando se edita un usuario
                    confirmPassword: '',
                });
            } catch (err) {
                const uiError = toUiError(err);
                setTopError(uiError.message || 'No se pudo cargar los datos del usuario.');
                toast.error('Error al cargar el usuario');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [id, isEdit, reset]);

    const onSubmit = async (values: UserFormState) => {
        setTopError('');

        if (!values.nombre.trim()) {
            setError('nombre', { message: 'El nombre es obligatorio' });
            return;
        }
        if (!values.username.trim()) {
            setError('username', { message: 'El username es obligatorio' });
            return;
        }
        if (!values.email.trim()) {
            setError('email', { message: 'El email es obligatorio' });
            return;
        }

        try {
            const payload = { ...values };
            delete payload.confirmPassword;
            if (isEdit && id) {
                await axiosInstance.put(`/usuarios/${id}`, values);
                toast.success('Usuario actualizado correctamente');
            } else {
                await axiosInstance.post('/usuarios', values);
                toast.success('Usuario creado correctamente');
            }
            navigate('/administrador/usuarios');
        } catch (error) {
            const uiError = toUiError(error);

            if (uiError.message) setTopError(uiError.message);

            // Ahora procesamos los errores de campo
            if (uiError.fields) {
                // Si hay errores de campos específicos, usamos setError para mostrarlos
                Object.keys(uiError.fields).forEach((field) => {
                    const message = uiError.fields?.[field];
                    setError(field as keyof UserFormState, {
                        type: 'server',
                        message: Array.isArray(message) ? message.join(' ') : String(message),
                    });
                });
            }

            toast.error('Error al guardar el usuario');
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h2>
                    <button onClick={() => navigate('/administrador/usuarios')} className="text-gray-500 hover:text-gray-700">
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
                        Cargando datos del usuario...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                {...register('nombre', { required: 'El nombre es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register('username', { required: 'El username es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.username && <p className="text-red-600 text-sm">{errors.username.message}</p>}
                        </div>
                        {/* Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: isEdit ? false : 'La contraseña es obligatoria',  // Contraseña solo obligatoria si no es edición
                                    })}

                                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...register('confirmPassword', {
                                        required: isEdit ? false : 'Debes confirmar la contraseña',  // Confirmar Contraseña solo obligatoria si no es edición
                                    })}
                                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
                        </div>


                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email', { required: 'El email es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Apellido Paterno */}
                        <div>
                            <label htmlFor="apellido_paterno" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido Paterno
                            </label>
                            <input
                                id="apellido_paterno"
                                type="text"
                                {...register('apellido_paterno', { required: 'El apellido paterno es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.apellido_paterno ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.apellido_paterno && <p className="text-red-600 text-sm">{errors.apellido_paterno.message}</p>}
                        </div>

                        {/* Apellido Materno */}
                        <div>
                            <label htmlFor="apellido_materno" className="block text-sm font-medium text-gray-700 mb-1">
                                Apellido Materno
                            </label>
                            <input
                                id="apellido_materno"
                                type="text"
                                {...register('apellido_materno', { required: 'El apellido materno es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.apellido_materno ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.apellido_materno && <p className="text-red-600 text-sm">{errors.apellido_materno.message}</p>}
                        </div>

                        {/* Sexo */}
                        <div>
                            <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
                                Sexo
                            </label>
                            <select
                                id="sexo"
                                {...register('sexo', { required: 'El sexo es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.sexo ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Seleccione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                            {errors.sexo && <p className="text-red-600 text-sm">{errors.sexo.message}</p>}
                        </div>

                        {/* Dirección */}
                        <div>
                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección
                            </label>
                            <input
                                id="direccion"
                                type="text"
                                {...register('direccion', { required: 'La dirección es obligatoria' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.direccion && <p className="text-red-600 text-sm">{errors.direccion.message}</p>}
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Nacimiento
                            </label>
                            <input
                                id="fecha_nacimiento"
                                type="date"
                                {...register('fecha_nacimiento', { required: 'La fecha de nacimiento es obligatoria' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.fecha_nacimiento && <p className="text-red-600 text-sm">{errors.fecha_nacimiento.message}</p>}
                        </div>

                        {/* Rol */}
                        <div>
                            <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                                Rol
                            </label>
                            <select
                                id="rol"
                                {...register('rol', { required: 'El rol es obligatorio' })}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 ${errors.rol ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((rol) => (
                                    <option key={rol.id} value={rol.id}>
                                        {rol.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.rol && <p className="text-red-600 text-sm">{errors.rol.message}</p>}
                        </div
                        >

                        {/* Botones */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/administrador/usuarios')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isSubmitting ? 'Guardando...' : <><FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserForm;
