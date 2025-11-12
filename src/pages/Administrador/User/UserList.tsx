import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axiosInstance from '../../../app/axiosInstance';
import { toUiError } from '../../../api/error';
import type { Rol } from '../../Perfil';
/*
interface R{
  id:number;
  nombre:string;
}
  */
interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  rol: Rol | null;
  apellido_paterno: string;    // Agregar apellido_paterno
  apellido_materno: string;    // Agregar apellido_materno
  sexo: string;                // Asegúrate de incluir cualquier otra propiedad que falte
  direccion: string;
  fecha_nacimiento: string;
}
// Tipo local para guardar y mostrar info del error en la UI
type UiError = {
  message: string
  fields?: Record<string, string[]>
  status?: number
  code?: string
  file?: string
  line?: number
  exception?: string
  raw?: any
};

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');     // mensaje corto para mostrar arriba
  const [uiErr, setUiErr] = useState<UiError | null>(null); // error “rico” con detalles

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    setUiErr(null);
    try {
      const { data } = await axiosInstance.get<User[]>('/usuarios');
      setUsers(data);
    } catch (err: any) {
      // Mapea a error de UI y guarda RAW para inspección
      const mapped = toUiError(err) as UiError;
      const raw = err?.response?.data ?? err;
      const full: UiError = { ...mapped, raw };
      setUiErr(full);
      setErrorMsg(mapped.message || 'Error al cargar los usuarios');
      toast.error(mapped.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Está seguro de eliminar el usuario "${nombre}"?`)) return;

    try {
      await axiosInstance.delete(`/usuarios/${id}`);
      toast.success('Usuario eliminado correctamente');
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      const mapped = toUiError(err) as UiError;
      const raw = err?.response?.data ?? err;
      const full: UiError = { ...mapped, raw };
      setUiErr(full);
      setErrorMsg(mapped.message || 'Error al eliminar el usuario');
      toast.error(mapped.message || 'Error al eliminar el usuario');
    }
  };

  const crearCuentas = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx'; // Soporta CSV o Excel

    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        await axiosInstance.post('/usuarios/crearcuentas', formData);
        toast.success('Cuentas creadas correctamente');
        loadUsers(); // Recargar la lista después de crear
      } catch (err: any) {
        const mapped = toUiError(err) as UiError;
        const raw = err?.response?.data ?? err;
        const full: UiError = { ...mapped, raw };
        setUiErr(full);
        setErrorMsg(mapped.message || 'Error al crear las cuentas');
        toast.error(mapped.message || 'Error al crear las cuentas');
      }
    };

    input.click(); // Abrir el cuadro de diálogo
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Gestión de Usuarios</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/administrador/usuarios/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Nuevo Usuario
            </button>
            <button
              onClick={crearCuentas}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
            >
              Crear Cuentas
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error Message (resumen + detalles) */}
        {(errorMsg || uiErr) && (
          <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-200 text-red-700">
            <div className="font-semibold">Ocurrió un error</div>
            {errorMsg && <div className="mt-1">{errorMsg}</div>}

            {/* Campos útiles si existen */}
            <div className="text-xs mt-2 space-y-1">
              {uiErr?.status && <div>HTTP: {uiErr.status}</div>}
              {uiErr?.code && <div>Code: {uiErr.code}</div>}
              {uiErr?.file && <div>File: {uiErr.file}</div>}
              {uiErr?.line && <div>Line: {uiErr.line}</div>}
              {uiErr?.exception && <div>Exception: {uiErr.exception}</div>}
            </div>

            {/* JSON crudo del backend para depurar */}
            <details className="mt-2">
              <summary className="cursor-pointer">Detalles técnicos (payload)</summary>
              <pre className="text-xs mt-2 whitespace-pre-wrap">
                {JSON.stringify(uiErr?.raw ?? uiErr, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Loading / Empty / Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12 text-gray-600">Cargando usuarios...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                 
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Paterno</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido Materno</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direccion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Nacimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.apellido_paterno}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.apellido_materno}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.sexo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.direccion}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.fecha_nacimiento}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.rol?.nombre}</td>

                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/administrador/usuarios/${user.id}/edit`)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.nombre)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredUsers.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
